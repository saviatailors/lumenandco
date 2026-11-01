import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAuth, supabaseAdmin, isAdminEmail } from "@/lib/supabase-admin";

// --- STRICT PIPELINE STAGES ---
export const DELIVERY_STAGES = [
  "backlog",
  "in_progress",
  "internal_review",
  "internal_revision",
  "ready_for_client",
  "client_review",
  "client_revision",
  "approved",
  "delivered",
  "archived",
] as const;

export type DeliveryStage = typeof DELIVERY_STAGES[number];

export const STAGE_LABELS: Record<DeliveryStage, string> = {
  backlog: "Backlog",
  in_progress: "In Progress",
  internal_review: "Internal Review",
  internal_revision: "Revision Requested (Internal)",
  ready_for_client: "Ready for Client",
  client_review: "Client Review",
  client_revision: "Client Revision Requested",
  approved: "Approved",
  delivered: "Published / Delivered",
  archived: "Archived",
};

export const DELIVERABLE_TYPES = [
  "reel",
  "static_post",
  "carousel",
  "ad_creative",
  "website_task",
  "blog",
  "email_campaign",
  "other",
] as const;

export type DeliverableType = typeof DELIVERABLE_TYPES[number];

export const PRIORITIES = ["low", "med", "high", "urgent"] as const;
export type Priority = typeof PRIORITIES[number];

export type StaffRole = "super_admin" | "ops_manager" | "account_manager" | "designer" | "content_writer" | "ad_specialist";

export type StaffMember = {
  id: string;
  code: string; // Unique Employee Code e.g. "EMP-100"
  name: string;
  email: string;
  role: StaffRole;
  role_label: string;
  avatar_color: string;
  capacity_limit: number;
  weeks_at_high_capacity: number; // Burnout risk tracking
};

export const SEED_STAFF: StaffMember[] = [
  { id: "staff-6", code: "EMP-100", name: "Sahit Sai", email: "sahitsai6@gmail.com", role: "super_admin", role_label: "Founder & Super Admin", avatar_color: "#111827", capacity_limit: 10, weeks_at_high_capacity: 0 },
  { id: "staff-1", code: "EMP-101", name: "Santhan Kumar", email: "santhan@lumenandco.in", role: "ops_manager", role_label: "Co-Founder & Ops Lead", avatar_color: "#ef4d23", capacity_limit: 8, weeks_at_high_capacity: 0 },
];

export type ClientInfo = {
  id: string;
  code: string; // Unique Client Code e.g. "CLT-777"
  company_name: string;
  location?: string;
  contacts_count?: number;
  open_queries_count?: number;
  package_tier: string;
  account_manager_id: string;
  needs_attention_count?: number;
};

export const SEED_CLIENTS: ClientInfo[] = [];

export type Subtask = {
  id: string;
  label: string;
  completed: boolean;
  assignee_staff_id?: string;
  due_date?: string;
};

export type AttachmentVersion = {
  id: string;
  version: number;
  filename: string;
  file_url: string;
  thumbnail_url?: string;
  file_size_bytes: number;
  file_type: "image" | "video" | "pdf" | "doc";
  uploaded_by_staff_id: string;
  uploaded_by_name: string;
  created_at: string;
};

export type InternalComment = {
  id: string;
  deliverable_id: string;
  staff_id: string;
  staff_name: string;
  staff_role: string;
  content: string;
  reactions?: { emoji: string; count: number; users: string[] }[];
  parent_comment_id?: string; // Threaded replies
  created_at: string;
};

export type ClientPortalComment = {
  id: string;
  deliverable_id: string;
  actor: "client" | "staff";
  author_name: string;
  content: string;
  created_at: string;
};

export type ActivityLog = {
  id: string;
  deliverable_id: string;
  actor_name: string;
  actor_role: string;
  from_status: string;
  to_status: string;
  action_description: string;
  timestamp: string;
};

export type TimeEntry = {
  id: string;
  deliverable_id: string;
  staff_id: string;
  staff_name: string;
  duration_hours: number;
  description: string;
  created_at: string;
};

export type DeliverableTemplate = {
  id: string;
  name: string;
  type: DeliverableType;
  default_estimated_hours: number;
  default_subtasks: string[];
  default_tags: string[];
};

