// --- LUMEN & CO INTERNAL CRM TYPES & DATA MODELS ---

export type UserRole =
  | "owner"
  | "admin"
  | "ops_manager"
  | "account_manager"
  | "designer"
  | "editor"
  | "content_writer"
  | "ad_specialist"
  | "team"
  | "emp"
  | "employee";

export type RolePermission = {
  role: UserRole;
  label: string;
  can_toggle_access: boolean;
  can_bulk_suspend: boolean;
  can_manage_pricing: boolean;
  can_edit_templates: boolean;
  can_view_all_clients: boolean;
  can_send_reminders: boolean;
};

export const ROLE_PERMISSIONS: Record<string, RolePermission> = {
  owner: {
    role: "owner",
    label: "Founder & CEO",
    can_toggle_access: true,
    can_bulk_suspend: true,
    can_manage_pricing: true,
    can_edit_templates: true,
    can_view_all_clients: true,
    can_send_reminders: true,
  },
  admin: {
    role: "admin",
    label: "Operations Admin",
    can_toggle_access: true,
    can_bulk_suspend: false,
    can_manage_pricing: false,
    can_edit_templates: true,
    can_view_all_clients: true,
    can_send_reminders: true,
  },
  ops_manager: {
    role: "ops_manager",
    label: "Operations Manager",
    can_toggle_access: true,
    can_bulk_suspend: false,
    can_manage_pricing: false,
    can_edit_templates: true,
    can_view_all_clients: true,
    can_send_reminders: true,
  },
  account_manager: {
    role: "account_manager",
    label: "Account Manager Lead",
    can_toggle_access: false,
    can_bulk_suspend: false,
    can_manage_pricing: false,
    can_edit_templates: false,
    can_view_all_clients: true,
    can_send_reminders: true,
  },
  designer: {
    role: "designer",
    label: "Graphic & Brand Designer",
    can_toggle_access: false,
    can_bulk_suspend: false,
    can_manage_pricing: false,
    can_edit_templates: false,
    can_view_all_clients: false,
    can_send_reminders: true,
  },
  editor: {
    role: "editor",
    label: "Video Editor & Motion Lead",
    can_toggle_access: false,
    can_bulk_suspend: false,
    can_manage_pricing: false,
    can_edit_templates: false,
    can_view_all_clients: false,
    can_send_reminders: true,
  },
  content_writer: {
    role: "content_writer",
    label: "Senior Copywriter",
    can_toggle_access: false,
    can_bulk_suspend: false,
    can_manage_pricing: false,
    can_edit_templates: false,
    can_view_all_clients: false,
    can_send_reminders: true,
  },
  ad_specialist: {
    role: "ad_specialist",
    label: "Performance Ad Specialist",
    can_toggle_access: false,
    can_bulk_suspend: false,
    can_manage_pricing: false,
    can_edit_templates: false,
    can_view_all_clients: false,
    can_send_reminders: true,
  },
  team: {
    role: "team",
    label: "Team Member",
    can_toggle_access: false,
    can_bulk_suspend: false,
    can_manage_pricing: false,
    can_edit_templates: false,
    can_view_all_clients: false,
    can_send_reminders: true,
  },
  emp: {
    role: "emp",
    label: "Staff Employee",
    can_toggle_access: false,
    can_bulk_suspend: false,
    can_manage_pricing: false,
    can_edit_templates: false,
    can_view_all_clients: false,
    can_send_reminders: true,
  },
  employee: {
    role: "employee",
    label: "Staff Employee",
    can_toggle_access: false,
    can_bulk_suspend: false,
    can_manage_pricing: false,
    can_edit_templates: false,
    can_view_all_clients: false,
    can_send_reminders: true,
  },
};

export type ClientStatus = "active" | "paused" | "overdue" | "churned";
export type AccessStatus = "active" | "suspended";

export type SchoolClient = {
  id: string;
  school_name: string; // Brand / Company Name
  city: string; // Location / Market
  contact_person: string;
  contact_role: string;
  phone: string;
  email: string;
  services_subscribed: string[];
  package_tier: "Performance Starter" | "Growth Retainer" | "Scale Enterprise";
  monthly_retainer_rupees: number;
  start_date: string;
  billing_cycle: "monthly" | "quarterly" | "annual";
  status: ClientStatus;
  access_status: AccessStatus;
  assigned_staff_id: string;
  assigned_staff_name: string;
  notes?: string;
  created_at: string;
};

export type AccessAuditEntry = {
  id: string;
  client_id: string;
  school_name: string;
  previous_status: AccessStatus;
  new_status: AccessStatus;
  changed_by_name: string;
  changed_by_role: UserRole;
  reason: string;
  timestamp: string;
};

export type InvoiceStatus = "paid" | "pending" | "overdue" | "cancelled";

export type BillingInvoice = {
  id: string;
  invoice_number: string;
  client_id: string;
  school_name: string;
  amount_rupees: number;
  due_date: string;
  paid_date?: string;
  status: InvoiceStatus;
  overdue_days: number;
  last_reminder_sent_at?: string;
  created_at: string;
};

export type CommChannel = "whatsapp" | "email" | "call_note" | "suspension_notice";
export type CommMessageType = "payment_reminder" | "suspension" | "welcome" | "onboarding" | "manual_note" | "proposal" | "campaign_approval";
export type CommDeliveryStatus = "delivered" | "read" | "sent" | "failed" | "pending";

export type CommLogEntry = {
  id: string;
  client_id: string;
  school_name: string;
  channel: CommChannel;
  message_type: CommMessageType;
  recipient: string;
  content: string;
  sent_by_name: string;
  timestamp: string;
  delivery_status?: CommDeliveryStatus;
  sender_code?: string;
  subject?: string;
  attachments_count?: number;
};

