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

// --- INITIAL SEED DELIVERABLES ---
export const INITIAL_DELIVERABLES: Deliverable[] = [];
