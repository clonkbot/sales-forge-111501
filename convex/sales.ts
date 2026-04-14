import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("salesEntries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const listPending = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Check if user is supervisor
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "supervisor") return [];

    const entries = await ctx.db
      .query("salesEntries")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .collect();

    // Enrich with user info
    const enrichedEntries = await Promise.all(
      entries.map(async (entry) => {
        const userProfile = await ctx.db
          .query("profiles")
          .withIndex("by_user", (q) => q.eq("userId", entry.userId))
          .first();
        return {
          ...entry,
          userName: userProfile?.name ?? "Unknown",
        };
      })
    );

    return enrichedEntries;
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Check if user is supervisor
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "supervisor") return [];

    const entries = await ctx.db
      .query("salesEntries")
      .order("desc")
      .take(100);

    // Enrich with user info
    const enrichedEntries = await Promise.all(
      entries.map(async (entry) => {
        const userProfile = await ctx.db
          .query("profiles")
          .withIndex("by_user", (q) => q.eq("userId", entry.userId))
          .first();
        return {
          ...entry,
          userName: userProfile?.name ?? "Unknown",
        };
      })
    );

    return enrichedEntries;
  },
});

export const create = mutation({
  args: {
    amount: v.number(),
    description: v.string(),
    client: v.string(),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("salesEntries", {
      userId,
      amount: args.amount,
      description: args.description,
      client: args.client,
      date: args.date,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const approve = mutation({
  args: { id: v.id("salesEntries") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user is supervisor
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "supervisor") {
      throw new Error("Only supervisors can approve entries");
    }

    const entry = await ctx.db.get(args.id);
    if (!entry) throw new Error("Entry not found");

    await ctx.db.patch(args.id, {
      status: "approved",
      approvedBy: userId,
      approvedAt: Date.now(),
    });
  },
});

export const reject = mutation({
  args: {
    id: v.id("salesEntries"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user is supervisor
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "supervisor") {
      throw new Error("Only supervisors can reject entries");
    }

    const entry = await ctx.db.get(args.id);
    if (!entry) throw new Error("Entry not found");

    await ctx.db.patch(args.id, {
      status: "rejected",
      approvedBy: userId,
      approvedAt: Date.now(),
      rejectionReason: args.reason,
    });
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) return null;

    if (profile.role === "sales_rep") {
      const entries = await ctx.db
        .query("salesEntries")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();

      const pending = entries.filter(e => e.status === "pending");
      const approved = entries.filter(e => e.status === "approved");
      const rejected = entries.filter(e => e.status === "rejected");

      return {
        totalEntries: entries.length,
        pendingCount: pending.length,
        approvedCount: approved.length,
        rejectedCount: rejected.length,
        totalApprovedAmount: approved.reduce((sum, e) => sum + e.amount, 0),
        totalPendingAmount: pending.reduce((sum, e) => sum + e.amount, 0),
      };
    } else {
      // Supervisor sees all
      const allEntries = await ctx.db
        .query("salesEntries")
        .collect();

      const pending = allEntries.filter(e => e.status === "pending");
      const approved = allEntries.filter(e => e.status === "approved");
      const rejected = allEntries.filter(e => e.status === "rejected");

      return {
        totalEntries: allEntries.length,
        pendingCount: pending.length,
        approvedCount: approved.length,
        rejectedCount: rejected.length,
        totalApprovedAmount: approved.reduce((sum, e) => sum + e.amount, 0),
        totalPendingAmount: pending.reduce((sum, e) => sum + e.amount, 0),
      };
    }
  },
});
