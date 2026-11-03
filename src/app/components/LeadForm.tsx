import { useEffect, useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Loader2,
  X,
  Clock,
  Video,
  Globe,
  Calendar as CalendarIcon,
  Check,
  User,
  ExternalLink,
  Sparkles,
  PhoneCall,
} from "lucide-react";
import { z } from "zod";
import { supabase } from "@/lib/supabase-client";
import { captureInboundLead } from "@/lib/lead-capture";
import { buildCalendlyUrl, CALENDLY_BRANDED_URL } from "./CalendlyWidget";

const OPEN_EVENT = "convix:open-lead-form";

export function openLeadForm(tabOrEvent?: "form" | "calendar" | React.MouseEvent | unknown) {
  const tab = tabOrEvent === "calendar" ? "calendar" : "form";
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { tab } }));
}

const schema = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(100, "Name is too long"),
  email: z.string().trim().email("Enter a valid email address").max(255, "Email is too long"),
  phone: z.string().trim().max(30).optional(),
  company: z.string().trim().max(120, "Company name is too long"),
  website: z.string().trim().max(200, "Website is too long"),
  budget: z.string().trim().max(60),
  goal: z.string().trim().max(120),
  message: z.string().trim().max(2000, "Please keep it under 2000 characters"),
});

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  budget: "",
  goal: "Performance marketing",
  message: "",
};

const BUDGETS = ["Not sure yet", "< $5k / mo", "$5k – $15k / mo", "$15k – $50k / mo", "$50k+ / mo"];
const GOALS = [
  "Performance marketing",
  "SEO & content",
  "Paid social",
  "Creative studio",
  "Analytics & CRO",
  "Brand & PR",
];

const inputClass =
  "w-full rounded-2xl border border-neutral-200/90 bg-white px-4 py-3 outline-none focus:border-[#ef4d23] focus:ring-1 focus:ring-[#ef4d23] text-sm text-neutral-900 placeholder:text-neutral-400 transition-all shadow-2xs";

