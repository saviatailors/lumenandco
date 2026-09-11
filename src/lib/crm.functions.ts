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

export const SEED_STAFF_COST_RATES: StaffCostRate[] = [
  { staff_id: "staff-1", staff_name: "Alex Rivers", hourly_cost_cents: 6500 }, // $65/hr
  { staff_id: "staff-2", staff_name: "Sarah Chen", hourly_cost_cents: 5500 },  // $55/hr
  { staff_id: "staff-3", staff_name: "David Miller", hourly_cost_cents: 5000 },// $50/hr
  { staff_id: "staff-4", staff_name: "Elena Rostova", hourly_cost_cents: 4500 },// $45/hr
  { staff_id: "staff-5", staff_name: "Michael Chang", hourly_cost_cents: 5000 },// $50/hr
];

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
export const INITIAL_ADVANCED_LEADS: AdvancedLead[] = [
  {
    id: "lead-777",
    company_name: "Sahit Co & Enterprise",
    contact_name: "Sahit Sai",
    contact_email: "sahitsai7@gmail.com",
    contact_phone: "+1 (555) 777-9999",
    source: "inbound",
    stage: "won",
    estimated_deal_value: 12000,
    probability_to_close: 1.0,
    assigned_to_staff_id: "staff-1",
    assigned_to_name: "Alex Rivers",
    next_action: "Omnichannel Retainer execution & Client Portal access active",
    next_action_date: "2026-09-10",
    lead_score: 98,
    lead_temp: "hot",
    created_at: "2026-09-10T09:00:00Z",
  },
  {
    id: "lead-201",
    company_name: "Pulse Athletics",
    contact_name: "Jason Vance",
    contact_email: "jason@pulseathletics.com",
    contact_phone: "+1 (555) 392-1049",
    source: "inbound",
    stage: "negotiating",
    estimated_deal_value: 7500,
    probability_to_close: 0.85,
    assigned_to_staff_id: "staff-1",
    assigned_to_name: "Alex Rivers",
    next_action: "Final contract signature call",
    next_action_date: "2026-09-11",
    lead_score: 92,
    lead_temp: "hot",
    created_at: "2026-09-01T10:00:00Z",
  },
  {
    id: "lead-202",
    company_name: "Solace Wellness",
    contact_name: "Amanda Hays",
    contact_email: "amanda@solacewellness.co",
    contact_phone: "+1 (555) 839-2011",
    source: "referral",
    stage: "proposal_sent",
    estimated_deal_value: 5200,
    probability_to_close: 0.70,
    assigned_to_staff_id: "staff-1",
    assigned_to_name: "Alex Rivers",
    next_action: "Follow-up on proposal deck",
    next_action_date: "2026-09-12",
    lead_score: 84,
    lead_temp: "hot",
    created_at: "2026-09-03T14:00:00Z",
  },
  {
    id: "lead-203",
    company_name: "Apex Gaming Gear",
    contact_name: "Tyler Cross",
    contact_email: "tyler@apexgaming.io",
    contact_phone: "+1 (555) 491-0022",
    source: "cold_outreach",
    stage: "qualified",
    estimated_deal_value: 4000,
    probability_to_close: 0.50,
    assigned_to_staff_id: "staff-1",
    assigned_to_name: "Alex Rivers",
    next_action: "Schedule strategy discovery call",
    next_action_date: "2026-09-14",
    lead_score: 62,
    lead_temp: "warm",
    created_at: "2026-09-05T09:00:00Z",
  },
  {
    id: "lead-204",
    company_name: "Luxe Botanical",
    contact_name: "Claire Bennett",
    contact_email: "claire@luxebotanical.com",
    contact_phone: "+1 (555) 771-3304",
    source: "instagram_dm",
    stage: "contacted",
    estimated_deal_value: 3200,
    probability_to_close: 0.30,
    assigned_to_staff_id: "staff-1",
    assigned_to_name: "Alex Rivers",
    next_action: "Send audit video recording",
    next_action_date: "2026-09-13",
    lead_score: 48,
    lead_temp: "cold",
    created_at: "2026-09-07T11:00:00Z",
  },
  {
    id: "lead-205",
    company_name: "Titan Footwear",
    contact_name: "Marcus Brody",
    contact_email: "m.brody@titanfootwear.com",
    contact_phone: "+1 (555) 902-1144",
    source: "website",
    stage: "new",
    estimated_deal_value: 8000,
    probability_to_close: 0.20,
    assigned_to_staff_id: "staff-1",
    assigned_to_name: "Alex Rivers",
    next_action: "Initial outreach & audit offer",
    next_action_date: "2026-09-10",
    lead_score: 55,
    lead_temp: "warm",
    created_at: "2026-09-09T08:00:00Z",
  },
  {
    id: "lead-206",
    company_name: "Strata Coffee Roasters",
    contact_name: "Kevin Dunn",
    contact_email: "kevin@stratacoffee.com",
    contact_phone: "+1 (555) 441-2099",
    source: "cold_outreach",
    stage: "lost",
    estimated_deal_value: 3000,
    probability_to_close: 0,
    assigned_to_staff_id: "staff-1",
    assigned_to_name: "Alex Rivers",
    next_action: "None",
    next_action_date: "2026-09-01",
    lead_score: 20,
    lead_temp: "cold",
    lost_reason: "Budget constraints — hired in-house junior designer",
    created_at: "2026-08-20T10:00:00Z",
  },
];

