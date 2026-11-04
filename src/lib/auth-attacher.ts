// Client-side middleware: attaches the signed-in user's token (Supabase or Google OAuth)
// to every server function call so the backend can verify it.
import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "./supabase-client";

export const attachAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
  let token: string | undefined;

  // 1. Check Supabase session
  try {
    const { data } = await supabase.auth.getSession();
    token = data.session?.access_token;
  } catch {}

  // 2. Fallback to Google OAuth session in localStorage
  if (!token && typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("lumen_admin_user_v2");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.token) token = parsed.token;
      }
    } catch {}
  }

  return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
});
