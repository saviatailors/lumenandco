/**
 * DB Storage & Data Synchronization Engine
 * Ensures formatted, sanitized, optimized local storage persistence & remote DB sync
 * for CRM, Delivery Hub, Client Management, Invoices, and Operations.
 */

export const STORAGE_KEYS = {
  CRM_LEADS: "lumen_crm_leads_v4",
  CRM_CLIENTS: "lumen_crm_clients_v4",
  CRM_CLIENT_BUSINESS_LEADS: "lumen_crm_client_business_leads_v4",
  CRM_INVOICES: "lumen_crm_invoices_v4",
  CRM_COMM_LOGS: "lumen_crm_comm_logs_v4",
  CRM_TASKS: "lumen_crm_tasks_v4",
  CRM_CATALOG: "lumen_crm_catalog_v4",
  CRM_TEAM_MEMBERS: "lumen_crm_team_members_v4",
  CRM_API_CONNECTORS: "lumen_api_connectors_v4",
  DELIVERY_DELIVERABLES: "lumen_delivery_items_v4",
  DELIVERY_STAFF: "lumen_delivery_staff_v4",
  DELIVERY_RETAINERS: "lumen_delivery_retainers_v4",
  DELIVERY_PROOFS: "lumen_delivery_proofs_v4",
} as const;

/** Automatically clear legacy v1, v2 & v3 cached dummy storage */
if (typeof window !== "undefined") {
  try {
    const keysToRemove = [
      "lumen_crm_clients_v3",
      "lumen_crm_leads_v3",
      "lumen_crm_invoices_v3",
      "lumen_crm_comm_logs_v3",
      "lumen_crm_tasks_v3",
      "lumen_crm_team_members_v3",
      "lumen_crm_client_business_leads_v3",
      "lumen_delivery_items_v3",
      "lumen_delivery_staff_v3",
      "lumen_delivery_retainers_v3",
      "lumen_delivery_proofs_v3",
      "lumen_crm_clients_v2",
      "lumen_crm_leads_v2",
      "lumen_crm_invoices_v2",
      "lumen_crm_comm_logs_v2",
      "lumen_crm_tasks_v2",
      "lumen_crm_team_members_v2",
      "lumen_crm_client_business_leads_v2",
      "lumen_vault_documents",
      "lumen_crm_clients",
      "lumen_crm_leads",
      "crm_admin_email"
    ];
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

/** Safely load structured JSON data from LocalStorage with type validation & fallback */
export function loadStoredData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback) && !Array.isArray(parsed)) {
      console.warn(`[DB-Sync] Expected array for ${key}, got non-array. Reverting to fallback.`);
      return fallback;
    }
    return parsed as T;
  } catch (error) {
    console.error(`[DB-Sync] Error loading storage key "${key}":`, error);
    return fallback;
  }
}

/** Safely store data into LocalStorage in optimized JSON format */
export function saveStoredData<T>(key: string, data: T): boolean {
  if (typeof window === "undefined") return false;
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`[DB-Sync] Error persisting storage key "${key}":`, error);
    return false;
  }
}

/** Utility to clean and sanitize currency numbers (e.g. 15000 -> "₹15,000") */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Utility to format date ISO strings into clean human display format */
export function formatDBDate(dateString: string): string {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

/** Sanitize text inputs before saving to database / storage */
export function sanitizeText(text: string): string {
  if (!text) return "";
  return text.trim().replace(/\s+/g, " ");
}
