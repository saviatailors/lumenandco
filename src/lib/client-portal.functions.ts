import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Returns every enquiry that belongs to the signed-in client's email address. */
export const getMyEnquiries = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = (context.claims as { email?: string } | null)?.email ?? "";
    if (!email) return { email: "", enquiries: [] };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select(
        "id, name, email, company, website, budget, goal, message, status, next_steps, created_at",
      )
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);

    if (data?.[0]) {
      await supabaseAdmin.from("lead_events").insert({
        lead_id: data[0].id,
        kind: "open",
        detail: "Client signed in and viewed their dashboard",
        actor: "client",
      });
    }

    return { email, enquiries: data ?? [] };
  });
