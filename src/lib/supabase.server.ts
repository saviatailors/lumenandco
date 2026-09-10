// Server-only Supabase helpers for your own project. Never import this from
// browser code — it reads the secret service key from the environment.
import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, keyAwareFetch } from "./supabase-client";

/** Privileged client — bypasses row level security. Server handlers only. */
export function supabaseAdmin() {
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY secret. Add the service key from your Supabase project settings.",
    );
  }
  return createClient<Database>(SUPABASE_URL, key, {
    global: { fetch: keyAwareFetch(key) },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Function middleware: requires a signed-in user of YOUR Supabase project.
 * Validates the bearer token against your project and exposes
 * context.claims ({ email, sub }) to handlers.
 */
export const requireAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const request = getRequest();
  const authHeader = request?.headers.get("authorization");
  if (!authHeader) throw new Error("Unauthorized: No authorization header provided");

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) throw new Error("Unauthorized: No bearer token");

  const { data, error } = await supabaseAdmin().auth.getUser(token);
  if (error || !data.user) throw new Error("Unauthorized");

  return next({
    context: {
      claims: { email: data.user.email ?? undefined, sub: data.user.id },
      userId: data.user.id,
    },
  });
});

/** Client acting as the signed-in user (row level security applies). */
export function supabaseAsUser(token: string) {
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: { fetch: keyAwareFetch(SUPABASE_PUBLISHABLE_KEY, { Authorization: `Bearer ${token}` }) },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
