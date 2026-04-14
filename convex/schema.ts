import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // User profiles with role information
  profiles: defineTable({
    userId: v.id("users"),
    name: v.string(),
    role: v.union(v.literal("sales_rep"), v.literal("supervisor")),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_role", ["role"]),

  // Sales entries logged by sales reps
  salesEntries: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    description: v.string(),
    client: v.string(),
    date: v.number(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.number()),
    rejectionReason: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_and_status", ["userId", "status"]),
});
