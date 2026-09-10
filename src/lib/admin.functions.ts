import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAuth } from "@/lib/supabase.server";

/** Reads the allowed admin addresses from the ADMIN_EMAILS setting (comma separated). */
export function adminEmailList() {
  return (process.env["ADMIN_EMAILS"] ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

/** Tells the browser whether the signed-in account may use the private dashboards. */
export const checkAdmin = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data) => z.object({}).parse(data ?? {}))
  .handler(async ({ context }) => {
    const email = (context.claims as { email?: string } | null)?.email?.toLowerCase() ?? "";
    const allowed = adminEmailList();
    return { email, isAdmin: Boolean(email) && allowed.includes(email) };
  });
