import { ChevronRight } from "lucide-react";
import Navbar from "./components/Navbar";

import HomeSections from "./components/HomeSections";
import LeadFormDialog, { openLeadForm } from "./components/LeadForm";

export default function App() {
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
                fontSize: "clamp(36px, 8vw, 72px)",
                lineHeight: 1.05,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                animationDelay: "80ms",
              }}
            >
              Growing{" "}
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                Brands
              </span>
              <br />
              of tomorrow
            </h1>

            <p
              className="mt-4 sm:mt-6 text-neutral-700 px-2 animate-fade-in"
              style={{
                fontSize: "clamp(13px, 3.5vw, 16px)",
                animationDelay: "160ms",
              }}
            >
              Performance marketing, SEO, paid social and creative — one team behind
              every click you buy
            </p>

            <button
              onClick={openLeadForm}
              className="mt-6 sm:mt-8 inline-flex items-center gap-3 bg-[#0b0f1a] text-white rounded-full pl-6 sm:pl-7 pr-2 py-2 sm:py-2.5 animate-fade-in hover-lift"
              style={{ fontSize: 14, animationDelay: "240ms" }}
            >
              Get Started
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
