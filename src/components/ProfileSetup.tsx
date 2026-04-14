import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

export function ProfileSetup() {
  const createProfile = useMutation(api.profiles.create);
  const { signOut } = useAuthActions();
  const [name, setName] = useState("");
  const [role, setRole] = useState<"sales_rep" | "supervisor">("sales_rep");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await createProfile({ name: name.trim(), role });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create profile");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pb-16">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-white tracking-tight">Complete Setup</h1>
          </div>
          <p className="text-slate-500 font-mono text-xs tracking-wider uppercase">
            Configure Your Profile
          </p>
        </div>

        {/* Setup Card */}
        <div className="bg-[#141414] border border-slate-800 rounded-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#0D0D0D] border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-slate-400 uppercase tracking-wider mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("sales_rep")}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    role === "sales_rep"
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-slate-700 bg-[#0D0D0D] hover:border-slate-600"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className={`w-8 h-8 ${role === "sales_rep" ? "text-amber-500" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className={`font-mono text-xs ${role === "sales_rep" ? "text-amber-500" : "text-slate-400"}`}>
                      Sales Rep
                    </span>
                  </div>
                  {role === "sales_rep" && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setRole("supervisor")}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    role === "supervisor"
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-slate-700 bg-[#0D0D0D] hover:border-slate-600"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className={`w-8 h-8 ${role === "supervisor" ? "text-emerald-500" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className={`font-mono text-xs ${role === "supervisor" ? "text-emerald-500" : "text-slate-400"}`}>
                      Supervisor
                    </span>
                  </div>
                  {role === "supervisor" && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
                  )}
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-500 font-mono">
                {role === "sales_rep"
                  ? "Log and track your sales entries"
                  : "Review and approve team sales entries"
                }
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold py-3 px-4 rounded-lg hover:from-amber-400 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Creating Profile...</span>
                </>
              ) : (
                <span>Complete Setup</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <button
              onClick={() => signOut()}
              className="w-full text-slate-500 hover:text-slate-300 text-sm font-mono transition-colors"
            >
              Sign out and use a different account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
