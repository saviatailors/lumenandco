import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAuth } from "@/lib/supabase.server";

/** Tells the browser whether the signed-in account may use the private dashboards. */
export const checkAdmin = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data) => z.object({}).parse(data ?? {}))
  .handler(async ({ context }) => {
    const { isAdminEmail } = await import("@/lib/supabase.server");
    const email = (context.claims as { email?: string } | null)?.email?.toLowerCase() ?? "";
    return { email, isAdmin: await isAdminEmail(email) };
  });