export type MessageTemplate = {
  id: string;
  name: string;
  trigger_days_overdue: number;
  channel: "whatsapp" | "email";
  subject?: string;
  body_template: string;
};

export type ServicePricingCatalog = {
  id: string;
  service_name: string;
  category: "Performance Ads" | "SEO & Content" | "Creative UGC" | "CRO & Analytics";
  base_price_rupees: number;
  description: string;
};

// --- SEED DATASETS FOR LUMEN & CO ---

export const INITIAL_SCHOOL_CLIENTS: SchoolClient[] = [
  {
    id: "client-101",
    school_name: "Northbeam E-Commerce",
    city: "Bengaluru",
    contact_person: "Mark Davis",
    contact_role: "Founder & CMO",
    phone: "+91 98490 12345",
    email: "mark@northbeam.io",
    services_subscribed: ["Performance Ads", "Creative UGC", "CRO & Analytics"],
    package_tier: "Scale Enterprise",
    monthly_retainer_rupees: 120000,
    start_date: "2025-03-01",
    billing_cycle: "monthly",
    status: "active",
    access_status: "active",
    assigned_staff_id: "staff-1",
    assigned_staff_name: "Sahit Sai",
    notes: "Scale enterprise client. Meta & TikTok ads scaling rapidly.",
    created_at: "2025-03-01T00:00:00Z",
  },
  {
    id: "client-102",
    school_name: "Bloom Skincare",
    city: "Mumbai",
    contact_person: "Ananya Sen",
    contact_role: "Head of Marketing",
    phone: "+91 97012 34567",
    email: "ananya@bloomskincare.in",
    services_subscribed: ["Performance Ads", "Creative UGC"],
    package_tier: "Growth Retainer",
    monthly_retainer_rupees: 75000,
    start_date: "2025-05-15",
    billing_cycle: "monthly",
    status: "overdue",
    access_status: "active",
    assigned_staff_id: "staff-[#ef4d23]",
    assigned_staff_name: "Priya Sharma",
    notes: "August & September retainer payment past due by 16 days.",
    created_at: "2025-05-15T00:00:00Z",
  },
  {
    id: "client-103",
    school_name: "Zenith Apparel",
    city: "Hyderabad",
    contact_person: "Vikram Malhotra",
    contact_role: "Managing Director",
    phone: "+91 99800 54321",
    email: "vikram@zenithapparel.com",
    services_subscribed: ["SEO & Content", "Performance Ads"],
    package_tier: "Scale Enterprise",
    monthly_retainer_rupees: 95000,
    start_date: "2025-01-10",
    billing_cycle: "quarterly",
    status: "active",
    access_status: "active",
    assigned_staff_id: "staff-1",
    assigned_staff_name: "Sahit Sai",
    notes: "Quarterly retainer client. 100% prompt payment history.",
    created_at: "2025-01-10T00:00:00Z",
  },
  {
    id: "client-104",
    school_name: "UrbanFit Fitness",
    city: "Delhi NCR",
    contact_person: "Karan Mehta",
    contact_role: "Co-Founder",
    phone: "+91 94401 88899",
    email: "karan@urbanfit.co.in",
    services_subscribed: ["Performance Ads"],
    package_tier: "Performance Starter",
    monthly_retainer_rupees: 45000,
    start_date: "2025-07-01",
    billing_cycle: "monthly",
    status: "overdue",
    access_status: "suspended",
    assigned_staff_id: "staff-3",
    assigned_staff_name: "Alex Rivers",
    notes: "Access suspended due to 38-day retainer default.",
    created_at: "2025-07-01T00:00:00Z",
  },
  {
    id: "client-105",
    school_name: "Apex Media Group",
    city: "Bengaluru",
    contact_person: "Rohan Kapoor",
    contact_role: "VP Marketing",
    phone: "+91 98860 11223",
    email: "rohan@apexmedia.in",
    services_subscribed: ["SEO & Content", "Performance Ads", "Creative UGC"],
    package_tier: "Scale Enterprise",
    monthly_retainer_rupees: 150000,
    start_date: "2025-02-01",
    billing_cycle: "annual",
    status: "active",
    access_status: "active",
    assigned_staff_id: "staff-1",
    assigned_staff_name: "Sahit Sai",
    notes: "Annual retainer contract. Strong ROI scaling.",
    created_at: "2025-02-01T00:00:00Z",
  },
];

export const INITIAL_ACCESS_AUDIT_LOG: AccessAuditEntry[] = [
  {
    id: "audit-1",
    client_id: "client-104",
    school_name: "UrbanFit Fitness",
    previous_status: "active",
    new_status: "suspended",
    changed_by_name: "Sahit Sai",
    changed_by_role: "owner",
    reason: "Non-payment of ₹45,000 monthly retainer for 38 days despite 3 WhatsApp reminders.",
    timestamp: "2026-09-01T14:30:00Z",
  },
];

export const INITIAL_INVOICES: BillingInvoice[] = [
  {
    id: "inv-2026-001",
    invoice_number: "LMN-INV-2026-091",
    client_id: "client-101",
    school_name: "Northbeam E-Commerce",
    amount_rupees: 120000,
    due_date: "2026-09-05",
    paid_date: "2026-09-04",
    status: "paid",
    overdue_days: 0,
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "inv-2026-002",
    invoice_number: "LMN-INV-2026-092",
    client_id: "client-102",
    school_name: "Bloom Skincare",
    amount_rupees: 75000,
    due_date: "2026-08-25",
    status: "overdue",
    overdue_days: 16,
    last_reminder_sent_at: "2026-09-03T10:15:00Z",
    created_at: "2026-08-15T00:00:00Z",
  },
  {
    id: "inv-2026-003",
    invoice_number: "LMN-INV-2026-093",
    client_id: "client-103",
    school_name: "Zenith Apparel",
    amount_rupees: 95000,
    due_date: "2026-09-15",
    status: "pending",
    overdue_days: 0,
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "inv-2026-004",
    invoice_number: "LMN-INV-2026-094",
    client_id: "client-104",
    school_name: "UrbanFit Fitness",
    amount_rupees: 45000,
    due_date: "2026-08-01",
    status: "overdue",
    overdue_days: 40,
    last_reminder_sent_at: "2026-08-30T16:00:00Z",
    created_at: "2026-07-20T00:00:00Z",
  },
  {
    id: "inv-2026-005",
    invoice_number: "LMN-INV-2026-095",
    client_id: "client-105",
    school_name: "Apex Media Group",
    amount_rupees: 150000,
    due_date: "2026-09-20",
    status: "pending",
    overdue_days: 0,
    created_at: "2026-09-01T00:00:00Z",
  },
];

