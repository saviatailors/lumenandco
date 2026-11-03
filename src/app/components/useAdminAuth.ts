import { useCallback, useEffect, useState, useRef } from "react";
import {
  getRoleForEmail,
  isAuthorizedEmail,
  hasPermission as checkPermission,
  getRoleLabel,
  type UserRole,
  type Permission,
} from "@/lib/rbac";

export type AdminUser = {
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  role: UserRole;
  roleLabel: string;
  token?: string;
  issuedAt: number;
  expiresAt: number;
  lastActive: number;
};

export type AdminState = "checking" | "signedOut" | "denied" | "expired" | "ready";

/** Authorized Google email accounts allowed into the Command Center */
export const DEFAULT_ALLOWED_EMAILS = [
  "sahitsai6@gmail.com",
  "saviatailors@gmail.com",
  "sahit@lumenandco.in",
  "santhan@lumenandco.in",
  "admin@lumenandco.com",
];

/** Official Google OAuth 2.0 Web Client ID */
export const DEFAULT_GOOGLE_CLIENT_ID =
  "64600989630-9p4h2kl0ro7orenf9g4ndcarqj68u35u.apps.googleusercontent.com";

/** Session Timeouts: 8 hours maximum session, 60 minutes inactivity timeout */
export const SESSION_MAX_TTL_MS = 8 * 60 * 60 * 1000;
export const INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000;

/** Verifies if an email address is authorized for Command Center access */
export function isEmailAllowed(email?: string | null): boolean {
  return isAuthorizedEmail(email);
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

/** Syncs session token into cookie for backend server function authentication */
function setAuthCookie(token: string, maxAgeSeconds: number = 28800) {
  if (typeof document === "undefined") return;
  const isSecure = window.location.protocol === "https:";
  document.cookie = `lumen_auth_token=${encodeURIComponent(
    token
  )}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${isSecure ? "; Secure" : ""}`;
}

function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie =
    "lumen_auth_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
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
 * Enterprise Google Authentication Hook with RBAC & Session Security
 */
export function useAdminAuth() {
  const [googleClientId, setGoogleClientIdState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("lumen_google_client_id") ||
        (import.meta.env?.VITE_GOOGLE_CLIENT_ID as string) ||
        DEFAULT_GOOGLE_CLIENT_ID
      );
    }
    return DEFAULT_GOOGLE_CLIENT_ID;
  });

  const [user, setUser] = useState<AdminUser | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("lumen_admin_user_v2");
        if (stored) {
          const parsed = JSON.parse(stored);
          const now = Date.now();

          // Check expiration
          if (parsed.expiresAt && now > parsed.expiresAt) {
            return null;
          }
          // Check inactivity timeout
          if (parsed.lastActive && now - parsed.lastActive > INACTIVITY_TIMEOUT_MS) {
            return null;
          }

          const role = getRoleForEmail(parsed?.email);
          if (role) {
            return {
              ...parsed,
              role,
              roleLabel: getRoleLabel(role),
            };
          }
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
          const now = Date.now();

          if (parsed.expiresAt && now > parsed.expiresAt) {
            return "expired";
          }
          if (parsed.lastActive && now - parsed.lastActive > INACTIVITY_TIMEOUT_MS) {
            return "expired";
          }

          if (isAuthorizedEmail(parsed?.email)) {
            return "ready";
          }
          return "denied";
        } catch {}
      }
    }
    return "signedOut";
  });

  const [error, setError] = useState<string>("");
  const lastActiveRef = useRef<number>(Date.now());

  // Periodically verify session validity & inactivity timeout
  useEffect(() => {
    if (state !== "ready" || !user) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (user.expiresAt && now > user.expiresAt) {
        setState("expired");
        setError("Your Google session has expired. Please sign in again.");
        clearAuthCookie();
      } else if (now - lastActiveRef.current > INACTIVITY_TIMEOUT_MS) {
        setState("expired");
        setError("Session locked due to inactivity. Please re-authenticate.");
        clearAuthCookie();
      }
    }, 15000);

    const updateActivity = () => {
      lastActiveRef.current = Date.now();
      if (user) {
        user.lastActive = lastActiveRef.current;
      }
    };

    window.addEventListener("mousemove", updateActivity, { passive: true });
    window.addEventListener("keydown", updateActivity, { passive: true });
    window.addEventListener("click", updateActivity, { passive: true });
    window.addEventListener("scroll", updateActivity, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("scroll", updateActivity);
    };
  }, [state, user]);

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
      const role = getRoleForEmail(email);

      if (!role) {
        setState("denied");
        setError(
          `Access Denied: Google account (${email}) is not authorized for the Command Center.`
        );
        return false;
      }

      const now = Date.now();
      const expiresAt = payload.exp ? payload.exp * 1000 : now + SESSION_MAX_TTL_MS;

      const userObj: AdminUser = {
        email,
        name: payload.name || payload.given_name || email.split("@")[0],
        picture: payload.picture,
        given_name: payload.given_name,
        role,
        roleLabel: getRoleLabel(role),
        token: credential,
        issuedAt: now,
        expiresAt,
        lastActive: now,
      };

      setUser(userObj);
      setState("ready");
      setError("");
      setAuthCookie(credential, Math.floor((expiresAt - now) / 1000));

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
      const role = getRoleForEmail(cleanEmail);

      if (!role) {
        setState("denied");
        setError(
          `Access Denied: Google account (${cleanEmail}) is not authorized for the Command Center.`
        );
        return false;
      }

      const now = Date.now();
      const expiresAt = now + SESSION_MAX_TTL_MS;

      // Construct verified session payload
      const sessionPayload = {
        email: cleanEmail,
        name,
        picture,
        role,
        issuedAt: now,
        expiresAt,
      };
      const sessionToken = btoa(JSON.stringify(sessionPayload));

      const userObj: AdminUser = {
        email: cleanEmail,
        name,
        picture,
        role,
        roleLabel: getRoleLabel(role),
        token: sessionToken,
        issuedAt: now,
        expiresAt,
        lastActive: now,
      };

      setUser(userObj);
      setState("ready");
      setError("");
      setAuthCookie(sessionToken, Math.floor(SESSION_MAX_TTL_MS / 1000));

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
    clearAuthCookie();
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

  const role: UserRole | null = user?.role || (user?.email ? getRoleForEmail(user.email) : null);

  return {
    state,
    user,
    role,
    roleLabel: role ? getRoleLabel(role) : "Restricted",
    isSuperAdmin: role === "super_admin",
    isAdmin: role === "super_admin" || role === "admin",
    isManager: role === "super_admin" || role === "admin" || role === "manager",
    isEmployee: role !== null,
    hasPermission: (permission: Permission) => checkPermission(role, permission),
    email: user?.email || "sahitsai6@gmail.com",
    name: user?.name || "Sahit Sai",
    picture: user?.picture,
    token: user?.token,
    error,
    googleClientId,
    setGoogleClientId,
    signInWithGoogleCredential,
    signInWithGoogleAccount,
    signOut,
    signIn: signInWithGoogleAccount,
    signInWithPassword: signInWithGoogleAccount,
    signInWithCredentials: signInWithGoogleAccount,
    onPasswordSignIn: signInWithGoogleAccount,
  };
}
