import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Clock,
  HelpCircle,
} from "lucide-react";
import Navbar from "./Navbar";
import LeadFormDialog, { openLeadForm } from "./LeadForm";
import { Footer, Eyebrow } from "./HomeSections";

export interface FaqData {
  question: string;
  answer: string;
}

export interface MetricItem {
  value: string;
  label: string;
  sub?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  timeline?: string;
}

export interface ServicePageProps {
  eyebrow: string;
  h1: string;
  heroSubtitle: string;
  targetMarket?: "India" | "US" | "Global";
  problemTitle: string;
  problemDescription: string;
  problemPoints: string[];
  solutionTitle: string;
  solutionDescription: string;
  solutionPoints: { title: string; description: string }[];
  processSteps: ProcessStep[];
  deliverables: string[];
  metrics: MetricItem[];
  pricingHint: {
    headline: string;
    details: string;
    badge?: string;
  };
  faqs: FaqData[];
  relatedLinks: { label: string; href: string; badge?: string }[];
  children?: ReactNode;
}

export default function ServicePageTemplate(props: ServicePageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div
      className="relative min-h-screen w-full bg-[#f8f9fa] text-[#111] p-3 sm:p-4"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        <Navbar />

        {/* HERO SECTION */}
        <section className="pt-12 sm:pt-20 pb-16 sm:pb-24 text-center px-4">
          <div className="flex justify-center mb-4">
            <Eyebrow>{props.eyebrow}</Eyebrow>
          </div>

          <h1
            className="mt-4 max-w-4xl mx-auto text-balance tracking-tight"
            style={{
              fontSize: "clamp(34px, 6vw, 62px)",
              lineHeight: 1.08,
              fontWeight: 600,
              letterSpacing: "-0.025em",
            }}
          >
            {props.h1}
          </h1>

          <p
            className="mt-6 max-w-2xl mx-auto text-neutral-600 leading-relaxed text-balance"
            style={{ fontSize: "clamp(15px, 2.5vw, 18px)" }}
          >
            {props.heroSubtitle}
          </p>

          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={openLeadForm}
              className="inline-flex items-center gap-3 bg-[#0b0f1a] text-white rounded-full pl-6 pr-2.5 py-3 hover-lift shadow-md transition-all hover:bg-neutral-900"
              style={{ fontSize: 15, fontWeight: 500 }}
            >
              Book a free strategy call
              <span
                className="w-7 h-7 rounded-full inline-flex items-center justify-center text-white"
                style={{ backgroundColor: "#ef4d23" }}
              >
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
            <Link
              to="/work/"
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-800 hover:bg-neutral-50 transition-colors"
            >
              See case studies
              <ArrowUpRight className="w-4 h-4 text-neutral-500" />
            </Link>
          </div>

          {/* Quick Trust Badges */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#ef4d23]" /> 21-day turnaround to launch
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#ef4d23]" /> Month-to-month flexibility
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#ef4d23]" /> Dedicated senior growth strategist
            </span>
          </div>
        </section>

        {/* METRICS STRIP */}
        <section className="mb-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {props.metrics.map((m, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm text-center"
              >
                <div
                  className="text-3xl sm:text-4xl font-semibold tracking-tight"
                  style={{ color: "#ef4d23" }}
                >
                  {m.value}
                </div>
                <div className="mt-1 text-sm font-medium text-neutral-800">{m.label}</div>
                {m.sub ? <div className="mt-0.5 text-xs text-neutral-400">{m.sub}</div> : null}
              </div>
            ))}
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="mb-14 bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-sm">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#ef4d23]" /> The Challenge in 2026
            </div>
            <h2
              className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900"
              style={{ letterSpacing: "-0.02em" }}
            >
              {props.problemTitle}
            </h2>
            <p className="mt-4 text-neutral-600 leading-relaxed text-base">
              {props.problemDescription}
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {props.problemPoints.map((pt, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-150 text-sm text-neutral-700 leading-snug"
                >
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT WE DO / SOLUTION */}
        <section className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-2">
              <Sparkles className="w-4 h-4 text-[#ef4d23]" /> What We Deliver
            </div>
            <h2
              className="text-2xl sm:text-4xl font-semibold tracking-tight text-neutral-900"
              style={{ letterSpacing: "-0.02em" }}
            >
              {props.solutionTitle}
            </h2>
            <p className="mt-3 text-neutral-600 text-sm sm:text-base leading-relaxed">
              {props.solutionDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {props.solutionPoints.map((sol, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-sm flex flex-col justify-between hover:border-neutral-300 transition-colors"
              >
                <div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold mb-4 text-white"
                    style={{ backgroundColor: "#ef4d23" }}
                  >
                    0{i + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{sol.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{sol.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4-STEP PROCESS */}
        <section className="mb-14 bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-2">
              <Clock className="w-4 h-4 text-[#ef4d23]" /> Methodical & Transparent
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
              Our 4-Step Compounding Process
            </h2>
            <p className="mt-2 text-neutral-600 text-sm">
              From day 1 audit to weekly testing loops that scale revenue predictably.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {props.processSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 relative"
              >
                <div className="text-xs font-semibold text-[#ef4d23] mb-1">{step.number}</div>
                <div className="text-base font-semibold text-neutral-900 mb-2">{step.title}</div>
                <p className="text-xs text-neutral-600 leading-relaxed">{step.description}</p>
                {step.timeline ? (
                  <div className="mt-3 inline-block rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium text-neutral-500 border border-neutral-200">
                    {step.timeline}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* DELIVERABLES & PRICING HINT */}
        <section className="mb-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deliverables checklist */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Tangible Outputs
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                What Ships to Your Account
              </h3>
              <ul className="space-y-3">
                {props.deliverables.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing Hint Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-medium text-[#ef4d23] mb-3">
                {props.pricingHint.badge || "Simple Pricing"}
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                {props.pricingHint.headline}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                {props.pricingHint.details}
              </p>
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 text-xs text-neutral-600 space-y-1.5">
                <div>✓ No long-term lock-in: month-to-month after first 90 days</div>
                <div>✓ 100% IP ownership of all creatives, scripts and data</div>
                <div>✓ Weekly reporting call directly with your senior execution team</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <Link
                to="/pricing/"
                className="text-xs font-medium text-neutral-700 hover:text-black underline underline-offset-4"
              >
                View full pricing plans →
              </Link>
              <button
                onClick={openLeadForm}
                className="rounded-full bg-[#0b0f1a] text-white text-xs font-medium px-4 py-2 hover:bg-neutral-800 transition-colors"
              >
                Request custom quote
              </button>
            </div>
          </div>
        </section>

        {/* RESULTS & CLIENT TRUST BLOCK */}
        <section className="mb-14 bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-sm">
          <div className="max-w-2xl mb-6">
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Proven Impact
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
              Results Measured in Revenue, Not Vanity
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              "Judge us on profit, not on decks." We operate as an embedded growth partner tied to contribution margin.
            </p>
          </div>

          {/* Testimonial Placeholder Block clearly marked per spec */}
          <div className="p-5 rounded-2xl bg-neutral-50 border border-dashed border-neutral-300 text-neutral-600 text-xs sm:text-sm">
            <div className="font-semibold text-neutral-800 mb-1">
              Client Proof &amp; Case Study Note (TODO):
            </div>
            <p className="text-neutral-500 leading-relaxed">
              Real project metrics and verified video reels are available in our{" "}
              <Link to="/work/" className="text-[#ef4d23] font-medium underline">
                Work section
              </Link>
              . Verified client testimonial video hooks and logos will be updated upon quarterly partner sign-off.
            </p>
          </div>
        </section>

        {/* VISIBLE FAQS (Matches FAQPage Schema) */}
        <section className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-2">
              <HelpCircle className="w-4 h-4 text-[#ef4d23]" /> Frequently Asked Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
              Everything You Need to Know
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {props.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-medium text-neutral-900 text-sm sm:text-base hover:bg-neutral-50/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-500 transition-transform ${
                        isOpen ? "rotate-180 text-[#ef4d23]" : ""
                      }`}
                    />
                  </button>
                  {isOpen ? (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-neutral-600 text-xs sm:text-sm leading-relaxed border-t border-neutral-100 pt-3">
                      {faq.answer}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        {/* INTERNAL LINKS TRIAD */}
        <section className="mb-14 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            Related Growth Resources
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
            {props.relatedLinks.map((link, i) => (
              <Link
                key={i}
                to={link.href}
                className="group p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 hover:border-[#ef4d23]/40 transition-colors flex items-center justify-between"
              >
                <div>
                  {link.badge ? (
                    <div className="text-[10px] uppercase font-semibold text-[#ef4d23] mb-0.5">
                      {link.badge}
                    </div>
                  ) : null}
                  <div className="text-sm font-medium text-neutral-900 group-hover:text-[#ef4d23] transition-colors">
                    {link.label}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-[#ef4d23] transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="mb-16 bg-[#0b0f1a] text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: "#ef4d23" }}
          />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ backgroundColor: "rgba(239, 77, 35, 0.18)", color: "#ff6c45" }}
            >
              Ready to Scale?
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
              Let's Find the Revenue Hiding in Your Campaigns
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8">
              Book a 30-minute growth audit. No pushy sales pitch — just real data, creative angles, and an actionable roadmap tailored for your market.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={openLeadForm}
                className="inline-flex items-center gap-2.5 rounded-full text-white px-7 py-3 text-sm font-medium shadow-lg hover-lift transition-transform"
                style={{ backgroundColor: "#ef4d23" }}
              >
                Book a free strategy call
                <ChevronRight className="w-4 h-4" />
              </button>
              <Link
                to="/contact/"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white hover:bg-white/20 transition-colors"
              >
                Direct contact details
              </Link>
            </div>
          </div>
        </section>

        <Footer />
        <LeadFormDialog />
      </div>
    </div>
  );
}
