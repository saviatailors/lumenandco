import {
  Search,
  Megaphone,
  Clapperboard,
  Brain,
  Palette,
  BarChart3,
  ChevronRight,
  Quote,
  Star,
  Play,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { openLeadForm } from "./LeadForm";
import { goToSection } from "./nav";
import reel1 from "@/assets/reel-1.mp4.asset.json";
import reel2 from "@/assets/reel-2.mp4.asset.json";
import reel3 from "@/assets/reel-3.mp4.asset.json";
import { useSiteMedia, DEFAULT_POSTER, type MediaItem } from "./useSiteMedia";


const ORANGE = "#ef4d23";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm"
      style={{ fontSize: 13 }}
    >
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ backgroundColor: ORANGE }}
      />
      {children}
    </div>
  );
}

export function Title({
  lead,
  italic,
  tail,
}: {
  lead: string;
  italic: string;
  tail?: string;
}) {
  return (
    <h2
      className="mt-4 max-w-3xl"
      style={{
        fontSize: "clamp(28px, 5vw, 48px)",
        lineHeight: 1.08,
        fontWeight: 500,
        letterSpacing: "-0.02em",
      }}
    >
      {lead}{" "}
      <span
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontStyle: "italic",
          fontWeight: 400,
        }}
      >
        {italic}
      </span>
      {tail ? ` ${tail}` : ""}
    </h2>
  );
}

const LOGOS = ["Northbeam", "Fable", "Kite&Co", "Lumen", "Orbit", "Verda", "Nimbus", "Pulse", "Aurora"];

