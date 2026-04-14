import { useConvexAuth } from "convex/react";
import { AuthScreen } from "./components/AuthScreen";
import { ProfileSetup } from "./components/ProfileSetup";
import { Dashboard } from "./components/Dashboard";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import "./styles.css";

function AppContent() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const profile = useQuery(api.profiles.get);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-slate-400 text-sm tracking-wider">INITIALIZING...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  if (profile === undefined) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-slate-400 text-sm tracking-wider">LOADING PROFILE...</span>
        </div>
      </div>
    );
  }

  if (profile === null) {
    return <ProfileSetup />;
  }

  return <Dashboard profile={profile} />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] relative">
      {/* Grid texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <AppContent />
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-3 text-center pointer-events-none">
        <p className="font-mono text-[10px] text-slate-600 tracking-widest uppercase">
          Requested by <span className="text-slate-500">@Salmong</span> · Built by <span className="text-slate-500">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}
