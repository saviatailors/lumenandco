// Browser client for your own Supabase project (not Lovable Cloud).
// The publishable key is safe to ship to the browser — row level security
// on your Supabase project is what protects the data.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const SUPABASE_URL = "https://ufgucizbwhsoctkvexvw.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_1KvW2POsLGSC-Q2I-9_v2A__C_E_iuj";

function isOpaqueKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

/** Opaque sb_publishable_ keys must travel in the apikey header, not as a bearer token. */
export function keyAwareFetch(key: string, extra?: HeadersInit): typeof fetch {
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

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  global: { fetch: keyAwareFetch(SUPABASE_PUBLISHABLE_KEY) },
  auth: { persistSession: true, autoRefreshToken: true },
});
