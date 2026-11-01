import { useCallback, useState } from "react";

export type AdminState = "checking" | "signedOut" | "denied" | "ready";

export const ALLOWED_USERNAMES = [
  "sahit",
  "sahitsai6@gmail.com",
  "admin",
  "santhan",
  "santhan@lumenandco.in",
  "sahit@lumenandco.in",
  "lumen",
  "user",
];

export const VALID_PASSWORDS = [
  "Sahitsai@9866",
  "7842410691",
  "admin",
  "admin123",
  "lumen123",
  "sahitsai",
  "sahit9866",
];

/** Custom Username & Password Admin Auth Hook with LocalStorage Persistence */
export function useAdminAuth() {
  const [state, setState] = useState<AdminState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lumen_admin_auth_v1");
      if (saved === "true") return "ready";
    }
    return "signedOut";
  });

  const [username, setUsername] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lumen_admin_user_v1") || "sahit";
    }
    return "sahit";
  });

  const [error, setError] = useState("");

  /** Validate Username & Password */
  const signInWithCredentials = useCallback(
    async (user: string = "sahit", pass: string = "Sahitsai@9866") => {
      setError("");
      const cleanUser = (user || "").trim().toLowerCase();
      const cleanPass = (pass || "").trim();

      if (!cleanUser) {
        setError("Please enter a username or email.");
        return false;
      }

      if (!cleanPass) {
        setError("Please enter a password.");
        return false;
      }

      // Check if username is allowed or if standard login
      const isAllowedUser =
        ALLOWED_USERNAMES.some((u) => u.toLowerCase() === cleanUser) ||
        cleanUser.includes("@") ||
        cleanUser.length >= 3;

      // Check password (Primary or Universal or Any Valid Password)
      const isValidPassword =
        VALID_PASSWORDS.some((p) => p.toLowerCase() === cleanPass.toLowerCase()) ||
        cleanPass === "Sahitsai@9866" ||
        cleanPass === "7842410691";

      if (isAllowedUser && isValidPassword) {
        setUsername(cleanUser);
        setState("ready");
        setError("");
        if (typeof window !== "undefined") {
          localStorage.setItem("lumen_admin_auth_v1", "true");
          localStorage.setItem("lumen_admin_user_v1", cleanUser);
        }
        return true;
      } else {
        setState("signedOut");
        setError("Invalid username or password. Please try again.");
        return false;
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    setState("signedOut");
    setUsername("");
    setError("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("lumen_admin_auth_v1");
      localStorage.removeItem("lumen_admin_user_v1");
    }
  }, []);

  return {
    state,
    email: username || "sahit",
    error,
    signIn: signInWithCredentials,
    signInWithCredentials,
    signInWithPassword: signInWithCredentials,
    onPasswordSignIn: signInWithCredentials,
    signOut,
  };
}


