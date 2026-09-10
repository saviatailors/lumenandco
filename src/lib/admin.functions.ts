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

/** True when the address holds an admin role in the database, or is in ADMIN_EMAILS. */
export async function isAdminEmail(email: string) {
  const mail = email.trim().toLowerCase();
  if (!mail) return false;
  if (adminEmailList().includes(mail)) return true;
  try {
    const { supabaseAdmin } = await import("@/lib/supabase.server");
    const { data } = await supabaseAdmin()
      .from("admin_users")
      .select("email, role")
      .ilike("email", mail)
      .maybeSingle();
    return Boolean(data && (data as { role?: string }).role === "admin");
  } catch {
    return false;
  }
}

/** Tells the browser whether the signed-in account may use the private dashboards. */
export const checkAdmin = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data) => z.object({}).parse(data ?? {}))
  .handler(async ({ context }) => {
    const email = (context.claims as { email?: string } | null)?.email?.toLowerCase() ?? "";
    return { email, isAdmin: await isAdminEmail(email) };
  });
