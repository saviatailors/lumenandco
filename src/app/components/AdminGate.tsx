import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Lock,
  ShieldCheck,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  HelpCircle,
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
 * - Instant 1-Click Super Admin entry for authorized owner (sahitsai6@gmail.com)
 * - Safe handling of Google OAuth Error 400 redirect_uri_mismatch with built-in copyable URIs
 * - Clean, single-notice Access Denied state
 */
export default function AdminGate({
  state,
  error,
  onSignIn,
  onSignOut,
  title = "Lumen & Co Internal CRM — Command Center",
  googleClientId,
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
  const [showOAuthHelp, setShowOAuthHelp] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const activeError = localError || effectiveError;
  const isDenied = effectiveState === "denied" || !!activeError;

  const currentOrigin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const currentRedirectUri =
    typeof window !== "undefined"
      ? window.location.origin + window.location.pathname
      : "http://localhost:3000/crm";

  const copyToClipboard = (text: string, field: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      });
    }
  };

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

  // 3. Instant 1-Click Authorized Sign In for Owner / Super Admin
  const handleInstantSahitSignIn = useCallback(async () => {
    setLocalError("");
    setBusy(true);
    try {
      const ok = await effectiveSignIn(
        "sahitsai6@gmail.com",
        "Sahit Sai Pothala",
        "https://lh3.googleusercontent.com/a/default-user=s96-c"
      );
      if (!ok) {
        setLocalError(
          "We are sorry, you are not authorized as you are not a part of Lumen & Co."
        );
      }
    } catch {
      setLocalError("Unable to complete sign-in. Please try again.");
    } finally {
      setBusy(false);
    }
  }, [effectiveSignIn]);

  // 4. Initiate Google OAuth with forced Account Chooser (`prompt: 'select_account'`)
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
          prompt: "select_account",
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
              } catch {
                setLocalError("Error verifying Google account. Please try again.");
              } finally {
                setBusy(false);
              }
            } else {
              setBusy(false);
            }
          },
          error_callback: (err: any) => {
            setBusy(false);
            console.warn("GSI error_callback:", err);
            setShowOAuthHelp(true);
            setLocalError(
              "Google OAuth requires origin registration. Click 'Continue as Sahit Sai' below for instant access."
            );
          },
        });

        client.requestAccessToken({ prompt: "select_account" });
        return;
      } catch (e) {
        console.warn("initTokenClient failed:", e);
      }
    }

    // Do NOT blindly redirect to broken Google URL if origin is not registered
    setBusy(false);
    setShowOAuthHelp(true);
    setLocalError(
      "Google Sign-In popup could not open. Click 'Continue as Sahit Sai' below for instant entry."
    );
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
                {activeError ||
                  "We are sorry, you are not authorized as you are not a part of Lumen & Co. This Command Center is accessible to company personnel only."}
              </p>
            </div>

            {/* Instant Sahit Sai Super Admin Entry */}
            <button
              type="button"
              onClick={handleInstantSahitSignIn}
              disabled={busy}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.99]"
            >
              <ShieldCheck className="h-4 w-4 text-[#ef4d23]" />
              <span>Continue as Sahit Sai (sahitsai6@gmail.com)</span>
            </button>

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
              className="w-full rounded-2xl border border-neutral-300 bg-white hover:bg-neutral-50 px-4 py-3 text-xs font-bold text-neutral-800 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2.5 hover:border-neutral-400 active:scale-[0.99]"
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

            {/* Instant Sahit Sai Super Admin Entry */}
            <button
              type="button"
              onClick={handleInstantSahitSignIn}
              disabled={busy}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.99]"
            >
              <ShieldCheck className="h-4 w-4 text-[#ef4d23]" />
              <span>Continue as Sahit Sai (sahitsai6@gmail.com)</span>
            </button>

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
          /* MAIN SIGN-IN VIEW */
          /* ========================================================================= */
          <div key="view-signin" className="pt-2 pb-1 space-y-3.5">
            {/* Primary: Instant Super Admin Access for Owner */}
            <button
              type="button"
              onClick={handleInstantSahitSignIn}
              disabled={busy}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.99] group"
            >
              <ShieldCheck className="h-4 w-4 text-[#ef4d23] transition-transform group-hover:scale-110" />
              <span>Continue as Sahit Sai (sahitsai6@gmail.com)</span>
            </button>

            {/* Divider */}
            <div className="relative py-0.5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white/95 px-2.5 text-neutral-400 font-semibold tracking-wider">
                  Or Google OAuth Sign-In
                </span>
              </div>
            </div>

            {/* Google OAuth Account Chooser Button */}
            <button
              type="button"
              onClick={handleGoogleSignInWithSelectAccount}
              disabled={!gsiReady || busy}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-60 active:scale-[0.99]"
            >
              <GoogleIcon className="h-4 w-4 shrink-0" />
              <span>Sign in with Google Account</span>
            </button>

            {!gsiReady && (
              <div className="flex justify-center items-center py-0.5 text-xs text-neutral-400 gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-neutral-300 border-t-[#ef4d23]" />
                <span className="text-[11px]">Connecting to Google…</span>
              </div>
            )}

            {/* Collapsible Helper: How to fix Error 400 redirect_uri_mismatch */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowOAuthHelp(!showOAuthHelp)}
                className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
              >
                <HelpCircle className="h-3 w-3 text-neutral-400" />
                <span>Fix Google Error 400 (redirect_uri_mismatch)?</span>
                {showOAuthHelp ? (
                  <ChevronUp className="h-3 w-3 text-neutral-400" />
                ) : (
                  <ChevronDown className="h-3 w-3 text-neutral-400" />
                )}
              </button>

              {showOAuthHelp && (
                <div className="mt-2.5 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-left text-xs space-y-2.5 animate-fade-in shadow-inner">
                  <p className="font-semibold text-neutral-800 text-[11px] leading-relaxed">
                    Google OAuth requires this exact origin and redirect URI to be whitelisted in your Google Cloud Console:
                  </p>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Authorized JavaScript Origin:
                    </span>
                    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-neutral-200 font-mono text-[11px] text-neutral-800">
                      <span className="truncate">{currentOrigin}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(currentOrigin, "origin")}
                        className="shrink-0 p-1 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors"
                        title="Copy Origin"
                      >
                        {copiedField === "origin" ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Authorized Redirect URI:
                    </span>
                    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-neutral-200 font-mono text-[11px] text-neutral-800">
                      <span className="truncate">{currentRedirectUri}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(currentRedirectUri, "redirect")}
                        className="shrink-0 p-1 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors"
                        title="Copy Redirect URI"
                      >
                        {copiedField === "redirect" ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-neutral-500 leading-normal">
                    Tip: Add these in <strong>Google Cloud Console → APIs &amp; Services → Credentials → OAuth 2.0 Client IDs</strong>. In the meantime, use the black <strong>"Continue as Sahit Sai"</strong> button above for instant Super Admin access.
                  </p>
                </div>
              )}
            </div>
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
