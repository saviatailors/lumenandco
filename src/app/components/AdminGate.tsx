import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Lock, ShieldCheck, UserCheck } from "lucide-react";

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
  onSignIn: () => void;
  onPasswordSignIn?: (email: string, password: string) => Promise<boolean>;
  onSignOut: () => void;
  title: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-[#ededed] p-4"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] space-y-4">
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
          <div className="space-y-3 pt-2">
            {/* Primary Direct Admin Sign-in Button */}
            <button
              onClick={onSignIn}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-sm hover:opacity-95 transition-all"
              style={{ background: ORANGE }}
            >
              <UserCheck className="h-4 w-4" /> Sign In as Admin (sahitsai6@gmail.com)
            </button>

            {onPasswordSignIn ? (
              showPassword ? (
                <form
                  className="mt-3 space-y-2 text-left"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    setBusy(true);
                    await onPasswordSignIn(mail, password);
                    setBusy(false);
                  }}
                >
                  <input
                    type="email"
                    required
                    value={mail}
                    onChange={(event) => setMail(event.target.value)}
                    placeholder="Admin Email"
                    autoComplete="username"
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-xs outline-none focus:border-neutral-400"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password (Optional)"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-xs outline-none focus:border-neutral-400"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    {busy ? "Signing in…" : "Sign in with Email"}
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowPassword(true)}
                  className="text-xs text-neutral-500 underline hover:text-neutral-700"
                >
                  Sign in with custom email instead
                </button>
              )
            ) : null}
          </div>
        )}

        {error ? <p className="text-xs text-[#ef4d23] font-medium">{error}</p> : null}

        <div className="pt-2 border-t border-neutral-100">
          <Link to="/" className="text-xs text-neutral-400 hover:text-neutral-600">
            Back to main website
          </Link>
        </div>
      </div>
    </div>
  );
}