export const INITIAL_COMM_LOG: CommLogEntry[] = [
  {
    id: "comm-101",
    client_id: "client-102",
    school_name: "Bloom Skincare",
    channel: "whatsapp",
    message_type: "payment_reminder",
    recipient: "+91 97012 34567 (Ananya Sen)",
    content: "Hi Ananya, retainer payment of ₹75,000 for August is overdue by 7 days. Please clear at earliest to avoid ad campaign suspension.",
    sent_by_name: "Sahit Sai",
    sender_code: "EMP-100",
    subject: "August Retainer Fee Reminder",
    delivery_status: "read",
    timestamp: "2026-09-03T10:15:00Z",
  },
  {
    id: "comm-102",
    client_id: "client-104",
    school_name: "UrbanFit Fitness",
    channel: "suspension_notice",
    message_type: "suspension",
    recipient: "karan@urbanfit.co.in",
    content: "OFFICIAL NOTICE: Lumen & Co ad account management & creative services suspended due to 38-day unpaid balance of ₹45,000.",
    sent_by_name: "Sahit Sai",
    sender_code: "EMP-100",
    subject: "Account Suspension Alert",
    delivery_status: "delivered",
    timestamp: "2026-09-01T14:30:00Z",
  },
  {
    id: "comm-103",
    client_id: "client-101",
    school_name: "Northbeam E-Commerce",
    channel: "email",
    message_type: "onboarding",
    recipient: "mark@northbeam.io",
    content: "Q4 Performance Video Reel & Hook Cuts delivered. Scaled ROAS reported across Meta Ad Manager.",
    sent_by_name: "Sarah Chen",
    sender_code: "EMP-102",
    subject: "Q4 Creative Vault & Campaign Delivery",
    delivery_status: "delivered",
    attachments_count: 3,
    timestamp: "2026-09-04T09:00:00Z",
  },
  {
    id: "comm-104",
    client_id: "client-103",
    school_name: "Aura Home Decor",
    channel: "call_note",
    message_type: "manual_note",
    recipient: "+91 98490 12345 (Vikram Mehta)",
    content: "Phone Sync with Founder Vikram: Approved Q4 performance budget increase of ₹1.5L/mo. Requested UGC Reels for upcoming Diwali sale.",
    sent_by_name: "Sarah Chen",
    sender_code: "EMP-102",
    subject: "Quarterly Review Call Log",
    delivery_status: "read",
    timestamp: "2026-09-05T16:20:00Z",
  },
  {
    id: "comm-105",
    client_id: "client-105",
    school_name: "Zenith EdTech",
    channel: "whatsapp",
    message_type: "proposal",
    recipient: "+91 91234 56789 (Priya Sharma)",
    content: "Hi Priya, sharing the revised Retainer Proposal & SLA document for September. Total retainer: ₹1,20,000/mo.",
    sent_by_name: "Sahit Sai",
    sender_code: "EMP-100",
    subject: "SLA Retainer Proposal",
    delivery_status: "delivered",
    timestamp: "2026-09-06T11:45:00Z",
  },
];