export const SEED_TEMPLATES: DeliverableTemplate[] = [
  {
    id: "tmpl-1",
    name: "Standard Reels / Short-Form Video Pack",
    type: "reel",
    default_estimated_hours: 6,
    default_subtasks: ["Cut raw B-roll footage", "Add caption animations", "Color grade & audio balance", "Export 9:16 vertical MP4"],
    default_tags: ["video", "reels", "tiktok"],
  },
  {
    id: "tmpl-2",
    name: "Meta Ad Creative Concept Set",
    type: "ad_creative",
    default_estimated_hours: 8,
    default_subtasks: ["AI concept generation", "Format 4:5 & 1:1 image sets", "Write primary text & headline options", "Internal review QA"],
    default_tags: ["meta-ads", "ai-creative"],
  },
  {
    id: "tmpl-3",
    name: "Instagram Carousel 10-Slide Pack",
    type: "carousel",
    default_estimated_hours: 5,
    default_subtasks: ["Draft slide copy & outline", "Design brand slide deck", "Format cover slide hook", "Export PDF & PNGs"],
    default_tags: ["instagram", "carousel"],
  },
];

export type ClientHealthSnapshot = {
  client_id: string;
  company_name: string;
  on_time_delivery_rate: number; // e.g. 92%
  revision_rate: number; // e.g. 14%
  sla_breaches_this_month: number;
  execution_health_score: number; // 0 - 100%
};

export type Deliverable = {
  id: string;
  client_id: string;
  client_name: string;
  title: string;
  type: DeliverableType;
  brief_description: string;
  assigned_to_staff_id: string;
  assigned_to_name: string;
  secondary_assignee_ids?: string[];
  created_by_staff_id: string;
  priority: Priority;
  due_date: string;
  publish_date: string;
  status: DeliveryStage;
  client_visible: boolean; // FAIL CLOSED: Defaults to false
  estimated_hours: number;
  actual_hours_logged: number;
  tags: string[];
  blocked_by_deliverable_ids?: string[]; // Task Dependencies
  is_recurring?: boolean;
  recurrence_cron?: string; // e.g. "Weekly on Monday"
  ai_generated_brief?: string;
  subtasks: Subtask[];
  attachments: AttachmentVersion[];
  internal_comments: InternalComment[];
  client_comments: ClientPortalComment[];
  activity_logs: ActivityLog[];
  time_entries: TimeEntry[];
  created_at: string;
  updated_at: string;
};

