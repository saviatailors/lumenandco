import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAuth, supabaseAdmin } from "@/lib/supabase.server";

const STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;

/** Only the accounts listed in the ADMIN_EMAILS setting may use the dashboard. */
function adminEmails() {
  return (process.env["ADMIN_EMAILS"] ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function requireAdmin(claims: unknown) {
  const email = (claims as { email?: string } | null)?.email?.toLowerCase() ?? "";
  if (!email || !adminEmails().includes(email)) {
    throw new Error("Not an admin account");
  }
  return email;
}

async function logEvent(
  supabase: Awaited<ReturnType<typeof admin>>,
  lead_id: string,
  kind: string,
  detail: string,
  actor: "team" | "client" = "team",
) {
  await supabase.from("lead_events").insert({ lead_id, kind, detail, actor });
}

function admin() {
  return supabaseAdmin();
}

export const listLeads = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data) => z.object({}).parse(data ?? {}))
  .handler(async ({ context }) => {
    await requireAdmin(context.claims);
    const supabase = admin();
    const { data: rows, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { leads: rows ?? [] };
  });

export const updateLead = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(STATUSES).optional(),
        notes: z.string().max(4000).optional(),
        next_steps: z.string().max(4000).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context.claims);
    const supabase = admin();
    const patch: { status?: string; notes?: string; next_steps?: string } = {};
    if (data.status) patch.status = data.status;
    if (typeof data.notes === "string") patch.notes = data.notes;
    if (typeof data.next_steps === "string") patch.next_steps = data.next_steps;

    const { data: before } = await supabase
      .from("leads")
      .select("status, notes, next_steps")
      .eq("id", data.id)
      .maybeSingle();

    const { error } = await supabase.from("leads").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);

    if (patch.status && patch.status !== before?.status) {
      await logEvent(
        supabase,
        data.id,
        "stage",
        `Stage moved from ${before?.status ?? "new"} to ${patch.status}`,
      );
    }
    if (typeof patch.notes === "string" && patch.notes !== (before?.notes ?? "")) {
      await logEvent(supabase, data.id, "note", patch.notes.trim() ? "Internal note updated" : "Internal note cleared");
    }
    if (typeof patch.next_steps === "string" && patch.next_steps !== (before?.next_steps ?? "")) {
      await logEvent(supabase, data.id, "next_steps", "Next steps for the client updated");
    }
    return { ok: true };
  });

/** Dashboard: the activity history for one enquiry. */
export const listLeadEvents = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context.claims);
    const supabase = admin();
    const { data: rows, error } = await supabase
      .from("lead_events")
      .select("id, kind, detail, actor, created_at")
      .eq("lead_id", data.id)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { events: rows ?? [] };
  });

/** Dashboard: records that the team opened an enquiry. */
export const logLeadOpened = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context.claims);
    const supabase = admin();
    await logEvent(supabase, data.id, "open", "Enquiry opened in the dashboard");
    return { ok: true };
  });

export const deleteLead = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context.claims);
    const supabase = admin();
    const { error } = await supabase.from("leads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const KINDS = ["reel", "creative"] as const;

export const listMedia = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data) => z.object({}).parse(data ?? {}))
  .handler(async ({ context }) => {
    await requireAdmin(context.claims);
    const supabase = admin();
    const { data: rows, error } = await supabase
      .from("site_media")
      .select("*")
      .order("kind", { ascending: true })
      .order("sort_order", { ascending: true })
      .limit(200);
    if (error) throw new Error(error.message);
    return { media: rows ?? [] };
  });

export const saveMedia = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data) =>
    z
      .object({
        id: z.string().uuid().optional(),
        kind: z.enum(KINDS),
        src: z.string().trim().min(1).max(600),
        title: z.string().trim().max(120).default(""),
        subtitle: z.string().trim().max(120).default(""),
        poster: z.string().trim().max(600).default(""),
        sort_order: z.number().int().min(0).max(9999).default(0),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context.claims);
    const supabase = admin();
    const row = {
      kind: data.kind,
      src: data.src,
      title: data.title,
      subtitle: data.subtitle,
      poster: data.poster,
      sort_order: data.sort_order,
    };
    if (data.id) {
      const { error } = await supabase.from("site_media").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("site_media").insert(row);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context.claims);
    const supabase = admin();
    const { error } = await supabase.from("site_media").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const VIDEO_BUCKET = "site-videos";

/** Creates a one-off upload ticket so the dashboard can send a video file straight to storage. */
export const createVideoUpload = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data) =>
    z
      .object({
        filename: z.string().trim().min(1).max(200),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context.claims);
    const supabase = admin();
    const safe = data.filename.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80);
    const path = `${Date.now()}-${safe}`;
    const { data: ticket, error } = await supabase.storage
      .from(VIDEO_BUCKET)
      .createSignedUploadUrl(path);
    if (error || !ticket) throw new Error(error?.message ?? "Could not start the upload");
    return { path: ticket.path, token: ticket.token, bucket: VIDEO_BUCKET };
  });

/** Removes an uploaded video file from storage. */
export const deleteVideoFile = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data) =>
    z.object({ path: z.string().trim().min(1).max(400) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context.claims);
    const supabase = admin();
    const { error } = await supabase.storage.from(VIDEO_BUCKET).remove([data.path]);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const PORTAL_FIELDS =
  "id, name, email, company, website, budget, goal, message, status, next_steps, created_at";

/** Public: looks up a client's enquiries from their private portal link code. */
export const getLeadPortal = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ token: z.string().trim().min(16).max(80) }).parse(data),
  )
  .handler(async ({ data }) => {
    const supabase = admin();
    const { data: row, error } = await supabase
      .from("leads")
      .select(PORTAL_FIELDS)
      .eq("portal_token", data.token)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("We couldn't find that enquiry.");

    // Every enquiry sent from the same email belongs to the same client.
    const { data: all } = await supabase
      .from("leads")
      .select(PORTAL_FIELDS)
      .eq("email", row.email)
      .order("created_at", { ascending: false })
      .limit(50);

    const enquiries = all?.length ? all : [row];
    await logEvent(supabase, row.id, "open", "Client opened their dashboard", "client");
    return { lead: row, enquiries };
  });
