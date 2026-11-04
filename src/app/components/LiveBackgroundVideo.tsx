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

    let isDisposed = false;

    // Strict DOM property configuration required by WebKit & Chromium for permanent unblocked looping
    video.defaultMuted = true;
    video.muted = true;
    video.volume = 0;
    video.playsInline = true;
    video.loop = true;

    const markPlaying = () => {
      if (!isDisposed) {
        setIsPlaying(true);
      }
    };

    const tryPlay = () => {
      if (!video || isDisposed) return;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            markPlaying();
          })
          .catch((err) => {
            // Autoplay policy paused it — recover silently on the very first user interaction
            const kickstart = () => {
              if (videoRef.current && !isDisposed) {
                videoRef.current.play().then(markPlaying).catch(() => {});
              }
              window.removeEventListener("pointerdown", kickstart);
              window.removeEventListener("touchstart", kickstart);
              window.removeEventListener("scroll", kickstart);
              window.removeEventListener("keydown", kickstart);
              window.removeEventListener("mousemove", kickstart);
              window.removeEventListener("wheel", kickstart);
            };

            window.addEventListener("pointerdown", kickstart, { once: true, passive: true });
            window.addEventListener("touchstart", kickstart, { once: true, passive: true });
            window.addEventListener("scroll", kickstart, { once: true, passive: true });
            window.addEventListener("keydown", kickstart, { once: true, passive: true });
            window.addEventListener("mousemove", kickstart, { once: true, passive: true });
            window.addEventListener("wheel", kickstart, { once: true, passive: true });
          });
      }
    };

    // 1. Initial play attempt
    if (video.readyState === 0) {
      video.load();
    }
    tryPlay();

    // 2. Playback lifecycle event listeners
    video.addEventListener("playing", markPlaying);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("loadeddata", tryPlay);

    // 3. Prevent loop stutter: seamless rewind before reaching end-of-file
    let isRewinding = false;
    const handleTimeUpdate = () => {
      if (
        !isRewinding &&
        video.duration > 0 &&
        video.currentTime >= video.duration - 0.2
      ) {
        isRewinding = true;
        video.currentTime = 0;
        tryPlay();
        setTimeout(() => {
          isRewinding = false;
        }, 400);
      }
    };
    video.addEventListener("timeupdate", handleTimeUpdate);

    // 4. Force restart on 'ended' event if native loop attribute misses a cycle
    const handleEnded = () => {
      video.currentTime = 0;
      tryPlay();
    };
    video.addEventListener("ended", handleEnded);

    // 5. Automatic recovery if browser power management pauses background video
    const handlePause = () => {
      if (!isDisposed && document.visibilityState === "visible") {
        tryPlay();
      }
    };
    video.addEventListener("pause", handlePause);

    // 6. Network stall recovery
    const handleStalled = () => {
      if (!isDisposed && document.visibilityState === "visible") {
        tryPlay();
      }
    };
    video.addEventListener("stalled", handleStalled);

    // 7. Source error fallback to CloudFront CDN
    const handleError = () => {
      if (fallbackSrc && video.currentSrc !== fallbackSrc && !isDisposed) {
        video.src = fallbackSrc;
        video.load();
        tryPlay();
      }
    };
    video.addEventListener("error", handleError);

    // 8. Foreground wakeups (tab switch, desktop minimize, mobile app switch)
    const handleWakeup = () => {
      if (document.visibilityState === "visible") {
        tryPlay();
      }
    };
    document.addEventListener("visibilitychange", handleWakeup);
    window.addEventListener("focus", handleWakeup);
    window.addEventListener("pageshow", handleWakeup);

    // 9. Active Heartbeat Watchdog: Checks every 1.5s to ensure the background is permanently live
    let lastTime = -1;
    let stuckCount = 0;
    const watchdog = setInterval(() => {
      if (isDisposed) return;
      if (document.visibilityState === "visible" && video) {
        if (video.paused || video.ended) {
          tryPlay();
        } else if (video.currentTime === lastTime && video.readyState >= 2) {
          stuckCount++;
          if (stuckCount >= 2) {
            // Frame is frozen despite playing status: nudge video time forward and resume
            video.currentTime = video.currentTime + 0.05;
            tryPlay();
            stuckCount = 0;
          }
        } else {
          lastTime = video.currentTime;
          stuckCount = 0;
        }
      }
    }, 1500);

    return () => {
      isDisposed = true;
      clearInterval(watchdog);
      video.removeEventListener("playing", markPlaying);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("stalled", handleStalled);
      video.removeEventListener("error", handleError);
      document.removeEventListener("visibilitychange", handleWakeup);
      window.removeEventListener("focus", handleWakeup);
      window.removeEventListener("pageshow", handleWakeup);
    };
  }, [fallbackSrc]);

  return (
    <div className={containerClassName}>
      {/* High-quality poster underneath for zero-CLS immediate visual presentation */}
      {poster && (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${
            isPlaying ? "opacity-0" : "opacity-100"
          }`}
        />
      )}

      {/* Live Background Video: Continuous high-frame-rate playback */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${
          isPlaying ? "opacity-100" : "opacity-0"
        } ${className}`}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        poster={poster}
        aria-hidden={ariaHidden}
        {...({ "webkit-playsinline": "true", "x5-playsinline": "true" } as any)}
      >
        {/* Optimized local VP9 WebM first (smooth, lightweight, zero-audio) */}
        {webmSrc && <source src={webmSrc} type="video/webm" />}
        {/* Universal local H.264 MP4 */}
        {mp4Src && <source src={mp4Src} type="video/mp4" />}
        {/* Remote CDN fallback */}
        {fallbackSrc && <source src={fallbackSrc} type="video/mp4" />}
      </video>

      {/* Decorative / Brand gradient overlay */}
      {overlayClassName && <div className={overlayClassName} />}
    </div>
  );
}
