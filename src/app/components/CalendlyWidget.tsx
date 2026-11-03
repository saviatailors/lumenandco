import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

export const CALENDLY_BASE_URL = "https://calendly.com/sahitsai6/lumen-co";
export const CALENDLY_BRANDED_URL = "https://calendly.com/sahitsai6/lumen-co?primary_color=ef4d23";

/**
 * Builds a Calendly URL prefilled with attendee name, email, and signature Lumen & Co brand color (#ef4d23)
 */
export function buildCalendlyUrl(opts?: { name?: string; email?: string }): string {
  const url = new URL(CALENDLY_BASE_URL);
  url.searchParams.set("primary_color", "ef4d23");
  if (opts?.name?.trim()) {
    url.searchParams.set("name", opts.name.trim());
  }
  if (opts?.email?.trim()) {
    url.searchParams.set("email", opts.email.trim());
  }
  return url.toString();
}

/**
 * Global Calendly Floating Badge Widget with Lumen & Co brand styling (#ef4d23)
 */
export default function CalendlyWidget() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname.startsWith("/sahit") ||
    location.pathname.startsWith("/delivery");

  useEffect(() => {
    // Hide the floating widget on internal admin / delivery dashboards
    const existingBadge = document.querySelector(".calendly-badge-widget") as HTMLElement | null;
    if (isAdminRoute) {
      if (existingBadge) existingBadge.style.display = "none";
      return;
    } else if (existingBadge) {
      existingBadge.style.display = "block";
    }

    // 1. Load Calendly CSS and custom override styles if not present
    if (!document.getElementById("calendly-widget-css")) {
      const link = document.createElement("link");
      link.id = "calendly-widget-css";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    if (!document.getElementById("calendly-widget-custom-style")) {
      const style = document.createElement("style");
      style.id = "calendly-widget-custom-style";
      style.innerHTML = `
        .calendly-badge-widget {
          z-index: 40 !important;
        }
        .calendly-badge-content {
          box-shadow: 0 10px 25px -5px rgba(239, 77, 35, 0.4), 0 8px 10px -6px rgba(239, 77, 35, 0.3) !important;
          font-family: Inter, sans-serif !important;
          font-weight: 600 !important;
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }
        .calendly-badge-content:hover {
          transform: translateY(-2px) scale(1.02) !important;
          box-shadow: 0 14px 28px -5px rgba(239, 77, 35, 0.5), 0 10px 10px -5px rgba(239, 77, 35, 0.4) !important;
        }
      `;
      document.head.appendChild(style);
    }

    // 2. Initialize Badge Widget with Lumen & Co brand colors
    const initBadge = () => {
      const badge = document.querySelector(".calendly-badge-widget");
      if (badge) return; // Already rendered

      if (typeof window !== "undefined" && (window as any).Calendly?.initBadgeWidget) {
        (window as any).Calendly.initBadgeWidget({
          url: CALENDLY_BRANDED_URL,
          text: "Schedule time with me",
          color: "#ef4d23", // Replaced #0069ff with signature Lumen & Co brand color
          textColor: "#ffffff",
          branding: true,
        });
      }
    };

    // 3. Load Calendly JS if not present
    if (!(window as any).Calendly) {
      if (!document.getElementById("calendly-widget-js")) {
        const script = document.createElement("script");
        script.id = "calendly-widget-js";
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        script.onload = () => {
          setTimeout(initBadge, 150);
        };
        document.body.appendChild(script);
      }
    } else {
      initBadge();
    }
  }, [isAdminRoute]);

  return null;
}
