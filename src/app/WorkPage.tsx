import { ChevronRight, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import Navbar from "./components/Navbar";
import LeadFormDialog, { openLeadForm } from "./components/LeadForm";
import {
  Eyebrow,
  Title,
  Footer,
  ReelCard,
  useReels,
  useCreatives,
} from "./components/HomeSections";


const ORANGE = "#ef4d23";

const SERVICES = [
  {
    title: "Video editing",
    body: "Short-form edits, motion graphics and platform-native cuts built for retention, not just views.",
    deliverables: ["Reels & TikTok edits", "Motion graphics", "Hook variations", "Subtitles & captions"],
  },
  {
    title: "Gen AI advertising",
    body: "AI-generated concepts, copy and creative variants scaled into real campaigns with human oversight.",
    deliverables: ["AI concepting", "Copy variants", "Image generation", "Personalised ads"],
  },
  {
    title: "Creatives",
    body: "Statics, carousels, UGC-style hooks and brand assets shipped weekly and plugged into ad sets.",
    deliverables: ["Static design", "Carousel ads", "UGC hooks", "Brand kits"],
  },
  {
    title: "Ads",
    body: "Paid search and social campaigns rebuilt around profit, with weekly testing and budget guardrails.",
    deliverables: ["Meta & TikTok ads", "Google & Bing ads", "Creative testing", "Bid management"],
  },
  {
    title: "SEO",
    body: "Technical fixes, content clusters and authority building for the terms your buyers actually search.",
    deliverables: ["Tech audit", "Keyword strategy", "Content production", "Link building"],
  },
  {
    title: "Analytics & CRO",
    body: "Clean attribution, server-side tracking and landing pages tuned until the conversion rate moves.",
    deliverables: ["Tracking setup", "Dashboards", "Landing pages", "A/B testing"],
  },
];

const PROJECTS = [
  {
    brand: "Northbeam Outdoors",
    sector: "DTC retail",
    scope: "Paid social, creative studio, CRO",
    headline: "From one hero product to a full catalogue engine",
    body: "We rebuilt the creative pipeline around weekly hook testing and rewrote the top three landing pages. Blended ROAS moved from 1.9x to 4.4x in five months while spend tripled.",
    metrics: [
      { v: "4.4x", l: "blended ROAS" },
      { v: "+212%", l: "revenue YoY" },
      { v: "-38%", l: "cost per order" },
    ],
    img: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=800&fit=crop",
  },
  {
    brand: "Fable Studio",
    sector: "B2B SaaS",
    scope: "Paid search, analytics, content",
    headline: "Pipeline instead of raw lead volume",
    body: "Search was rebuilt around high-intent clusters and wired to CRM revenue, so bidding chased qualified pipeline rather than form fills. Cost per qualified demo halved in one quarter.",
    metrics: [
      { v: "-51%", l: "cost per demo" },
      { v: "3.2x", l: "pipeline growth" },
      { v: "68%", l: "MQL to SQL rate" },
    ],
    img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop",
  },
  {
    brand: "Kite & Co",
    sector: "Hospitality group",
    scope: "SEO, brand & PR, local search",
    headline: "Owning local search across nine venues",
    body: "A technical clean-up, location pages and a digital PR push lifted non-brand organic traffic and filled midweek covers without discounting.",
    metrics: [
      { v: "+164%", l: "organic traffic" },
      { v: "#1", l: "for 27 local terms" },
      { v: "+29%", l: "midweek covers" },
    ],
    img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&h=800&fit=crop",
  },
  {
    brand: "Lumen Health",
    sector: "Subscription wellness",
    scope: "Full-funnel media, creative, retention",
    headline: "Cutting churn while scaling acquisition",
    body: "Creative was segmented by motivation rather than demographic, and onboarding emails were rewritten around first-week wins. Subscriber payback dropped under two months.",
    metrics: [
      { v: "1.8 mo", l: "payback period" },
      { v: "-24%", l: "month-2 churn" },
      { v: "+96%", l: "new subscribers" },
    ],
    img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=1200&h=800&fit=crop",
  },
];

export default function WorkPage() {
  const reels = useReels();
  const creatives = useCreatives();
  return (

    <div
      id="top"
      className="relative min-h-screen w-full p-3 sm:p-4"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disableRemotePlayback
          {...{ "webkit-playsinline": "true", "x5-playsinline": "true" }}
          poster="https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=60"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4"
        />
        <div className="absolute inset-0 bg-white/25" />
      </div>

      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
        <div className="absolute inset-0 bg-white/5" />
        <div className="relative z-10 pb-10 sm:pb-16">
          <Navbar />

          <div className="flex flex-col items-center px-4 pt-10 sm:pt-16 text-center">
            <div
              className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm animate-fade-in"
              style={{ fontSize: 13 }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: ORANGE }}
              />
              Our work
            </div>

            <h1
              className="mt-5 sm:mt-6 max-w-4xl animate-fade-in"
              style={{
                fontSize: "clamp(34px, 7vw, 64px)",
                lineHeight: 1.05,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                animationDelay: "80ms",
              }}
            >
              Services we run,{" "}
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                results
              </span>{" "}
              we can prove
            </h1>

            <p
              className="mt-4 sm:mt-6 max-w-2xl text-neutral-700 px-2 animate-fade-in"
              style={{ fontSize: "clamp(13px, 3.5vw, 16px)", animationDelay: "160ms" }}
            >
              Six disciplines under one roof, and the projects where they compounded
              into real revenue.
            </p>

            <button
              onClick={openLeadForm}
              className="mt-6 sm:mt-8 inline-flex items-center gap-3 bg-[#0b0f1a] text-white rounded-full pl-6 sm:pl-7 pr-2 py-2 sm:py-2.5 animate-fade-in hover-lift"
              style={{ fontSize: 14, animationDelay: "240ms" }}
            >
              Start a project
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/15 inline-flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Services */}
      <section
        id="services"
        className="scroll-mt-4 mt-3 sm:mt-4 bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-10"
      >
        <Eyebrow>What we do</Eyebrow>
        <Title lead="Six services," italic="one accountable" tail="team" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="bg-white rounded-2xl p-5 shadow-sm hover-lift animate-fade-in"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <p style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>
                {s.title}
              </p>
              <p className="mt-2 text-neutral-600" style={{ fontSize: 14, lineHeight: 1.6 }}>
                {s.body}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {s.deliverables.map((d) => (
                  <li
                    key={d}
                    className="rounded-full bg-[#f5f2ee] px-3 py-1 text-neutral-700"
                    style={{ fontSize: 12 }}
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section
        id="projects"
        className="scroll-mt-4 mt-3 sm:mt-4 bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-10"
      >
        <Eyebrow>Past projects</Eyebrow>
        <Title lead="Case studies with" italic="numbers" tail="attached" />

        <div className="mt-8 flex flex-col gap-4">
          {PROJECTS.map((p, i) => (
            <article
              key={p.brand}
              className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className={`grid lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
              >
                <img
                  src={p.img}
                  alt={`${p.brand} campaign work`}
                  className="w-full h-56 sm:h-72 lg:h-full object-cover bg-neutral-200"
                  loading="lazy"
                />
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-white"
                      style={{ backgroundColor: ORANGE, fontSize: 12 }}
                    >
                      {p.sector}
                    </span>
                    <span className="text-neutral-500" style={{ fontSize: 12 }}>
                      {p.scope}
                    </span>
                  </div>
                  <p
                    className="mt-3"
                    style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}
                  >
                    {p.brand}
                  </p>
                  <p
                    className="mt-1"
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontStyle: "italic",
                      fontSize: 22,
                      lineHeight: 1.2,
                    }}
                  >
                    {p.headline}
                  </p>
                  <p className="mt-3 text-neutral-600" style={{ fontSize: 14, lineHeight: 1.65 }}>
                    {p.body}
                  </p>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {p.metrics.map((m) => (
                      <div key={m.l} className="rounded-xl bg-[#f5f2ee] p-3">
                        <p style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>
                          {m.v}
                        </p>
                        <p className="text-neutral-500" style={{ fontSize: 12 }}>
                          {m.l}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Reels + creatives */}
      <section className="mt-3 sm:mt-4 bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-10 overflow-hidden">
        <Eyebrow>Creative output</Eyebrow>
        <Title lead="Video that earns" italic="the scroll" />
        <div className="mt-8 -mx-6 sm:-mx-10 px-6 sm:px-10">
          <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
            {reels.map((item, i) => (
              <div
                key={item.id}

                className="animate-fade-in"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <ReelCard item={item} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p
            className="text-neutral-500 mb-4"
            style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}
          >
            Statics and social assets
          </p>
          <div className="relative marquee-mask overflow-hidden">
            <div className="flex w-max animate-marquee">
              {[...creatives, ...creatives].map((item, i) => (
                <div key={i} className="shrink-0 px-2">
                  <img
                    src={item.src}
                    alt={item.title || `Creative sample ${(i % creatives.length) + 1}`}

                    className="w-[180px] sm:w-[240px] aspect-[4/5] object-cover rounded-xl bg-neutral-200"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-3 sm:mt-4 bg-[#0b0f1a]/85 backdrop-blur-xl text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10">
        <p
          style={{
            fontSize: "clamp(26px, 4.5vw, 42px)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Want results like these{" "}
          <span
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            for your brand?
          </span>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={openLeadForm}
            className="inline-flex items-center gap-2 rounded-full text-white px-6 py-2.5 hover-lift"
            style={{ backgroundColor: ORANGE, fontSize: 14 }}
          >
            Get Started
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-2.5"
            style={{ fontSize: 14 }}
          >
            Back to home
          </Link>
        </div>
      </section>

      <Footer />
      <LeadFormDialog />
    </div>
  );
}
