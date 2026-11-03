/**
 * Inbound Lead Capture & CRM Pipeline Synchronization Engine
 * Persists leads across local CRM storage, cross-window events, and remote database.
 */
import { STORAGE_KEYS, loadStoredData, saveStoredData } from "@/lib/db-sync";
import { AdvancedLead } from "@/lib/crm.functions";
import { ClientBusinessLead } from "@/lib/lumenandco.types";
import { supabase } from "@/lib/supabase-client";

export interface InboundLeadPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  budget?: string;
  goal?: string;
  message?: string;
  scheduled_meeting_date?: string;
  is_booking?: boolean;
}

export function parseBudgetValue(budgetStr?: string): number {
  if (!budgetStr) return 5000;
  if (budgetStr.includes("< $5k")) return 3500;
  if (budgetStr.includes("$5k – $15k")) return 10000;
  if (budgetStr.includes("$15k – $50k")) return 25000;
  if (budgetStr.includes("$50k+")) return 60000;
  const num = parseInt(budgetStr.replace(/[^0-9]/g, ""), 10);
  return isNaN(num) || num <= 0 ? 5000 : num;
}

export async function captureInboundLead(payload: InboundLeadPayload): Promise<{
  advancedLead: AdvancedLead;
  clientBusinessLead: ClientBusinessLead;
}> {
  const timestamp = new Date().toISOString();
  const dateNum = Date.now();
  const estimatedDealUsd = parseBudgetValue(payload.budget);
  const estimatedDealInr = estimatedDealUsd * 80;

  const contactName = payload.name.trim();
  const contactEmail = payload.email.trim();
  const contactPhone = payload.phone?.trim() || "+91 98765 43210";
  const companyName = payload.company?.trim() || `${contactName} (Direct Inquiry)`;

  // 1. Create AdvancedLead (for Agency B2B Sales Pipeline)
  const advancedLead: AdvancedLead = {
    id: `lead-agency-${dateNum}`,
    company_name: companyName,
    contact_name: contactName,
    contact_email: contactEmail,
    contact_phone: contactPhone,
    source: "website",
    stage: "new",
    estimated_deal_value: estimatedDealUsd,
    probability_to_close: 0.7,
    assigned_to_staff_id: "tm-[#sahit]",
    assigned_to_name: "Sahit Sai",
    next_action: payload.is_booking
      ? `Scheduled 30-Min Audit Call: ${payload.scheduled_meeting_date}`
      : `Audit Review & Strategic Roadmap (${payload.goal || "Growth Audit"})`,
    next_action_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    lead_score: 95,
    lead_temp: "hot",
    created_at: timestamp,
    website: payload.website || undefined,
    budget: payload.budget || undefined,
    goal: payload.goal || undefined,
    notes: payload.message || (payload.scheduled_meeting_date ? `Reserved slot: ${payload.scheduled_meeting_date}` : undefined),
    scheduled_meeting_date: payload.scheduled_meeting_date || undefined,
  };

  // 2. Create ClientBusinessLead (for Client Campaign Pipeline / Telecalling Roster)
  const clientBusinessLead: ClientBusinessLead = {
    id: `clead-agency-${dateNum}`,
    client_id: "client-lumen-inbound",
    client_name: "Lumen & Co Inbound Agency",
    lead_name: contactName,
    phone: contactPhone,
    email: contactEmail,
    city: payload.company ? `${payload.company} (Web)` : "Website Inbound",
    campaign_source: payload.is_booking
      ? `30-Min Calendar Meeting (${payload.scheduled_meeting_date})`
      : `Website Form (${payload.goal || "Growth Audit"})`,
    temperature: "hot",
    assigned_telecaller: "Sahit Sai (Sales Lead)",
    estimated_deal_value_rupees: estimatedDealInr,
    created_at: timestamp,
    next_followup_at: new Date(Date.now() + 86400000).toISOString(),
    notes: [
      payload.company ? `Company: ${payload.company}` : null,
      payload.website ? `Website: ${payload.website}` : null,
      payload.budget ? `Budget: ${payload.budget}` : null,
      payload.goal ? `Goal: ${payload.goal}` : null,
      payload.message ? `Message: ${payload.message}` : null,
      payload.scheduled_meeting_date ? `Meeting: ${payload.scheduled_meeting_date}` : null,
    ].filter(Boolean).join(" • "),
    call_history: [
      {
        id: `ch-${dateNum}`,
        timestamp,
        caller_name: "Website Bot",
        outcome: payload.is_booking ? "Calendar Call Booked" : "Inbound Lead Captured",
        notes: `Inbound website inquiry submitted. Goal: ${payload.goal || "Growth Audit"}. Budget: ${payload.budget || "N/A"}.`,
        tier_updated_to: "hot",
      },
    ],
  };

  // 3. Persist to LocalStorage (Primary single source of truth for CRM)
  if (typeof window !== "undefined") {
    try {
      const currentAdvancedLeads = loadStoredData<AdvancedLead[]>(STORAGE_KEYS.CRM_LEADS, []);
      const updatedAdvancedLeads = [
        advancedLead,
        ...currentAdvancedLeads.filter((l) => l.id !== advancedLead.id),
      ];
      saveStoredData(STORAGE_KEYS.CRM_LEADS, updatedAdvancedLeads);

      const currentClientLeads = loadStoredData<ClientBusinessLead[]>(
        STORAGE_KEYS.CRM_CLIENT_BUSINESS_LEADS,
        []
      );
      const updatedClientLeads = [
        clientBusinessLead,
        ...currentClientLeads.filter((l) => l.id !== clientBusinessLead.id),
      ];
      saveStoredData(STORAGE_KEYS.CRM_CLIENT_BUSINESS_LEADS, updatedClientLeads);
    } catch (err) {
      console.error("[LeadCapture] Failed to save lead to localStorage:", err);
    }
  }

  // 4. Dispatch browser custom events for real-time CRM updates
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(
        new CustomEvent("lumen:new-lead", {
          detail: { advancedLead, clientBusinessLead },
        })
      );
      // Trigger storage event so other open tabs/windows update
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.warn("[LeadCapture] Failed to dispatch lead event:", err);
    }
  }

  // 5. Remote Sync Attempt to Supabase (Non-blocking fallback)
  try {
    await supabase.from("leads").insert({
      name: payload.name,
      email: payload.email,
      company: payload.company || null,
      website: payload.website || null,
      budget: payload.budget || null,
      goal: payload.goal || null,
      message: payload.scheduled_meeting_date
        ? `Scheduled meeting for ${payload.scheduled_meeting_date}. ${payload.message || ""}`
        : payload.message || null,
    });
  } catch (err) {
    console.warn("[LeadCapture] Supabase remote sync notice (offline or skipped):", err);
  }

  return { advancedLead, clientBusinessLead };
}

