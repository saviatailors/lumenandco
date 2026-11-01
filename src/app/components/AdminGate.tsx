import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Lock, ShieldCheck, AlertTriangle } from "lucide-react";
import LiveBackgroundVideo from "./LiveBackgroundVideo";

import type { AdminState } from "./useAdminAuth";

const ORANGE = "#ef4d23";

/** Sign-in / access gate for private dashboard screens. */
export default function AdminGate({
  state,
  email,
  error,
  onSignIn,
  onPasswordSignIn,
  onSignOut,
  title,
}: {
  state: AdminState;
  email: string;
  error: string;
  onSignIn: (user?: string, pass?: string) => any;
  onPasswordSignIn?: (email: string, password: string) => Promise<boolean>;
  onSignOut: () => void;
  title: string;
}) {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState("");

  const activeError = localError || error;

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center p-4 overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Live Background Video */}
      <LiveBackgroundVideo overlayClassName="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="w-full max-w-sm rounded-3xl bg-white/95 backdrop-blur-md p-7 text-center shadow-[0_20px_60px_-30px_rgba(0,0,0,0.5)] space-y-4 border border-white/20">
        <div className="mx-auto flex items-center justify-center pt-1 pb-2">
          <Link to="/">
            <img src="/lumen-and-co-logo.png" alt="Lumen & Co Agency" className="h-12 sm:h-14 w-auto object-contain transition-all hover:scale-105" />
          </Link>
        </div>
        
        <div>
          <h1
            className="text-xl text-neutral-900 font-bold"
            style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
          >
            {title}
          </h1>
          <p className="mt-1 text-xs text-neutral-500">Lumen & Co Private Operations Hub</p>
        </div>

        {/* Error Notification Banner */}
        {activeError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50/90 p-3 text-left text-xs text-red-700 font-medium flex items-start gap-2.5 shadow-sm animate-shake">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
            <div className="leading-snug">{activeError}</div>
          </div>
        ) : null}

        {state === "checking" ? (
          <p className="mt-3 inline-flex items-center gap-2 text-xs text-neutral-500">
            Checking your session…
          </p>
        ) : state === "denied" ? (
          <div className="space-y-3">
            <p className="text-xs text-neutral-600">
              <span className="font-semibold text-neutral-900">{email}</span> is not authorized.
            </p>
            <button
              onClick={onSignOut}
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Sign out & Switch Account
            </button>
          </div>
        ) : (
          <form
            className="space-y-3 pt-1 text-left"
            onSubmit={async (event) => {
              event.preventDefault();
              setLocalError("");
              const inputUser = mail.trim() || "sahit";
              const inputPass = password.trim() || "Sahitsai@9866";
              const authFn = onPasswordSignIn || onSignIn;
              if (authFn) {
                setBusy(true);
                const success = await authFn(inputUser, inputPass);
                setBusy(false);
                if (!success) {
                  setLocalError("Invalid username or password. Please check your credentials.");
                }
              }
            }}
          >
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                Username or Email
              </label>
              <input
                type="text"
                required
                value={mail}
                onChange={(event) => {
                  setMail(event.target.value);
                  setLocalError("");
                }}
                placeholder="sahit"
                autoComplete="username"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-neutral-900 outline-none transition-all ${
                  activeError
                    ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-neutral-200 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setLocalError("");
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-neutral-900 outline-none transition-all ${
                  activeError
                    ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-neutral-200 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl px-4 py-3 text-xs font-bold text-white shadow-sm hover:opacity-95 transition-all disabled:opacity-60 mt-1 cursor-pointer"
              style={{ background: ORANGE }}
            >
              {busy ? "Authenticating…" : "Sign In to CRM"}
            </button>

            {/* Demo / Quick Fill Credentials */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMail("sahit");
                  setPassword("Sahitsai@9866");
                  setLocalError("");
                }}
                className="w-full py-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-[#ef4d23] text-[11px] font-bold rounded-xl border border-neutral-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🔑 Auto-Fill Admin Credentials (sahit)</span>
              </button>
            </div>
          </form>
        )}

        <div className="pt-2 border-t border-neutral-100">
          <Link to="/" className="text-xs text-neutral-400 hover:text-neutral-600">
            Back to main website
          </Link>
        </div>
      </div>
    </div>
  );
}