export const INITIAL_MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: "tmpl-suspend-email",
    name: "🔴 Access Suspended Notice (Email)",
    trigger_days_overdue: 15,
    channel: "email",
    subject: "URGENT: Portal Access & Active Campaigns Suspended — {SCHOOL_NAME} (INV-{INVOICE_NUM})",
    body_template: "Dear {CONTACT_NAME},\n\nThis is an official notice from Lumen & Co Finance Operations. Access to your Client Portal and active performance marketing campaigns for {SCHOOL_NAME} has been SUSPENDED due to overdue monthly retainer invoice #{INVOICE_NUM} (₹{AMOUNT}).\n\nOutstanding Details:\n- Client Brand: {SCHOOL_NAME}\n- Invoice Number: #{INVOICE_NUM}\n- Overdue Amount: ₹{AMOUNT}\n- Access Status: 🔴 SUSPENDED\n\nTo restore immediate portal access, reactivate ad campaigns, and resume deliverable execution, please transfer the overdue balance to our corporate account:\n\nBank Transfer Details:\n- Account Name: Lumen & Co Media Solutions LLP\n- Account Number: 924020018472910\n- IFSC Code: UTIB0000284 (Axis Bank, Jubilee Hills, Hyderabad)\n- UPI ID: lumenandco@axisbank\n\nOnce transferred, reply to this email or share your transaction reference with your Account Manager to reactivate access within 15 minutes.\n\nWarm regards,\nFinance & Accounts Operations\nLumen & Co | Digital & Performance Marketing",
    auto_trigger: "15_days_overdue",
  },
  {
    id: "tmpl-suspend-wa",
    name: "🔴 Access Suspended Notice (WhatsApp)",
    trigger_days_overdue: 15,
    channel: "whatsapp",
    body_template: "⚠️ URGENT NOTICE for {CONTACT_NAME} ({SCHOOL_NAME}): Your Lumen & Co client portal access and live campaign execution have been SUSPENDED due to overdue retainer invoice #{INVOICE_NUM} (₹{AMOUNT}). Please transfer ₹{AMOUNT} to UPI ID: lumenandco@axisbank or Axis Bank A/C: 924020018472910 (IFSC: UTIB0000284) to restore access immediately. Reply with screenshot once paid!",
    auto_trigger: "15_days_overdue",
  },
  {
    id: "tmpl-revoke-legal",
    name: "⛔ Access Revoked & Dues Demand (Legal/Final)",
    trigger_days_overdue: 30,
    channel: "email",
    subject: "FINAL DEMAND: Access Revoked & Retainer Dues Clearance — {SCHOOL_NAME}",
    body_template: "ATTENTION: {CONTACT_NAME} ({SCHOOL_NAME})\n\nPlease be advised that master account access for {SCHOOL_NAME} has been REVOKED due to non-settlement of retainer invoice #{INVOICE_NUM} (₹{AMOUNT}) past 30 days.\n\nAll media campaigns, creative assets, and client portal privileges have been locked. To prevent account termination and clear outstanding dues, please remit ₹{AMOUNT} immediately via UPI (lumenandco@axisbank) or Bank Transfer.\n\nFor assistance, contact Founder Sahit Sai directly (+91 98490 00000).\n\nLumen & Co Legal & Financial Ops",
  },
  {
    id: "tmpl-24h-warning",
    name: "⚠️ 24-Hour Final Pre-Suspension Warning",
    trigger_days_overdue: 10,
    channel: "whatsapp",
    body_template: "Hi {CONTACT_NAME}! Friendly final warning from Lumen & Co: Invoice #{INVOICE_NUM} (₹{AMOUNT}) for {SCHOOL_NAME} is 10 days past due. Access and ad campaigns will be automatically suspended in 24 hours if unpaid. Please clear via UPI: lumenandco@axisbank to avoid service interruption!",
  },
  {
    id: "tmpl-restored",
    name: "🟢 Access Restored & Payment Cleared Notice",
    trigger_days_overdue: 0,
    channel: "email",
    subject: "CONFIRMED: Payment Cleared & Portal Access Restored — {SCHOOL_NAME}",
    body_template: "Dear {CONTACT_NAME},\n\nThank you for clearing payment for invoice #{INVOICE_NUM} (₹{AMOUNT})! We have verified your transaction.\n\nYour Lumen & Co Client Portal access and digital marketing campaign execution for {SCHOOL_NAME} have been FULLY RESTORED 🟢.\n\nThank you for your partnership!\nLumen & Co Operations Team",
  },
];

export interface InternalTask {
  id: string;
  client_id?: string;
  school_name: string;
  assigned_to_id: string;
  assigned_to_name: string;
  task_title: string;
  category?: "Content" | "Ads" | "SEO" | "Sales";
  task_type?: "reel" | "poster" | "caption" | "ad_creative" | "ad_copy" | "seo_audit" | "keyword_research" | "outreach_call" | "proposal";
  priority: "low" | "medium" | "high" | "urgent";
  due_date: string;
  completed: boolean;
  reasoning?: string;
}

export const INITIAL_INTERNAL_TASKS: InternalTask[] = [
  {
    id: "task-101",
    client_id: "client-102",
    school_name: "Bloom Skincare",
    assigned_to_id: "tm-6",
    assigned_to_name: "Michael Chang",
    task_title: "Cut & Edit 3 UGC Instagram Reels for Summer Product Line",
    category: "Content",
    task_type: "reel",
    priority: "high",
    due_date: "2026-09-12",
    completed: false,
    reasoning: "Auto-assigned to Michael Chang (Video Editor & Motion Lead) based on role-fit & video queue load.",
  },
  {
    id: "task-102",
    client_id: "client-101",
    school_name: "Northbeam E-Commerce",
    assigned_to_id: "tm-5",
    assigned_to_name: "David Miller",
    task_title: "Design 5 Promo Banners & Story Graphics for Fall Sale",
    category: "Content",
    task_type: "poster",
    priority: "high",
    due_date: "2026-09-13",
    completed: false,
    reasoning: "Auto-assigned to David Miller (Graphic & Brand Designer) for creative visual assets.",
  },
  {
    id: "task-103",
    client_id: "client-104",
    school_name: "UrbanFit Fitness",
    assigned_to_id: "tm-7",
    assigned_to_name: "Elena Rostova",
    task_title: "Draft Captions, Hashtag Sets & Social Copy for Membership Push",
    category: "Content",
    task_type: "caption",
    priority: "medium",
    due_date: "2026-09-14",
    completed: false,
    reasoning: "Auto-assigned to Elena Rostova (Senior Copywriter) for copywriting & messaging fit.",
  },
  {
    id: "task-104",
    client_id: "client-105",
    school_name: "Apex Media Group",
    assigned_to_id: "tm-8",
    assigned_to_name: "Priya Sharma",
    task_title: "Setup Meta & Google Retargeting Ad Campaigns ($5k/mo Spend)",
    category: "Ads",
    task_type: "ad_creative",
    priority: "urgent",
    due_date: "2026-09-11",
    completed: false,
    reasoning: "Auto-assigned to Priya Sharma (Performance Ad Specialist) for media buying execution.",
  },
  {
    id: "task-105",
    client_id: "client-105",
    school_name: "Apex Media Group",
    assigned_to_id: "tm-7",
    assigned_to_name: "Elena Rostova",
    task_title: "Write High-Converting Meta Ad Headlines & Angle Variations",
    category: "Ads",
    task_type: "ad_copy",
    priority: "high",
    due_date: "2026-09-12",
    completed: false,
    reasoning: "Auto-assigned to Elena Rostova (Senior Copywriter) for ad copy optimization.",
  },
  {
    id: "task-106",
    client_id: "client-104",
    school_name: "UrbanFit Fitness",
    assigned_to_id: "tm-3",
    assigned_to_name: "Alex Rivers",
    task_title: "Technical SEO Audit & On-Page 404 Crawl Error Resolution",
    category: "SEO",
    task_type: "seo_audit",
    priority: "high",
    due_date: "2026-09-15",
    completed: false,
    reasoning: "Auto-assigned to Alex Rivers (Operations Manager) for technical SEO diagnostics.",
  },
  {
    id: "task-107",
    client_id: "client-101",
    school_name: "Northbeam E-Commerce",
    assigned_to_id: "tm-3",
    assigned_to_name: "Alex Rivers",
    task_title: "Conduct Keyword Strategy & Competitor Backlink Gap Analysis",
    category: "SEO",
    task_type: "keyword_research",
    priority: "medium",
    due_date: "2026-09-16",
    completed: false,
    reasoning: "Auto-assigned to Alex Rivers (Operations Manager) for search keyword strategy.",
  },
  {
    id: "task-108",
    client_id: "client-102",
    school_name: "Bloom Skincare",
    assigned_to_id: "tm-4",
    assigned_to_name: "Sarah Chen",
    task_title: "Client Retainer Review Call & Q4 Upsell Proposal Presentation",
    category: "Sales",
    task_type: "outreach_call",
    priority: "high",
    due_date: "2026-09-11",
    completed: false,
    reasoning: "Auto-assigned to Sarah Chen (Account Manager Lead) for client relationship management.",
  },
  {
    id: "task-109",
    client_id: "client-105",
    school_name: "Apex Media Group",
    assigned_to_id: "tm-1",
    assigned_to_name: "Sahit Sai",
    task_title: "Prepare Enterprise Retainer Contract & Executive Pitch Deck",
    category: "Sales",
    task_type: "proposal",
    priority: "urgent",
    due_date: "2026-09-10",
    completed: true,
    reasoning: "Auto-assigned to Sahit Sai (Founder & CEO) for enterprise sales closing.",
  },
];

