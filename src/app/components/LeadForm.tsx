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
} from "lucide-react";
import { z } from "zod";
import { supabase } from "@/lib/supabase-client";
import { captureInboundLead } from "@/lib/lead-capture";

const OPEN_EVENT = "convix:open-lead-form";

export function openLeadForm() {
  window.dispatchEvent(new Event(OPEN_EVENT));
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

const TIMEZONES = [
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Singapore",
  "Australia/Sydney",
];

const TIME_SLOTS_12H = [
  "09:30am",
  "10:00am",
  "11:30am",
  "02:00pm",
  "03:30pm",
  "05:00pm",
  "06:30pm",
  "11:30pm",
];

const TIME_SLOTS_24H = [
  "09:30",
  "10:00",
  "11:30",
  "14:00",
  "15:30",
  "17:00",
  "18:30",
  "23:30",
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

  // Calendar state matching Image 2
  const [selectedDay, setSelectedDay] = useState(25);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(8); // September (0-indexed 8)
  const [selectedYear] = useState(2026);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("11:30pm");
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  useEffect(() => {
    const onOpen = () => {
      setDone(false);
      setError(null);
      setActiveTab("form");
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

  const monthsList = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

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

  async function confirmBooking() {
    setError(null);
    if (!values.name || !values.name.trim()) {
      setError("Please enter your name so we know who to meet with");
      return;
    }
    if (!values.email || !values.email.trim() || !values.email.includes("@")) {
      setError("Please enter a valid work email for your calendar invite");
      return;
    }

    setSending(true);
    const monthName = monthsList[selectedMonthIndex] || "September";
    const dateStr = `${monthName} ${selectedDay}, ${selectedYear} at ${selectedTimeSlot} (${timezone})`;

    try {
      await captureInboundLead({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone?.trim() || undefined,
        company: values.company?.trim() || undefined,
        website: values.website?.trim() || undefined,
        budget: values.budget?.trim() || undefined,
        goal: values.goal?.trim() || "30-min Strategy & Audit Meeting",
        message: values.message?.trim()
          ? `Scheduled 30-min meeting for ${dateStr}. Note: ${values.message.trim()}`
          : `Scheduled 30-min strategy meeting for ${dateStr}.`,
        scheduled_meeting_date: dateStr,
        is_booking: true,
      });
    } catch (err) {
      console.warn("Booking lead capture error:", err);
    }
    setSending(false);
    setDone(true);
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
          <div className="py-10 text-center max-w-md mx-auto">
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
              {activeTab === "calendar"
                ? `Your 30-minute audit meeting is reserved for Sep ${selectedDay}, ${selectedYear} at ${selectedTimeSlot} (${timezone}). A calendar invite has been dispatched.`
                : "A senior growth strategist will review your details and send your free audit roadmap within 24 hours."}
            </p>
            <button
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0b0f1a] text-white px-7 py-3 hover-lift text-sm font-medium shadow-md"
              onClick={() => setOpen(false)}
            >
              Back to site
            </button>
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
          /* TAB 2: CALENDAR SCHEDULER VIEW (IMAGE 2 EXACT MATCH) */
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-neutral-200/80 shadow-md relative overflow-hidden">
            {/* Top Brand Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#ef4d23]" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
              {/* Left Column: Host info */}
              <div className="md:col-span-3 pr-0 md:pr-4 border-b md:border-b-0 md:border-r border-neutral-200/80 pb-5 md:pb-0">
                <div className="w-11 h-11 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-sm overflow-hidden border border-neutral-200 shadow-xs">
                  <span className="text-xs bg-gradient-to-tr from-emerald-600 to-teal-400 w-full h-full flex items-center justify-center">
                    MP
                  </span>
                </div>
                <p className="mt-2.5 text-xs font-semibold text-neutral-600">Mohit Pandey</p>
                <h3 className="text-xl font-bold text-neutral-900 leading-snug">30 min meeting</h3>

                <div className="mt-4 space-y-2.5 text-xs font-medium text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-500" />
                    <span>30m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-neutral-500" />
                    <span>Cal Video</span>
                  </div>
                  <div className="pt-2">
                    <div className="relative inline-block w-full">
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full appearance-none bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-700 pr-7 cursor-pointer hover:bg-neutral-100 transition-colors"
                      >
                        {TIMEZONES.map((tz) => (
                          <option key={tz} value={tz}>
                            {tz}
                          </option>
                        ))}
                      </select>
                      <Globe className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column: Calendar Month View */}
              <div className="md:col-span-5 px-0 md:px-3 border-b md:border-b-0 md:border-r border-neutral-200/80 pb-5 md:pb-0">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-neutral-900">
                    {monthsList[selectedMonthIndex]} <span className="text-neutral-500 font-normal">{selectedYear}</span>
                  </h4>
                  <div className="flex items-center gap-1 text-neutral-500">
                    <button
                      type="button"
                      onClick={() => setSelectedMonthIndex((prev) => Math.max(0, prev - 1))}
                      className="p-1 hover:text-black hover:bg-neutral-100 rounded-md transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedMonthIndex((prev) => Math.min(11, prev + 1))}
                      className="p-1 hover:text-black hover:bg-neutral-100 rounded-md transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Days of week header */}
                <div className="grid grid-cols-7 text-center text-[10px] font-bold text-neutral-400 tracking-wider mb-2">
                  <span>SUN</span>
                  <span>MON</span>
                  <span>TUE</span>
                  <span>WED</span>
                  <span>THU</span>
                  <span>FRI</span>
                  <span>SAT</span>
                </div>

                {/* Date Grid matching Image 2 */}
                <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                  {/* Empty cells before month starts */}
                  <div className="py-2.5" />
                  <div className="py-2.5" />

                  {/* Days 8 to 24 */}
                  {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDay(d)}
                      className={`py-2 rounded-xl text-neutral-700 font-medium transition-all hover:bg-neutral-100 ${
                        selectedDay === d ? "bg-neutral-200 font-bold" : ""
                      }`}
                    >
                      {d}
                    </button>
                  ))}

                  {/* Active Selected Day (25th) */}
                  <button
                    type="button"
                    onClick={() => setSelectedDay(25)}
                    className={`py-2 rounded-xl text-white font-semibold transition-all relative flex flex-col items-center justify-center ${
                      selectedDay === 25 ? "bg-[#ef4d23] shadow-xs" : "bg-[#ef4d23]/80 text-white"
                    }`}
                  >
                    <span>25</span>
                    <span className="w-1 h-1 rounded-full bg-white mt-0.5" />
                  </button>

                  {/* Day 26 */}
                  <button
                    type="button"
                    onClick={() => setSelectedDay(26)}
                    className={`py-2 rounded-xl font-medium transition-all ${
                      selectedDay === 26 ? "bg-[#ef4d23] text-white" : "bg-[#f5f3ee] text-neutral-800 hover:bg-[#eae6de]"
                    }`}
                  >
                    26
                  </button>

                  {/* Days 27, 28, 29, 30 with grey background pills */}
                  {[27, 28, 29, 30].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDay(d)}
                      className={`py-2 rounded-xl font-medium transition-all ${
                        selectedDay === d ? "bg-[#ef4d23] text-white" : "bg-[#f5f3ee] text-neutral-800 hover:bg-[#eae6de]"
                      }`}
                    >
                      {d}
                    </button>
                  ))}

                  {/* Next month days OCT 1 to 10 */}
                  {[{ num: 1, tag: "OCT" }, { num: 2 }, { num: 3 }, { num: 4 }, { num: 5 }, { num: 6 }, { num: 7 }, { num: 8 }, { num: 9 }, { num: 10 }].map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedDay(item.num)}
                      className={`py-1.5 rounded-xl font-medium transition-all flex flex-col items-center justify-center ${
                        selectedDay === item.num ? "bg-[#ef4d23] text-white" : "bg-[#f5f3ee] text-neutral-800 hover:bg-[#eae6de]"
                      }`}
                    >
                      {item.tag && (
                        <span className="text-[8px] tracking-tighter uppercase font-semibold text-neutral-500 leading-none">
                          {item.tag}
                        </span>
                      )}
                      <span className="text-xs">{item.num}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Time Slots & Contact */}
              <div className="md:col-span-4 pl-0 md:pl-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-neutral-800">
                      {monthsList[selectedMonthIndex]?.slice(0, 3)} {selectedDay}th
                    </span>
                    <div className="inline-flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/80 text-[11px] font-medium">
                      <button
                        type="button"
                        onClick={() => setTimeFormat("12h")}
                        className={`px-2 py-0.5 rounded-md transition-all ${
                          timeFormat === "12h" ? "bg-white text-neutral-900 shadow-xs font-semibold" : "text-neutral-500"
                        }`}
                      >
                        12h
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeFormat("24h")}
                        className={`px-2 py-0.5 rounded-md transition-all ${
                          timeFormat === "24h" ? "bg-white text-neutral-900 shadow-xs font-semibold" : "text-neutral-500"
                        }`}
                      >
                        24h
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {(timeFormat === "12h" ? TIME_SLOTS_12H : TIME_SLOTS_24H).map((slot) => {
                      const isSelected = selectedTimeSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`w-full py-1.5 px-3 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                            isSelected
                              ? "bg-[#ef4d23] text-white border-[#ef4d23] shadow-md font-semibold"
                              : "bg-white border-neutral-200 text-neutral-800 hover:border-[#ef4d23] hover:text-[#ef4d23] hover:bg-[#ef4d23]/5"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Direct Contact Inputs for Instant Booking */}
                <div className="mt-3 pt-3 border-t border-neutral-200/80 space-y-2">
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      className="w-full text-xs rounded-xl border border-neutral-200/90 bg-neutral-50/70 px-3 py-2 outline-none focus:bg-white focus:border-[#ef4d23] text-neutral-900 placeholder:text-neutral-400 transition-all shadow-2xs"
                      placeholder="Your full name *"
                      value={values.name}
                      maxLength={100}
                      required
                      onChange={(e) => set("name", e.target.value)}
                    />
                    <input
                      type="email"
                      className="w-full text-xs rounded-xl border border-neutral-200/90 bg-neutral-50/70 px-3 py-2 outline-none focus:bg-white focus:border-[#ef4d23] text-neutral-900 placeholder:text-neutral-400 transition-all shadow-2xs"
                      placeholder="Work email *"
                      value={values.email}
                      maxLength={255}
                      required
                      onChange={(e) => set("email", e.target.value)}
                    />
                    <input
                      type="tel"
                      className="w-full text-xs rounded-xl border border-neutral-200/90 bg-neutral-50/70 px-3 py-2 outline-none focus:bg-white focus:border-[#ef4d23] text-neutral-900 placeholder:text-neutral-400 transition-all shadow-2xs"
                      placeholder="Phone / WhatsApp (optional)"
                      value={values.phone}
                      maxLength={30}
                      onChange={(e) => set("phone", e.target.value)}
                    />
                  </div>

                  {error && (
                    <p className="text-[#ef4d23] text-[11px] font-medium" role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={confirmBooking}
                    disabled={sending}
                    className="w-full bg-[#ef4d23] hover:bg-[#d83f17] text-white font-medium text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-60"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {sending ? "Reserving slot..." : `Confirm for ${selectedTimeSlot}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
