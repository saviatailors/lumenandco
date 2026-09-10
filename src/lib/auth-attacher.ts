// Client-side middleware: attaches the signed-in user's token to every
// server function call so the backend can verify it against your Supabase.
import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "./supabase-client";

export const attachAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
});
