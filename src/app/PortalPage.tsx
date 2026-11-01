import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link, useParams } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { getLeadPortal } from "@/lib/crm.functions";
import EnquiryDashboard, { type PortalLead } from "./components/EnquiryDashboard";

export default function PortalPage() {
  const { token } = useParams({ from: "/portal/$token" });
  const fetchLead = useServerFn(getLeadPortal);
  const [enquiries, setEnquiries] = useState<PortalLead[]>([]);
  const [activeId, setActiveId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const res = await fetchLead({ data: { token } });
        if (!alive) return;
        setEnquiries(res.enquiries as PortalLead[]);
        setActiveId((res.lead as PortalLead).id);
      } catch {
        if (alive) setError("This link isn't valid any more. Please ask us for a new one.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div
      className="min-h-screen w-full bg-[#ededed] p-3 sm:p-5"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white px-5 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-neutral-400">
              lumen&co
            </p>
            <h1
              className="text-2xl text-neutral-900"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
            >
              Your client dashboard
            </h1>
          </div>
          <Link
            to="/"
            className="rounded-full bg-[#ef4d23] px-4 py-2 text-xs font-semibold text-white"
          >
            Visit site
          </Link>
        </header>

        {loading ? (
          <div className="mt-3 flex items-center justify-center gap-2 rounded-3xl bg-white p-12 text-sm text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your dashboard…
          </div>
        ) : error ? (
          <div className="mt-3 rounded-3xl bg-white p-10 text-center text-sm text-neutral-600">
            {error}
          </div>
        ) : (
          <div className="mt-3">
            <EnquiryDashboard enquiries={enquiries} initialId={activeId} />
            <p className="px-2 pb-10 text-xs text-neutral-500">
              Prefer signing in?{" "}
              <Link to="/client/" className="underline">
                Use your email address
              </Link>{" "}
              to reach this dashboard any time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
