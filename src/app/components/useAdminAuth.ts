import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const ADMIN_EMAILS = ["sahitsai6@gmail.com"];

export type AdminState = "checking" | "signedOut" | "denied" | "ready";

/** Google-only gate for the private dashboard screens. */
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
    if (!ADMIN_EMAILS.includes(mail)) {
      setState("denied");
      return false;
    }
    setState("ready");
    return true;
  }, []);

  useEffect(() => {
    void evaluate();
  }, [evaluate]);

  const signIn = useCallback(async () => {
    setError("");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
      extraParams: { prompt: "select_account" },
    });
    if (result.error) {
      setError("Google sign-in didn't complete. Please try again.");
      return;
    }
    if (result.redirected) return;
    await evaluate();
  }, [evaluate]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState("signedOut");
    setEmail("");
  }, []);

  return { state, email, error, signIn, signOut, refresh: evaluate };
}
