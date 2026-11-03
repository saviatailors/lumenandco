import { createFileRoute, redirect, ErrorComponentProps, useRouter } from "@tanstack/react-router";
import DeliveryHubPage from "@/app/DeliveryHubPage";
import { isAuthorizedEmail } from "@/lib/rbac";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

function DeliveryErrorFallback({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  console.error("Delivery Hub Error:", error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0f1a] text-white p-6">
      <div className="max-w-md w-full bg-[#131b2e] border border-white/10 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="w-12 h-12 rounded-2xl bg-[#ef4d23]/20 border border-[#ef4d23]/40 flex items-center justify-center mx-auto text-[#ef4d23] mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Delivery Hub Recovery</h2>
        <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
          The operations hub encountered a temporary error. You can reload the workspace or return to the main CRM.
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

          <a
            href="/sahit/"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 py-2.5 px-4 text-xs font-semibold transition-all border border-white/10"
          >
            Go to CRM Command Center
          </a>

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

export const Route = createFileRoute("/delivery")({
  ssr: false,
  errorComponent: DeliveryErrorFallback,
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("lumen_admin_auth_v2") === "true";
      const stored = localStorage.getItem("lumen_admin_user_v2");
      let authorized = false;
      if (isAuth && stored) {
        try {
          const user = JSON.parse(stored);
          if (isAuthorizedEmail(user?.email)) {
            authorized = true;
          }
        } catch {}
      }
      if (!authorized) {
        throw redirect({
          to: "/sahit/",
        });
      }
    }
  },
  head: () => ({
    meta: [
      { title: "Delivery Hub — lumen&co" },
      { name: "description", content: "Operations and deliverable hub for the lumen&co team." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Delivery Hub — lumen&co" },
      { property: "og:description", content: "Operations and deliverable hub for the lumen&co team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DeliveryHubPage,
});
