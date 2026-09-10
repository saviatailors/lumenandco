import { useEffect, useState } from "react";
import { ChevronRight, Loader2, X } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const OPEN_EVENT = "convix:open-lead-form";

export function openLeadForm() {
  window.dispatchEvent(new Event(OPEN_EVENT));

}


const schema = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(100, "Name is too long"),
  email: z.string().trim().email("Enter a valid email address").max(255, "Email is too long"),
  company: z.string().trim().max(120, "Company name is too long"),
  website: z.string().trim().max(200, "Website is too long"),
  budget: z.string().trim().max(60),
  goal: z.string().trim().max(120),
  message: z.string().trim().max(2000, "Please keep it under 2000 characters"),
});

const EMPTY = {
  name: "",
  email: "",
  company: "",
  website: "",
  budget: "",
  goal: "Performance marketing",
  message: "",
};

const BUDGETS = ["< $5k / mo", "$5k – $15k / mo", "$15k – $50k / mo", "$50k+ / mo"];
const GOALS = [
  "Performance marketing",
  "SEO & content",
  "Paid social",
  "Creative studio",
  "Analytics & CRO",
  "Brand & PR",
];

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 outline-none focus:border-[#ef4d23] transition-colors";

export default function LeadFormDialog() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onOpen = () => {
      setDone(false);
      setError(null);
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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSending(true);
    const v = parsed.data;
    const { error: dbError } = await supabase.from("leads").insert({
      name: v.name,
      email: v.email,
      company: v.company || null,
      website: v.website || null,
      budget: v.budget || null,
      goal: v.goal || null,
      message: v.message || null,
    });
    setSending(false);
    if (dbError) {
      setError("Something went wrong sending your details. Please try again.");
      return;
    }
    setValues(EMPTY);
    setDone(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6">
      <button
        aria-label="Close form"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Get started with lumen&co"
        className="relative w-full max-w-[560px] max-h-[92vh] overflow-y-auto bg-[#f5f2ee] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl animate-scale-in"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <button
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white inline-flex items-center justify-center border border-neutral-200"
          onClick={() => setOpen(false)}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {done ? (
          <div className="py-6 text-center">
            <span
              className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5"
              style={{ fontSize: 13 }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: "#ef4d23" }}
              />
              Request received
            </span>
            <h2
              className="mt-5"
              style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em" }}
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
            <p className="mt-3 text-neutral-600" style={{ fontSize: 14 }}>
              A strategist will reply within one working day with your free audit slot.
            </p>
            <button
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0b0f1a] text-white px-6 py-2.5 hover-lift"
              style={{ fontSize: 14 }}
              onClick={() => setOpen(false)}
            >
              Back to site
            </button>
          </div>
        ) : (
          <>
            <span
              className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5"
              style={{ fontSize: 13 }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: "#ef4d23" }}
              />
              Free 30-minute audit
            </span>
            <h2
              className="mt-4"
              style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.1 }}
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

            <form className="mt-5 grid gap-3.5" onSubmit={submit} style={{ fontSize: 14 }}>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-neutral-600">Full name</span>
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
                <label className="grid gap-1.5">
                  <span className="text-neutral-600">Work email</span>
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
                <label className="grid gap-1.5">
                  <span className="text-neutral-600">Company</span>
                  <input
                    className={inputClass}
                    value={values.company}
                    maxLength={120}
                    onChange={(e) => set("company", e.target.value)}
                    placeholder="Brand Co."
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-neutral-600">Website</span>
                  <input
                    className={inputClass}
                    value={values.website}
                    maxLength={200}
                    onChange={(e) => set("website", e.target.value)}
                    placeholder="brand.com"
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-neutral-600">What do you need?</span>
                  <select
                    className={inputClass}
                    value={values.goal}
                    onChange={(e) => set("goal", e.target.value)}
                  >
                    {GOALS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5">
                  <span className="text-neutral-600">Monthly budget</span>
                  <select
                    className={inputClass}
                    value={values.budget}
                    onChange={(e) => set("budget", e.target.value)}
                  >
                    <option value="">Not sure yet</option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="grid gap-1.5">
                <span className="text-neutral-600">Anything else?</span>
                <textarea
                  className={inputClass}
                  rows={3}
                  maxLength={2000}
                  value={values.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="Current channels, targets, timelines…"
                />
              </label>

              {error && (
                <p className="text-[#ef4d23]" style={{ fontSize: 13 }} role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="mt-1 inline-flex items-center justify-center gap-3 rounded-full text-white pl-6 pr-2 py-2.5 hover-lift disabled:opacity-60"
                style={{ backgroundColor: "#ef4d23", fontSize: 14 }}
              >
                {sending ? "Sending…" : "Send my details"}
                <span className="w-7 h-7 rounded-full bg-white/20 inline-flex items-center justify-center">
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </span>
              </button>
              <p className="text-neutral-500" style={{ fontSize: 12 }}>
                We only use your details to reply about your audit.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
