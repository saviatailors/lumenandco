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
            <p className="mt-1 text-sm text-neutral-500">Sign in with your Google account.</p>
            <button
              onClick={onSignIn}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white"
              style={{ background: ORANGE }}
            >
              Continue with Google
            </button>
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