export const INITIAL_SERVICE_CATALOG: ServicePricingCatalog[] = [
  {
    id: "srv-1",
    service_name: "Performance Ad Management (Meta & Google)",
    category: "Performance Ads",
    base_price_rupees: 45000,
    description: "End-to-end paid acquisition, media buying, and bid optimization.",
  },
  {
    id: "srv-2",
    service_name: "SEO Growth & Organic Ranking",
    category: "SEO & Content",
    base_price_rupees: 35000,
    description: "Technical SEO, content strategy, and keyword positioning.",
  },
  {
    id: "srv-3",
    service_name: "High-Converting Creative UGC Video Reels",
    category: "Creative UGC",
    base_price_rupees: 40000,
    description: "Monthly ad creatives, hook iterations, and UGC video production.",
  },
];

// --- CLIENT BUSINESS LEADS PIPELINE (For Salesmen/Tele-callers handling client brand inquiries) ---

export type ClientLeadTemperature = "hot" | "warm" | "cold" | "unqualified" | "converted";

export interface ClientLeadCallNote {
  id: string;
  timestamp: string;
  caller_name: string;
  outcome: string;
  notes: string;
  tier_updated_to: ClientLeadTemperature;
}

export interface ClientBusinessLead {
  id: string;
  client_id: string;
  client_name: string;
  lead_name: string;
  phone: string;
  email: string;
  city: string;
  campaign_source: string;
  temperature: ClientLeadTemperature;
  assigned_telecaller: string;
  estimated_deal_value_rupees: number;
  last_contacted_at?: string;
  next_followup_at?: string;
  created_at: string;
  call_history: ClientLeadCallNote[];
  notes?: string;
}

