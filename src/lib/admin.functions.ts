import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAuth, isAdminEmail } from "@/lib/supabase-admin";

/** Tells the browser whether the signed-in account may use the private dashboards. */
export const checkAdmin = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data: unknown) => z.object({}).parse(data ?? {}))
  .handler(async ({ context }) => {
    const email = (context.claims as { email?: string } | null)?.email?.toLowerCase() ?? "";
    return { email, isAdmin: await isAdminEmail(email) };
  });