function LogoStrip() {
  const items = [...LOGOS, ...LOGOS];
  return (
    <section className="mt-8 sm:mt-12 bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl py-6 overflow-hidden">
      <p
        className="text-center text-neutral-500 mb-5"
        style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase" }}
      >
        Trusted by growth teams at
      </p>
      <div className="relative marquee-mask overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-10 sm:gap-14 px-4">
          {items.map((l, i) => (
            <span
              key={`${l}-${i}`}
              className="text-neutral-400 shrink-0"
              style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const SERVICES = [
  {
    icon: Clapperboard,
    title: "Video editing",
    body: "Short-form edits, motion graphics and platform-native cuts built for retention, not just views.",
  },
  {
    icon: Brain,
    title: "Gen AI advertising",
    body: "AI-generated concepts, copy and creative variants scaled into real campaigns with human oversight.",
  },
  {
    icon: Palette,
    title: "Creatives",
    body: "Statics, carousels, UGC-style hooks and brand assets shipped weekly and plugged into ad sets.",
  },
  {
    icon: Megaphone,
    title: "Ads",
    body: "Paid search and social campaigns rebuilt around profit, with weekly testing and budget guardrails.",
  },
  {
    icon: Search,
    title: "SEO",
    body: "Technical fixes, content clusters and authority building for the terms your buyers actually search.",
  },
  {
    icon: BarChart3,
    title: "Analytics & CRO",
    body: "Clean attribution, server-side tracking and landing pages tuned until the conversion rate moves.",
  },
];

function Services() {
  return (
    <section id="services" className="scroll-mt-4 mt-3 sm:mt-4 bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-10">
      <Eyebrow>What we do</Eyebrow>
      <Title lead="Creative + media," italic="one" tail="growth engine" />
      <div className="mt-6 sm:mt-8 grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="bg-[#f5f2ee] rounded-2xl p-3.5 sm:p-6 animate-fade-in hover-lift flex flex-col justify-between"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div>
                <span
                  className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl"
                  style={{ backgroundColor: "#fdece7" }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: ORANGE }} />
                </span>
                <h3 className="mt-2.5 sm:mt-4 text-xs sm:text-lg font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-1 sm:mt-2 text-neutral-600 text-[11px] sm:text-sm leading-snug sm:leading-relaxed">
                  {s.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const STEPS = [
  { n: "01", t: "Audit", b: "Two weeks inside your accounts, analytics and creative library." },
  { n: "02", t: "Plan", b: "A channel mix, budget model and creative calendar you sign off on." },
  { n: "03", t: "Launch", b: "Campaigns, tracking and landing pages live within 21 days." },
  { n: "04", t: "Compound", b: "Weekly tests, monthly reviews, quarterly re-forecasting." },
];

function Process() {
  return (
    <section className="mt-3 sm:mt-4 bg-[#0b0f1a]/85 backdrop-blur-xl text-white rounded-2xl sm:rounded-3xl p-4 sm:p-10">
      <div
        className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5"
        style={{ fontSize: 13 }}
      >
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ backgroundColor: ORANGE }}
        />
        How we work
      </div>
      <h2
        className="mt-4 max-w-3xl"
        style={{
          fontSize: "clamp(28px, 5vw, 48px)",
          lineHeight: 1.08,
          fontWeight: 500,
          letterSpacing: "-0.02em",
        }}
      >
        From audit to{" "}
        <span
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          compounding
        </span>{" "}
        growth
      </h2>
      <div className="mt-6 sm:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {STEPS.map((s, i) => (
          <div
            key={s.n}
            className="rounded-2xl p-3.5 sm:p-6 bg-white/5 border border-white/10 animate-fade-in hover-lift flex flex-col justify-between"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div>
              <span style={{ color: ORANGE, fontSize: 13, fontWeight: 600 }}>{s.n}</span>
              <h3 className="mt-2 sm:mt-3 text-xs sm:text-lg font-semibold tracking-tight">
                {s.t}
              </h3>
              <p className="mt-1 sm:mt-2 text-white/60 text-[11px] sm:text-sm leading-snug sm:leading-relaxed">
                {s.b}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export const REELS = [
  { src: reel1.url, title: "Paid social reel", subtitle: "1.2M views" },
  { src: reel2.url, title: "UGC hook test", subtitle: "840K views" },
  { src: reel3.url, title: "Brand launch", subtitle: "2.1M views" },
  { src: reel1.url, title: "Performance edit", subtitle: "960K views" },
  { src: reel2.url, title: "Hook variant B", subtitle: "610K views" },
  { src: reel3.url, title: "Product film", subtitle: "1.7M views" },
];

export const CREATIVES = [
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=750&fit=crop",
];

/** Reels + creatives, live from the private dashboard, with the built-ins as fallback. */
export function useReels() {
  return useSiteMedia("reel", REELS);
}

export function useCreatives() {
  return useSiteMedia(
    "creative",
    CREATIVES.map((src) => ({ src })),
  );
}

export function ReelCard({ item }: { item: MediaItem }) {
  return (
    <div className="snap-start shrink-0 w-[170px] sm:w-[220px]">
      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-900 shadow-lg">
        <video
          src={item.src}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disableRemotePlayback
          webkit-playsinline="true"
          x5-playsinline="true"
          poster={item.poster || DEFAULT_POSTER}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="font-medium" style={{ fontSize: 13 }}>{item.title}</p>
          <p className="text-white/70" style={{ fontSize: 12 }}>{item.subtitle}</p>
        </div>
        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm inline-flex items-center justify-center">
          <Play className="w-3.5 h-3.5 text-white fill-white" />
        </div>
      </div>
    </div>
  );
}


function Work() {
  const reels = useReels();
  const creatives = useCreatives();
  return (
    <section id="work" className="scroll-mt-4 mt-3 sm:mt-4 bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-10 overflow-hidden">
      <Eyebrow>Results we can prove</Eyebrow>
      <Title lead="Creative that converts," italic="data that scales" />
      <p className="mt-4 max-w-2xl text-neutral-600" style={{ fontSize: 15, lineHeight: 1.6 }}>
        A live look at the hooks, statics and motion ads we ship for brands every week.
      </p>

      <div className="mt-8 -mx-6 sm:-mx-10 px-6 sm:px-10">
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
          {reels.map((item, i) => (
            <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${i * 70}ms` }}>
              <ReelCard item={item} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-neutral-500 mb-4" style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Recent creative output
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
  );
}

import { TrendingUp } from "lucide-react";
import Gauge from "./Gauge";

const STATS = [
  { v: "$48M", l: "ad spend managed" },
  { v: "180+", l: "brands scaled" },
  { v: "4.1x", l: "median blended ROAS" },
  { v: "21 days", l: "to first launch" },
];

function MetaAdsCard() {
  return (
    <div className="bg-[#f5f2ee]/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 animate-fade-in hover-lift h-full">
      <div className="bg-white/80 rounded-2xl p-4 sm:p-5 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between" style={{ fontSize: 12 }}>
          <span style={{ color: ORANGE }}>Meta Ads</span>
          <span className="text-neutral-500">This Month</span>
        </div>
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 28, fontWeight: 600 }}>$482K</span>
            <span
              className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 rounded-full px-2 py-0.5"
              style={{ fontSize: 11 }}
            >
              <TrendingUp className="w-3 h-3" />
              +18%
            </span>
          </div>
          <div className="text-neutral-500" style={{ fontSize: 11 }}>
            Ad spend vs last month
          </div>
        </div>
        <div className="mt-4">
          <Gauge value={92} color={ORANGE} />
          <div className="mt-3 flex items-center justify-between" style={{ fontSize: 12 }}>
            <span className="text-neutral-500">ROAS</span>
            <span className="font-semibold">4.6x</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stats() {
  return (
    <section className="mt-3 sm:mt-4 grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3">
      <div className="col-span-2">
        <MetaAdsCard />
      </div>
      {STATS.slice(0, 1).map((s, i) => (
        <div
          key={s.l}
          className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 animate-fade-in hover-lift"
          style={{ animationDelay: `${(i + 1) * 70}ms` }}
        >
          <p style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 500, letterSpacing: "-0.02em" }}>
            {s.v}
          </p>
          <p className="mt-1 text-neutral-500" style={{ fontSize: 13 }}>
            {s.l}
          </p>
        </div>
      ))}
      {STATS.slice(1).map((s, i) => (
        <div
          key={s.l}
          className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 animate-fade-in hover-lift"
          style={{ animationDelay: `${(i + 2) * 70}ms` }}
        >
          <p style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 500, letterSpacing: "-0.02em" }}>
            {s.v}
          </p>
          <p className="mt-1 text-neutral-500" style={{ fontSize: 13 }}>
            {s.l}
          </p>
        </div>
      ))}
    </section>
  );
}

const QUOTES = [
  {
    q: "They rebuilt our tracking in week one and found 30% of revenue we were not attributing. Everything after that was easier.",
    n: "Maya Ellis",
    r: "VP Growth, Fable",
  },
  {
    q: "The creative volume is the unlock. We ship more tests in a month than our old agency ran in a quarter.",
    n: "Daniel Roth",
    r: "CMO, Northbeam",
  },
];

function Testimonials() {
  return (
    <section className="mt-3 sm:mt-4 grid gap-3 sm:gap-4 lg:grid-cols-2">
      {QUOTES.map((t, i) => (
        <figure
          key={t.n}
          className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 animate-fade-in hover-lift"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <Quote className="w-6 h-6" style={{ color: ORANGE }} />
          <blockquote
            className="mt-4 text-neutral-800"
            style={{ fontSize: "clamp(16px, 2.2vw, 20px)", lineHeight: 1.5 }}
          >
            {t.q}
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <span className="w-9 h-9 rounded-full" style={{ backgroundColor: "#fdece7" }} />
            <span>
              <span className="block" style={{ fontSize: 14, fontWeight: 600 }}>
                {t.n}
              </span>
              <span className="block text-neutral-500" style={{ fontSize: 13 }}>
                {t.r}
              </span>
            </span>
            <span className="ml-auto flex gap-0.5">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} className="w-3.5 h-3.5" style={{ color: ORANGE }} fill={ORANGE} />
              ))}
            </span>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}

const TEAM = [
  { n: "Maya Okafor", r: "Founder & media buyer" },
  { n: "Tomas Berg", r: "Head of SEO" },
  { n: "Ada Lindqvist", r: "Creative director" },
  { n: "Rahul Menon", r: "Analytics lead" },
];

function About() {
  return (
    <section id="about" className="scroll-mt-4 mt-3 sm:mt-4 grid gap-3 sm:gap-4 lg:grid-cols-5">
      <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-10">
        <Eyebrow>About lumen&co</Eyebrow>
        <Title lead="A growth team that lives in" italic="your numbers" />
        <p className="mt-5 text-neutral-600" style={{ fontSize: 15, lineHeight: 1.7 }}>
          No account managers relaying messages. You work directly with the people
          running your campaigns — media buyers, SEOs and creatives sitting in the same
          weekly call, reporting on contribution margin instead of impressions.
        </p>
        <p className="mt-3 text-neutral-600" style={{ fontSize: 15, lineHeight: 1.7 }}>
          We started in 2018 with one belief: an agency should be judged by the profit
          it creates, not the decks it delivers. Eight years and 180 brands later, that
          is still the only number on the first slide.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {TEAM.map((t, i) => (
            <div
              key={t.n}
              className="flex items-center gap-3 bg-[#f5f2ee] rounded-2xl p-4 animate-fade-in hover-lift"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span
                className="w-10 h-10 rounded-full shrink-0"
                style={{ backgroundColor: "#fdece7" }}
              />
              <span>
                <span className="block" style={{ fontSize: 14, fontWeight: 600 }}>
                  {t.n}
                </span>
                <span className="block text-neutral-500" style={{ fontSize: 13 }}>
                  {t.r}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 bg-[#f5f2ee]/75 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-10 flex flex-col justify-between">
        <div>
          <p
            className="text-neutral-500"
            style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase" }}
          >
            What you can expect
          </p>
          <ul className="mt-5 space-y-4">
            {[
              "A named senior buyer on every call",
              "Creative shipped weekly, not quarterly",
              "Dashboards you can open at any hour",
              "Month-to-month after the first 90 days",
            ].map((line, i) => (
              <li
                key={line}
                className="flex gap-3 animate-fade-in"
                style={{ fontSize: 15, animationDelay: `${i * 70}ms` }}
              >
                <span
                  className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: ORANGE }}
                />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <p
          className="mt-10"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: "clamp(20px, 3vw, 28px)",
            lineHeight: 1.3,
          }}
        >
          "Judge us on profit, not on decks."
        </p>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section
      id="contact"
      className="scroll-mt-4 mt-3 sm:mt-4 rounded-2xl sm:rounded-3xl p-8 sm:p-14 text-center"
      style={{ backgroundColor: ORANGE }}
    >
      <h2
        className="mx-auto max-w-3xl text-white"
        style={{
          fontSize: "clamp(28px, 5.5vw, 52px)",
          lineHeight: 1.06,
          fontWeight: 500,
          letterSpacing: "-0.02em",
        }}
      >
        Let's find the growth{" "}
        <span
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          hiding
        </span>{" "}
        in your account
      </h2>
      <p className="mt-4 text-white/85" style={{ fontSize: 15 }}>
        Free 30-minute audit. No pitch deck, just the numbers.
      </p>
      <button onClick={openLeadForm} className="mt-7 inline-flex items-center gap-3 bg-[#0b0f1a] text-white rounded-full pl-7 pr-2 py-2.5 hover-lift" style={{ fontSize: 14 }}>
        Get a free audit
        <span className="w-7 h-7 rounded-full bg-white/15 inline-flex items-center justify-center">
          <ChevronRight className="w-4 h-4" />
        </span>
      </button>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mt-3 sm:mt-4 bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-10">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="inline-block">
            <img
              src="/lumen-and-co-logo.png"
              alt="Lumen & Co Agency"
              className="h-11 sm:h-12 w-auto object-contain transition-all hover:scale-105"
            />
          </Link>
          <p className="mt-3 text-neutral-600" style={{ fontSize: 14, lineHeight: 1.6 }}>
            A digital marketing agency building compounding growth for ambitious brands.
          </p>
        </div>
        <div>
          <p className="text-neutral-500" style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Sections
          </p>
          <ul className="mt-3 space-y-2" style={{ fontSize: 14 }}>
            <li><a href="#top" onClick={(e) => goToSection(e, "top")} className="text-neutral-700 hover:text-black">Home</a></li>
            <li><a href="#services" onClick={(e) => goToSection(e, "services")} className="text-neutral-700 hover:text-black">Services</a></li>
            <li><Link to="/work" className="text-neutral-700 hover:text-black">Work</Link></li>
            <li><a href="#about" onClick={(e) => goToSection(e, "about")} className="text-neutral-700 hover:text-black">About</a></li>
            <li><a href="#contact" onClick={(e) => goToSection(e, "contact")} className="text-neutral-700 hover:text-black">Contact</a></li>
            <li><Link to="/client" className="text-neutral-700 hover:text-black">Client sign in</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-neutral-500" style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Services
          </p>
          <ul className="mt-3 space-y-2 text-neutral-700" style={{ fontSize: 14 }}>
            <li>Paid search</li>
            <li>Paid social</li>
            <li>SEO & content</li>
            <li>Analytics & CRO</li>
          </ul>
        </div>
        <div>
          <p className="text-neutral-500" style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Contact
          </p>
          <ul className="mt-3 space-y-2 text-neutral-700" style={{ fontSize: 14 }}>
            <li>hello@lumenandco.in</li>
            <li>Mon–Fri, 9–6</li>
          </ul>
        </div>
      </div>
      <div
        className="mt-8 pt-6 border-t border-neutral-200 flex flex-wrap gap-2 justify-between text-neutral-500"
        style={{ fontSize: 13 }}
      >
        <span>© {new Date().getFullYear()} lumen&co</span>
        <span>Placeholder contact details — send me the real ones anytime.</span>
      </div>
    </footer>
  );
}

export default function HomeSections() {
  return (
    <>
      <LogoStrip />
      <Services />
      <Process />
      <Work />
      <Stats />
      <About />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
