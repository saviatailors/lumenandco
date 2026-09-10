import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, Lock } from "lucide-react";

import type { AdminState } from "./useAdminAuth";

const ORANGE = "#ef4d23";

/** Sign-in / not-allowed screen shown before the private dashboards. */
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
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#ef4d23]/10 text-[#ef4d23]">
          <Lock className="h-4 w-4" />
        </div>
        <h1
          className="mt-4 text-2xl text-neutral-900"
          style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
        >
          {title}
        </h1>

        {state === "checking" ? (
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Checking your account…
          </p>
        ) : state === "denied" ? (
          <>
            <p className="mt-2 text-sm text-neutral-600">
              {email} doesn’t have access to this dashboard.
            </p>
            <button
              onClick={onSignOut}
              className="mt-5 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Use a different account
            </button>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-neutral-500">Sign in with your admin account.</p>
            <button
              onClick={onSignIn}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white"
              style={{ background: ORANGE }}
            >
              Continue with Google
            </button>

            {onPasswordSignIn ? (
              showPassword ? (
                <form
                  className="mt-4 space-y-2 text-left"
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
                    placeholder="Email"
                    autoComplete="username"
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                  />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {busy ? "Signing in…" : "Sign in"}
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowPassword(true)}
                  className="mt-3 text-xs text-neutral-500 underline hover:text-neutral-700"
                >
                  Use email and password instead
                </button>
              )
            ) : null}
          </>
        )}

        {error ? <p className="mt-2 text-xs text-[#ef4d23]">{error}</p> : null}

        <Link to="/" className="mt-4 block text-xs text-neutral-400 hover:text-neutral-600">
          Back to site
        </Link>
      </div>
    </div>
  );
}
