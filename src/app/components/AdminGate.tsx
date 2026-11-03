import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Lock,
} from "lucide-react";
import LiveBackgroundVideo from "./LiveBackgroundVideo";
import {
  useAdminAuth,
  loadGoogleGsiScript,
  type AdminState,
} from "./useAdminAuth";

/** Google "G" Colorful SVG Icon */
function GoogleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export interface AdminGateProps {
  state?: AdminState;
  email?: string;
  error?: string;
  onSignIn?: (email?: string, name?: string, picture?: string) => any;
  onPasswordSignIn?: (email: string, password: string) => any;
  onSignOut?: () => void;
  title?: string;
  googleClientId?: string;
  onGoogleCredential?: (credential: string) => Promise<boolean>;
  onSetGoogleClientId?: (id: string) => void;
}

/**
 * Modern Google Authentication Gate for Lumen & Co Internal Operations Hub & CRM
 * 
 * Features:
 * - Always forces Google Account Chooser (`prompt: 'select_account'`) so users can switch accounts
 * - Never displays unauthorized Google accounts on screen
 * - Clean, single-notice Access Denied state
 */
export default function AdminGate({
  state,
  email,
  error,
  onSignIn,
  onSignOut,
  title = "Lumen & Co Internal CRM — Command Center",
  googleClientId,
  onGoogleCredential,
}: AdminGateProps) {
  const auth = useAdminAuth();

  const effectiveState = state ?? auth.state;
  const effectiveError = error ?? auth.error;
  const effectiveSignOut = onSignOut ?? auth.signOut;
  const effectiveClientId = googleClientId ?? auth.googleClientId;
  const effectiveSignIn = onSignIn ?? auth.signInWithGoogleAccount;

  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState("");
  const [gsiReady, setGsiReady] = useState(false);

  const activeError = localError || effectiveError;
  const isDenied = effectiveState === "denied" || !!activeError;

  // 1. Load Google Identity Services script
  useEffect(() => {
    let active = true;
    loadGoogleGsiScript().then((ok) => {
      if (active) {
        setGsiReady(ok);
        // Explicitly disable One Tap auto-select to avoid trapping user in unauthorized account
        if (typeof window !== "undefined" && (window as any).google?.accounts?.id) {
          try {
            (window as any).google.accounts.id.disableAutoSelect();
          } catch {}
        }
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // 2. Handle OAuth token return via redirect hash if popup was blocked
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash.includes("access_token=")) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = params.get("access_token");
      if (accessToken) {
        window.history.replaceState(null, "", window.location.pathname);
        setBusy(true);
        fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((res) => res.json())
          .then(async (info) => {
            if (info?.email) {
              const ok = await effectiveSignIn(info.email, info.name, info.picture);
              if (!ok) {
                setLocalError(
                  "We are sorry, you are not authorized as you are not a part of Lumen & Co."
                );
              }
            }
          })
          .catch(() => {
            setLocalError("Unable to verify Google credentials. Please try again.");
          })
          .finally(() => setBusy(false));
      }
    }
  }, [effectiveSignIn]);

  // 3. Initiate Google OAuth with forced Account Chooser (`prompt: 'select_account'`)
  const handleGoogleSignInWithSelectAccount = useCallback(() => {
    setLocalError("");
    setBusy(true);

    if (typeof window === "undefined") return;

    const google = (window as any).google;
    if (google?.accounts?.oauth2) {
      try {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: effectiveClientId,
          scope: "openid email profile",
          prompt: "select_account", // ALWAYS force Account Picker so user can choose sahitsai6@gmail.com!
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.error) {
              setBusy(false);
              if (tokenResponse.error !== "access_denied") {
                setLocalError("Google sign-in was cancelled or encountered an error.");
              }
              return;
            }

            if (tokenResponse?.access_token) {
              try {
                const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const info = await res.json();
                if (info?.email) {
                  const ok = await effectiveSignIn(info.email, info.name, info.picture);
                  if (!ok) {
                    setLocalError(
                      "We are sorry, you are not authorized as you are not a part of Lumen & Co."
                    );
                  }
                } else {
                  setLocalError("Unable to retrieve email from Google. Please try again.");
                }
              } catch (err) {
                setLocalError("Error verifying Google account. Please try again.");
              } finally {
                setBusy(false);
              }
            } else {
              setBusy(false);
            }
          },
        });

        client.requestAccessToken({ prompt: "select_account" });
        return;
      } catch (e) {
        console.warn("initTokenClient fallback to redirect:", e);
      }
    }

    // Direct OAuth 2.0 fallback with forced account selection prompt
    const redirectUri = window.location.origin + window.location.pathname;
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${effectiveClientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=openid%20email%20profile&prompt=select_account`;

    window.location.href = oauthUrl;
  }, [effectiveClientId, effectiveSignIn]);

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center p-4 overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Live Background Video */}
      <LiveBackgroundVideo overlayClassName="absolute inset-0 bg-black/50 backdrop-blur-md" />

      <div className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl p-7 sm:p-8 text-center shadow-[0_24px_70px_-20px_rgba(0,0,0,0.6)] space-y-5 border border-white/40 relative z-10 transition-all">
        {/* Lumen & Co Header */}
        <div className="mx-auto flex items-center justify-center pt-1 pb-1">
          <Link to="/" className="group inline-block">
            <img
              src="/lumen-and-co-logo.png"
              alt="Lumen & Co Agency"
              className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ef4d23]/10 border border-[#ef4d23]/20 text-[#ef4d23] text-[11px] font-bold uppercase tracking-wider mb-2">
            <Lock className="h-3 w-3" />
            <span>Secure Enterprise Gateway</span>
          </div>
          <h1
            className="text-2xl text-neutral-900 font-bold tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
          >
            {title}
          </h1>
          <p className="mt-1 text-xs text-neutral-500 font-medium">
            Strictly Restricted to Authorized Lumen & Co Personnel
          </p>
        </div>

        {/* ========================================================================= */}
        {/* AUTHENTICATION STATE VIEWS */}
        {/* ========================================================================= */}
        {busy ? (
          <div key="view-busy" className="py-6 space-y-3">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-[#ef4d23]" />
            <p className="text-xs text-neutral-600 font-medium">
              Verifying Google Account Authorization…
            </p>
          </div>
        ) : isDenied ? (
          /* ========================================================================= */
          /* ACCESS DENIED STATE (CLEAN SINGLE VIEW, NO UNAPPROVED ACCOUNTS SHOWN) */
          /* ========================================================================= */
          <div key="view-denied" className="space-y-4 py-2">
            <div className="rounded-2xl border border-red-200 bg-red-50/95 p-5 text-left text-xs text-red-900 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-red-950 text-sm">
                <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                <span>Access Denied</span>
              </div>
              <p className="text-neutral-700 leading-relaxed">
                We are sorry, you are not authorized as you are not a part of Lumen &amp; Co. This Command Center is accessible to company personnel only.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setLocalError("");
                if (typeof window !== "undefined" && (window as any).google?.accounts?.id) {
                  try {
                    (window as any).google.accounts.id.disableAutoSelect();
                  } catch {}
                }
                effectiveSignOut();
                handleGoogleSignInWithSelectAccount();
              }}
              className="w-full rounded-2xl border border-neutral-300 bg-white hover:bg-neutral-50 px-4 py-3.5 text-xs font-bold text-neutral-800 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2.5 hover:border-neutral-400 active:scale-[0.99]"
            >
              <GoogleIcon className="h-4 w-4 shrink-0" />
              <span>Sign in with another Google account</span>
            </button>
          </div>
        ) : effectiveState === "checking" ? (
          /* ========================================================================= */
          /* CHECKING STATE */
          /* ========================================================================= */
          <div key="view-checking" className="py-6 space-y-3">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-[#ef4d23]" />
            <p className="text-xs text-neutral-600 font-medium">
              Verifying Google Security Token…
            </p>
          </div>
        ) : effectiveState === "expired" ? (
          /* ========================================================================= */
          /* SESSION EXPIRED / TIMEOUT STATE */
          /* ========================================================================= */
          <div key="view-expired" className="space-y-4 py-2">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-left text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Session Timed Out</span>
              </div>
              <p>
                Your secure session has expired for security compliance. Please sign in again with your authorized Google account.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setLocalError("");
                effectiveSignOut();
                handleGoogleSignInWithSelectAccount();
              }}
              className="w-full rounded-2xl bg-white border border-neutral-300 hover:border-neutral-400 px-4 py-3 text-xs font-bold text-neutral-800 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <GoogleIcon className="h-4 w-4" />
              <span>Sign in again with Google</span>
            </button>
          </div>
        ) : (
          /* ========================================================================= */
          /* BRANDED SIGN-IN BUTTON (NEVER SHOWS PRE-ATTACHED UNAPPROVED ACCOUNT) */
          /* ========================================================================= */
          <div key="view-signin" className="pt-2 pb-1 space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignInWithSelectAccount}
              disabled={!gsiReady || busy}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-sm font-semibold shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-60 active:scale-[0.99]"
            >
              <GoogleIcon className="h-5 w-5 shrink-0" />
              <span>Sign in with Google</span>
            </button>

            {!gsiReady && (
              <div className="flex justify-center items-center py-1 text-xs text-neutral-400 gap-2">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-neutral-300 border-t-[#ef4d23]" />
                <span>Connecting to Google…</span>
              </div>
            )}
          </div>
        )}

        {/* Back Link */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-center gap-2">
          <Link
            to="/"
            className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            ← Back to main website
          </Link>
        </div>
      </div>
    </div>
  );
}
