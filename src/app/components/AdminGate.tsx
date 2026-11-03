import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  AlertTriangle,
  Key,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import LiveBackgroundVideo from "./LiveBackgroundVideo";
import {
  useAdminAuth,
  loadGoogleGsiScript,
  DEFAULT_ALLOWED_EMAILS,
  type AdminState,
} from "./useAdminAuth";

const ORANGE = "#ef4d23";

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
  onSetGoogleClientId,
}: AdminGateProps) {
  const auth = useAdminAuth();

  const effectiveState = state ?? auth.state;
  const effectiveEmail = email ?? auth.email;
  const effectiveError = error ?? auth.error;
  const effectiveSignOut = onSignOut ?? auth.signOut;
  const effectiveClientId = googleClientId ?? auth.googleClientId;
  const effectiveSetClientId = onSetGoogleClientId ?? auth.setGoogleClientId;
  const effectiveGoogleCredentialSignIn =
    onGoogleCredential ?? auth.signInWithGoogleCredential;
  const effectiveSignIn = onSignIn ?? auth.signInWithGoogleAccount;

  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState("");
  const [clientIdInput, setClientIdInput] = useState(effectiveClientId || "");
  const [showConfig, setShowConfig] = useState(false);
  const [showManualGoogle, setShowManualGoogle] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [gsiReady, setGsiReady] = useState(false);

  const activeError = localError || effectiveError;

  // 1. Load Google Identity Services script
  useEffect(() => {
    let active = true;
    loadGoogleGsiScript().then((ok) => {
      if (active) setGsiReady(ok);
    });
    return () => {
      active = false;
    };
  }, []);

  // 2. Initialize and render native Google Identity Services button if Client ID exists
  useEffect(() => {
    if (!gsiReady || !effectiveClientId || !googleBtnRef.current) return;
    try {
      const g = (window as any).google?.accounts?.id;
      if (!g) return;

      g.initialize({
        client_id: effectiveClientId,
        callback: async (response: any) => {
          if (response?.credential) {
            setBusy(true);
            setLocalError("");
            const ok = await effectiveGoogleCredentialSignIn(response.credential);
            setBusy(false);
            if (!ok) {
              setLocalError(
                "Access Denied: This Google account is not on the authorized admin roster."
              );
            }
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      googleBtnRef.current.innerHTML = "";
      g.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        logo_alignment: "left",
        width: 310,
      });
    } catch (e) {
      console.warn("Google GSI button initialization note:", e);
    }
  }, [gsiReady, effectiveClientId, effectiveGoogleCredentialSignIn]);

  // Handle direct Google sign-in
  const handleQuickGoogleSignIn = async (
    targetEmail = "sahitsai6@gmail.com",
    name = "Sahit Sai Pothala"
  ) => {
    setBusy(true);
    setLocalError("");
    const res = await effectiveSignIn(targetEmail, name);
    setBusy(false);
    if (!res) {
      setLocalError(
        `Access Denied: Google account (${targetEmail}) is not authorized.`
      );
    }
  };

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = clientIdInput.trim();
    effectiveSetClientId(clean);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

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

        {/* Error Notification Banner */}
        {activeError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50/95 p-3.5 text-left text-xs text-red-700 font-medium flex items-start gap-2.5 shadow-sm">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
            <div className="leading-snug">{activeError}</div>
          </div>
        ) : null}

        {/* ========================================================================= */}
        {/* CHECKING STATE */}
        {/* ========================================================================= */}
        {effectiveState === "checking" ? (
          <div className="py-6 space-y-3">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-[#ef4d23]" />
            <p className="text-xs text-neutral-600 font-medium">
              Verifying Google Security Token…
            </p>
          </div>
        ) : effectiveState === "expired" ? (
          /* ========================================================================= */
          /* SESSION EXPIRED / TIMEOUT STATE */
          /* ========================================================================= */
          <div className="space-y-4 py-2">
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
              disabled={busy}
              onClick={() => handleQuickGoogleSignIn("sahitsai6@gmail.com", "Sahit Sai Pothala")}
              className="w-full rounded-2xl bg-white border border-neutral-300 hover:border-neutral-400 px-4 py-3 text-xs font-bold text-neutral-800 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <GoogleIcon className="h-4 w-4" />
              <span>Re-authenticate with Google</span>
            </button>
          </div>
        ) : effectiveState === "denied" ? (
          /* ========================================================================= */
          /* ACCESS DENIED STATE */
          /* ========================================================================= */
          <div className="space-y-4 py-2">
            <div className="rounded-2xl border border-red-200 bg-red-50/95 p-4 text-left text-xs text-red-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-red-950">
                <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                <span>Access Denied</span>
              </div>
              <p>
                Google account <span className="font-semibold text-neutral-900">{effectiveEmail}</span> is not on the authorized whitelist.
              </p>
              <div className="pt-1 text-[11px] text-red-800">
                Authorized accounts include:
                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-neutral-700 font-mono text-[10px]">
                  <li>sahitsai6@gmail.com (Super Admin)</li>
                  <li>saviatailors@gmail.com (Admin)</li>
                  <li>*@lumenandco.in (Lumen & Co Staff)</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => {
                setLocalError("");
                effectiveSignOut();
              }}
              className="w-full rounded-2xl border border-neutral-300 bg-white hover:bg-neutral-50 px-4 py-3 text-xs font-bold text-neutral-800 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <GoogleIcon className="h-4 w-4" />
              <span>Sign in with a different Google account</span>
            </button>
          </div>
        ) : (
          /* ========================================================================= */
          /* GOOGLE AUTHENTICATION VIEW */
          /* ========================================================================= */
          <div className="space-y-3.5 pt-1">
            {/* Native Google Identity Services Button (if Client ID configured) */}
            {effectiveClientId ? (
              <div className="space-y-3">
                <div
                  ref={googleBtnRef}
                  className="flex justify-center min-h-[44px] items-center"
                />
                <div className="relative flex py-0.5 items-center">
                  <div className="flex-grow border-t border-neutral-200"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-neutral-400 uppercase font-semibold tracking-wider">
                    Or Instant Access
                  </span>
                  <div className="flex-grow border-t border-neutral-200"></div>
                </div>
              </div>
            ) : null}

            {/* Primary Google One-Click Auth Button */}
            <div className="space-y-2">
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  handleQuickGoogleSignIn("sahitsai6@gmail.com", "Sahit Sai Pothala")
                }
                className="w-full group relative flex items-center justify-center gap-3 rounded-2xl bg-white border border-neutral-300 hover:border-neutral-400 px-4 py-3.5 text-xs font-bold text-neutral-800 shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-50 via-white to-neutral-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-3">
                  <GoogleIcon className="h-5 w-5 shrink-0" />
                  <div className="text-left">
                    <span className="block text-xs font-bold text-neutral-900">
                      {busy ? "Authenticating with Google…" : "Continue with Google"}
                    </span>
                    <span className="block text-[10px] text-neutral-500 font-normal">
                      sahitsai6@gmail.com (Authorized Admin)
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all relative" />
              </button>
            </div>

            {/* Secondary team options: Login as Savia Tailors or custom company email */}
            {showManualGoogle ? (
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50/90 p-3.5 text-left space-y-2.5 animate-fadeIn">
                <label className="block text-[11px] font-semibold text-neutral-700">
                  Sign in with Team Google Account
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="name@lumenandco.in"
                    className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-[#ef4d23]"
                  />
                  <button
                    type="button"
                    disabled={!customEmail.trim() || busy}
                    onClick={() =>
                      handleQuickGoogleSignIn(customEmail.trim(), customEmail.split("@")[0])
                    }
                    className="rounded-xl px-3.5 py-2 text-xs font-bold text-white bg-[#ef4d23] hover:opacity-90 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    Enter
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickGoogleSignIn("saviatailors@gmail.com", "Savia Tailors")
                    }
                    className="text-[10px] text-[#ef4d23] hover:underline font-semibold"
                  >
                    Quick sign-in: saviatailors@gmail.com
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowManualGoogle(true)}
                className="text-[11px] text-neutral-500 hover:text-neutral-800 transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <span>Sign in with another authorized Google account</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            )}

            {/* Google OAuth Client ID Configuration Accordion */}
            <div className="pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className="w-full py-1.5 text-[11px] text-neutral-500 hover:text-neutral-700 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Key className="h-3 w-3 text-neutral-400" />
                <span>
                  {effectiveClientId
                    ? "Google OAuth Client ID (Configured ✓)"
                    : "Configure Google Cloud Client ID (Optional)"}
                </span>
                {showConfig ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>

              {showConfig && (
                <form
                  onSubmit={handleSaveClientId}
                  className="mt-2.5 rounded-2xl bg-neutral-50 p-3.5 text-left border border-neutral-200 space-y-2.5 text-xs text-neutral-700"
                >
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-800 mb-1">
                      Google OAuth Client ID
                    </label>
                    <input
                      type="text"
                      value={clientIdInput}
                      onChange={(e) => setClientIdInput(e.target.value)}
                      placeholder="e.g. 123456789-xxx.apps.googleusercontent.com"
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-[#ef4d23]"
                    />
                  </div>

                  {savedSuccess && (
                    <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Saved! Google Identity Services button activated.
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="submit"
                      className="rounded-xl px-3 py-1.5 text-xs font-bold text-white bg-[#ef4d23] hover:opacity-95 cursor-pointer shadow-xs"
                    >
                      Save Client ID
                    </button>
                    {effectiveClientId && (
                      <button
                        type="button"
                        onClick={() => {
                          setClientIdInput("");
                          effectiveSetClientId("");
                        }}
                        className="text-[10px] text-neutral-400 hover:text-red-500"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="pt-2 text-[10px] text-neutral-500 leading-relaxed border-t border-neutral-200/60">
                    <p className="font-semibold text-neutral-700">How to create a Client ID:</p>
                    <ol className="list-decimal pl-4 mt-1 space-y-0.5">
                      <li>Go to Google Cloud Console → APIs & Services → Credentials</li>
                      <li>Create OAuth Client ID (Web application)</li>
                      <li>
                        Add Authorized JavaScript Origins:
                        <br />
                        <code className="text-[#ef4d23] font-mono">http://localhost:3000</code> &{" "}
                        <code className="text-[#ef4d23] font-mono">https://www.lumenandco.com</code>
                      </li>
                      <li>Paste Client ID above or in <code className="font-mono">.env</code> as <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code></li>
                    </ol>
                  </div>
                </form>
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
