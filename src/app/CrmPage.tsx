import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Copy, ExternalLink, Film, LogOut, RefreshCw, Trash2 } from "lucide-react";

import { listLeads, updateLead, deleteLead, listLeadEvents, logLeadOpened } from "@/lib/crm.functions";

type LeadEvent = { id: string; kind: string; detail: string; actor: string; created_at: string };
import MediaManager from "./components/MediaManager";
import AdminGate from "./components/AdminGate";
import { useAdminAuth } from "./components/useAdminAuth";


type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  website: string | null;
  budget: string | null;
  goal: string | null;
  message: string | null;
  status: string;
  notes: string;
  next_steps: string;
  portal_token: string;
  created_at: string;
};


const STATUSES = ["new", "contacted", "qualified", "won", "lost"];

const STATUS_STYLES: Record<string, string> = {
  new: "bg-[#ef4d23]/10 text-[#ef4d23] border-[#ef4d23]/30",
  contacted: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  qualified: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  won: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  lost: "bg-neutral-500/10 text-neutral-600 border-neutral-500/30",
};

export default function CrmPage() {
  const fetchLeads = useServerFn(listLeads);
  const patchLead = useServerFn(updateLead);
  const removeLead = useServerFn(deleteLead);
  const fetchEvents = useServerFn(listLeadEvents);
  const markOpened = useServerFn(logLeadOpened);

  const admin = useAdminAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<"leads" | "media">("leads");
  const [copied, setCopied] = useState<string | null>(null);
  const [events, setEvents] = useState<Record<string, LeadEvent[]>>({});



  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchLeads({ data: {} });
      setLeads(res.leads as Lead[]);
    } catch {
      setError("We couldn't load your enquiries. Try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin.state === "ready") void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin.state]);

  const loadEvents = async (id: string) => {
    try {
      const res = await fetchEvents({ data: { id } });
      setEvents((prev) => ({ ...prev, [id]: res.events as LeadEvent[] }));
    } catch {
      /* ignore */
    }
  };

  const toggleOpen = async (id: string) => {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    try {
      await markOpened({ data: { id } });
    } catch {
      /* ignore */
    }
    await loadEvents(id);
  };

  const setStatus = async (id: string, status: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await patchLead({ data: { id, status } });
    await loadEvents(id);
  };

  const setNotes = async (id: string, notes: string) => {
    await patchLead({ data: { id, notes } });
    await loadEvents(id);
  };

  const setNextSteps = async (id: string, next_steps: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, next_steps } : l)));
    await patchLead({ data: { id, next_steps } });
    await loadEvents(id);
  };

  const copyPortal = async (token: string) => {
    const url = `${window.location.origin}/portal/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(token);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      window.prompt("Copy this client link", url);
    }
  };


  const drop = async (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    await removeLead({ data: { id } });
  };

  const visible = filter === "all" ? leads : leads.filter((l) => l.status === filter);
  const counts = STATUSES.map((s) => ({ s, n: leads.filter((l) => l.status === s).length }));

  if (admin.state !== "ready") {
    return (
      <AdminGate
        state={admin.state}
        email={admin.email}
        error={admin.error}
        onSignIn={() => void admin.signIn()}
        onPasswordSignIn={admin.signInWithPassword}
        onSignOut={() => void admin.signOut()}
        title="Private CRM"
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#ededed] p-3 sm:p-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white px-5 py-4">
          <div>
            <h1
              className="text-2xl text-neutral-900"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
            >
              lumen&co CRM
            </h1>
            <p className="text-xs text-neutral-500">
              {leads.length} enquiries · {admin.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => void load()}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button
              onClick={() => void admin.signOut()}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
            <Link
              to="/sahit/videos"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <Film className="h-3.5 w-3.5" /> Video library
            </Link>
            <Link
              to="/"
              className="rounded-full bg-[#ef4d23] px-4 py-2 text-xs font-semibold text-white"
            >
              Site
            </Link>

          </div>

        </header>

        <div className="mt-3 flex gap-2">
          {(["leads", "media"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold ${tab === t ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white text-neutral-700"}`}
            >
              {t === "leads" ? "Enquiries" : "Website media"}
            </button>
          ))}
        </div>

        {error ? (
          <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-xs text-[#ef4d23]">{error}</p>
        ) : null}

        {tab === "leads" ? (
          <>
        <div className="mt-3 flex flex-wrap gap-2">

          <button
            onClick={() => setFilter("all")}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${filter === "all" ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white text-neutral-700"}`}
          >
            All {leads.length}
          </button>
          {counts.map(({ s, n }) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${filter === s ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white text-neutral-700"}`}
            >
              {s} {n}
            </button>
          ))}
        </div>

        <div className="mt-3 space-y-2 pb-10">
          {visible.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center text-sm text-neutral-500">
              No enquiries here yet.
            </div>
          ) : null}
          {visible.map((l) => (
            <div key={l.id} className="rounded-2xl bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <button
                  onClick={() => void toggleOpen(l.id)}
                  className="text-left"
                >
                  <p className="text-sm font-semibold text-neutral-900">{l.name}</p>
                  <p className="text-xs text-neutral-500">
                    {l.email}
                    {l.company ? ` · ${l.company}` : ""}
                  </p>
                </button>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${STATUS_STYLES[l.status] ?? STATUS_STYLES["new"]}`}
                  >
                    {l.status}
                  </span>
                  <select
                    value={l.status}
                    onChange={(e) => void setStatus(l.id, e.target.value)}
                    className="rounded-lg border border-neutral-200 bg-[#f5f2ee] px-2 py-1.5 text-xs capitalize outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => void drop(l.id)}
                    aria-label="Delete enquiry"
                    className="rounded-lg border border-neutral-200 p-1.5 text-neutral-400 hover:text-[#ef4d23]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {openId === l.id ? (
                <div className="mt-4 grid gap-3 border-t border-neutral-100 pt-4 sm:grid-cols-2">
                  <dl className="space-y-1.5 text-xs text-neutral-600">
                    <div>
                      <dt className="inline text-neutral-400">Goal: </dt>
                      <dd className="inline">{l.goal || "—"}</dd>
                    </div>
                    <div>
                      <dt className="inline text-neutral-400">Budget: </dt>
                      <dd className="inline">{l.budget || "—"}</dd>
                    </div>
                    <div>
                      <dt className="inline text-neutral-400">Website: </dt>
                      <dd className="inline">{l.website || "—"}</dd>
                    </div>
                    <div>
                      <dt className="inline text-neutral-400">Received: </dt>
                      <dd className="inline">{new Date(l.created_at).toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-400">Message</dt>
                      <dd className="mt-1 whitespace-pre-wrap rounded-xl bg-[#f5f2ee] p-3">
                        {l.message || "—"}
                      </dd>
                    </div>
                  </dl>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-neutral-400">
                        Next steps (the client sees this)
                      </label>
                      <textarea
                        defaultValue={l.next_steps}
                        onBlur={(e) => void setNextSteps(l.id, e.target.value)}
                        rows={3}
                        placeholder="e.g. Audit call booked for Tuesday 4pm — we'll send the deck after."
                        className="mt-1 w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs outline-none focus:border-[#ef4d23]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400">Internal notes</label>
                      <textarea
                        defaultValue={l.notes}
                        onBlur={(e) => void setNotes(l.id, e.target.value)}
                        rows={4}
                        placeholder="Add notes — saved when you click away"
                        className="mt-1 w-full rounded-xl border border-neutral-200 bg-[#f5f2ee] p-3 text-xs outline-none focus:border-[#ef4d23]"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`/portal/${l.portal_token}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Open client portal
                      </a>
                      <button
                        onClick={() => void copyPortal(l.portal_token)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {copied === l.portal_token ? "Link copied" : "Copy client link"}
                      </button>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold text-neutral-900">Activity log</p>
                    <ol className="mt-2 space-y-2">
                      {(events[l.id] ?? []).length === 0 ? (
                        <li className="text-xs text-neutral-400">
                          Nothing recorded yet — stage changes, notes and opens show up here.
                        </li>
                      ) : null}
                      {(events[l.id] ?? []).map((ev) => (
                        <li key={ev.id} className="flex flex-wrap items-center gap-2 text-xs">
                          <span
                            className={`inline-block h-1.5 w-1.5 rounded-full ${
                              ev.actor === "client" ? "bg-blue-500" : "bg-[#ef4d23]"
                            }`}
                          />
                          <span className="text-neutral-700">{ev.detail}</span>
                          <span className="text-neutral-400">
                            {ev.actor === "client" ? "client" : "you"} ·{" "}
                            {new Date(ev.created_at).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

              ) : null}
            </div>
          ))}
        </div>
        </>
        ) : (
          <MediaManager />
        )}
      </div>

    </div>
  );
}
