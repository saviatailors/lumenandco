import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAuth, supabaseAdmin, isAdminEmail } from "@/lib/supabase-admin";

// --- LEAD STAGES & SOURCES ---
export const ADVANCED_LEAD_STAGES = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "negotiating",
  "won",
  "lost",
] as const;

export type AdvancedLeadStage = typeof ADVANCED_LEAD_STAGES[number];

export const STAGE_LABELS: Record<AdvancedLeadStage, string> = {
  new: "New Lead",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal_sent: "Proposal Sent",
  negotiating: "Negotiating",
  won: "Won (Client Converted)",
  lost: "Lost",
};

export const LEAD_SOURCES = [
  "referral",
  "cold_outreach",
  "inbound",
  "instagram_dm",
  "website",
  "other",
] as const;

export type LeadSource = typeof LEAD_SOURCES[number];

export type AdvancedLead = {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  source: LeadSource;
  stage: AdvancedLeadStage;
  estimated_deal_value: number; // e.g. 5000/mo
  probability_to_close: number; // e.g. 0.7 (70%)
  assigned_to_staff_id: string;
  assigned_to_name: string;
  next_action: string;
  next_action_date: string;
  lead_score: number; // 0-100 auto-calculated
  lead_temp: "hot" | "warm" | "cold";
  lost_reason?: string;
  converted_client_id?: string;
  created_at: string;
};

// --- CONTRACT & HISTORY ---
export type Contract = {
  id: string;
  client_id: string;
  package_name: string;
  services_included: string[];
  monthly_value: number; // e.g. 6500
  billing_cycle: "monthly" | "quarterly" | "annual";
  start_date: string;
  renewal_date: string;
  auto_renew: boolean;
  status: "active" | "pending_renewal" | "expired" | "cancelled";
  version: number;
};

export type ContractHistory = {
  id: string;
  contract_id: string;
  version: number;
  change_type: "initial" | "upgrade" | "downgrade" | "renewal" | "pricing_adjustment";
  previous_monthly_value: number;
  new_monthly_value: number;
  changed_by: string;
  timestamp: string;
};

// --- INVOICES & PAYMENTS ---
export type InvoiceItem = {
  description: string;
  amount_cents: number;
};

export type Invoice = {
  id: string;
  invoice_number: string; // e.g. INV-2026-001
  client_id: string;
  client_name: string;
  contract_id: string;
  line_items: InvoiceItem[];
  amount_cents: number;
  status: "draft" | "sent" | "paid" | "overdue" | "void";
  due_date: string;
  paid_date?: string;
  created_at: string;
};

export type Expense = {
  id: string;
  client_id?: string;
  client_name?: string;
  category: "ad_spend" | "freelancer" | "tools" | "other";
  amount_cents: number;
  description: string;
  date: string;
};

export type StaffCostRate = {
  staff_id: string;
  staff_name: string;
  hourly_cost_cents: number; // e.g. 5000 = $50/hr
};

export const SEED_STAFF_COST_RATES: StaffCostRate[] = [];

// --- CLIENT PROFITABILITY MARGIN MODEL ---
export type ClientProfitability = {
  client_id: string;
  company_name: string;
  monthly_revenue: number;
  delivery_hub_hours_logged: number;
  labor_cost: number;
  allocated_expenses: number;
  net_profit_margin: number;
  margin_percentage: number;
};

// --- COMPOSITE CHURN INTELLIGENCE HEALTH MODEL ---
export type CompositeHealthScore = {
  client_id: string;
  company_name: string;
  execution_score: number; // From Delivery Hub (on-time rate %, revision rate %)
  financial_score: number; // Payment history, overdue counts
  engagement_score: number; // Recency of contact & meetings
  composite_score: number; // 0-100 composite
  churn_risk_level: "low" | "medium" | "high" | "critical";
  contributing_factors: string[];
  suggested_retention_action: string;
};

// --- SEED ADVANCED LEADS ---
export const INITIAL_ADVANCED_LEADS: AdvancedLead[] = [];

// --- SEED CONTRACTS & INVOICES ---
export const INITIAL_CONTRACTS: Contract[] = [];

export const INITIAL_INVOICES: Invoice[] = [];

export const INITIAL_EXPENSES: Expense[] = [];

function admin() {
  return supabaseAdmin();
}

async function requireAdmin(claims: unknown) {
  const email = (claims as { email?: string } | null)?.email?.toLowerCase() ?? "";
  if (!(await isAdminEmail(email))) {
    throw new Error("Not an admin account");
  }
  return email;
}

const STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;

export const listLeads = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => z.object({}).parse(data ?? {}))
  .handler(async ({ context }) => {
    await requireAdmin((context as any)?.claims);
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
  .validator((data) =>
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
    await requireAdmin((context as any)?.claims);
    const supabase = admin();
    const patch: { status?: string; notes?: string; next_steps?: string } = {};
    if (data.status) patch.status = data.status;
    if (typeof data.notes === "string") patch.notes = data.notes;
    if (typeof data.next_steps === "string") patch.next_steps = data.next_steps;

    const { error } = await supabase.from("leads").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listLeadEvents = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await requireAdmin((context as any)?.claims);
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

export const logLeadOpened = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await requireAdmin((context as any)?.claims);
    return { ok: true };
  });

export const deleteLead = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await requireAdmin((context as any)?.claims);
    const supabase = admin();
    const { error } = await supabase.from("leads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const KINDS = ["reel", "creative"] as const;

export const listMedia = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => z.object({}).parse(data ?? {}))
  .handler(async ({ context }) => {
    await requireAdmin((context as any)?.claims);
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
  .validator((data) =>
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
    await requireAdmin((context as any)?.claims);
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
  .validator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await requireAdmin((context as any)?.claims);
    const supabase = admin();
    const { error } = await supabase.from("site_media").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const VIDEO_BUCKET = "site-videos";

export const createVideoUpload = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) =>
    z
      .object({
        filename: z.string().trim().min(1).max(200),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin((context as any)?.claims);
    const supabase = admin();
    const safe = data.filename.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80);
    const path = `${Date.now()}-${safe}`;
    const { data: ticket, error } = await supabase.storage
      .from(VIDEO_BUCKET)
      .createSignedUploadUrl(path);
    if (error || !ticket) throw new Error(error?.message ?? "Could not start the upload");
    return { path: ticket.path, token: ticket.token, bucket: VIDEO_BUCKET };
  });

export const deleteVideoFile = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => z.object({ path: z.string().trim().min(1).max(400) }).parse(data))
  .handler(async ({ data, context }) => {
    await requireAdmin((context as any)?.claims);
    const supabase = admin();
    const { error } = await supabase.storage.from(VIDEO_BUCKET).remove([data.path]);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const PORTAL_FIELDS =
  "id, name, email, company, website, budget, goal, message, status, next_steps, created_at";

export const getLeadPortal = createServerFn({ method: "POST" })
  .validator((data) => z.object({ token: z.string().trim().min(16).max(80) }).parse(data))
  .handler(async ({ data }) => {
    const supabase = admin();
    const { data: row, error } = await supabase
      .from("leads")
      .select(PORTAL_FIELDS)
      .eq("portal_token", data.token)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("We couldn't find that enquiry.");

    const { data: all } = await supabase
      .from("leads")
      .select(PORTAL_FIELDS)
      .eq("email", row.email)
      .order("created_at", { ascending: false })
      .limit(50);

    const enquiries = all?.length ? all : [row];
    return { lead: row, enquiries };
  });
