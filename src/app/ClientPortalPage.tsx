import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Loader2, LogOut } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { getMyEnquiries } from "@/lib/client-portal.functions";
import EnquiryDashboard, { type PortalLead } from "./components/EnquiryDashboard";

export default function ClientPortalPage() {
  const fetchMine = useServerFn(getMyEnquiries);

  const [checking, setChecking] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [enquiries, setEnquiries] = useState<PortalLead[]>([]);

  const load = async () => {
    try {
      const res = await fetchMine({ data: undefined });
      setEnquiries(res.enquiries as PortalLead[]);
      setSignedIn(true);
    } catch {
      setError("We couldn't load your enquiries. Please sign in again.");
      setSignedIn(false);
    }
  };

  useEffect(() => {
    let alive = true;
    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      if (data.session) await load();
      if (alive) setChecking(false);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true },
    });
    setBusy(false);
    if (err) setError("We couldn't send the code. Check the email address and try again.");
    else setStep("code");
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code.trim(),
      type: "email",
    });
    if (err) {
      setBusy(false);
      setError("That code didn't work. Ask for a new one and try again.");
      return;
    }
    await load();
    setBusy(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSignedIn(false);
    setEnquiries([]);
    setStep("email");
    setCode("");
  };

  return (
    <div
      className="min-h-screen w-full bg-[#ededed] p-3 sm:p-5"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white px-5 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-neutral-400">
              lumen&co
            </p>
            <h1
              className="text-2xl text-neutral-900"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
            >
              Client sign in
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {signedIn ? (
              <button
                onClick={() => void signOut()}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            ) : null}
            <Link
              to="/"
              className="rounded-full bg-[#ef4d23] px-4 py-2 text-xs font-semibold text-white"
            >
              Visit site
            </Link>
          </div>
        </header>

        {checking ? (
          <div className="mt-3 flex items-center justify-center gap-2 rounded-3xl bg-white p-12 text-sm text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Checking your sign in…
          </div>
        ) : signedIn ? (
          <div className="mt-3">
            <EnquiryDashboard enquiries={enquiries} />
          </div>
        ) : (
          <div className="mt-3 rounded-3xl bg-white p-6 sm:p-10">
            <h2
              className="text-neutral-900"
              style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em" }}
            >
              See your enquiry, budget and stage
            </h2>
            <p className="mt-2 max-w-md text-sm text-neutral-500">
              Enter the email address you used when you contacted us. We'll send you a 6-digit code
              — no password needed.
            </p>

            {step === "email" ? (
              <form onSubmit={(e) => void sendCode(e)} className="mt-6 max-w-sm space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-neutral-200 bg-[#f5f2ee] p-3 text-sm outline-none focus:border-[#ef4d23]"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-full bg-[#ef4d23] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Send my code
                </button>
              </form>
            ) : (
              <form onSubmit={(e) => void verify(e)} className="mt-6 max-w-sm space-y-3">
                <p className="text-xs text-neutral-500">We sent a code to {email}.</p>
                <input
                  inputMode="numeric"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6-digit code"
                  className="w-full rounded-xl border border-neutral-200 bg-[#f5f2ee] p-3 text-sm tracking-widest outline-none focus:border-[#ef4d23]"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex items-center gap-2 rounded-full bg-[#ef4d23] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Open my dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-xs text-neutral-500 underline"
                  >
                    Use a different email
                  </button>
                </div>
              </form>
            )}

            {error ? <p className="mt-3 text-xs text-[#ef4d23]">{error}</p> : null}
          </div>
        )}
      </div>
    </div>
  );
}
