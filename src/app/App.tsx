import { ChevronRight } from "lucide-react";
import Navbar from "./components/Navbar";
import LiveBackgroundVideo from "./components/LiveBackgroundVideo";
import HomeSections from "./components/HomeSections";
import LeadFormDialog, { openLeadForm } from "./components/LeadForm";

export default function App() {
  return (
    <div
      id="top"
      className="relative min-h-screen w-full p-3 sm:p-4"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <LiveBackgroundVideo />

      <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl">
        <div className="absolute inset-0 bg-white/5" />


        <div className="relative z-10">
          <Navbar />

          <div className="flex flex-col items-center px-4 pt-10 sm:pt-16 pb-20 sm:pb-28 text-center">
            <div
              className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm animate-fade-in"
              style={{ fontSize: 13 }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: "#ef4d23" }}
              />
              lumen&co
            </div>

            <h1
              className="mt-5 sm:mt-6 max-w-4xl animate-fade-in"
              style={{
                fontSize: "clamp(34px, 7vw, 68px)",
                lineHeight: 1.08,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                animationDelay: "80ms",
              }}
            >
              India's Creative,{" "}
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                AI-Powered
              </span>
              <br />
              Digital Marketing Agency
            </h1>

            <p
              className="mt-4 sm:mt-6 text-neutral-700 max-w-2xl px-2 animate-fade-in text-center mx-auto"
              style={{
                fontSize: "clamp(13px, 3.5vw, 16px)",
                animationDelay: "160ms",
              }}
            >
              Lumen &amp; Co is a creative, AI-powered digital marketing agency based in India offering Gen AI ads, video editing, creatives, performance ads, SEO and CRO for brands in India and the US.
            </p>

            <button
              onClick={openLeadForm}
              className="mt-6 sm:mt-8 inline-flex items-center gap-3 bg-[#0b0f1a] text-white rounded-full pl-6 sm:pl-7 pr-2 py-2 sm:py-2.5 animate-fade-in hover-lift"
              style={{ fontSize: 14, animationDelay: "240ms" }}
            >
              Book a free strategy call
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/15 inline-flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          </div>

        </div>
      </div>

      <HomeSections />
      <LeadFormDialog />
    </div>
  );
}
