import { useEffect, useRef, useState } from "react";

interface LiveBackgroundVideoProps {
  className?: string;
  containerClassName?: string;
  overlayClassName?: string;
  poster?: string;
  mp4Src?: string;
  webmSrc?: string;
  fallbackSrc?: string;
  ariaHidden?: boolean;
}

const DEFAULT_POSTER = "/videos/hero-bg-poster.jpg";
const DEFAULT_FALLBACK =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4";

export default function LiveBackgroundVideo({
  className = "",
  containerClassName = "fixed inset-0 -z-10 overflow-hidden",
  overlayClassName = "absolute inset-0 bg-white/25",
  poster = DEFAULT_POSTER,
  mp4Src = "/videos/hero-bg.mp4",
  webmSrc = "/videos/hero-bg.webm",
  fallbackSrc = DEFAULT_FALLBACK,
  ariaHidden = true,
}: LiveBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Respect reduced motion accessibility
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Modern browsers (WebKit / Blink) require the DOM property (not just HTML attribute)
    // to be explicitly set to muted for autoplay to succeed without a user gesture.
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    let isDisposed = false;

    const markPlaying = () => {
      if (!isDisposed) {
        setIsPlaying(true);
      }
    };

    const tryPlay = () => {
      if (!video) return;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            markPlaying();
          })
          .catch((err) => {
            // Autoplay was blocked by browser power-saving or autoplay policy.
            // Recover transparently on the first user interaction anywhere on the page.
            console.warn("Live background autoplay paused. Waiting for interaction:", err);
            const kickstart = () => {
              if (videoRef.current) {
                videoRef.current.play().then(markPlaying).catch(() => {});
              }
              window.removeEventListener("pointerdown", kickstart);
              window.removeEventListener("touchstart", kickstart);
              window.removeEventListener("scroll", kickstart);
              window.removeEventListener("keydown", kickstart);
              window.removeEventListener("mousemove", kickstart);
            };

            window.addEventListener("pointerdown", kickstart, { once: true, passive: true });
            window.addEventListener("touchstart", kickstart, { once: true, passive: true });
            window.addEventListener("scroll", kickstart, { once: true, passive: true });
            window.addEventListener("keydown", kickstart, { once: true, passive: true });
            window.addEventListener("mousemove", kickstart, { once: true, passive: true });
          });
      }
    };

    if (video.readyState === 0) {
      video.load();
    }

    // Attempt playback immediately upon mounting
    tryPlay();

    // Also attach listeners to handle buffering and loading states
    video.addEventListener("playing", markPlaying);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("loadeddata", tryPlay);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        tryPlay();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      isDisposed = true;
      video.removeEventListener("playing", markPlaying);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("loadeddata", tryPlay);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className={containerClassName}>
      {/* High-quality poster rendered underneath for instant zero-CLS paint */}
      {poster && (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ${
            isPlaying ? "opacity-0" : "opacity-100"
          }`}
        />
      )}

      {/* Live Video with smooth fade-in once active */}
      <video
        ref={videoRef}
        src={mp4Src}
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ${
          isPlaying ? "opacity-100" : "opacity-0"
        } ${className}`}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disableRemotePlayback
        poster={poster}
        aria-hidden={ariaHidden}
        {...({ "webkit-playsinline": "true", "x5-playsinline": "true" } as any)}
      >
        {/* Optimized local high-performance MP4 first */}
        {mp4Src && <source src={mp4Src} type="video/mp4" />}
        {/* Next-gen VP9 WebM */}
        {webmSrc && <source src={webmSrc} type="video/webm" />}
        {/* Original CloudFront fallback */}
        {fallbackSrc && <source src={fallbackSrc} type="video/mp4" />}
      </video>

      {/* Decorative / Brand gradient overlay */}
      {overlayClassName && <div className={overlayClassName} />}
    </div>
  );
}
