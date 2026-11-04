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
  auto_trigger?: string;
};

export type ServicePricingCatalog = {
  id: string;
  service_name: string;
  category: "Performance Ads" | "SEO & Content" | "Creative UGC" | "CRO & Analytics";
  base_price_rupees: number;
  description: string;
};

// --- SEED DATASETS FOR LUMEN & CO ---

export const INITIAL_SCHOOL_CLIENTS: SchoolClient[] = [];

export const INITIAL_ACCESS_AUDIT_LOG: AccessAuditEntry[] = [];

export const INITIAL_INVOICES: BillingInvoice[] = [];

export const INITIAL_COMM_LOG: CommLogEntry[] = [];

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
  due_date?: string;
  completed: boolean;
  reasoning?: string;
}

export const INITIAL_INTERNAL_TASKS: InternalTask[] = [];

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

export const INITIAL_CLIENT_BUSINESS_LEADS: ClientBusinessLead[] = [];

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

export const INITIAL_CREATIVE_APPROVALS: CreativeApprovalItem[] = [];

export const INITIAL_USER_CONSENT_RECORDS: UserConsentRecord[] = [];

export const INITIAL_USER_LOGIN_HISTORY: UserLoginHistoryEntry[] = [];

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  role: UserRole;
  crmAccess: boolean;
  email: string;
  phone: string;
  department: string;
  assignedClients: string[];
  capacityLoad: string;
  avatarBg: string;
  initial: string;
}


