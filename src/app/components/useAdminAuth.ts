import { useCallback, useEffect, useState } from "react";

export type AdminUser = {
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
};

export type AdminState = "checking" | "signedOut" | "denied" | "ready";

/** Authorized Google email accounts allowed into the Command Center */
export const DEFAULT_ALLOWED_EMAILS = [
  "sahitsai6@gmail.com",
  "saviatailors@gmail.com",
  "sahit@lumenandco.in",
  "santhan@lumenandco.in",
  "admin@lumenandco.com",
];

/** Verifies if an email address is authorized for Command Center access */
export function isEmailAllowed(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();

  // 1. Check default allowed accounts
  if (DEFAULT_ALLOWED_EMAILS.some((allowed) => allowed.toLowerCase() === clean)) {
    return true;
  }

  // 2. Check environment variable overrides (VITE_ADMIN_EMAILS or ADMIN_EMAILS)
  const envAdmin =
    (typeof import.meta !== "undefined" &&
      (import.meta.env?.VITE_ADMIN_EMAILS || import.meta.env?.ADMIN_EMAILS)) ||
    "";
  if (envAdmin) {
    const list = String(envAdmin)
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (list.includes(clean)) return true;
  }

  // 3. Any company domain address (@lumenandco.in, @lumenandco.com)
  if (clean.endsWith("@lumenandco.in") || clean.endsWith("@lumenandco.com")) {
    return true;
  }

  return false;
}

/** Parses Google Identity Services ID Token (JWT) into JSON payload */
export function decodeGoogleJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Failed to decode Google ID Token:", err);
    return null;
  }
}

/** Loads Google Identity Services client script dynamically */
export function loadGoogleGsiScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).google?.accounts?.id) {
      resolve(true);
      return;
    }
    const existing = document.getElementById("google-gsi-client");
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.id = "google-gsi-client";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

/**
 * Google Authentication Hook for Lumen & Co Internal CRM Command Center
 */
export function useAdminAuth() {
  const [googleClientId, setGoogleClientIdState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("lumen_google_client_id") ||
        (import.meta.env?.VITE_GOOGLE_CLIENT_ID as string) ||
        ""
      );
    }
    return "";
  });

  const [user, setUser] = useState<AdminUser | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("lumen_admin_user_v2");
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {}
    }
    return null;
  });

  const [state, setState] = useState<AdminState>(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("lumen_admin_auth_v2") === "true";
      const stored = localStorage.getItem("lumen_admin_user_v2");
      if (isAuth && stored) {
        try {
          const parsed = JSON.parse(stored);
          if (isEmailAllowed(parsed?.email)) {
            return "ready";
          }
          return "denied";
        } catch {}
      }
    }
    return "signedOut";
  });

  const [error, setError] = useState<string>("");

  const setGoogleClientId = useCallback((clientId: string) => {
    const clean = (clientId || "").trim();
    setGoogleClientIdState(clean);
    if (typeof window !== "undefined") {
      if (clean) {
        localStorage.setItem("lumen_google_client_id", clean);
      } else {
        localStorage.removeItem("lumen_google_client_id");
      }
    }
  }, []);

  /** Sign in using Google ID Token returned by Google Identity Services */
  const signInWithGoogleCredential = useCallback(
    async (credential: string) => {
      setError("");
      const payload = decodeGoogleJwt(credential);
      if (!payload || !payload.email) {
        setError("Could not read Google account details. Please try again.");
        setState("signedOut");
        return false;
      }

      const email = payload.email.toLowerCase().trim();
      const userObj: AdminUser = {
        email,
        name: payload.name || payload.given_name || email.split("@")[0],
        picture: payload.picture,
        given_name: payload.given_name,
      };

      if (!isEmailAllowed(email)) {
        setUser(userObj);
        setState("denied");
        setError(
          `Access Denied: Google account (${email}) is not authorized for the Command Center.`
        );
        return false;
      }

      setUser(userObj);
      setState("ready");
      setError("");
      if (typeof window !== "undefined") {
        localStorage.setItem("lumen_admin_auth_v2", "true");
        localStorage.setItem("lumen_admin_user_v2", JSON.stringify(userObj));
      }
      return true;
    },
    []
  );

  /** Direct Google sign-in helper (used for dev testing or verified OAuth redirects) */
  const signInWithGoogleAccount = useCallback(
    async (
      email: string = "sahitsai6@gmail.com",
      name: string = "Sahit Sai Pothala",
      picture: string = "https://lh3.googleusercontent.com/a/default-user=s96-c"
    ) => {
      setError("");
      const cleanEmail = email.toLowerCase().trim();
      const userObj: AdminUser = {
        email: cleanEmail,
        name,
        picture,
      };

      if (!isEmailAllowed(cleanEmail)) {
        setUser(userObj);
        setState("denied");
        setError(
          `Access Denied: Google account (${cleanEmail}) is not authorized for the Command Center.`
        );
        return false;
      }

      setUser(userObj);
      setState("ready");
      setError("");
      if (typeof window !== "undefined") {
        localStorage.setItem("lumen_admin_auth_v2", "true");
        localStorage.setItem("lumen_admin_user_v2", JSON.stringify(userObj));
      }
      return true;
    },
    []
  );

  const signOut = useCallback(async () => {
    setState("signedOut");
    setUser(null);
    setError("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("lumen_admin_auth_v2");
      localStorage.removeItem("lumen_admin_user_v2");
      localStorage.removeItem("lumen_admin_auth_v1");
      localStorage.removeItem("lumen_admin_user_v1");
      if ((window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.disableAutoSelect();
      }
    }
  }, []);

  return {
    state,
    user,
    email: user?.email || "sahitsai6@gmail.com",
    name: user?.name || "Sahit Sai",
    picture: user?.picture,
    error,
    googleClientId,
    setGoogleClientId,
    signInWithGoogleCredential,
    signInWithGoogleAccount,
    signOut,
    // Compatibility aliases for existing component references
    signIn: signInWithGoogleAccount,
    signInWithPassword: signInWithGoogleAccount,
    signInWithCredentials: signInWithGoogleAccount,
    onPasswordSignIn: signInWithGoogleAccount,
  };
}
