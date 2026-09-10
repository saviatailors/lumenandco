import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase-client";
import { checkAdmin } from "@/lib/admin.functions";

export type AdminState = "checking" | "signedOut" | "denied" | "ready";

/** Google-only gate for the private dashboard screens (your own Supabase auth). */
export function useAdminAuth() {
  const [state, setState] = useState<AdminState>("checking");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const evaluate = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    const mail = data.user?.email?.toLowerCase() ?? "";
    setEmail(mail);
    if (!mail) {
      setState("signedOut");
      return false;
    }
    try {
      const result = await checkAdmin({ data: {} });
      if (!result.isAdmin) {
        setState("denied");
        return false;
      }
      setState("ready");
      return true;
    } catch {
      setState("denied");
      return false;
    }
  }, []);

  useEffect(() => {
    void evaluate();
    const { data: sub } = supabase.auth.onAuthStateChange(() => void evaluate());
    return () => sub.subscription.unsubscribe();
  }, [evaluate]);

  const signIn = useCallback(async () => {
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + window.location.pathname,
        queryParams: { prompt: "select_account" },
      },
    });
    if (oauthError) {
      setError("Google sign-in didn't complete. Please try again.");
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState("signedOut");
    setEmail("");
  }, []);

  return { state, email, error, signIn, signOut, refresh: evaluate };
}
