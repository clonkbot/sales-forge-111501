import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";

type TabType = "pending" | "all";
type EnrichedSalesEntry = Doc<"salesEntries"> & { userName: string };

export function SupervisorDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const pendingEntries = useQuery(api.sales.listPending);
  const allEntries = useQuery(api.sales.listAll);
  const approve = useMutation(api.sales.approve);
  const reject = useMutation(api.sales.reject);

  const [rejectingId, setRejectingId] = useState<Id<"salesEntries"> | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processingId, setProcessingId] = useState<Id<"salesEntries"> | null>(null);

  const handleApprove = async (id: Id<"salesEntries">) => {
    setProcessingId(id);
    try {
      await approve({ id });
    } catch (error) {
      console.error("Failed to approve:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectingId || !rejectReason.trim()) return;
    setProcessingId(rejectingId);
    try {
      await reject({ id: rejectingId, reason: rejectReason });
      setRejectingId(null);
      setRejectReason("");
    } catch (error) {
      console.error("Failed to reject:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const entries = activeTab === "pending" ? pendingEntries : allEntries;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex bg-[#141414] border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm transition-all ${
              activeTab === "pending"
                ? "bg-amber-500 text-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Pending Review</span>
            {pendingEntries && pendingEntries.length > 0 && (
              <span className={`px-1.5 py-0.5 rounded text-xs ${
                activeTab === "pending" ? "bg-black/20" : "bg-amber-500/20 text-amber-500"
              }`}>
                {pendingEntries.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm transition-all ${
              activeTab === "all"
                ? "bg-slate-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>All Entries</span>
          </button>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#141414] border border-slate-700 rounded-xl p-6 w-full max-w-md animate-fade-in-up">
            <h3 className="text-white font-display text-lg mb-4">Reject Entry</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
                  Reason for Rejection
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0D0D0D] border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all resize-none"
                  placeholder="Please provide a reason..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setRejectingId(null);
                    setRejectReason("");
                  }}
                  className="flex-1 px-4 py-2.5 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-600 font-mono text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectReason.trim() || processingId === rejectingId}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white font-bold py-2.5 px-4 rounded-lg transition-all disabled:opacity-50"
                >
                  {processingId === rejectingId ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Reject"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Entries List */}
      {entries === undefined ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-[#141414] border border-slate-800 rounded-xl p-8 md:p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-white font-display text-lg mb-2">
            {activeTab === "pending" ? "No pending entries" : "No entries yet"}
          </h3>
          <p className="text-slate-500 font-mono text-sm">
            {activeTab === "pending" ? "All entries have been reviewed" : "Sales reps haven't logged any sales yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry: EnrichedSalesEntry, index: number) => (
            <div
              key={entry._id}
              className={`bg-[#141414] border rounded-xl p-4 md:p-5 transition-all animate-fade-in-up ${
                entry.status === "pending"
                  ? "border-amber-500/30 hover:border-amber-500/50"
                  : "border-slate-800 hover:border-slate-700"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                    <h3 className="text-white font-medium">{entry.client}</h3>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400 text-sm">{entry.userName}</span>
                    <StatusBadge status={entry.status} />
                  </div>
                  {entry.description && (
                    <p className="text-slate-500 text-sm truncate">{entry.description}</p>
                  )}
                  <p className="text-slate-600 font-mono text-xs mt-1">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-xl md:text-2xl font-mono font-bold text-white">
                    ${entry.amount.toLocaleString()}
                  </p>

                  {entry.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(entry._id)}
                        disabled={processingId === entry._id}
                        className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 px-3 md:px-4 rounded-lg transition-all disabled:opacity-50 text-sm"
                      >
                        {processingId === entry._id ? (
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="hidden md:inline">Approve</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setRejectingId(entry._id)}
                        disabled={processingId === entry._id}
                        className="flex items-center gap-1.5 border border-red-500/50 text-red-500 hover:bg-red-500/10 font-bold py-2 px-3 md:px-4 rounded-lg transition-all disabled:opacity-50 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="hidden md:inline">Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {entry.status === "rejected" && entry.rejectionReason && (
                <div className="mt-3 pt-3 border-t border-slate-800">
                  <p className="text-red-400 text-sm font-mono">
                    <span className="text-red-500">Reason:</span> {entry.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  const styles = {
    pending: "bg-amber-500/20 text-amber-500 border-amber-500/30",
    approved: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
    rejected: "bg-red-500/20 text-red-500 border-red-500/30",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono uppercase border ${styles[status]}`}>
      {status === "pending" && (
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
      )}
      {status}
    </span>
  );
}