// --- SEED CONTRACTS & INVOICES ---
export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: "ctr-101",
    client_id: "client-1",
    package_name: "Scale Retainer",
    services_included: ["Paid Social Ads", "Video Creative Studio", "CRO & Analytics"],
    monthly_value: 6500,
    billing_cycle: "monthly",
    start_date: "2026-01-15",
    renewal_date: "2026-10-15",
    auto_renew: true,
    status: "active",
    version: 2,
  },
  {
    id: "ctr-102",
    client_id: "client-2",
    package_name: "Growth Retainer",
    services_included: ["Gen AI Ads", "Email Marketing", "Creative Studio"],
    monthly_value: 4200,
    billing_cycle: "monthly",
    start_date: "2026-03-01",
    renewal_date: "2026-09-30", // Upcoming renewal!
    auto_renew: true,
    status: "pending_renewal",
    version: 1,
  },
  {
    id: "ctr-103",
    client_id: "client-3",
    package_name: "Creative Studio",
    services_included: ["Static & Carousel Banners", "UGC Hooks"],
    monthly_value: 3500,
    billing_cycle: "monthly",
    start_date: "2026-04-10",
    renewal_date: "2026-10-10",
    auto_renew: true,
    status: "active",
    version: 1,
  },
  {
    id: "ctr-104",
    client_id: "client-4",
    package_name: "SEO & Technical Growth",
    services_included: ["Technical SEO", "Schema Markup", "Content Clusters"],
    monthly_value: 2800,
    billing_cycle: "monthly",
    start_date: "2026-02-01",
    renewal_date: "2026-11-01",
    auto_renew: true,
    status: "active",
    version: 1,
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-301",
    invoice_number: "INV-2026-001",
    client_id: "client-1",
    client_name: "Northbeam Outdoors",
    contract_id: "ctr-101",
    line_items: [{ description: "Monthly Scale Retainer - September 2026", amount_cents: 650000 }],
    amount_cents: 650000,
    status: "paid",
    due_date: "2026-09-01",
    paid_date: "2026-09-02",
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "inv-302",
    invoice_number: "INV-2026-002",
    client_id: "client-2",
    client_name: "Fable Skincare",
    contract_id: "ctr-102",
    line_items: [{ description: "Monthly Growth Retainer - September 2026", amount_cents: 420000 }],
    amount_cents: 420000,
    status: "overdue",
    due_date: "2026-09-05",
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "inv-303",
    invoice_number: "INV-2026-003",
    client_id: "client-3",
    client_name: "Kite & Co",
    contract_id: "ctr-103",
    line_items: [{ description: "Creative Studio Retainer - September 2026", amount_cents: 350000 }],
    amount_cents: 350000,
    status: "paid",
    due_date: "2026-09-05",
    paid_date: "2026-09-04",
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "inv-304",
    invoice_number: "INV-2026-004",
    client_id: "client-4",
    client_name: "Verda Organics",
    contract_id: "ctr-104",
    line_items: [{ description: "SEO Retainer - September 2026", amount_cents: 280000 }],
    amount_cents: 280000,
    status: "sent",
    due_date: "2026-09-15",
    created_at: "2026-09-01T00:00:00Z",
  },
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: "exp-1", client_id: "client-1", client_name: "Northbeam Outdoors", category: "ad_spend", amount_cents: 120000, description: "Stape.io CAPI server hosting", date: "2026-09-02" },
  { id: "exp-2", client_id: "client-2", client_name: "Fable Skincare", category: "tools", amount_cents: 35000, description: "Midjourney Pro subscription", date: "2026-09-03" },
];

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
    await requireAdmin(context.claims);
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

export const logLeadOpened = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.claims);
    return { ok: true };
  });

export const deleteLead = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => z.object({ id: z.string().uuid() }).parse(data))
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
  .validator((data) => z.object({}).parse(data ?? {}))
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
  .validator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.claims);
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

export const deleteVideoFile = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => z.object({ path: z.string().trim().min(1).max(400) }).parse(data))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.claims);
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