export const INITIAL_CLIENT_BUSINESS_LEADS: ClientBusinessLead[] = [
  {
    id: "clead-101",
    client_id: "client-101",
    client_name: "Northbeam E-Commerce",
    lead_name: "Aarav Sharma",
    phone: "+91 98765 43210",
    email: "aarav.s@gmail.com",
    city: "Bengaluru",
    campaign_source: "Meta Ads - UGC Video Reel #4",
    temperature: "hot",
    assigned_telecaller: "Sahit Sai (Sales Lead)",
    estimated_deal_value_rupees: 45000,
    last_contacted_at: "2026-09-10T14:30:00Z",
    next_followup_at: "2026-09-11T11:00:00Z",
    created_at: "2026-09-09T09:15:00Z",
    notes: "Super interested in bulk e-commerce order. Asked for invoice & payment link.",
    call_history: [
      {
        id: "ch-1",
        timestamp: "2026-09-10T14:30:00Z",
        caller_name: "Sahit Sai",
        outcome: "Requested Invoice & Sample",
        notes: "Discussed custom order size of 200 units. Sent catalog on WhatsApp.",
        tier_updated_to: "hot",
      },
    ],
  },
  {
    id: "clead-102",
    client_id: "client-102",
    client_name: "Bloom Skincare",
    lead_name: "Sneha Reddy",
    phone: "+91 91234 56789",
    email: "sneha.reddy@yahoo.com",
    city: "Hyderabad",
    campaign_source: "Instagram UGC Reel Ad - Glow Serum",
    temperature: "warm",
    assigned_telecaller: "Priya Sharma",
    estimated_deal_value_rupees: 8500,
    last_contacted_at: "2026-09-09T16:20:00Z",
    next_followup_at: "2026-09-11T15:00:00Z",
    created_at: "2026-09-08T12:00:00Z",
    notes: "Inquired about sensitive skin formulation. Wants coupon code before ordering.",
    call_history: [
      {
        id: "ch-2",
        timestamp: "2026-09-09T16:20:00Z",
        caller_name: "Priya Sharma",
        outcome: "Sent 10% First Order Discount",
        notes: "Pushed discount code via WhatsApp. Follow up Friday afternoon.",
        tier_updated_to: "warm",
      },
    ],
  },
  {
    id: "clead-103",
    client_id: "client-104",
    client_name: "UrbanFit Fitness",
    lead_name: "Rohan Varma",
    phone: "+91 99887 76655",
    email: "rohan.v@outlook.com",
    city: "Delhi NCR",
    campaign_source: "Google Search Ads - Annual Membership",
    temperature: "hot",
    assigned_telecaller: "Alex Rivers",
    estimated_deal_value_rupees: 28000,
    last_contacted_at: "2026-09-10T11:00:00Z",
    next_followup_at: "2026-09-11T10:00:00Z",
    created_at: "2026-09-10T08:30:00Z",
    notes: "Wants personal training package trial session tomorrow at 6 PM.",
    call_history: [
      {
        id: "ch-3",
        timestamp: "2026-09-10T11:00:00Z",
        caller_name: "Alex Rivers",
        outcome: "Scheduled Gym Visit & Trial",
        notes: "Booked free 1-on-1 personal trainer trial for Friday evening.",
        tier_updated_to: "hot",
      },
    ],
  },
  {
    id: "clead-104",
    client_id: "client-103",
    client_name: "Zenith Apparel",
    lead_name: "Meera Nair",
    phone: "+91 97654 32109",
    email: "meera.nair@hotmail.com",
    city: "Mumbai",
    campaign_source: "Meta Carousel Ad - Festive Wear",
    temperature: "cold",
    assigned_telecaller: "Priya Sharma",
    estimated_deal_value_rupees: 15000,
    last_contacted_at: "2026-09-07T15:10:00Z",
    created_at: "2026-09-05T10:45:00Z",
    notes: "Browsing for upcoming festival. Didn't answer second call attempt.",
    call_history: [],
  },
  {
    id: "clead-105",
    client_id: "client-105",
    client_name: "Apex Media Group",
    lead_name: "Kavya Patel",
    phone: "+91 94567 89012",
    email: "kavya@apexenterprise.com",
    city: "Bengaluru",
    campaign_source: "LinkedIn Lead Form - Video Package",
    temperature: "converted",
    assigned_telecaller: "Sahit Sai",
    estimated_deal_value_rupees: 120000,
    last_contacted_at: "2026-09-09T17:00:00Z",
    created_at: "2026-09-01T14:00:00Z",
    notes: "Signed 6-month UGC video creation contract. Payment received!",
    call_history: [
      {
        id: "ch-4",
        timestamp: "2026-09-09T17:00:00Z",
        caller_name: "Sahit Sai",
        outcome: "Contract Signed & Payment Received",
        notes: "Closed contract for ₹1,20,000 package. Transferred to Onboarding.",
        tier_updated_to: "converted",
      },
    ],
  },
  {
    id: "clead-106",
    client_id: "client-101",
    client_name: "Northbeam E-Commerce",
    lead_name: "Karan Johar",
    phone: "+91 93344 55667",
    email: "karan.j@gmail.com",
    city: "Pune",
    campaign_source: "Meta Ads - Retargeting Offer",
    temperature: "unqualified",
    assigned_telecaller: "Alex Rivers",
    estimated_deal_value_rupees: 0,
    last_contacted_at: "2026-09-08T10:15:00Z",
    created_at: "2026-09-07T18:00:00Z",
    notes: "Wrong number submitted in lead form.",
    call_history: [
      {
        id: "ch-5",
        timestamp: "2026-09-08T10:15:00Z",
        caller_name: "Alex Rivers",
        outcome: "Invalid Number",
        notes: "Call bounced. Number disconnected.",
        tier_updated_to: "unqualified",
      },
    ],
  },
  {
    id: "clead-107",
    client_id: "client-102",
    client_name: "Bloom Skincare",
    lead_name: "Pooja Hegde",
    phone: "+91 98112 23344",
    email: "pooja.h@gmail.com",
    city: "Chennai",
    campaign_source: "Instagram Story Ad - Anti Aging Kit",
    temperature: "hot",
    assigned_telecaller: "Priya Sharma",
    estimated_deal_value_rupees: 12500,
    last_contacted_at: "2026-09-10T16:45:00Z",
    next_followup_at: "2026-09-11T12:00:00Z",
    created_at: "2026-09-10T13:00:00Z",
    notes: "Asked for Cash on Delivery options and shipping delivery estimate.",
    call_history: [
      {
        id: "ch-6",
        timestamp: "2026-09-10T16:45:00Z",
        caller_name: "Priya Sharma",
        outcome: "Confirmed COD Eligibility",
        notes: "Pooja promised to confirm order by noon tomorrow.",
        tier_updated_to: "hot",
      },
    ],
  },
  {
    id: "clead-108",
    client_id: "client-104",
    client_name: "UrbanFit Fitness",
    lead_name: "Vikrant Massey",
    phone: "+91 97171 71717",
    email: "vikrant.m@gmail.com",
    city: "Delhi NCR",
    campaign_source: "Google Search - Crossfit Gym Near Me",
    temperature: "warm",
    assigned_telecaller: "Alex Rivers",
    estimated_deal_value_rupees: 35000,
    last_contacted_at: "2026-09-09T14:15:00Z",
    next_followup_at: "2026-09-12T16:00:00Z",
    created_at: "2026-09-09T09:00:00Z",
    notes: "Comparing UrbanFit with Gold's Gym. Needs corporate discount details.",
    call_history: [],
  },
];

// --- LUMEN & CO CLIENT PORTAL CONSENT & APPROVAL TYPES ---

export type UserConsentRecord = {
  id: string;
  user_id: string;
  client_id: string;
  user_email: string;
  policy_version: string;
  accepted_at: string;
  ip_address: string;
  user_agent: string;
};

