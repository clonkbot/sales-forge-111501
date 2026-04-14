import { Doc } from "../../convex/_generated/dataModel";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SalesRepDashboard } from "./SalesRepDashboard";
import { SupervisorDashboard } from "./SupervisorDashboard";
import { useState } from "react";

interface DashboardProps {
  profile: Doc<"profiles">;
}

export function Dashboard({ profile }: DashboardProps) {
  const { signOut } = useAuthActions();
  const stats = useQuery(api.sales.getStats);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h1 className="font-display text-lg md:text-xl font-bold text-white tracking-tight">SalesForge</h1>
                <p className="hidden md:block text-slate-500 font-mono text-[10px] tracking-wider uppercase">
                  {profile.role === "supervisor" ? "Supervisor Dashboard" : "Sales Dashboard"}
                </p>
              </div>
            </div>

            {/* Desktop User Info */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-white font-medium">{profile.name}</p>
                <p className="text-slate-500 font-mono text-xs uppercase">
                  {profile.role === "supervisor" ? (
                    <span className="text-emerald-500">Supervisor</span>
                  ) : (
                    <span className="text-amber-500">Sales Rep</span>
                  )}
                </p>
              </div>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-600 font-mono text-sm transition-all"
              >
                Sign Out
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-white font-medium">{profile.name}</p>
                  <p className="text-slate-500 font-mono text-xs uppercase">
                    {profile.role === "supervisor" ? (
                      <span className="text-emerald-500">Supervisor</span>
                    ) : (
                      <span className="text-amber-500">Sales Rep</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-600 font-mono text-sm transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Stats Bar */}
      {stats && (
        <div className="border-b border-slate-800 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <StatCard
                label="Total Entries"
                value={stats.totalEntries.toString()}
                color="slate"
              />
              <StatCard
                label="Pending"
                value={stats.pendingCount.toString()}
                color="amber"
                pulse={stats.pendingCount > 0}
              />
              <StatCard
                label="Approved"
                value={stats.approvedCount.toString()}
                color="emerald"
              />
              <StatCard
                label="Approved Value"
                value={`$${stats.totalApprovedAmount.toLocaleString()}`}
                color="emerald"
                mono
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {profile.role === "supervisor" ? (
          <SupervisorDashboard />
        ) : (
          <SalesRepDashboard />
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  pulse = false,
  mono = false
}: {
  label: string;
  value: string;
  color: "slate" | "amber" | "emerald";
  pulse?: boolean;
  mono?: boolean;
}) {
  const colorClasses = {
    slate: "text-slate-300",
    amber: "text-amber-500",
    emerald: "text-emerald-500",
  };

  return (
    <div className="relative bg-[#141414] border border-slate-800 rounded-lg p-3 md:p-4">
      {pulse && (
        <div className="absolute top-3 right-3 w-2 h-2 bg-amber-500 rounded-full animate-pulse-glow" />
      )}
      <p className="font-mono text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`text-lg md:text-2xl font-bold ${colorClasses[color]} ${mono ? "font-mono" : "font-display"}`}>
        {value}
      </p>
    </div>
  );
}
