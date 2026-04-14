import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await signIn("password", formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pb-16">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-white tracking-tight">SalesForge</h1>
          </div>
          <p className="text-slate-500 font-mono text-xs tracking-wider uppercase">
            {flow === "signIn" ? "Access Your Dashboard" : "Create Your Account"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#141414] border border-slate-800 rounded-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-[#0D0D0D] border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full bg-[#0D0D0D] border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <input name="flow" type="hidden" value={flow} />

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold py-3 px-4 rounded-lg hover:from-amber-400 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{flow === "signIn" ? "Sign In" : "Create Account"}</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="w-full text-slate-400 hover:text-white text-sm font-mono transition-colors"
            >
              {flow === "signIn" ? (
                <>Don't have an account? <span className="text-amber-500">Sign up</span></>
              ) : (
                <>Already have an account? <span className="text-amber-500">Sign in</span></>
              )}
            </button>
          </div>

          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#141414] px-2 text-slate-600 font-mono uppercase tracking-wider">or</span>
            </div>
          </div>

          <button
            onClick={() => signIn("anonymous")}
            className="mt-4 w-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 font-mono text-sm py-3 px-4 rounded-lg transition-all"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
