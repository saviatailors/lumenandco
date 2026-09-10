import { Link } from "@tanstack/react-router";

export default function NotFoundPage() {
  return (
    <main className="relative min-h-[100svh] w-full bg-black overflow-x-hidden select-none">
      {/* BACKGROUND VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-100 z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4"
      />

      {/* HEADER LOGO */}
      <header
        aria-label="Lumen & Co Agency"
        className="absolute top-[32px] sm:top-[60px] left-1/2 -translate-x-1/2 z-10 flex items-center justify-center scale-90 sm:scale-100 origin-top bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border border-white/20 hover:bg-white transition-all cursor-pointer"
      >
        <Link to="/" className="inline-flex items-center">
          <img
            src="/lumen-and-co-logo.png"
            alt="Lumen & Co Agency"
            className="h-7 sm:h-8 w-auto object-contain"
          />
        </Link>
      </header>

      {/* CENTERED 404 CONTENT GROUP */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center text-center gap-[28px] sm:gap-[44px] w-[min(100%-40px,360px)] sm:w-[483px]">
        {/* 404 HEADING */}
        <h1
          className="font-[600] leading-[1.1] pb-2 sm:pb-4 text-transparent bg-clip-text"
          style={{
            fontFamily: '"Geist Mono:SemiBold", monospace',
            backgroundImage:
              "linear-gradient(247.3282658084845deg, rgb(255, 255, 255) 2.5334%, rgba(255, 255, 255, 0.4) 93.612%)",
            WebkitBackgroundClip: "text",
            fontSize: "clamp(140px, 52vw, 200px)",
            letterSpacing: "-0.09em",
          }}
        >
          <span className="hidden sm:inline" style={{ fontSize: "295.751px", letterSpacing: "-24.6459px" }}>
            404
          </span>
          <span className="inline sm:hidden">404</span>
        </h1>

        {/* THIN HORIZONTAL DIVIDER */}
        <div className="w-full sm:w-[425px] h-[1px] bg-white shrink-0" />

        {/* ERROR MESSAGE */}
        <p
          className="text-white font-[600] leading-[1.1] w-full"
          style={{
            fontFamily: '"Geist Mono:SemiBold", monospace',
            fontSize: "clamp(16px, 4.5vw, 20px)",
            letterSpacing: "-1.3px",
          }}
        >
          <span className="hidden sm:inline" style={{ fontSize: "24px", letterSpacing: "-2px" }}>
            The path may be broken, but the journey isn't. Let's get you back.
          </span>
          <span className="inline sm:hidden">
            The path may be broken, but the journey isn't. Let's get you back.
          </span>
        </p>
      </div>
    </main>
  );
}
