import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

type SalesEntry = Doc<"salesEntries">;

export function SalesRepDashboard() {
  const salesEntries = useQuery(api.sales.listMine);
  const createEntry = useMutation(api.sales.create);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    client: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client || !formData.amount) return;

    setIsSubmitting(true);
    try {
      await createEntry({
        client: formData.client,
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).getTime(),
      });
      setFormData({
        client: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="font-display text-xl md:text-2xl font-bold text-white">Your Sales Entries</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold py-2.5 px-5 rounded-lg hover:from-amber-400 hover:to-orange-500 transition-all"
        >
          {showForm ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Entry</span>
            </>
          )}
        </button>
      </div>

      {/* New Entry Form */}
      {showForm && (
        <div className="bg-[#141414] border border-slate-800 rounded-xl p-4 md:p-6 animate-fade-in-up">
          <h3 className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-4">Log New Sale</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  required
                  className="w-full bg-[#0D0D0D] border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Sale Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-[#0D0D0D] border border-slate-700 rounded-lg pl-8 pr-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                  placeholder="Annual subscription (optional)"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full bg-[#0D0D0D] border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 px-6 rounded-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Submit for Approval</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Entries List */}
      {salesEntries === undefined ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : salesEntries.length === 0 ? (
        <div className="bg-[#141414] border border-slate-800 rounded-xl p-8 md:p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-white font-display text-lg mb-2">No entries yet</h3>
          <p className="text-slate-500 font-mono text-sm">Click "New Entry" to log your first sale</p>
        </div>
      ) : (
        <div className="space-y-3">
          {salesEntries.map((entry: SalesEntry, index: number) => (
            <div
              key={entry._id}
              className="bg-[#141414] border border-slate-800 rounded-xl p-4 md:p-5 hover:border-slate-700 transition-all animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-medium truncate">{entry.client}</h3>
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
                <div className="text-right">
                  <p className="text-xl md:text-2xl font-mono font-bold text-white">
                    ${entry.amount.toLocaleString()}
                  </p>
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
