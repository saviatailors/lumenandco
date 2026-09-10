import { useMemo, useState } from "react";
import { ShieldAlert, MessageSquare, Building2, AlertTriangle, CheckCircle2 } from "lucide-react";

export type PortalLead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  website: string | null;
  budget: string | null;
  goal: string | null;
  message: string | null;
  status: string;
  next_steps: string;
  created_at: string;
};

const STAGES = [
  { key: "new", label: "Enquiry received" },
  { key: "contacted", label: "Strategist in touch" },
  { key: "qualified", label: "Audit & proposal" },
  { key: "won", label: "Project kicked off" },
];

const DEFAULT_STEPS =
  "A strategist is reviewing your enquiry and will email you within one working day with a free 30-minute audit slot.";

export const STATUS_LABEL: Record<string, string> = {
  new: "Enquiry received",
  contacted: "Strategist in touch",
  qualified: "Audit & proposal",
  won: "Project running",
  lost: "Closed",
};

export default function EnquiryDashboard({
  enquiries,
  initialId,
  isSuspended = false,
}: {
  enquiries: PortalLead[];
  initialId?: string;
  isSuspended?: boolean;
}) {
  const [activeId, setActiveId] = useState(initialId ?? enquiries[0]?.id ?? "");
  const lead = useMemo(
    () => enquiries.find((e) => e.id === activeId) ?? enquiries[0] ?? null,
    [enquiries, activeId],
  );

  if (!lead) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center text-sm text-neutral-600">
        We don't have any enquiries under this email yet. Send one from the site and it will appear
        here.
      </div>
    );
  }

  const stageIndex = Math.max(
    0,
    STAGES.findIndex((s) => s.key === lead.status),
  );
  const lost = lead.status === "lost";
  const active = enquiries.filter((e) => e.status !== "lost" && e.status !== "won").length;

  return (
    <div className="space-y-4 pb-10">
      {/* Access Suspended / Revoked Payment Clearance Banner */}
      {isSuspended && (
        <div className="rounded-3xl bg-red-50 border-2 border-red-300 p-6 text-red-950 space-y-3 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-red-700 font-extrabold text-sm uppercase tracking-wide">
              <ShieldAlert className="h-5 w-5 text-red-600 animate-pulse" />
              <span>Portal & Campaign Access Suspended</span>
            </div>
            <span className="bg-red-600 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase">
              Retainer Clearance Past Due
            </span>
          </div>

          <p className="text-xs font-semibold leading-relaxed text-red-900">
            Official Notice: Master portal access and active performance marketing campaign execution for your account have been <strong>TEMPORARILY SUSPENDED</strong> due to pending monthly retainer payment clearance.
          </p>

          <div className="bg-white p-4 rounded-2xl border border-red-200 text-xs font-medium space-y-2 text-neutral-800">
            <span className="font-extrabold text-red-800 text-xs block">Bank Transfer & Immediate Payment Clearance Details:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-neutral-900">
              <div>
                <span className="text-neutral-500 block text-[10px]">Corporate Account Name:</span>
                <span>Lumen & Co Media Solutions LLP</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Axis Bank A/C Number:</span>
                <span className="font-mono font-bold text-neutral-900">924020018472910</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Bank IFSC Code:</span>
                <span>UTIB0000284 (Axis Bank, Jubilee Hills, Hyd)</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Instant UPI ID:</span>
                <span className="font-bold text-[#ef4d23] font-mono">lumenandco@axisbank</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-red-200 text-xs">
            <span className="text-red-800 font-semibold text-[11px]">
              Once transferred, please submit your payment screenshot to Accounts for 15-minute reactivation.
            </span>
            <a
              href="https://wa.me/919849000000?text=Hi%20Lumen%20%26%20Co%2C%20here%20is%20my%20payment%20clearance%20receipt%20for%20retainer%20reactivation."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" /> Send Payment Receipt on WhatsApp
            </a>
          </div>
        </div>
      )}

      <section className="rounded-3xl bg-white p-6">
        <span
          className="inline-flex items-center gap-2 rounded-full bg-[#f5f2ee] px-4 py-1.5"
          style={{ fontSize: 13 }}
        >
          <span className="inline-block h-2 w-2 rounded-full bg-[#ef4d23]" />
          {lost ? "Closed" : "In progress"}
        </span>
        <h2
          className="mt-4 text-neutral-900"
          style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.02em" }}
        >
          Hello {lead.name.split(" ")[0]} — here's where things{" "}
          <span
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            stand
          </span>
        </h2>
        <p className="mt-2 text-sm text-neutral-500">{lead.email}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Requests with us", value: String(enquiries.length) },
            { label: "Currently open", value: String(active) },
            { label: "Monthly budget", value: lead.budget || "Not set yet" },
          ].map((k) => (
            <div key={k.label} className="rounded-2xl bg-[#f5f2ee] p-4">
              <p className="text-xs text-neutral-500">{k.label}</p>
              <p className="mt-1 text-lg font-semibold text-neutral-900">{k.value}</p>
            </div>
          ))}
        </div>
      </section>

      {enquiries.length > 1 ? (
        <section className="rounded-3xl bg-white p-6">
          <h3 className="text-sm font-semibold text-neutral-900">Your requests</h3>
          <div className="mt-3 grid gap-2">
            {enquiries.map((e) => {
              const on = e.id === lead.id;
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setActiveId(e.id)}
                  className={`flex flex-wrap items-center justify-between gap-2 rounded-2xl border p-4 text-left transition ${
                    on ? "border-[#ef4d23] bg-[#fff5f2]" : "border-neutral-200 bg-white"
                  }`}
                >
                  <span className="text-sm font-medium text-neutral-900">
                    {e.goal || "General enquiry"}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {STATUS_LABEL[e.status] ?? e.status} ·{" "}
                    {new Date(e.created_at).toLocaleDateString()}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="rounded-3xl bg-white p-6">
        <h3 className="text-sm font-semibold text-neutral-900">Next steps</h3>
        <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-[#f5f2ee] p-4 text-sm text-neutral-700">
          {lead.next_steps?.trim() || DEFAULT_STEPS}
        </p>
      </section>

      <section className="rounded-3xl bg-white p-6">
        <h3 className="text-sm font-semibold text-neutral-900">Progress</h3>
        <ol className="mt-4 space-y-3">
          {STAGES.map((s, i) => {
            const done = !lost && i <= stageIndex;
            return (
              <li key={s.key} className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold ${
                    done
                      ? "border-[#ef4d23] bg-[#ef4d23] text-white"
                      : "border-neutral-200 bg-white text-neutral-400"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`text-sm ${done ? "text-neutral-900" : "text-neutral-400"}`}>
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>
        {lost ? (
          <p className="mt-4 text-xs text-neutral-500">
            This request is closed for now — reply to our last email any time to reopen it.
          </p>
        ) : null}
      </section>

      <section className="rounded-3xl bg-white p-6">
        <h3 className="text-sm font-semibold text-neutral-900">This request</h3>
        <p className="mt-1 text-xs text-neutral-400">
          Sent {new Date(lead.created_at).toLocaleDateString()}
        </p>
        <dl className="mt-3 grid gap-2 text-sm text-neutral-600 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-neutral-400">Company</dt>
            <dd>{lead.company || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-400">Website</dt>
            <dd>{lead.website || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-400">What you need</dt>
            <dd>{lead.goal || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-400">Monthly budget</dt>
            <dd>{lead.budget || "Not set yet"}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-neutral-400">Your message</p>
        <p className="mt-1 whitespace-pre-wrap rounded-2xl bg-[#f5f2ee] p-4 text-sm text-neutral-700">
          {lead.message || "—"}
        </p>
      </section>

      <p className="px-2 text-xs text-neutral-500">
        Something to change? Reply to our email and we'll update it here.
      </p>
    </div>
  );
}
