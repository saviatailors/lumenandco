import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ChevronRight, HelpCircle, ArrowUpRight } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { Footer, Eyebrow } from "@/app/components/HomeSections";
import LeadFormDialog, { openLeadForm } from "@/app/components/LeadForm";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () =>
    buildSeoMeta({
      title: "Digital Marketing Packages & Pricing | Lumen & Co",
      description:
        "Transparent monthly plans for India and US clients. Creatives, video, ads and SEO — custom packages available.",
      canonicalPath: "/pricing/",
      keywords: [
        "digital marketing packages India",
        "digital marketing agency pricing",
        "monthly marketing retainer cost",
        "US offshore marketing pricing",
        "SEO and paid ads packages",
      ],
      breadcrumbs: [
        { name: "Home", item: "/" },
        { name: "Pricing", item: "/pricing/" },
      ],
      faqs: [
        {
          question: "How much does Lumen & Co charge?",
          answer:
            "US plans start at $600/month. India packages are quoted following a free 30-minute growth audit based on your monthly creative volume and ad spend tiers. Custom enterprise retainers are also available.",
        },
        {
          question: "Are there any long-term contract lock-ins?",
          answer:
            "No. After an initial 90-day foundational sprint (which allows sufficient time to test, learn, and optimize creative funnels), all retainers transition to month-to-month.",
        },
        {
          question: "Is ad spend included in the monthly retainer?",
          answer:
            "No. Ad spend is paid directly to advertising platforms (Meta, Google, TikTok) using your credit card so you maintain 100% control, points, and account ownership.",
        },
        {
          question: "Who owns the creative assets produced?",
          answer:
            "You own 100% of all video edits, design files, copywriting decks, and ad account data from day one.",
        },
      ],
    }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div
      className="relative min-h-screen w-full bg-[#f8f9fa] text-[#111] p-3 sm:p-4"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        <Navbar />

        {/* Hero */}
        <section className="pt-12 sm:pt-20 pb-14 text-center px-4">
          <div className="flex justify-center mb-4">
            <Eyebrow>Transparent Investment</Eyebrow>
          </div>
          <h1
            className="mt-4 max-w-3xl mx-auto text-balance tracking-tight"
            style={{
              fontSize: "clamp(34px, 6vw, 60px)",
              lineHeight: 1.08,
              fontWeight: 600,
              letterSpacing: "-0.025em",
            }}
          >
            Simple Plans. Real Results.
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-neutral-600 text-sm sm:text-base leading-relaxed">
            Transparent monthly plans for brands in India and businesses in the US. No hidden fees, no opaque markups, and no lock-in after 90 days.
          </p>
        </section>

        {/* Pricing Cards Grid */}
        <section className="mb-20 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1: Creative & Video */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-semibold text-neutral-500 tracking-wider">
                  Creative Engine
                </span>
                <h2 className="text-2xl font-bold text-neutral-900 mt-2">Creative &amp; Reels</h2>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  For brands needing high-velocity short-form video reels, static ads, and carousel creative.
                </p>

                <div className="mt-6 mb-6 pb-6 border-b border-neutral-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-neutral-900">$600</span>
                    <span className="text-xs text-neutral-500">/ month (or ₹45k INR)</span>
                  </div>
                  <div className="text-[11px] text-[#ef4d23] font-medium mt-1">
                    Billed monthly • Month-to-month after 90 days
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-neutral-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <span>12 to 16 High-retention video reels &amp; TikTok cuts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <span>20+ Static ad variants and educational carousels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <span>Kinetic typography, motion graphics &amp; sound design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <span>Gen AI visual concepting &amp; hook testing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <span>48 to 72-hour turnaround per batch</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={openLeadForm}
                  className="w-full rounded-full bg-[#0b0f1a] text-white py-2.5 text-xs font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Tier 2: Full Growth Partner (Popular) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#ef4d23] shadow-md flex flex-col justify-between relative">
              <div
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-semibold text-white uppercase tracking-wider shadow"
                style={{ backgroundColor: "#ef4d23" }}
              >
                Most Popular
              </div>

              <div>
                <span className="text-xs uppercase font-semibold text-neutral-500 tracking-wider">
                  Full-Funnel Retainer
                </span>
                <h2 className="text-2xl font-bold text-neutral-900 mt-2">Scale &amp; Media</h2>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  End-to-end creative production, Meta &amp; Google ad management, and server-side tracking.
                </p>

                <div className="mt-6 mb-6 pb-6 border-b border-neutral-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-neutral-900">$1,200</span>
                    <span className="text-xs text-neutral-500">/ month (or ₹85k INR)</span>
                  </div>
                  <div className="text-[11px] text-[#ef4d23] font-medium mt-1">
                    Complete growth engine • Includes ad management
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-neutral-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <span>Everything in Creative Engine tier</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <span>Full Meta (FB/IG) &amp; Google Ads management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <span>Server-side Meta Conversions API (CAPI) setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <span>Weekly creative A/B testing inside ad sets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <span>Dedicated senior media buyer &amp; weekly Zoom review</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={openLeadForm}
                  className="w-full rounded-full text-white py-2.5 text-xs font-semibold shadow hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#ef4d23" }}
                >
                  Book a Strategy Call
                </button>
              </div>
            </div>

            {/* Tier 3: Omnichannel & Med Spa */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-semibold text-neutral-500 tracking-wider">
                  Enterprise &amp; Specialized
                </span>
                <h2 className="text-2xl font-bold text-neutral-900 mt-2">Omnichannel / Med Spa</h2>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  For aesthetic clinics, high-volume D2C, and multi-location businesses demanding total market dominance.
                </p>

                <div className="mt-6 mb-6 pb-6 border-b border-neutral-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-neutral-900">Custom</span>
                    <span className="text-xs text-neutral-500">From $1,800/mo (₹1.4L+)</span>
                  </div>
                  <div className="text-[11px] text-[#ef4d23] font-medium mt-1">
                    Multi-channel ads • Local SEO • 2-Min SMS Automations
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-neutral-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <span>Everything in Scale tier</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <span>Google Maps Local 3-Pack SEO &amp; review acceleration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <span>Automated 2-minute SMS lead follow-up &amp; booking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <span>Dedicated landing page design &amp; CRO testing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ef4d23] shrink-0 mt-0.5" />
                    <span>Direct founder access with Sahit Sai Pothala</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={openLeadForm}
                  className="w-full rounded-full bg-[#0b0f1a] text-white py-2.5 text-xs font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Request Custom Scope
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-20 max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
              Pricing FAQs
            </h2>
          </div>
          <div className="space-y-3">
            {[
              {
                q: "How much does Lumen & Co charge?",
                a: "US plans start at $600/month. India packages are quoted following a free 30-minute growth audit based on your monthly creative volume and ad spend tiers. Custom enterprise retainers are also available.",
              },
              {
                q: "Are there any long-term contract lock-ins?",
                a: "No. After an initial 90-day foundational sprint (which allows sufficient time to test, learn, and optimize creative funnels), all retainers transition to month-to-month.",
              },
              {
                q: "Is ad spend included in the monthly retainer?",
                a: "No. Ad spend is paid directly to advertising platforms (Meta, Google, TikTok) using your credit card so you maintain 100% control, points, and account ownership.",
              },
              {
                q: "Who owns the creative assets produced?",
                a: "You own 100% of all video edits, design files, copywriting decks, and ad account data from day one.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm">
                <div className="font-semibold text-neutral-900 text-sm mb-2">{faq.q}</div>
                <div className="text-xs text-neutral-600 leading-relaxed">{faq.a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mb-16 bg-[#0b0f1a] text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
              Not Sure Which Plan Fits Your Stage?
            </h2>
            <p className="text-neutral-300 text-sm mb-6">
              Let's look at your accounts together. We'll audit your creative pipeline and tell you exactly what makes mathematical sense.
            </p>
            <button
              onClick={openLeadForm}
              className="rounded-full px-6 py-2.5 text-sm font-medium text-white shadow-lg"
              style={{ backgroundColor: "#ef4d23" }}
            >
              Book a free strategy call
            </button>
          </div>
        </section>

        <Footer />
        <LeadFormDialog />
      </div>
    </div>
  );
}
