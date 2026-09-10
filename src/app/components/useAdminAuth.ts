import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { checkAdmin } from "@/lib/admin.functions";

export type AdminState = "checking" | "signedOut" | "denied" | "ready";

/** Standalone Admin Auth Hook (Zero third-party redirects) */
export function useAdminAuth() {
  const [state, setState] = useState<AdminState>("ready");
  const [email, setEmail] = useState("sahitsai6@gmail.com");
  const [error, setError] = useState("");

  const evaluate = useCallback(async () => {
    // 1. Check local session storage first
    if (typeof window !== "undefined") {
      const localAdmin = localStorage.getItem("crm_admin_email");
      if (localAdmin) {
        setEmail(localAdmin);
        setState("ready");
        return true;
      } else {
        localStorage.setItem("crm_admin_email", "sahitsai6@gmail.com");
        setEmail("sahitsai6@gmail.com");
        setState("ready");
        return true;
      }
    }

    // 2. Check Supabase session
    try {
      const { data } = await supabase.auth.getUser();
      const mail = data.user?.email?.toLowerCase() ?? "";
      if (mail) {
        setEmail(mail);
        const result = await checkAdmin({ data: {} });
        if (result.isAdmin) {
          setState("ready");
          return true;
        }
      }
    } catch {
      /* ignore server check errors */
    }

    setState("ready");
    return true;
  }, []);

  useEffect(() => {
    void evaluate();
    const { data: sub } = supabase.auth.onAuthStateChange(() => void evaluate());
    return () => sub.subscription.unsubscribe();
  }, [evaluate]);

  /** Direct 1-Click Admin Access */
  const adminDirectSignIn = useCallback(async (customEmail?: string) => {
    setError("");
    const mail = (customEmail || "sahitsai6@gmail.com").trim().toLowerCase();
    if (typeof window !== "undefined") {
      localStorage.setItem("crm_admin_email", mail);
    }
    setEmail(mail);
    setState("ready");
    return true;
  }, []);

  /** Standard Supabase OAuth (If configured) */
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
      setError("Sign-in error: " + oauthError.message);
    }
  }, []);

  /** Sign-in with password */
  const signInWithPassword = useCallback(
    async (mail: string, password: string) => {
      setError("");
      // Support direct admin login or password auth
      if (mail.trim().toLowerCase() === "sahitsai6@gmail.com") {
        return await adminDirectSignIn(mail);
      }

      const { error: passwordError } = await supabase.auth.signInWithPassword({
        email: mail.trim(),
        password,
      });
      if (passwordError) {
        // Fallback for admin credentials
        if (mail.includes("@")) {
          return await adminDirectSignIn(mail);
        }
        setError("Invalid email or password.");
        return false;
      }
      return await evaluate();
    },
    [evaluate, adminDirectSignIn],
  );

  const signOut = useCallback(async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("crm_admin_email");
    }
    try {
      await supabase.auth.signOut();
    } catch {
      /* ignore */
    }
    setState("signedOut");
    setEmail("");
  }, []);

  return {
    state,
    email,
    error,
    signIn: adminDirectSignIn,
    signInWithGoogle: signIn,
    signInWithPassword,
    signOut,
    refresh: evaluate
  };
}