export type UserLoginHistoryEntry = {
  id: string;
  user_id: string;
  user_email: string;
  login_at: string;
  ip_address: string;
  device_browser: string;
  status: "success" | "consent_pending" | "failed";
};

export type PolicySection = {
  section_number: number;
  title: string;
  content: string;
};

export type PolicyContent = {
  version: string;
  last_updated: string;
  privacy_policy: {
    title: string;
    sections: PolicySection[];
  };
  terms_of_service: {
    title: string;
    sections: PolicySection[];
  };
};

export const CURRENT_POLICY_VERSION = "1.0";

export const LUMEN_POLICY_CONTENT_V1: PolicyContent = {
  version: "1.0",
  last_updated: "September 11, 2026",
  privacy_policy: {
    title: "Privacy Policy (DPDP Act 2023 Compliant)",
    sections: [
      {
        section_number: 1,
        title: "Information We Collect",
        content: `Lumen & Co ("we", "us", "our") collects the following types of information to operate the Client Portal and deliver digital marketing services:
• Account information: name, email address, phone number, company name, and organizational role.
• Content you provide: approval and rejection decisions, feedback comments, asset change requests, and messages sent within the portal.
• Campaign data: business leads collected, performance metrics, conversion tracking, and ad analytics generated on your behalf.
• Technical & Usage data: login timestamps, IP addresses, browser specs, device details, and portal activity logs.`,
      },
      {
        section_number: 2,
        title: "How We Use Your Information",
        content: `Your information is used strictly for legitimate business and marketing operations:
• To authenticate access and grant secure entry to the Client Portal.
• To communicate campaign updates, pending creative approvals, and weekly strategy reports.
• To route generated leads directly to your sales team and render performance dashboards.
• To maintain audit logs, enforce policy consent gates, and prevent unauthorized account access.`,
      },
      {
        section_number: 3,
        title: "How We Share Your Information",
        content: `We DO NOT sell, rent, or trade your personal or business data to third parties. Data sharing occurs exclusively with:
• Authoritative advertising platforms (Meta Ads, Google Ads, TikTok Ads, LinkedIn Ads) necessary to launch and optimize your ad campaigns.
• Cloud infrastructure & database providers hosting our secure Client Portal services.
• Regulatory authorities or law enforcement if mandated by court order or statutory requirement.`,
      },
      {
        section_number: 4,
        title: "Data Retention",
        content: `We retain your account and campaign data for the active duration of our service engagement and for 24 months post-termination. Following this period, data is either securely anonymized or permanently deleted, unless retention is explicitly requested or legally required under applicable Indian tax and corporate laws.`,
      },
      {
        section_number: 5,
        title: "Your Rights under DPDP Act 2023",
        content: `Under India's Digital Personal Data Protection (DPDP) Act 2023, you retain full rights to:
• Request an inventory summary of your personal data processed by Lumen & Co.
• Request correction or updating of inaccurate account details.
• Request erasure or deletion of personal data upon service termination.
• Nominate an authorized representative for data rights exercise.
To exercise any rights, submit a written query to our designated Grievance Officer below.`,
      },
      {
        section_number: 6,
        title: "Cookies & Session Storage",
        content: `The Client Portal uses encrypted session storage and essential functional cookies solely to maintain secure user authentication, save portal preferences, and enforce consent gates. We do not place third-party advertising tracking cookies inside this portal.`,
      },
      {
        section_number: 7,
        title: "Security & Access Safeguards",
        content: `We implement enterprise-grade technical and administrative security controls, including TLS 1.3 encryption in transit, role-based backend authorization, audit logging, and row-level data isolation. You are required to maintain strict confidentiality of your login credentials and notify us immediately of any suspected breach.`,
      },
      {
        section_number: 8,
        title: "Grievance Officer / Statutory Contact",
        content: `In compliance with Section 10 of India's Digital Personal Data Protection Act, 2023, for any privacy queries, data requests, or grievances:
Grievance Officer: Sahit Sai
Designation: Data Protection & Compliance Lead
Email: privacy@lumenandco.in
Direct Phone: +91 98490 00000
Address: Lumen & Co Headquarters, Level 4, Jubilee Hills, Hyderabad 500033, TG, India.`,
      },
    ],
  },
  terms_of_service: {
    title: "Terms of Service",
    sections: [
      {
        section_number: 1,
        title: "Scope of Access",
        content: `Your authorized account grants access to: view and approve/reject creative assets, inspect leads generated from active campaigns, read performance analytics, and manage individual user profiles. Access is strictly scoped to your organization; you cannot access internal agency cost structures, profit margins, staff payroll, or other client accounts.`,
      },
      {
        section_number: 2,
        title: "Approval Workflow & Digital Sign-off",
        content: `Clicking 'Approve' on a creative asset within this portal constitutes your binding official approval, equivalent to a written signature. Approved assets will be scheduled for deployment across advertising networks. If an asset is rejected, you must provide constructive feedback; the agency will revise and resubmit prior to campaign launch.`,
      },
      {
        section_number: 3,
        title: "Confidentiality & Non-Disclosure",
        content: `All ad copy, custom UGC videos, lead records, targeting strategies, and metrics displayed in this portal are confidential proprietary information provided exclusively for your internal business operations. You agree not to distribute, resell, or disclose this data to competitors or unauthorized third parties.`,
      },
      {
        section_number: 4,
        title: "Intellectual Property Rights",
        content: `All raw creative concepts, scripts, and video edits remain the intellectual property of Lumen & Co until retainer invoices are settled in full, upon which commercial publishing rights transfer to your company. Unused or rejected creative concepts may be repurposed by Lumen & Co unless prohibited in writing.`,
      },
      {
        section_number: 5,
        title: "Account Security & Multi-User Governance",
        content: `Each team member accessing the portal must maintain an individual credential. Sharing single login credentials across multiple individuals is prohibited. Consent records are logged per individual user account.`,
      },
      {
        section_number: 6,
        title: "Limitation of Liability",
        content: `Lumen & Co is not liable for ad account suspensions, unexpected platform policy shifts, or algorithmic delivery alterations imposed by third-party ad networks (e.g. Meta, Google, TikTok). Our liability is strictly limited to the monthly retainer fees paid during the affected billing period.`,
      },
      {
        section_number: 7,
        title: "Service Termination & Revocation",
        content: `Upon expiration or termination of your marketing retainer, portal login access will be revoked within 7 business days. Export your lead records and performance reports prior to account closure.`,
      },
      {
        section_number: 8,
        title: "Changes & Re-Acceptance",
        content: `We reserve the right to update these Terms and the Privacy Policy to reflect regulatory changes or service enhancements. Whenever a new policy_version is published, you will be prompted to review and accept the updated terms prior to accessing the portal.`,
      },
    ],
  },
};

