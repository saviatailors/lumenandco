// Server-only Supabase helpers for your own project. Never import this from
// browser code — it reads the secret service key from the environment.
import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const SUPABASE_URL = "https://ufgucizbwhsoctkvexvw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_1KvW2POsLGSC-Q2I-9_v2A__C_E_iuj";

function isOpaqueKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

/** Opaque sb_* keys must travel in the apikey header, not as a bearer token. */
function keyAwareFetch(key: string, extra?: HeadersInit): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) new Headers(init.headers).forEach((v, k) => headers.set(k, v));
    if (extra) new Headers(extra).forEach((v, k) => headers.set(k, v));
    if (isOpaqueKey(key) && headers.get("Authorization") === `Bearer ${key}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };
}

/** Privileged client — bypasses row level security. Server handlers only. */
export function supabaseAdmin() {
  const key = process.env["EXTERNAL_SUPABASE_SERVICE_KEY"];
  if (!key) {
    throw new Error(
      "Missing EXTERNAL_SUPABASE_SERVICE_KEY secret. Add the service key from your Supabase project settings.",
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
