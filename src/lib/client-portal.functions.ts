import { createServerFn } from "@tanstack/react-start";

import { requireAuth, supabaseAdmin } from "@/lib/supabase.server";

/** Returns every enquiry that belongs to the signed-in client's email address. */
export const getMyEnquiries = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .handler(async ({ context }) => {
    const email = (context.claims as { email?: string } | null)?.email ?? "";
    if (!email) return { email: "", enquiries: [] };

    const { data, error } = await supabaseAdmin()
      .from("leads")
      .select(
        "id, name, email, company, website, budget, goal, message, status, next_steps, created_at",
      )
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);

    if (data?.[0]) {
      await supabaseAdmin().from("lead_events").insert({
        lead_id: data[0].id,
        kind: "open",
        detail: "Client signed in and viewed their dashboard",
        actor: "client",
      });
    }

    return { email, enquiries: data ?? [] };
  });