// --- INITIAL SEED DELIVERABLES (~40 items across all pipeline stages) ---
export const INITIAL_DELIVERABLES: Deliverable[] = [
  {
    id: "del-nb-1",
    client_id: "client-northbeam",
    client_name: "Northbeam Outdoors",
    title: "Q4 Performance Video Reel & Hook Cuts",
    type: "reel",
    brief_description: "Short-form vertical video cut showcasing autumn jacket collection with dynamic text overlays.",
    assigned_to_staff_id: "staff-3",
    assigned_to_name: "David Miller",
    created_by_staff_id: "staff-1",
    priority: "urgent",
    due_date: "2026-09-18",
    publish_date: "2026-09-18",
    status: "in_progress",
    client_visible: true,
    estimated_hours: 6,
    actual_hours_logged: 4.5,
    tags: ["video", "reels", "autumn"],
    subtasks: [
      { id: "sub-1", label: "Select raw footage cuts", completed: true },
      { id: "sub-2", label: "Add motion graphics & logo", completed: true },
      { id: "sub-3", label: "Color grade & audio balance", completed: false },
    ],
    attachments: [],
    internal_comments: [],
    client_comments: [],
    activity_logs: [],
    time_entries: [],
    created_at: "2026-09-01T08:00:00Z",
    updated_at: "2026-09-18T09:12:00Z",
  },
  {
    id: "del-nb-2",
    client_id: "client-northbeam",
    client_name: "Northbeam Outdoors",
    title: "Autumn Campaign Launch Social Graphics & Carousel Pack",
    type: "carousel",
    brief_description: "10-slide Instagram carousel showcasing waterproof outerwear line.",
    assigned_to_staff_id: "staff-3",
    assigned_to_name: "David Miller",
    created_by_staff_id: "staff-1",
    priority: "med",
    due_date: "2026-08-24",
    publish_date: "2026-08-24",
    status: "in_progress",
    client_visible: true,
    estimated_hours: 4,
    actual_hours_logged: 3,
    tags: ["carousel", "design"],
    subtasks: [],
    attachments: [],
    internal_comments: [],
    client_comments: [],
    activity_logs: [],
    time_entries: [],
    created_at: "2026-08-01T08:00:00Z",
    updated_at: "2026-08-24T09:12:00Z",
  },
  {
    id: "del-nb-3",
    client_id: "client-northbeam",
    client_name: "Northbeam Outdoors",
    title: "E-Commerce SEO Buyers Guide: Best Waterproof Jackets 2026",
    type: "blog",
    brief_description: "Long-form keyword-optimized article for organic search acquisition.",
    assigned_to_staff_id: "staff-4",
    assigned_to_name: "Elena Rostova",
    created_by_staff_id: "staff-1",
    priority: "med",
    due_date: "2026-07-29",
    publish_date: "2026-07-29",
    status: "approved",
    client_visible: true,
    estimated_hours: 5,
    actual_hours_logged: 4,
    tags: ["blog", "seo"],
    subtasks: [],
    attachments: [],
    internal_comments: [],
    client_comments: [],
    activity_logs: [],
    time_entries: [],
    created_at: "2026-07-01T08:00:00Z",
    updated_at: "2026-07-29T09:12:00Z",
  },
  {
    id: "del-nb-4",
    client_id: "client-northbeam",
    client_name: "Northbeam Outdoors",
    title: "Meta Retargeting Video Ads Set (1:1 & 9:16 Ratios)",
    type: "ad_creative",
    brief_description: "High-conversion ad cut targeting cart abandoners.",
    assigned_to_staff_id: "staff-3",
    assigned_to_name: "David Miller",
    created_by_staff_id: "staff-1",
    priority: "urgent",
    due_date: "2026-06-26",
    publish_date: "2026-06-26",
    status: "in_progress",
    client_visible: true,
    estimated_hours: 6,
    actual_hours_logged: 5,
    tags: ["meta-ads"],
    subtasks: [],
    attachments: [],
    internal_comments: [],
    client_comments: [],
    activity_logs: [],
    time_entries: [],
    created_at: "2026-06-01T08:00:00Z",
    updated_at: "2026-06-26T09:12:00Z",
  },
  {
    id: "del-nb-5",
    client_id: "client-northbeam",
    client_name: "Northbeam Outdoors",
    title: "Email Newsletter Blast: Labor Day Early Access Offer",
    type: "email_campaign",
    brief_description: "HTML responsive email design for Klaviyo subscriber segment.",
    assigned_to_staff_id: "staff-4",
    assigned_to_name: "Elena Rostova",
    created_by_staff_id: "staff-1",
    priority: "med",
    due_date: "2026-06-13",
    publish_date: "2026-06-13",
    status: "approved",
    client_visible: true,
    estimated_hours: 3,
    actual_hours_logged: 3,
    tags: ["email"],
    subtasks: [],
    attachments: [],
    internal_comments: [],
    client_comments: [],
    activity_logs: [],
    time_entries: [],
    created_at: "2026-06-01T08:00:00Z",
    updated_at: "2026-06-13T09:12:00Z",
  },
  {
    id: "del-102",
    client_id: "client-2",
    client_name: "Fable Skincare",
    title: "Gen AI UGC Ad Concepts (Set 4)",
    type: "ad_creative",
    brief_description: "Photorealistic AI concept images & carousel copy for Serum line Meta campaign.",
    assigned_to_staff_id: "staff-3",
    assigned_to_name: "David Miller",
    created_by_staff_id: "staff-1",
    priority: "urgent",
    due_date: "2026-09-12",
    publish_date: "2026-09-15",
    status: "in_progress",
    client_visible: false,
    estimated_hours: 8,
    actual_hours_logged: 3.0,
    tags: ["meta-ads", "ai-creative"],
    blocked_by_deliverable_ids: ["del-108"], // Blocked by Brand Kit!
    subtasks: [
      { id: "sub-10", label: "Generate Midjourney texture renders", completed: true, assignee_staff_id: "staff-3" },
      { id: "sub-11", label: "Format 4:5 vertical ad set", completed: false, assignee_staff_id: "staff-3" },
      { id: "sub-12", label: "Write primary copy options", completed: false, assignee_staff_id: "staff-4" },
    ],
    attachments: [],
    internal_comments: [],
    client_comments: [],
    activity_logs: [],
    time_entries: [
      { id: "te-3", deliverable_id: "del-102", staff_id: "staff-3", staff_name: "David Miller", duration_hours: 3.0, description: "AI prompt generation & renders", created_at: "2026-09-08T15:00:00Z" },
    ],
    created_at: "2026-09-07T09:00:00Z",
    updated_at: "2026-09-08T11:00:00Z",
  },
  {
    id: "del-103",
    client_id: "client-3",
    client_name: "Kite & Co",
    title: "Autumn Promotion Static & Carousel Banners",
    type: "carousel",
    brief_description: "10-slide Instagram carousel showcasing customer reviews and promotional discount codes.",
    assigned_to_staff_id: "staff-3",
    assigned_to_name: "David Miller",
    created_by_staff_id: "staff-2",
    priority: "high",
    due_date: "2026-09-11",
    publish_date: "2026-09-16",
    status: "internal_review",
    client_visible: false,
    estimated_hours: 5,
    actual_hours_logged: 4.5,
    tags: ["design", "instagram"],
    subtasks: [
      { id: "sub-20", label: "Design typography layout", completed: true },
      { id: "sub-21", label: "Export PNG assets", completed: true },
    ],
    attachments: [
      {
        id: "att-3",
        version: 1,
        filename: "kite_co_carousel_draft.png",
        file_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
        file_size_bytes: 4500000,
        file_type: "image",
        uploaded_by_staff_id: "staff-3",
        uploaded_by_name: "David Miller",
        created_at: "2026-09-09T16:00:00Z",
      },
    ],
    internal_comments: [],
    client_comments: [],
    activity_logs: [],
    time_entries: [],
    created_at: "2026-09-06T10:00:00Z",
    updated_at: "2026-09-09T16:05:00Z",
  },
  {
    id: "del-104",
    client_id: "client-4",
    client_name: "Verda Organics",
    title: "Technical SEO Audit & Schema Markup Fixes",
    type: "website_task",
    brief_description: "Fix canonical tags, structured product data schema, and core web vitals optimization.",
    assigned_to_staff_id: "staff-4",
    assigned_to_name: "Elena Rostova",
    created_by_staff_id: "staff-1",
    priority: "med",
    due_date: "2026-09-07",
    publish_date: "2026-09-07",
    status: "approved",
    client_visible: true,
    estimated_hours: 4,
    actual_hours_logged: 4.0,
    tags: ["seo", "technical"],
    subtasks: [],
    attachments: [],
    internal_comments: [],
    client_comments: [],
    activity_logs: [],
    time_entries: [],
    created_at: "2026-09-01T09:00:00Z",
    updated_at: "2026-09-07T12:00:00Z",
  },
  {
    id: "del-105",
    client_id: "client-5",
    client_name: "Orbit Audio",
    title: "Conversion API & Server-side Attribution",
    type: "other",
    brief_description: "Configure Meta CAPI server container on Stape.io to bypass iOS tracking limits.",
    assigned_to_staff_id: "staff-5",
    assigned_to_name: "Michael Chang",
    created_by_staff_id: "staff-1",
    priority: "low",
    due_date: "2026-09-20",
    publish_date: "2026-09-20",
    status: "backlog",
    client_visible: false,
    estimated_hours: 6,
    actual_hours_logged: 0,
    tags: ["analytics", "tracking"],
    subtasks: [],
    attachments: [],
    internal_comments: [],
    client_comments: [],
    activity_logs: [],
    time_entries: [],
    created_at: "2026-09-08T10:00:00Z",
    updated_at: "2026-09-08T10:00:00Z",
  },
  {
    id: "del-108",
    client_id: "client-2",
    client_name: "Fable Skincare",
    title: "Brand Asset Master Vector Kit",
    type: "static_post",
    brief_description: "Master vector kit for all product logos and packaging colors.",
    assigned_to_staff_id: "staff-3",
    assigned_to_name: "David Miller",
    created_by_staff_id: "staff-1",
    priority: "high",
    due_date: "2026-09-10",
    publish_date: "2026-09-10",
    status: "approved",
    client_visible: true,
    estimated_hours: 4,
    actual_hours_logged: 3.5,
    tags: ["brand", "vector"],
    subtasks: [],
    attachments: [],
    internal_comments: [],
    client_comments: [],
    activity_logs: [],
    time_entries: [],
    created_at: "2026-09-03T10:00:00Z",
    updated_at: "2026-09-10T11:00:00Z",
  },
];