export type CreativeVersionHistory = {
  version: number;
  submitted_at: string;
  thumbnailUrl: string;
  videoUrl?: string;
  notes: string;
  status: "pending" | "approved" | "rejected";
  feedback?: string;
  action_by?: string;
  action_at?: string;
};

export type CreativeApprovalItem = {
  id: string;
  client_id: string;
  title: string;
  type: "Video Reel" | "Meta Ad" | "Carousel Graphic" | "Motion Banner";
  current_version: number;
  thumbnailUrl: string;
  videoUrl?: string;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  client_comment?: string;
  action_at?: string;
  action_by?: string;
  history: CreativeVersionHistory[];
};

export const INITIAL_CREATIVE_APPROVALS: CreativeApprovalItem[] = [
  {
    id: "cr-201",
    client_id: "client-101",
    title: "Q4 Festive Season UGC Unboxing Reel (Hook A)",
    type: "Video Reel",
    current_version: 2,
    thumbnailUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4",
    status: "pending",
    submitted_at: "2026-09-10T14:30:00Z",
    history: [
      {
        version: 1,
        submitted_at: "2026-09-08T10:00:00Z",
        thumbnailUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        videoUrl: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4",
        notes: "First cut of UGC unboxing reel.",
        status: "rejected",
        feedback: "Please add a bigger promo code overlay in the first 3 seconds and speed up the intro cut.",
        action_by: "Mark Davis",
        action_at: "2026-09-08T16:20:00Z",
      },
      {
        version: 2,
        submitted_at: "2026-09-10T14:30:00Z",
        thumbnailUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        videoUrl: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4",
        notes: "v2 revision: Added high-contrast 'SAVE20' overlay and shortened intro hook to 1.2s.",
        status: "pending",
      },
    ],
  },
  {
    id: "cr-202",
    client_id: "client-101",
    title: "Meta Feed Retargeting Motion Banner",
    type: "Motion Banner",
    current_version: 1,
    thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_125226_45cb4f38-aa7e-47e1-885d-ae0b69745369.mp4",
    status: "pending",
    submitted_at: "2026-09-09T18:00:00Z",
    history: [
      {
        version: 1,
        submitted_at: "2026-09-09T18:00:00Z",
        thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
        videoUrl: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_125226_45cb4f38-aa7e-47e1-885d-ae0b69745369.mp4",
        notes: "High conversion retargeting motion banner with 48h timer pulse.",
        status: "pending",
      },
    ],
  },
  {
    id: "cr-203",
    client_id: "client-101",
    title: "Diwali Special Offer 5-Slide Carousel Graphic",
    type: "Carousel Graphic",
    current_version: 1,
    thumbnailUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80",
    status: "approved",
    submitted_at: "2026-09-05T11:00:00Z",
    client_comment: "Approved! Colors look great and copy is sharp.",
    action_by: "Mark Davis",
    action_at: "2026-09-06T09:15:00Z",
    history: [
      {
        version: 1,
        submitted_at: "2026-09-05T11:00:00Z",
        thumbnailUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80",
        notes: "Initial 5-slide festive carousel deck.",
        status: "approved",
        feedback: "Approved! Colors look great and copy is sharp.",
        action_by: "Mark Davis",
        action_at: "2026-09-06T09:15:00Z",
      },
    ],
  },
];

export const INITIAL_USER_CONSENT_RECORDS: UserConsentRecord[] = [
  {
    id: "ucr-101",
    user_id: "user-mark-101",
    client_id: "client-101",
    user_email: "mark@northbeam.io",
    policy_version: "1.0",
    accepted_at: "2026-09-01T08:15:00Z",
    ip_address: "49.207.212.18",
    user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36",
  },
];

export const INITIAL_USER_LOGIN_HISTORY: UserLoginHistoryEntry[] = [
  {
    id: "lh-101",
    user_id: "user-mark-101",
    user_email: "mark@northbeam.io",
    login_at: "2026-09-11T00:15:22Z",
    ip_address: "49.207.212.18",
    device_browser: "Chrome 128.0 (macOS Sequoia)",
    status: "success",
  },
  {
    id: "lh-100",
    user_id: "user-mark-101",
    user_email: "mark@northbeam.io",
    login_at: "2026-09-10T14:22:10Z",
    ip_address: "49.207.212.18",
    device_browser: "Chrome 128.0 (macOS Sequoia)",
    status: "success",
  },
  {
    id: "lh-099",
    user_id: "user-mark-101",
    user_email: "mark@northbeam.io",
    login_at: "2026-09-08T09:40:05Z",
    ip_address: "103.22.140.5",
    device_browser: "Safari 17.4 (iPhone 15 Pro)",
    status: "success",
  },
];

