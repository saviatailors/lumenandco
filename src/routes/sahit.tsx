import { createFileRoute, ErrorComponentProps, useRouter } from "@tanstack/react-router";
import CrmPage from "@/app/CrmPage";
import { AlertTriangle, RefreshCw, LogOut, Home } from "lucide-react";

function CrmErrorFallback({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  console.error("CRM Runtime Error:", error);

  const handleResetCache = () => {
    try {
      localStorage.removeItem("lumen_admin_auth_v2");
      localStorage.removeItem("lumen_admin_user_v2");
    } catch {}
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0f1a] text-white p-6">
      <div className="max-w-md w-full bg-[#131b2e] border border-white/10 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="w-12 h-12 rounded-2xl bg-[#ef4d23]/20 border border-[#ef4d23]/40 flex items-center justify-center mx-auto text-[#ef4d23] mb-4 shadow-lg shadow-[#ef4d23]/20">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Command Center Recovery</h2>
        <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
          The CRM encountered an unexpected temporary error. You can reload the workspace or reset session cache to recover immediately.
        </p>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#ef4d23] hover:bg-[#d83f17] text-white py-3 px-4 text-xs font-bold transition-all shadow-md shadow-[#ef4d23]/25 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Reload Workspace
          </button>

          <button
            type="button"
            onClick={handleResetCache}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 py-2.5 px-4 text-xs font-semibold transition-all border border-white/10 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Reset Auth &amp; Sign In Again
          </button>

          <a
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-transparent hover:bg-white/5 text-neutral-400 hover:text-white py-2 px-4 text-xs font-medium transition-all"
          >
            <Home className="w-3.5 h-3.5" /> Return to Website Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/sahit")({
  ssr: false,
  errorComponent: CrmErrorFallback,
  head: () => ({
    meta: [
      { title: "Private CRM — lumen&co" },
      { name: "description", content: "Internal enquiry pipeline for the lumen&co team." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Private CRM — lumen&co" },
      { property: "og:description", content: "Internal enquiry pipeline for the lumen&co team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CrmPage,
});