export default function LeadFormDialog() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "calendar">("form");
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const custom = e as CustomEvent<{ tab?: "form" | "calendar" }>;
      setDone(false);
      setError(null);
      setActiveTab(custom.detail?.tab || "form");
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const set = (key: keyof typeof EMPTY, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  async function submitForm(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSending(true);
    const v = parsed.data;
    try {
      await captureInboundLead({
        name: v.name,
        email: v.email,
        phone: v.phone || undefined,
        company: v.company || undefined,
        website: v.website || undefined,
        budget: v.budget || undefined,
        goal: v.goal || undefined,
        message: v.message || undefined,
        is_booking: false,
      });
    } catch (err) {
      console.warn("Lead form capture error:", err);
    }
    setSending(false);
    setDone(true);
  }

  async function confirmBooking(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    setSending(true);

    if (values.name.trim() || values.email.trim()) {
      try {
        await captureInboundLead({
          name: values.name.trim() || "Website Visitor",
          email: values.email.trim() || "visitor@calendly.com",
          phone: values.phone?.trim() || undefined,
          company: values.company?.trim() || undefined,
          website: values.website?.trim() || undefined,
          budget: values.budget?.trim() || undefined,
          goal: "30-min Strategy Call (Calendly)",
          message: values.message?.trim() || "Requested 30-min growth strategy audit meeting via Calendly.",
          scheduled_meeting_date: "Pending Calendly Selection",
          is_booking: true,
        });
      } catch (err) {
        console.warn("Booking lead capture error:", err);
      }
    }

    setSending(false);
    const targetUrl = buildCalendlyUrl({
      name: values.name,
      email: values.email,
    });
    // Redirect directly to Calendly with signature Lumen & Co brand colors (#ef4d23)
    window.location.href = targetUrl;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <button
        aria-label="Close form"
        className="fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={() => setOpen(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Get started with lumen&co"
        className="relative w-full max-w-[820px] bg-[#f6f4ef] rounded-[28px] p-5 sm:p-8 shadow-2xl border border-neutral-200/80 animate-scale-in my-auto max-h-[90vh] overflow-y-auto"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Close Button */}
        <button
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white inline-flex items-center justify-center border border-neutral-200 text-neutral-600 hover:text-black hover:bg-neutral-50 transition-all shadow-xs z-10"
          onClick={() => setOpen(false)}
          aria-label="Close"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* View Mode Toggle Switcher */}
        {!done && (
          <div className="flex items-center justify-center mb-5">
            <div className="inline-flex bg-neutral-200/70 p-1 rounded-full border border-neutral-300/40">
              <button
                type="button"
                onClick={() => setActiveTab("form")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "form"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Audit Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("calendar")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "calendar"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                Book 30-min Call
              </button>
            </div>
          </div>
        )}

        {/* Done State */}
        {done ? (
          <div className="py-10 text-center max-w-lg mx-auto">
            <span
              className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-xs border border-neutral-200/60"
              style={{ fontSize: 13 }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: "#ef4d23" }}
              />
              Audit Request Confirmed
            </span>
            <h2
              className="mt-6 text-3xl font-medium tracking-tight text-neutral-900"
              style={{ lineHeight: 1.15 }}
            >
              Thanks — we'll be in{" "}
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                touch
              </span>
            </h2>
            <p className="mt-3 text-neutral-600 text-sm leading-relaxed">
              Your details have been received and saved. You can also pick a direct 30-minute growth strategy time slot on our calendar right now:
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={buildCalendlyUrl({ name: values.name, email: values.email })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#ef4d23] hover:bg-[#d83f17] text-white px-7 py-3 text-sm font-bold shadow-md shadow-[#ef4d23]/25 transition-all cursor-pointer"
              >
                <CalendarIcon className="w-4 h-4" /> Pick 30-Min Call Slot on Calendly →
              </a>
              <button
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white border border-neutral-300 text-neutral-700 px-6 py-3 text-sm font-medium hover:bg-neutral-50 shadow-xs cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        ) : activeTab === "form" ? (
          /* TAB 1: FORM VIEW (IMAGE 1 EXACT MATCH) */
          <div>
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-3.5 py-1.5 shadow-2xs border border-neutral-200/60">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: "#ef4d23" }}
              />
              <span className="text-xs font-medium text-neutral-800">Free 30-minute audit</span>
            </div>

            <h2
              className="mt-3 text-3xl sm:text-[34px] font-normal tracking-tight text-neutral-900 leading-snug"
            >
              Tell us about your{" "}
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                growth
              </span>{" "}
              goals
            </h2>

            <form className="mt-5 space-y-4" onSubmit={submitForm}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <label className="block">
                  <span className="text-xs font-medium text-neutral-600 mb-1.5 block">Full name</span>
                  <input
                    className={inputClass}
                    value={values.name}
                    maxLength={100}
                    required
                    autoComplete="name"
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Ana Roy"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-neutral-600 mb-1.5 block">Work email</span>
                  <input
                    className={inputClass}
                    type="email"
                    value={values.email}
                    maxLength={255}
                    required
                    autoComplete="email"
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="ana@brand.com"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-neutral-600 mb-1.5 block">Phone / WhatsApp</span>
                  <input
                    className={inputClass}
                    type="tel"
                    value={values.phone}
                    maxLength={30}
                    autoComplete="tel"
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-neutral-600 mb-1.5 block">Company</span>
                  <input
                    className={inputClass}
                    value={values.company}
                    maxLength={120}
                    onChange={(e) => set("company", e.target.value)}
                    placeholder="Brand Co."
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-neutral-600 mb-1.5 block">Website</span>
                  <input
                    className={inputClass}
                    value={values.website}
                    maxLength={200}
                    onChange={(e) => set("website", e.target.value)}
                    placeholder="brand.com"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-neutral-600 mb-1.5 block">What do you need?</span>
                  <div className="relative">
                    <select
                      className={`${inputClass} appearance-none pr-8 cursor-pointer`}
                      value={values.goal}
                      onChange={(e) => set("goal", e.target.value)}
                    >
                      {GOALS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs">
                      ▼
                    </div>
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-neutral-600 mb-1.5 block">Monthly budget</span>
                  <div className="relative">
                    <select
                      className={`${inputClass} appearance-none pr-8 cursor-pointer`}
                      value={values.budget}
                      onChange={(e) => set("budget", e.target.value)}
                    >
                      {BUDGETS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs">
                      ▼
                    </div>
                  </div>
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-medium text-neutral-600 mb-1.5 block">Anything else?</span>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={3}
                  maxLength={2000}
                  value={values.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="Current channels, targets, timelines…"
                />
              </label>

              {error && (
                <p className="text-[#ef4d23] text-xs font-medium" role="alert">
                  {error}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-[#f04620] hover:bg-[#de3b16] active:scale-[0.99] text-white font-medium text-sm sm:text-base py-3.5 px-6 rounded-full flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg shadow-[#f04620]/25 disabled:opacity-60"
                >
                  {sending ? "Sending details…" : "Send my details"}
                  <span className="w-7 h-7 rounded-full bg-white/20 inline-flex items-center justify-center">
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </span>
                </button>
                <p className="text-neutral-500 text-center text-[12px] mt-3">
                  We only use your details to reply about your audit.
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* TAB 2: 30-MIN STRATEGY CALL SCHEDULER VIEW */
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-md relative overflow-hidden">
            {/* Top Brand Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#ef4d23]" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2 items-center">
              {/* Left Column: Host & Meeting Details */}
              <div className="md:col-span-5 pr-0 md:pr-6 border-b md:border-b-0 md:border-r border-neutral-200/80 pb-6 md:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#ef4d23] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-[#ef4d23]/10">
                    SP
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Sahit Sai Pothala</h4>
                    <p className="text-xs text-neutral-500">Founder &amp; Growth Lead • Lumen &amp; Co</p>
                  </div>
                </div>

                <div className="mt-5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ef4d23]/10 text-[#ef4d23] text-[11px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef4d23]" />
                    30-Minute Growth Strategy Call
                  </span>
                  <h3 className="text-2xl font-bold text-neutral-900 mt-2 tracking-tight">
                    Scale Your Performance &amp; Creatives
                  </h3>
                  <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                    A private 1-on-1 strategy session to audit your current marketing funnel, creative velocity, and paid acquisition bottlenecks.
                  </p>
                </div>

                <div className="mt-5 space-y-2.5 text-xs font-medium text-neutral-700 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/70">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#ef4d23]" />
                    <span>30 Minutes duration</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Video className="w-4 h-4 text-[#ef4d23]" />
                    <span>Google Meet (web conferencing)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#ef4d23]" />
                    <span>Live ROAS audit &amp; actionable recommendations</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-[#ef4d23]" />
                    <span>Auto-adjusts to your local timezone</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Pre-fill & Instant Redirect to Calendly */}
              <div className="md:col-span-7 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-neutral-900">Enter details to pick your slot</h4>
                  <p className="text-xs text-neutral-500 mt-0.5 mb-4">
                    We'll pre-fill your information on Calendly and record your audit request in our CRM.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Your Name <span className="text-[#ef4d23]">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full text-xs rounded-xl border border-neutral-200/90 bg-neutral-50/70 px-3.5 py-2.5 outline-none focus:bg-white focus:border-[#ef4d23] text-neutral-900 placeholder:text-neutral-400 transition-all shadow-2xs"
                        placeholder="e.g. Alex Morgan"
                        value={values.name}
                        maxLength={100}
                        required
                        onChange={(e) => set("name", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Work Email <span className="text-[#ef4d23]">*</span>
                      </label>
                      <input
                        type="email"
                        className="w-full text-xs rounded-xl border border-neutral-200/90 bg-neutral-50/70 px-3.5 py-2.5 outline-none focus:bg-white focus:border-[#ef4d23] text-neutral-900 placeholder:text-neutral-400 transition-all shadow-2xs"
                        placeholder="e.g. alex@company.com"
                        value={values.email}
                        maxLength={255}
                        required
                        onChange={(e) => set("email", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          Phone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          className="w-full text-xs rounded-xl border border-neutral-200/90 bg-neutral-50/70 px-3.5 py-2.5 outline-none focus:bg-white focus:border-[#ef4d23] text-neutral-900 placeholder:text-neutral-400 transition-all shadow-2xs"
                          placeholder="+91 / +1 ..."
                          value={values.phone}
                          maxLength={30}
                          onChange={(e) => set("phone", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          Company / Website
                        </label>
                        <input
                          type="text"
                          className="w-full text-xs rounded-xl border border-neutral-200/90 bg-neutral-50/70 px-3.5 py-2.5 outline-none focus:bg-white focus:border-[#ef4d23] text-neutral-900 placeholder:text-neutral-400 transition-all shadow-2xs"
                          placeholder="e.g. brand.com"
                          value={values.company}
                          maxLength={100}
                          onChange={(e) => set("company", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <p className="text-[#ef4d23] text-xs font-medium mt-3" role="alert">
                      {error}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-5 border-t border-neutral-200/80 space-y-3">
                  <button
                    type="button"
                    onClick={confirmBooking}
                    disabled={sending}
                    className="w-full bg-[#ef4d23] hover:bg-[#d83f17] text-white font-bold text-sm py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#ef4d23]/25 disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CalendarIcon className="w-4 h-4" />
                    )}
                    {sending ? "Connecting to Calendly..." : "Choose 30-Min Time Slot on Calendly →"}
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1">
                    <span>Branded Calendly Integration</span>
                    <a
                      href={CALENDLY_BRANDED_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ef4d23] font-medium hover:underline inline-flex items-center gap-1"
                    >
                      Open directly in new tab ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
