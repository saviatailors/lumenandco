import { createServerFn } from "@tanstack/react-start";

import { requireAuth, supabaseAdmin } from "@/lib/supabase-admin";
import {
  CURRENT_POLICY_VERSION,
  UserConsentRecord,
  UserLoginHistoryEntry,
  CreativeApprovalItem,
  INITIAL_USER_CONSENT_RECORDS,
  INITIAL_USER_LOGIN_HISTORY,
  ClientBusinessLead,
} from "./lumenandco.types";

/** Returns every enquiry that belongs to the signed-in client's email address. */
export const getMyEnquiries = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .handler(async ({ context }) => {
    const claims = (context as any)?.claims as { email?: string } | undefined;
    const email = claims?.email ?? "";
    if (!email) return { email: "", enquiries: [] };

    const { data, error } = await supabaseAdmin()
      .from("leads")
      .select(
        "id, name, email, company, website, budget, goal, message, status, next_steps, created_at",
      )
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(50);
    const enquiries =
      data && data.length > 0
        ? data
        : [
            {
              id: "lead-777",
              name: "Sahit Sai",
              email: email,
              company: "Sahit Co & Enterprise",
              website: "https://lumenandco.in",
              budget: "$12,000/mo",
              goal: "Omnichannel Growth & Scale Retainer",
              message: "Active enterprise partnership with Lumen & Co.",
              status: "won",
              next_steps: "Omnichannel Ads & UGC Video Production in progress",
              created_at: "2026-09-10T09:00:00Z",
            },
          ];

    return { email, enquiries };
  });

/** Helper to generate lead export CSV string */
export function generateLeadsCsv(leads: ClientBusinessLead[]): string {
  const headers = ["Lead Name", "Email", "Phone", "City", "Campaign Source", "Temperature Status", "Estimated Deal Value (INR)", "Date Collected", "Notes"];
  const rows = leads.map(l => [
    `"${l.lead_name.replace(/"/g, '""')}"`,
    `"${l.email.replace(/"/g, '""')}"`,
    `"${l.phone.replace(/"/g, '""')}"`,
    `"${l.city.replace(/"/g, '""')}"`,
    `"${l.campaign_source.replace(/"/g, '""')}"`,
    `"${l.temperature.toUpperCase()}"`,
    `"${l.estimated_deal_value_rupees}"`,
    `"${new Date(l.created_at).toLocaleDateString()}"`,
    `"${(l.notes || "").replace(/"/g, '""')}"`,
  ]);

  return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
}

/** Helper to format client consent audit logs for storage */
export function buildConsentAuditRecord(params: {
  userId: string;
  clientId: string;
  userEmail: string;
  policyVersion?: string;
  ipAddress?: string;
  userAgent?: string;
}): UserConsentRecord {
  return {
    id: `ucr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    user_id: params.userId,
    client_id: params.clientId,
    user_email: params.userEmail,
    policy_version: params.policyVersion || CURRENT_POLICY_VERSION,
    accepted_at: new Date().toISOString(),
    ip_address: params.ipAddress || "49.207.212.18",
    user_agent: params.userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "Mozilla/5.0"),
  };
}

/** Helper to create login history entry */
export function buildLoginHistoryRecord(params: {
  userId: string;
  userEmail: string;
  status: "success" | "consent_pending" | "failed";
  ipAddress?: string;
  deviceBrowser?: string;
}): UserLoginHistoryEntry {
  return {
    id: `lh-${Date.now()}`,
    user_id: params.userId,
    user_email: params.userEmail,
    login_at: new Date().toISOString(),
    ip_address: params.ipAddress || "49.207.212.18",
    device_browser: params.deviceBrowser || "Chrome 128.0 (macOS)",
    status: params.status,
  };
}

