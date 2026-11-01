import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ChevronRight, Award, Sparkles, HeartHandshake, ArrowUpRight } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { Footer, Eyebrow } from "@/app/components/HomeSections";
import LeadFormDialog, { openLeadForm } from "@/app/components/LeadForm";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    buildSeoMeta({
      title: "About Lumen & Co | Creative Marketing Agency India",
      description:
        "Meet the team and founder behind Lumen & Co. An AI-first creative and growth marketing agency based in Visakhapatnam, India.",
      canonicalPath: "/about/",
      keywords: [
        "about Lumen and Co",
        "Sahit Sai Pothala",
        "digital marketing agency founder India",
        "creative marketing agency Visakhapatnam",
        "growth marketing agency India",
      ],
      breadcrumbs: [
        { name: "Home", item: "/" },
        { name: "About", item: "/about/" },
      ],
    }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div
      className="relative min-h-screen w-full bg-[#f8f9fa] text-[#111] p-3 sm:p-4"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        <Navbar />

        {/* Hero */}
        <section className="pt-12 sm:pt-20 pb-14 text-center px-4">
          <div className="flex justify-center mb-4">
            <Eyebrow>Our Story &amp; Philosophy</Eyebrow>
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
            A Growth Team That Lives in Your Numbers
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-neutral-600 text-sm sm:text-base leading-relaxed">
            No account managers playing telephone. You work directly with the media buyers, editors, and strategists running your campaigns, reporting on contribution margin instead of impressions.
          </p>
        </section>

        {/* Founder Story Block */}
        <section className="mb-16 bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1 text-center md:text-left">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto md:mx-0 overflow-hidden bg-neutral-100 border-4 border-orange-50 shadow-inner flex items-center justify-center">
                <img
                  src="/lumen-and-co-logo.png"
                  alt="Sahit Sai Pothala - Founder Lumen & Co"
                  className="w-full h-full object-contain p-4"
                  width="160"
                  height="160"
                  loading="lazy"
                />
              </div>
              <h2 className="text-lg font-bold text-neutral-900 mt-4">Sahit Sai Pothala</h2>
              <p className="text-xs text-[#ef4d23] font-semibold">Founder &amp; Head of Growth</p>
              <p className="text-xs text-neutral-500 mt-1">Visakhapatnam, Andhra Pradesh, IN</p>
            </div>

            <div className="md:col-span-2 text-neutral-700 text-sm leading-relaxed space-y-4">
              <p className="font-medium text-neutral-900 text-base">
                "We started with one core belief: an agency should be judged by the profit it creates, not the decks it delivers."
              </p>
              <p>
                Eight years and over 180 brands later, that is still the only number on our first slide. We saw firsthand how traditional agencies in India and the US bloated their retainers with layers of non-working middle management while junior interns executed the actual campaigns.
              </p>
              <p>
                At <strong>Lumen &amp; Co</strong>, we built a lean, high-velocity creative engineering model. By marrying generative AI tools with elite human creative directors, we deliver in days what old-school production houses take weeks to schedule.
              </p>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-neutral-900">What You Can Expect</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: "Senior Buyers on Calls",
                desc: "No junior gatekeepers. You speak directly to the person adjusting bids and cutting hooks.",
              },
              {
                title: "Weekly Creative Velocity",
                desc: "Fresh reels, carousels, and static ads shipped weekly to prevent audience fatigue.",
              },
              {
                title: "Live 24/7 Dashboards",
                desc: "Transparent access to ad spend, revenue, and ROAS numbers at any hour of the day.",
              },
              {
                title: "Month-to-Month After 90 Days",
                desc: "We earn our partnership every single month without lock-in handcuffs.",
              },
            ].map((val, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mb-3"
                  style={{ backgroundColor: "#ef4d23" }}
                >
                  0{i + 1}
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1.5">{val.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16 bg-[#0b0f1a] text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
              Ready to Partner with Us?
            </h2>
            <p className="text-neutral-300 text-sm mb-6">
              Let's find the growth hiding in your account with a free 30-minute growth audit.
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
