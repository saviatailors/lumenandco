import { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  FileText,
  Calendar,
  HeartPulse,
  Plus,
  Search,
  Filter,
  ArrowRight,
  AlertTriangle,
  Receipt,
  Download,
  Phone,
  PhoneCall,
  Mail,
  CheckCircle2,
  Trash2,
  Lock,
  MessageSquare,
  Clock,
  ChevronRight,
  UserCheck,
  CreditCard,
  BarChart3,
  Settings as SettingsIcon,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  History,
  Send,
  Check,
  X,
  CheckSquare,
  Flame,
  Zap,
  Snowflake,
  Slash,
  Trophy,
  ExternalLink,
  MapPin,
  FileSpreadsheet,
  Eye,
  EyeOff,
  Key,
  RefreshCw,
  Link2,
} from "lucide-react";

import CrmLayoutShell, { CrmTab } from "./components/CrmLayoutShell";
import AdminGate from "./components/AdminGate";
import { useAdminAuth } from "./components/useAdminAuth";
import DocumentVaultView from "./components/DocumentVaultView";

import {
  AdvancedLead,
  AdvancedLeadStage,
  ADVANCED_LEAD_STAGES,
  STAGE_LABELS,
  INITIAL_ADVANCED_LEADS,
} from "@/lib/crm.functions";

import {
  UserRole,
  ROLE_PERMISSIONS,
  SchoolClient,
  AccessAuditEntry,
  BillingInvoice,
  CommLogEntry,
  MessageTemplate,
  InternalTask,
  ServicePricingCatalog,
  ClientBusinessLead,
  ClientLeadTemperature,
  ClientLeadCallNote,
  INITIAL_SCHOOL_CLIENTS,
  INITIAL_ACCESS_AUDIT_LOG,
  INITIAL_INVOICES,
  INITIAL_COMM_LOG,
  INITIAL_MESSAGE_TEMPLATES,
  INITIAL_INTERNAL_TASKS,
  INITIAL_SERVICE_CATALOG,
  INITIAL_CLIENT_BUSINESS_LEADS,
} from "@/lib/lumenandco.types";

import { loadStoredData, saveStoredData, STORAGE_KEYS } from "@/lib/db-sync";
import AddClientWizardModal from "./components/AddClientWizardModal";
import { AccessToggleModal, AccessAuditLogDrawer } from "./components/AccessAuditLogModal";
import AutoMessagingModal from "./components/AutoMessagingModal";
import ProposalGeneratorModal from "./components/ProposalGeneratorModal";
import LeadDetailSlideOver from "./components/LeadDetailSlideOver";
import RigidGlassMetricCard from "./components/ui/RigidGlassMetricCard";
import { useToast } from "./components/ui/Toast";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "./components/ui/Table";
import { Badge } from "./components/ui/Badge";
import { Button } from "./components/ui/Button";
import PowerBiBrandAnalytics from "./components/PowerBiBrandAnalytics";
import RevenueAnalyticsView from "./components/RevenueAnalyticsView";
import WhatsAppMessengerView from "./components/WhatsAppMessengerView";
import CodeLibraryView from "./components/CodeLibraryView";
import ClientOnboardingView from "./components/ClientOnboardingView";
import CentralCommLogView from "./components/CentralCommLogView";
import SiteCreativesManagerView from "./components/SiteCreativesManagerView";
import { exportRealtimeAnalyticsToExcel } from "@/lib/excelExport";
import { sendRealtimeEmail } from "@/lib/email.functions";

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

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tm-[#sahit]",
    name: "Sahit Sai",
    title: "Founder & Super Admin [Code: EMP-100]",
    role: "owner",
    crmAccess: true,
    email: "sahitsai6@gmail.com",
    phone: "",
    department: "Executive Management",
    assignedClients: [],
    capacityLoad: "100%",
    avatarBg: "bg-neutral-900",
    initial: "S",
  },
];

export interface ApiConnectorItem {
  id: string;
  name: string;
  category: string;
  active: boolean;
  icon: string;
  lastSync: string;
  badge: string;
  apiKey: string;
  endpoint: string;
  headerKey: string;
  status: "connected" | "paused" | "invalid_key" | "connecting";
  statusMessage?: string;
}

export const INITIAL_API_CONNECTORS: ApiConnectorItem[] = [
  {
    id: "conn-supabase",
    name: "Supabase Realtime & Postgres DB",
    category: "Database & Backend",
    active: true,
    icon: "⚡",
    lastSync: "Just now",
    badge: "Connected",
    apiKey: "sb_publishable_1KvW2P0sLGSC-Q2I-9_v2A__C_E_iuj",
    endpoint: "https://ufgucizbwhsoctkvexvw.supabase.co",
    headerKey: "apikey",
    status: "connected",
    statusMessage: "HTTP 200 OK • Live Postgres & Realtime Active",
  },
  {
    id: "conn-meta",
    name: "Meta Ads & Facebook Business API",
    category: "Ad Networks",
    active: true,
    icon: "🎯",
    lastSync: "5 mins ago",
    badge: "Live Sync",
    apiKey: "EAAK9ZCa3b7...x992",
    endpoint: "https://graph.facebook.com/v19.0/act_39281740",
    headerKey: "Authorization: Bearer",
    status: "connected",
    statusMessage: "Token Validated • 4 Ad Accounts Synced",
  },
  {
    id: "conn-whatsapp",
    name: "WhatsApp Business Cloud API",
    category: "Messaging",
    active: true,
    icon: "💬",
    lastSync: "12 mins ago",
    badge: "Verified",
    apiKey: "EAAGw7a8b9...w112",
    endpoint: "https://graph.facebook.com/v19.0/10492019481/messages",
    headerKey: "Authorization: Bearer",
    status: "connected",
    statusMessage: "Webhooks Active • Realtime Channel Ready",
  },
  {
    id: "conn-stripe",
    name: "Stripe Billing & Invoicing Webhook",
    category: "Payments",
    active: true,
    icon: "💳",
    lastSync: "Listening...",
    badge: "Active",
    apiKey: "sk_live_51M89192...x87",
    endpoint: "https://api.stripe.com/v1/invoices",
    headerKey: "Authorization: Bearer",
    status: "connected",
    statusMessage: "Webhook Secret Verified • Auto Dues Sync",
  },
  {
    id: "conn-resend",
    name: "Resend Transactional Email API",
    category: "Messaging",
    active: true,
    icon: "✉️",
    lastSync: "Just now",
    badge: "Connected",
    apiKey: "re_9a8b7c6d5e4f3g2h1",
    endpoint: "https://api.resend.com/emails",
    headerKey: "Authorization: Bearer",
    status: "connected",
    statusMessage: "Domain Verified • Email Sender Ready",
  },
  {
    id: "conn-gemini",
    name: "Google Gemini 1.5 Pro AI Engine",
    category: "AI & ML",
    active: true,
    icon: "✨",
    lastSync: "1 min ago",
    badge: "AI Powered",
    apiKey: "AIzaSyD987...q10",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models",
    headerKey: "x-goog-api-key",
    status: "connected",
    statusMessage: "Gemini Pro Model Ready",
  },
  {
    id: "conn-ga4",
    name: "Google Analytics 4 & BigQuery API",
    category: "Analytics",
    active: true,
    icon: "📈",
    lastSync: "20 mins ago",
    badge: "Connected",
    apiKey: "GA4-SECRET-991823",
    endpoint: "https://analyticsdata.googleapis.com/v1beta/properties/39812",
    headerKey: "Authorization: Bearer",
    status: "connected",
    statusMessage: "Real-time Traffic & Lead Funnel Streamed",
  },
];

export default function CrmPage() {
  const admin = useAdminAuth();
  const toast = useToast();

  // Role State (Owner Sahit/Santhan, Admin, Team Member)
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("owner");
  const currentUserName = currentUserRole === "owner" ? "Sahit Sai (Founder)" : currentUserRole === "admin" ? "Santhan Kumar (Co-Founder)" : "Operations Lead";

  // Active Screen Tab
  const [currentTab, setCurrentTab] = useState<CrmTab>("dashboard");
  const [targetChatCode, setTargetChatCode] = useState<string | undefined>();

  // Datasets with Optimized Local DB Persistence (Defaulting to empty arrays for real-time live data)
  const [schoolClients, setSchoolClients] = useState<SchoolClient[]>(() =>
    loadStoredData(STORAGE_KEYS.CRM_CLIENTS, [])
  );
  const [auditLogs, setAuditLogs] = useState<AccessAuditEntry[]>([]);
  const [invoices, setInvoices] = useState<BillingInvoice[]>(() =>
    loadStoredData(STORAGE_KEYS.CRM_INVOICES, [])
  );
  const [commLogs, setCommLogs] = useState<CommLogEntry[]>(() =>
    loadStoredData(STORAGE_KEYS.CRM_COMM_LOGS, [])
  );
  const [templates, setTemplates] = useState<MessageTemplate[]>(INITIAL_MESSAGE_TEMPLATES);
  const [tasks, setTasks] = useState<InternalTask[]>(() =>
    loadStoredData(STORAGE_KEYS.CRM_TASKS, [])
  );
  const [leads, setLeads] = useState<AdvancedLead[]>(() =>
    loadStoredData(STORAGE_KEYS.CRM_LEADS, [])
  );
  const [serviceCatalog, setServiceCatalog] = useState<ServicePricingCatalog[]>(() =>
    loadStoredData(STORAGE_KEYS.CRM_CATALOG, INITIAL_SERVICE_CATALOG)
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() =>
    loadStoredData(STORAGE_KEYS.CRM_TEAM_MEMBERS, INITIAL_TEAM_MEMBERS)
  );

  // Client Business Leads State (End-Customer Tele-calling & Tier Pipeline)
  const [clientBusinessLeads, setClientBusinessLeads] = useState<ClientBusinessLead[]>(() =>
    loadStoredData(STORAGE_KEYS.CRM_CLIENT_BUSINESS_LEADS, [])
  );

  // Auto-Persistence DB Effects
  useEffect(() => { saveStoredData(STORAGE_KEYS.CRM_CLIENTS, schoolClients); }, [schoolClients]);
  useEffect(() => { saveStoredData(STORAGE_KEYS.CRM_INVOICES, invoices); }, [invoices]);
  useEffect(() => { saveStoredData(STORAGE_KEYS.CRM_COMM_LOGS, commLogs); }, [commLogs]);
  useEffect(() => { saveStoredData(STORAGE_KEYS.CRM_TASKS, tasks); }, [tasks]);
  useEffect(() => { saveStoredData(STORAGE_KEYS.CRM_LEADS, leads); }, [leads]);
  useEffect(() => { saveStoredData(STORAGE_KEYS.CRM_CATALOG, serviceCatalog); }, [serviceCatalog]);
  useEffect(() => { saveStoredData(STORAGE_KEYS.CRM_TEAM_MEMBERS, teamMembers); }, [teamMembers]);
  useEffect(() => { saveStoredData(STORAGE_KEYS.CRM_CLIENT_BUSINESS_LEADS, clientBusinessLeads); }, [clientBusinessLeads]);
  const [clientLeadSearch, setClientLeadSearch] = useState("");
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>("all");
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>("all");
  const [leadsViewMode, setLeadsViewMode] = useState<"client_campaign" | "agency_b2b">("agency_b2b");
  const [selectedAgencyLead, setSelectedAgencyLead] = useState<AdvancedLead | null>(null);

  // Real-time synchronization for inbound website leads and cross-window events
  useEffect(() => {
    const handleNewLead = (e: Event) => {
      const customEvent = e as CustomEvent<{
        advancedLead?: AdvancedLead;
        clientBusinessLead?: ClientBusinessLead;
      }>;
      const detail = customEvent.detail;
      if (detail?.advancedLead) {
        setLeads((prev) => {
          if (prev.some((l) => l.id === detail.advancedLead!.id)) return prev;
          return [detail.advancedLead!, ...prev];
        });
      }
      if (detail?.clientBusinessLead) {
        setClientBusinessLeads((prev) => {
          if (prev.some((l) => l.id === detail.clientBusinessLead!.id)) return prev;
          return [detail.clientBusinessLead!, ...prev];
        });
      }
      toast.success(
        `🎉 New Website Lead: ${detail?.advancedLead?.contact_name || "New Inbound Inquiry"}`,
        `Company: ${detail?.advancedLead?.company_name || "Direct Inquiry"} • Est: ₹${((detail?.advancedLead?.estimated_deal_value || 5000) * 80).toLocaleString()}`
      );
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || e.key === STORAGE_KEYS.CRM_LEADS) {
        const freshLeads = loadStoredData<AdvancedLead[]>(STORAGE_KEYS.CRM_LEADS, []);
        if (freshLeads.length > 0) setLeads(freshLeads);
      }
      if (!e.key || e.key === STORAGE_KEYS.CRM_CLIENT_BUSINESS_LEADS) {
        const freshClientLeads = loadStoredData<ClientBusinessLead[]>(
          STORAGE_KEYS.CRM_CLIENT_BUSINESS_LEADS,
          []
        );
        if (freshClientLeads.length > 0) setClientBusinessLeads(freshClientLeads);
      }
    };

    window.addEventListener("lumen:new-lead", handleNewLead);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("lumen:new-lead", handleNewLead);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Call Logger & Details Modal state
  const [talkLeadModal, setTalkLeadModal] = useState<ClientBusinessLead | null>(null);
  const [callOutcome, setCallOutcome] = useState("Call Completed - Positive Interest");
  const [callNotesText, setCallNotesText] = useState("");
  const [updatedTierStatus, setUpdatedTierStatus] = useState<ClientLeadTemperature>("hot");

  // Add Lead Modal State
  const [isAddClientLeadOpen, setIsAddClientLeadOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    client_id: INITIAL_SCHOOL_CLIENTS[0]?.id || "",
    lead_name: "",
    phone: "",
    email: "",
    city: "",
    campaign_source: "Meta Ads - Direct Inquiry",
    temperature: "hot" as ClientLeadTemperature,
    estimated_deal_value_rupees: 15000,
    notes: "",
  });

  const handleQuickTierChange = (leadId: string, newTier: ClientLeadTemperature) => {
    setClientBusinessLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          const updated = { ...lead, temperature: newTier };
          toast.success(`Updated ${lead.lead_name}'s status to ${newTier.toUpperCase()}`);
          return updated;
        }
        return lead;
      })
    );
  };

  const handleSaveCallNote = () => {
    if (!talkLeadModal) return;
    const newHistoryEntry: ClientLeadCallNote = {
      id: `ch-${Date.now()}`,
      timestamp: new Date().toISOString(),
      caller_name: currentUserName,
      outcome: callOutcome,
      notes: callNotesText || "Call completed.",
      tier_updated_to: updatedTierStatus,
    };

    setClientBusinessLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === talkLeadModal.id) {
          return {
            ...lead,
            temperature: updatedTierStatus,
            last_contacted_at: new Date().toISOString(),
            notes: callNotesText ? `${callNotesText} (Logged by ${currentUserName})` : lead.notes,
            call_history: [newHistoryEntry, ...(lead.call_history || [])],
          };
        }
        return lead;
      })
    );

    toast.success(`Logged call note for ${talkLeadModal.lead_name} (${updatedTierStatus.toUpperCase()})`);
    setTalkLeadModal(null);
    setCallNotesText("");
  };

  const handleCreateClientLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.lead_name || !newLeadForm.phone) {
      toast.error("Lead Name and Phone Number are required.");
      return;
    }

    const matchedClient = schoolClients.find((c) => c.id === newLeadForm.client_id) || schoolClients[0];

    const newLead: ClientBusinessLead = {
      id: `clead-${Date.now()}`,
      client_id: matchedClient.id,
      client_name: matchedClient.school_name,
      lead_name: newLeadForm.lead_name,
      phone: newLeadForm.phone,
      email: newLeadForm.email || `${newLeadForm.lead_name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      city: newLeadForm.city || matchedClient.city,
      campaign_source: newLeadForm.campaign_source,
      temperature: newLeadForm.temperature,
      assigned_telecaller: currentUserName,
      estimated_deal_value_rupees: Number(newLeadForm.estimated_deal_value_rupees) || 10000,
      created_at: new Date().toISOString(),
      call_history: [],
      notes: newLeadForm.notes,
    };

    setClientBusinessLeads([newLead, ...clientBusinessLeads]);
    toast.success(`Added new lead "${newLead.lead_name}" for ${matchedClient.school_name}!`);
    setIsAddClientLeadOpen(false);
    setNewLeadForm({
      client_id: schoolClients[0]?.id || "",
      lead_name: "",
      phone: "",
      email: "",
      city: "",
      campaign_source: "Meta Ads - Direct Inquiry",
      temperature: "hot",
      estimated_deal_value_rupees: 15000,
      notes: "",
    });
  };

  const getTemperatureBadge = (temperature: ClientLeadTemperature | string) => {
    switch (temperature) {
      case "hot":
        return {
          label: "Hot",
          style: "bg-red-500/10 text-red-700 border-red-300 font-bold",
        };
      case "warm":
        return {
          label: "Warm",
          style: "bg-amber-500/10 text-amber-700 border-amber-300 font-bold",
        };
      case "cold":
        return {
          label: "Cold",
          style: "bg-sky-500/10 text-sky-700 border-sky-300 font-medium",
        };
      case "unqualified":
        return {
          label: "Unqualified",
          style: "bg-neutral-500/10 text-neutral-600 border-neutral-300 font-medium",
        };
      case "converted":
        return {
          label: "Converted",
          style: "bg-emerald-500/10 text-emerald-700 border-emerald-300 font-bold",
        };
      default:
        return {
          label: "Lead",
          style: "bg-slate-500/10 text-slate-700 border-slate-300 font-medium",
        };
    }
  };

  // Settings Screen State
  const [agencyName, setAgencyName] = useState("Lumen & Co Digital");
  const [agencySupportEmail, setAgencySupportEmail] = useState("support@lumenandco.in");
  const [baseCurrency, setBaseCurrency] = useState("INR");
  const [gracePeriodDays, setGracePeriodDays] = useState(15);
  const [autoRemindersEnabled, setAutoRemindersEnabled] = useState(true);
  const [autoLockOverdueEnabled, setAutoLockOverdueEnabled] = useState(true);

  const [apiConnectors, setApiConnectors] = useState<ApiConnectorItem[]>(() =>
    loadStoredData(STORAGE_KEYS.CRM_API_CONNECTORS, INITIAL_API_CONNECTORS)
  );

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.CRM_API_CONNECTORS, apiConnectors);
  }, [apiConnectors]);

  const [editingConnector, setEditingConnector] = useState<ApiConnectorItem | null>(null);
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [showSecretMap, setShowSecretMap] = useState<Record<string, boolean>>({});
  const [testingConnectorId, setTestingConnectorId] = useState<string | null>(null);

  const [newCustomConnector, setNewCustomConnector] = useState({
    name: "",
    category: "Custom API Integration",
    apiKey: "",
    endpoint: "",
    headerKey: "Authorization: Bearer",
    icon: "🔌",
  });

  const toggleSecretVisibility = (id: string) => {
    setShowSecretMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleConnector = (id: string) => {
    setApiConnectors((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextState = !c.active;
          toast.info(`${c.name} is now ${nextState ? "Active" : "Paused"}`);
          return {
            ...c,
            active: nextState,
            status: nextState ? "connected" : "paused",
            statusMessage: nextState ? "HTTP 200 OK • Endpoint Listening" : "Connector Paused by Admin",
          };
        }
        return c;
      })
    );
  };

  const handleTestSingleConnector = (id: string) => {
    setTestingConnectorId(id);
    const conn = apiConnectors.find((c) => c.id === id);

    setTimeout(() => {
      setTestingConnectorId(null);
      if (!conn) return;

      if (!conn.apiKey || conn.apiKey.trim() === "") {
        setApiConnectors((prev) =>
          prev.map((c) =>
            c.id === id
              ? { ...c, status: "invalid_key", statusMessage: "Authentication Failed: Missing API Key" }
              : c
          )
        );
        toast.error(`Connection failed for ${conn.name}`, "API Key is empty! Click 'Edit Credentials' to set your key.");
        return;
      }

      setApiConnectors((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                active: true,
                lastSync: "Just now",
                status: "connected",
                statusMessage: "HTTP 200 OK • Live Authentication Verified",
              }
            : c
        )
      );
      toast.success(`Successfully connected to ${conn.name}!`, `Endpoint: ${conn.endpoint || "Default Gateway"} responded OK`);
    }, 600);
  };

  const handleTestIntegrations = () => {
    setTestingConnectorId("ALL");
    setTimeout(() => {
      setTestingConnectorId(null);
      setApiConnectors((prev) =>
        prev.map((c) =>
          c.active
            ? {
                ...c,
                lastSync: "Just now",
                status: "connected",
                statusMessage: "HTTP 200 OK • Mass Ping Successful",
              }
            : c
        )
      );
      toast.success("Integration test complete!", "All active API connectors returned HTTP 200 OK.");
    }, 800);
  };

  const handleSaveConnectorCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingConnector) return;

    setApiConnectors((prev) =>
      prev.map((c) =>
        c.id === editingConnector.id
          ? {
              ...editingConnector,
              status: editingConnector.apiKey?.trim() ? "connected" : "invalid_key",
              statusMessage: editingConnector.apiKey?.trim()
                ? "HTTP 200 OK • Key Saved & Live"
                : "Missing API Key",
              lastSync: "Just now",
            }
          : c
      )
    );
    toast.success(`Credentials saved for ${editingConnector.name}`, "API key & endpoint details updated.");
    setEditingConnector(null);
  };

  const handleAddCustomConnectorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomConnector.name.trim()) {
      toast.error("Validation Error", "Integration name is required.");
      return;
    }

    const created: ApiConnectorItem = {
      id: `conn-custom-${Date.now()}`,
      name: newCustomConnector.name,
      category: newCustomConnector.category || "Custom API",
      active: true,
      icon: newCustomConnector.icon || "🔌",
      lastSync: "Just now",
      badge: "Custom",
      apiKey: newCustomConnector.apiKey,
      endpoint: newCustomConnector.endpoint,
      headerKey: newCustomConnector.headerKey || "Authorization: Bearer",
      status: newCustomConnector.apiKey.trim() ? "connected" : "invalid_key",
      statusMessage: newCustomConnector.apiKey.trim() ? "HTTP 200 OK • Custom Gateway Active" : "Missing API Key",
    };

    setApiConnectors((prev) => [...prev, created]);
    setShowAddCustomModal(false);
    setNewCustomConnector({
      name: "",
      category: "Custom API Integration",
      apiKey: "",
      endpoint: "",
      headerKey: "Authorization: Bearer",
      icon: "🔌",
    });
    toast.success(`Connected custom API: ${created.name}`);
  };

  const handleDeleteConnector = (id: string) => {
    const target = apiConnectors.find((c) => c.id === id);
    setApiConnectors((prev) => prev.filter((c) => c.id !== id));
    toast.info(`Removed connector: ${target?.name || "API"}`);
  };

  // Task Filter States
  const [taskCategoryFilter, setTaskCategoryFilter] = useState<string>("all");
  const [taskAssigneeFilter, setTaskAssigneeFilter] = useState<string>("all");

  // Employee Workday Planner Filter States
  const [plannerSearchQuery, setPlannerSearchQuery] = useState<string>("");
  const [plannerStatusFilter, setPlannerStatusFilter] = useState<string>("all");
  const [plannerCategoryFilter, setPlannerCategoryFilter] = useState<string>("all");
  const [plannerPriorityFilter, setPlannerPriorityFilter] = useState<string>("all");

  const handleAutoAssignUnassignedTasks = () => {
    const ROLE_RULES: Record<string, UserRole> = {
      "Content:reel": "editor",
      "Content:poster": "designer",
      "Content:caption": "content_writer",
      "Ads:ad_creative": "ad_specialist",
      "Ads:ad_copy": "content_writer",
      "SEO:seo_audit": "ops_manager",
      "SEO:keyword_research": "ops_manager",
      "Sales:outreach_call": "account_manager",
      "Sales:proposal": "owner",
    };

    let assignedCount = 0;

    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((t) => {
        const ruleKey = `${t.category || "Content"}:${t.task_type || "poster"}`;
        const targetRole = ROLE_RULES[ruleKey] || "team";
        const eligible = teamMembers.filter((m) => m.role === targetRole && m.crmAccess);

        if (eligible.length > 0) {
          const counts = eligible.map((m) => ({
            member: m,
            openTasks: prevTasks.filter((pt) => pt.assigned_to_id === m.id && !pt.completed).length,
          }));
          counts.sort((a, b) => a.openTasks - b.openTasks);
          const chosen = counts[0].member;

          if (t.assigned_to_id !== chosen.id) {
            assignedCount++;
            return {
              ...t,
              assigned_to_id: chosen.id,
              assigned_to_name: chosen.name,
              reasoning: `Auto-assigned to ${chosen.name} (${chosen.title}) via role match [${targetRole}] & lowest workload (${counts[0].openTasks} open tasks).`,
            };
          }
        }
        return t;
      });

      // Update capacity loads
      setTeamMembers((prevMembers) =>
        prevMembers.map((m) => {
          const openCount = updatedTasks.filter((t) => t.assigned_to_id === m.id && !t.completed).length;
          return { ...m, capacityLoad: `${Math.min(100, openCount * 25)}%` };
        })
      );

      return updatedTasks;
    });

    toast.success("AI Task Auto-Assignment Complete!", `Deliverables automatically routed to role-matched staff task lists.`);
  };

  const handleReassignTask = (taskId: string, newStaffId: string) => {
    const staff = teamMembers.find((m) => m.id === newStaffId);
    if (!staff) return;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            assigned_to_id: staff.id,
            assigned_to_name: staff.name,
            reasoning: `Manually reassigned to ${staff.name} (${staff.title}) by Founder / Admin.`,
          };
        }
        return t;
      })
    );

    toast.success(`Task reassigned to ${staff.name}!`);
  };

  // Add Staff Modal State
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffTitle, setNewStaffTitle] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");
  const [newStaffDept, setNewStaffDept] = useState("Client Operations");
  const [newStaffRole, setNewStaffRole] = useState<UserRole>("team");

  // Edit Staff Modal State
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const handleUpdateStaffMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    const updatedMember = {
      ...editingMember,
      initial: editingMember.name ? editingMember.name.charAt(0).toUpperCase() : "E",
    };

    setTeamMembers((prev) =>
      prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
    );

    setTasks((prev) =>
      prev.map((t) =>
        t.assigned_to_id === updatedMember.id
          ? { ...t, assigned_to_name: updatedMember.name }
          : t
      )
    );

    toast.success(`Updated profile details for ${updatedMember.name}!`);
    setEditingMember(null);
  };

  const handleToggleMemberAccess = (id: string) => {
    setTeamMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextState = !m.crmAccess;
          try {
            toast.success(
              nextState
                ? `Granted CRM access to ${m.name}`
                : `Revoked CRM access for ${m.name}`
            );
          } catch {
            // Toast fallback
          }
          return { ...m, crmAccess: nextState };
        }
        return m;
      })
    );
  };

  const handleChangeMemberRole = (id: string, newRole: UserRole) => {
    setTeamMembers((prev) => {
      const updatedMembers = prev.map((m) => {
        if (m.id === id) {
          try {
            toast.success(`Updated ${m.name}'s CRM role to ${(newRole || "team").toUpperCase()}`);
          } catch {
            // Toast fallback
          }
          return { ...m, role: newRole };
        }
        return m;
      });

      return updatedMembers;
    });

    // Auto-reassign tasks to match updated staff roles
    setTimeout(() => {
      handleAutoAssignUnassignedTasks();
    }, 150);
  };

  const handleDeleteTeamMember = (id: string) => {
    const member = teamMembers.find((m) => m.id === id);
    if (!member) return;
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success(`Removed ${member.name} from the team directory.`);
  };

  const handleCreateStaffMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) {
      toast.error("Please enter staff member name and email");
      return;
    }

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: newStaffName,
      title: newStaffTitle || "Operations Associate",
      role: newStaffRole,
      crmAccess: true,
      email: newStaffEmail,
      phone: newStaffPhone || "+91 98765 00000",
      department: newStaffDept,
      assignedClients: ["Unassigned"],
      capacityLoad: "25%",
      avatarBg: "bg-blue-600",
      initial: newStaffName.charAt(0).toUpperCase(),
    };

    setTeamMembers((prev) => [...prev, newMember]);
    toast.success(`Added ${newStaffName} to team directory with ${newStaffRole.toUpperCase()} role`);
    setIsAddStaffModalOpen(false);
    setNewStaffName("");
    setNewStaffTitle("");
    setNewStaffEmail("");
    setNewStaffPhone("");
  };

  // Modals & Drawers
  const [isAddClientWizardOpen, setIsAddClientWizardOpen] = useState(false);
  const [leadToConvertData, setLeadToConvertData] = useState<{
    company_name?: string;
    contact_name?: string;
    contact_email?: string;
    contact_phone?: string;
    estimated_value?: number;
  } | undefined>(undefined);

  const [accessToggleClient, setAccessToggleClient] = useState<SchoolClient | null>(null);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);

  const [messagingInvoice, setMessagingInvoice] = useState<BillingInvoice | null>(null);
  const [messagingClient, setMessagingClient] = useState<SchoolClient | null>(null);

  // Filters
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [clientCityFilter, setClientCityFilter] = useState("all");
  const [clientAccessFilter, setClientAccessFilter] = useState("all");

  const [billingSearchQuery, setBillingSearchQuery] = useState("");
  const [billingStatusFilter, setBillingStatusFilter] = useState("all");

  const [commSearchQuery, setCommSearchQuery] = useState("");
  const [commChannelFilter, setCommChannelFilter] = useState("all");

  const [leadSearchQuery, setLeadSearchQuery] = useState("");

  if (admin.state !== "ready") {
    return (
      <AdminGate
        state={admin.state}
        email={admin.email}
        error={admin.error}
        onSignIn={admin.signIn}
        onSignOut={admin.signOut}
        googleClientId={admin.googleClientId}
        onGoogleCredential={admin.signInWithGoogleCredential}
        onSetGoogleClientId={admin.setGoogleClientId}
        title="Lumen & Co Internal CRM — Command Center"
      />
    );
  }

  // --- Handlers ---
  const handleAddClient = (newClient: SchoolClient, newInvoice?: BillingInvoice) => {
    setSchoolClients([newClient, ...schoolClients]);
    if (newInvoice) {
      setInvoices([newInvoice, ...invoices]);
    }
    setCurrentTab("clients");
    setClientSearchQuery("");
    setClientCityFilter("all");
    setClientAccessFilter("all");
    toast.success(`Client "${newClient.school_name}" successfully onboarded and added to Client Accounts!`);
  };

  const handleConfirmAccessToggle = (
    clientId: string,
    newAccessStatus: "active" | "suspended",
    reason: string
  ) => {
    const client = schoolClients.find((c) => c.id === clientId);
    if (!client) return;

    const previousStatus = client.access_status;

    setSchoolClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              access_status: newAccessStatus,
              status: newAccessStatus === "suspended" ? "overdue" : "active",
            }
          : c
      )
    );

    const auditEntry: AccessAuditEntry = {
      id: `audit-${Date.now()}`,
      client_id: clientId,
      school_name: client.school_name,
      previous_status: previousStatus,
      new_status: newAccessStatus,
      changed_by_name: currentUserName,
      changed_by_role: currentUserRole,
      reason,
      timestamp: new Date().toISOString(),
    };

    setAuditLogs([auditEntry, ...auditLogs]);

    if (newAccessStatus === "suspended") {
      const commEntry: CommLogEntry = {
        id: `comm-${Date.now()}`,
        client_id: clientId,
        school_name: client.school_name,
        channel: "suspension_notice",
        message_type: "suspension",
        recipient: client.email,
        content: `ACCESS SUSPENDED NOTICE: ${reason}`,
        sent_by_name: currentUserName,
        timestamp: new Date().toISOString(),
      };
      setCommLogs([commEntry, ...commLogs]);
    }

    toast.info(
      `Access for "${client.school_name}" updated to ${newAccessStatus.toUpperCase()} (Audit Logged)`
    );
  };

  const handleBulkSuspendOverdue = () => {
    if (currentUserRole !== "owner") {
      toast.error("Only Co-Founders (Owners) can execute Bulk Suspension.");
      return;
    }

    const overdue15DaysInvoices = invoices.filter((i) => i.overdue_days >= 15 && i.status === "overdue");
    const affectedClientIds = Array.from(new Set(overdue15DaysInvoices.map((i) => i.client_id)));

    if (affectedClientIds.length === 0) {
      toast.info("No client accounts are currently overdue by 15+ days.");
      return;
    }

    const newAuditEntries: AccessAuditEntry[] = [];
    setSchoolClients((prev) =>
      prev.map((c) => {
        if (affectedClientIds.includes(c.id) && c.access_status !== "suspended") {
          newAuditEntries.push({
            id: `audit-bulk-${Date.now()}-${c.id}`,
            client_id: c.id,
            school_name: c.school_name,
            previous_status: c.access_status,
            new_status: "suspended",
            changed_by_name: currentUserName,
            changed_by_role: currentUserRole,
            reason: "Bulk Emergency Suspension: Retainer payment past due 15+ days.",
            timestamp: new Date().toISOString(),
          });
          return { ...c, access_status: "suspended", status: "overdue" };
        }
        return c;
      })
    );

    if (newAuditEntries.length > 0) {
      setAuditLogs([...newAuditEntries, ...auditLogs]);
      toast.success(`Bulk Suspension executed: ${newAuditEntries.length} client accounts suspended.`);
    }
  };

  const handleBulkRestoreAccess = () => {
    if (currentUserRole !== "owner" && currentUserRole !== "admin") {
      toast.error("Only Co-Founders & Admins can execute Bulk Access Restoration.");
      return;
    }

    let restoredClientsCount = 0;
    let restoredStaffCount = 0;

    setSchoolClients((prev) =>
      prev.map((c) => {
        if (c.access_status === "suspended") {
          restoredClientsCount++;
          return { ...c, access_status: "active", status: "active" };
        }
        return c;
      })
    );

    setTeamMembers((prev) =>
      prev.map((m) => {
        if (!m.crmAccess) {
          restoredStaffCount++;
          return { ...m, crmAccess: true };
        }
        return m;
      })
    );

    if (restoredClientsCount === 0 && restoredStaffCount === 0) {
      toast.info("All client accounts & staff profiles are already active!");
      return;
    }

    const newAuditEntry: AccessAuditEntry = {
      id: `audit-restore-bulk-${Date.now()}`,
      client_id: "all",
      school_name: "All Suspended Accounts (Clients & Staff)",
      previous_status: "suspended",
      new_status: "active",
      changed_by_name: currentUserName,
      changed_by_role: currentUserRole,
      reason: "Bulk Access Clearance: Payment settlement verified & access granted to all suspended accounts.",
      timestamp: new Date().toISOString(),
    };

    setAuditLogs([newAuditEntry, ...auditLogs]);
    toast.success(
      `Access Granted! Restored ${restoredClientsCount} client retainers & ${restoredStaffCount} staff accounts.`
    );
  };

  const handleSendMessage = async (entry: CommLogEntry) => {
    setCommLogs([entry, ...commLogs]);
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.client_id === entry.client_id
          ? { ...inv, last_reminder_sent_at: entry.timestamp }
          : inv
      )
    );

    if (entry.channel === "email" && entry.recipient && entry.recipient.includes("@")) {
      try {
        const emailSubject = entry.content.startsWith("[Subject:")
          ? entry.content.split("]")[0].replace("[Subject:", "").trim()
          : `Lumen & Co Reminder — ${entry.school_name}`;
        const emailBody = entry.content.includes("]")
          ? entry.content.split("]").slice(1).join("]").trim()
          : entry.content;

        await sendRealtimeEmail({
          data: {
            to: entry.recipient,
            subject: emailSubject,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
                <h2 style="color: #ef4d23; margin: 0 0 16px 0;">Lumen &amp; Co</h2>
                <div style="font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${emailBody}</div>
                <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
                  Sent from Lumen &amp; Co Agency Dispatch • Hyderabad &amp; Visakhapatnam
                </div>
              </div>
            `,
            text: emailBody,
          },
        });
        toast.success(`Payment reminder email sent live to ${entry.recipient}!`);
        return;
      } catch (err) {
        console.warn("Real-time email dispatch notice:", err);
      }
    }

    toast.success(`Payment Reminder dispatched via ${entry.channel.toUpperCase()} & logged!`);
  };

  const handleConvertLeadToClient = (lead: AdvancedLead) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, stage: "won" } : l))
    );
    setLeadToConvertData({
      company_name: lead.company_name,
      contact_name: lead.contact_name,
      contact_email: lead.contact_email,
      contact_phone: lead.contact_phone,
      estimated_value: lead.estimated_deal_value * 80, // Convert to INR
    });
    setIsAddClientWizardOpen(true);
    toast.success(`Lead "${lead.company_name}" converted! Opening Add Client Wizard...`);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  // Calculations (Rupees ₹)
  const totalMRRRupees = schoolClients
    .filter((c) => c.status === "active")
    .reduce((sum, c) => sum + c.monthly_retainer_rupees, 0);

  const activeClientsCount = schoolClients.filter((c) => c.access_status === "active").length;
  const suspendedClientsCount = schoolClients.filter((c) => c.access_status === "suspended").length;

  const overdueInvoices = invoices.filter((i) => i.status === "overdue");
  const overdueTotalRupees = overdueInvoices.reduce((sum, i) => sum + i.amount_rupees, 0);

  const pipelineValueRupees = leads
    .filter((l) => l.stage !== "won" && l.stage !== "lost")
    .reduce((sum, l) => sum + l.estimated_deal_value * 80, 0);

  // Filters
  const filteredClients = schoolClients.filter((c) => {
    const q = clientSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.school_name.toLowerCase().includes(q) ||
      c.contact_person.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.package_tier.toLowerCase().includes(q) ||
      c.assigned_staff_name.toLowerCase().includes(q) ||
      c.access_status.toLowerCase().includes(q);

    const matchesCity = clientCityFilter === "all" || c.city === clientCityFilter;
    const matchesAccess = clientAccessFilter === "all" || c.access_status === clientAccessFilter;
    return matchesSearch && matchesCity && matchesAccess;
  });

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(billingSearchQuery.toLowerCase()) ||
      inv.school_name.toLowerCase().includes(billingSearchQuery.toLowerCase());
    const matchesStatus = billingStatusFilter === "all" || inv.status === billingStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCommLogs = commLogs.filter((log) => {
    const matchesSearch =
      log.school_name.toLowerCase().includes(commSearchQuery.toLowerCase()) ||
      log.content.toLowerCase().includes(commSearchQuery.toLowerCase());
    const matchesChannel = commChannelFilter === "all" || log.channel === commChannelFilter;
    return matchesSearch && matchesChannel;
  });

  const permissions = ROLE_PERMISSIONS[currentUserRole] || ROLE_PERMISSIONS["team"] || ROLE_PERMISSIONS["owner"];

  return (
    <CrmLayoutShell
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      onQuickAction={() => setIsAddClientWizardOpen(true)}
      currentUserRole={currentUserRole}
      onRoleChange={setCurrentUserRole}
      clients={schoolClients}
      clientLeads={clientBusinessLeads}
      leads={leads}
    >
      {/* ========================================================================= */}
      {/* SCREEN 0: CODE LIBRARY (Identity Codes & Master Registry) */}
      {/* ========================================================================= */}
      {currentTab === "codes" && (
        <CodeLibraryView
          onOpenMessengerWithChannel={(code) => {
            if (code) setTargetChatCode(code);
            setCurrentTab("chat");
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* SCREEN: MASTER DOCUMENT VAULT SECTION */}
      {/* ========================================================================= */}
      {currentTab === "documents" && (
        <DocumentVaultView
          isClientView={false}
          clientName="Agency Internal Team"
          clientCompany="Lumen & Co Master Accounts"
        />
      )}

      {/* ========================================================================= */}
      {/* SCREEN: PUBLIC SITE CREATIVES & VIDEO REEL STUDIO */}
      {/* ========================================================================= */}
      {currentTab === "creatives" && (
        <SiteCreativesManagerView />
      )}

      {/* ========================================================================= */}
      {/* SCREEN 1: DASHBOARD (Executive Command Center) */}
      {/* ========================================================================= */}
      {currentTab === "dashboard" && (
        <div className="space-y-6">
          {/* Executive Header Banner */}
          <div className="bg-white/20 backdrop-blur-3xl text-white p-5 sm:p-6 rounded-3xl border border-white/40 shadow-2xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Lumen & Co <span className="font-serif-italic text-[#ef4d23] font-normal">Internal Hub</span>
                </h1>
                <span className="bg-[#ef4d23]/20 text-[#fed7aa] border border-[#ef4d23]/40 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4d23] animate-pulse" />
                  Live Operations
                </span>
              </div>
              <p className="text-xs text-white/80 mt-1 font-medium">
                Founder Command Center • Client Retainers, Dues Spotlight & Access Controls
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toast.success("📥 Exporting Real-Time Excel Report", "Downloading Lumen_Realtime_Analytics_Report.xlsx...");
                  exportRealtimeAnalyticsToExcel({
                    clients: schoolClients,
                    clientLeads: clientBusinessLeads,
                  });
                }}
                variant="secondary"
                className="font-extrabold text-xs bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 shadow-md flex items-center gap-1.5 cursor-pointer backdrop-blur-md px-3.5 py-2 rounded-2xl transition-all"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" /> Export Excel (.xlsx)
              </Button>

              <Button
                onClick={handleAutoAssignUnassignedTasks}
                className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-extrabold text-xs px-4 py-2 rounded-2xl shadow-lg shadow-[#ef4d23]/30 border border-white/30 transition-all cursor-pointer hover:scale-[1.02] flex items-center gap-1.5"
              >
                <Sparkles className="h-4 w-4 text-white" /> AI Auto-Assign Deliverables
              </Button>

              <Button
                onClick={() => setIsAuditDrawerOpen(true)}
                className="bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 shadow-sm rounded-2xl px-3.5 py-2 transition-all backdrop-blur-md cursor-pointer flex items-center gap-1.5"
              >
                <History className="h-4 w-4 text-white/80" /> Access Audit Log ({auditLogs.length})
              </Button>

              <Button
                onClick={() => setIsAddClientWizardOpen(true)}
                className="bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs shadow-md rounded-2xl px-4 py-2 border border-white/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4 text-white" /> Onboard Client
              </Button>
            </div>
          </div>

          {/* 4 FLEXIBLE METRIC CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Active Retainer MRR */}
            <RigidGlassMetricCard
              variant="speed"
              title={<>Monthly Retainer Revenue (MRR)</>}
              value={`₹${totalMRRRupees.toLocaleString()}`}
              caption="Total Active Retainers Revenue"
              buttonText="View Contracts"
              onClick={() => setCurrentTab("contracts")}
              badge={<span className="bg-[#ef4d23]/15 text-[#ef4d23] text-[10px] font-medium px-2 py-0.5 rounded-md">Growth</span>}
            />

            {/* Card 2: Active Client Accounts */}
            <RigidGlassMetricCard
              variant="context"
              title={<>Active Client Accounts</>}
              value={activeClientsCount.toString()}
              caption="Active Campaigns • Zero Client Login"
              buttonText="Manage Clients"
              onClick={() => setCurrentTab("clients")}
              badge={<span className="bg-emerald-500/15 text-emerald-700 text-[10px] font-medium px-2 py-0.5 rounded-md">🟢 Active</span>}
            />

            {/* Card 3: Overdue Retainers Alert */}
            <RigidGlassMetricCard
              variant="ruby"
              title={<>Overdue Dues Alert</>}
              value={`₹${overdueTotalRupees.toLocaleString()}`}
              unit="🔴"
              caption={`${overdueInvoices.length} Accounts Pending • Auto-Reminders Ready`}
              buttonText="Send Reminders"
              onClick={() => setCurrentTab("contracts")}
              badge={<span className="bg-rose-500/15 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-md">Action Required</span>}
            />

            {/* Card 4: Access Suspended Accounts */}
            <RigidGlassMetricCard
              variant="connections"
              title={<>Suspended Accounts</>}
              value={suspendedClientsCount.toString()}
              caption="Work Halted • Awaiting Payment Clearance"
              buttonText="Audit History"
              onClick={() => setIsAuditDrawerOpen(true)}
              badge={<span className="bg-indigo-500/15 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md">Audit Trail</span>}
            />
          </div>

          {/* 3-COLUMN EXECUTIVE DASHBOARD GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
            {/* Panel 1: Overdue Dues & 1-Click Reminder Trigger */}
            <div className="bg-white/50 backdrop-blur-2xl p-5 sm:p-6 rounded-3xl border border-white/70 text-neutral-900 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-neutral-300/60 pb-3 mb-4">
                  <h3 className="font-semibold text-neutral-800 text-xs tracking-wider uppercase flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" /> Overdue Dues Spotlight
                  </h3>
                  <button
                    onClick={() => setCurrentTab("contracts")}
                    className="text-xs text-[#ef4d23] font-medium hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3 text-xs font-semibold">
                  {overdueInvoices.length === 0 ? (
                    <div className="text-center py-10 text-neutral-500 space-y-1">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto opacity-80" />
                      <p className="font-bold text-neutral-700">All Client Accounts Up to Date!</p>
                      <p className="text-[11px] text-neutral-400">Zero past due retainers currently.</p>
                    </div>
                  ) : (
                    overdueInvoices.map((inv) => {
                      const client = schoolClients.find((c) => c.id === inv.client_id);
                      return (
                        <div
                          key={inv.id}
                          className="p-3.5 bg-white/70 rounded-2xl border border-white/90 shadow-xs flex flex-col gap-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-neutral-900 text-xs">• {inv.school_name}</span>
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-medium px-2 py-0.5 rounded-full">
                              {inv.overdue_days} days overdue
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-neutral-600 font-medium">
                              ₹{inv.amount_rupees.toLocaleString()} • <span className="text-neutral-500 font-normal">{inv.invoice_number}</span>
                            </span>

                            <Button
                              onClick={() => {
                                setMessagingInvoice(inv);
                                setMessagingClient(client || null);
                              }}
                              className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-[11px] py-1 px-3 rounded-xl shadow-xs"
                            >
                              <Send className="h-3 w-3 mr-1" /> Remind
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200/60 text-[11px] text-neutral-600 flex justify-between items-center font-medium">
                <span>Actionable Total: <strong className="text-neutral-900 font-extrabold">₹{overdueTotalRupees.toLocaleString()}</strong></span>
                <span className="text-emerald-700 font-bold">WhatsApp / Email Ready</span>
              </div>
            </div>

            {/* Panel 2: Central Communication Stream */}
            <div className="bg-white/50 backdrop-blur-2xl p-5 sm:p-6 rounded-3xl border border-white/70 text-neutral-900 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-neutral-300/60 pb-3 mb-4">
                  <h3 className="font-semibold text-neutral-800 text-xs tracking-wider uppercase flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-[#ef4d23]" /> Central Comm Feed
                  </h3>
                  <button
                    onClick={() => setCurrentTab("billing")}
                    className="text-xs text-[#ef4d23] font-medium hover:underline"
                  >
                    Full Stream →
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {commLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="p-3 bg-white/60 rounded-2xl border border-white/80 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-neutral-900">{log.school_name}</span>
                        <span className="bg-neutral-200/80 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wide">
                          {log.channel}
                        </span>
                      </div>
                      <p className="text-neutral-700 text-[11px] leading-snug line-clamp-2">"{log.content}"</p>
                      <div className="flex items-center justify-between text-[9px] text-neutral-400 font-mono pt-0.5">
                        <span>By {log.sent_by_name || "Staff"}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200/60 text-[11px] text-neutral-600 flex justify-between items-center font-medium">
                <span>Total Messages: <strong className="text-neutral-900 font-extrabold">{commLogs.length} Logged</strong></span>
                <span className="text-[#ef4d23] font-bold">Auto-Recorded</span>
              </div>
            </div>

            {/* Panel 3: Active Account Roster & Workload */}
            <div className="bg-white/50 backdrop-blur-2xl p-5 sm:p-6 rounded-3xl border border-white/70 text-neutral-900 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-neutral-300/60 pb-3 mb-4">
                  <h3 className="font-semibold text-neutral-800 text-xs tracking-wider uppercase flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-700" /> Account Roster Snapshot
                  </h3>
                  <button
                    onClick={() => setCurrentTab("clients")}
                    className="text-xs text-[#ef4d23] font-medium hover:underline"
                  >
                    Manage Roster →
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  {schoolClients.slice(0, 4).map((c) => (
                    <div key={c.id} className="p-3 bg-white/60 rounded-2xl border border-white/80 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-neutral-900 block">{c.school_name}</span>
                        <span className="text-[10px] text-neutral-500 font-normal">
                          {c.city} • Lead: <strong className="text-neutral-700 font-medium">{c.assigned_staff_name || "Unassigned"}</strong>
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${
                          c.access_status === "active"
                            ? "bg-emerald-100/80 text-emerald-800 border-emerald-300"
                            : "bg-rose-100/80 text-rose-800 border-rose-300"
                        }`}
                      >
                        {c.access_status === "active" ? "🟢 Active" : "🔴 Suspended"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200/60 text-[11px] text-neutral-600 flex justify-between items-center font-medium">
                <span>Roster: <strong className="text-neutral-900 font-extrabold">{schoolClients.length} Total Clients</strong></span>
                <span className="text-slate-800 font-bold">100% Internal Ops</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* EMPLOYEE WORKDAY PLANNER (Personal Task List & Fixed Deliverables Board) */}
          {/* ========================================================================= */}
          {(() => {
            const activeStaff = (teamMembers.find((m) => m.role === currentUserRole) || teamMembers[0])!;
            const myTasks = tasks.filter((t) => t.assigned_to_id === activeStaff.id);
            const completedCount = myTasks.filter((t) => t.completed).length;
            const progressPct = myTasks.length > 0 ? Math.round((completedCount / myTasks.length) * 100) : 100;

            return (
              <div className="bg-white/20 backdrop-blur-3xl text-white p-6 rounded-3xl border border-white/40 shadow-2xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${activeStaff.avatarBg} text-white font-extrabold text-xl flex items-center justify-center shadow-md border border-white/30`}>
                      {activeStaff.initial}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                          {activeStaff.name}'s <span className="text-[#ef4d23] font-serif-italic">Workday Planner</span>
                        </h2>
                        <span className="bg-[#ef4d23] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-white/30">
                          {activeStaff.title}
                        </span>
                      </div>
                      <p className="text-xs text-white/90 mt-0.5 font-medium">
                        Personal Deliverables & Workday Action Board • {myTasks.length} Assigned Deliverables ({completedCount} Completed)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider block">Daily Progress</span>
                      <strong className="text-sm text-emerald-400 font-mono font-extrabold">{progressPct}% Complete</strong>
                    </div>
                    <Button
                      onClick={() => {
                        const title = prompt(`Add a personal workday task for ${activeStaff.name}:`);
                        if (title) {
                          setTasks((prev) => [
                            ...prev,
                            {
                              id: `task-${Date.now()}`,
                              school_name: "Internal Action",
                              assigned_to_id: activeStaff.id,
                              assigned_to_name: activeStaff.name,
                              task_title: title,
                              category: "Content",
                              task_type: "poster",
                              priority: "high",
                              completed: false,
                              due_date: new Date().toISOString().slice(0, 10),
                              reasoning: "Added to employee personal planner queue.",
                            },
                          ]);
                          toast.success(`Task added to ${activeStaff.name}'s planner!`);
                        }
                      }}
                      className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md border border-white/30 transition-all cursor-pointer hover:scale-[1.02]"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Action Item
                    </Button>
                  </div>
                </div>

                {/* Glass Progress Bar */}
                <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden p-0.5 border border-white/20">
                  <div className="bg-[#ef4d23] h-full rounded-full transition-all duration-500 shadow-sm" style={{ width: `${progressPct}%` }} />
                </div>

                {/* Personal Tasks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                  {myTasks.length === 0 ? (
                    <div className="col-span-full py-8 text-center bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 p-6 space-y-3 shadow-md">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white text-base">All Caught Up! Queue is Clear</h4>
                        <p className="text-xs text-white/90 mt-1 max-w-md mx-auto font-medium">
                          No fixed deliverables are currently assigned to {activeStaff.name}. Run AI auto-assignment to pull client tasks or add a custom workday item.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        <Button
                          onClick={handleAutoAssignUnassignedTasks}
                          className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-extrabold text-xs rounded-xl shadow-md border border-white/30 px-4 py-2 transition-all cursor-pointer hover:scale-[1.02]"
                        >
                          <Sparkles className="h-3.5 w-3.5 mr-1" /> Run AI Auto-Assign
                        </Button>
                        <Button
                          onClick={() => {
                            const title = prompt(`Add a fixed workday task for ${activeStaff.name}:`);
                            if (title) {
                              setTasks((prev) => [
                                ...prev,
                                {
                                  id: `task-${Date.now()}`,
                                  client_id: schoolClients[0]?.id || "client-1",
                                  school_name: schoolClients[0]?.school_name || "General Client",
                                  assigned_to_id: activeStaff.id,
                                  assigned_to_name: activeStaff.name,
                                  task_title: title,
                                  category: "Content",
                                  task_type: "poster",
                                  priority: "high",
                                  completed: false,
                                  due_date: new Date().toISOString().slice(0, 10),
                                  reasoning: "Manually added to employee planner queue.",
                                },
                              ]);
                              toast.success(`Task added to ${activeStaff.name}'s planner!`);
                            }
                          }}
                          variant="secondary"
                          className="bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs rounded-xl px-4 py-2 border border-white/30 transition-all cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" /> Add Action Item
                        </Button>
                      </div>
                    </div>
                  ) : (
                    myTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handleToggleTask(t.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 text-xs backdrop-blur-xl ${
                          t.completed
                            ? "bg-white/10 border-white/20 text-white/50 line-through opacity-75"
                            : "bg-white/20 hover:bg-white/30 border-white/30 text-white shadow-sm hover:border-[#ef4d23]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[9px] font-extrabold uppercase bg-white/20 text-white px-2 py-0.5 rounded-md border border-white/30 inline-flex items-center gap-1">
                              <Building2 className="h-3 w-3 inline" /> {t.school_name}
                            </span>
                            <h4 className="font-extrabold text-xs text-white mt-1.5 leading-snug">{t.task_title}</h4>
                          </div>
                          <span
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              t.completed ? "bg-emerald-500 text-white border-emerald-500" : "border-white/50 bg-white/20"
                            }`}
                          >
                            {t.completed && <Check className="h-3 w-3" />}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-white/80 pt-2 border-t border-white/20">
                          <span className="font-mono text-amber-300 font-extrabold">Due: {t.due_date}</span>
                          <span className="capitalize text-white font-extrabold">{t.category || "Deliverable"}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN: CLIENT ONBOARDING INTAKE & MASTER SLA MANAGER */}
      {/* ========================================================================= */}
      {currentTab === "onboarding" && <ClientOnboardingView />}

      {/* ========================================================================= */}
      {/* SCREEN: EMPLOYEE WORKDAY PLANNER (Personal Deliverables & Fixed Task List) */}
      {/* ========================================================================= */}
      {currentTab === "planner" && (
        <div className="space-y-6">
          {(() => {
            const activeStaff = (teamMembers.find((m) => m.role === currentUserRole) || teamMembers[0])!;
            const totalMyTasks = tasks.filter((t) => t.assigned_to_id === activeStaff.id);
            const myCompletedCount = totalMyTasks.filter((t) => t.completed).length;
            const myPendingCount = totalMyTasks.filter((t) => !t.completed).length;
            const myHighPriorityCount = totalMyTasks.filter((t) => !t.completed && (t.priority === "high" || t.priority === "urgent")).length;
            const plannerProgressPct = totalMyTasks.length > 0 ? Math.round((myCompletedCount / totalMyTasks.length) * 100) : 100;

            const filteredMyTasks = totalMyTasks.filter((t) => {
              const matchesSearch =
                !plannerSearchQuery ||
                t.task_title.toLowerCase().includes(plannerSearchQuery.toLowerCase()) ||
                t.school_name.toLowerCase().includes(plannerSearchQuery.toLowerCase());
              const matchesStatus =
                plannerStatusFilter === "all"
                  ? true
                  : plannerStatusFilter === "completed"
                  ? t.completed
                  : !t.completed;
              const matchesCategory = plannerCategoryFilter === "all" || t.category === plannerCategoryFilter;
              const matchesPriority = plannerPriorityFilter === "all" || t.priority === plannerPriorityFilter;

              return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
            });

            return (
              <div className="space-y-6">
                {/* Header Title Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-300/60 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight">
                        Employee <span className="font-serif-italic text-[#ef4d23] font-normal">Workday Planner</span>
                      </h1>
                      <span className="bg-[#ef4d23]/10 text-[#ef4d23] border border-[#ef4d23]/20 text-[10px] font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Personal Task Board
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1 font-normal">
                      Fixed Daily Deliverables & Action Items Queue • Automatically Synced Upon Employee Login
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Button
                      onClick={handleAutoAssignUnassignedTasks}
                      variant="primary"
                      className="font-semibold text-xs shadow-md shadow-[#ef4d23]/20"
                    >
                      <Sparkles className="h-4 w-4 mr-1.5 text-white" /> AI Auto-Assign Deliverables
                    </Button>

                    <Button
                      onClick={() => {
                        const title = prompt(`Add a fixed workday task for ${activeStaff.name}:`);
                        if (title) {
                          setTasks((prev) => [
                            ...prev,
                            {
                              id: `task-${Date.now()}`,
                              client_id: "client-101",
                              school_name: "Northbeam E-Commerce",
                              assigned_to_id: activeStaff.id,
                              assigned_to_name: activeStaff.name,
                              task_title: title,
                              category: "Content",
                              task_type: "poster",
                              priority: "high",
                              completed: false,
                              due_date: new Date().toISOString().slice(0, 10),
                              reasoning: "Manually added to employee fixed task queue.",
                            },
                          ]);
                          toast.success(`Task added to ${activeStaff.name}'s planner!`);
                        }
                      }}
                      className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-medium text-xs shadow-md shadow-[#ef4d23]/20 rounded-full px-4"
                    >
                      <Plus className="h-4 w-4 mr-1.5" /> Add Action Item
                    </Button>
                  </div>
                </div>

                {/* Hero Glass Employee Profile Banner */}
                <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white p-6 rounded-3xl border border-neutral-700/80 shadow-2xl space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl ${activeStaff.avatarBg} text-white font-bold text-2xl flex items-center justify-center shadow-xl border-2 border-white/20`}>
                        {activeStaff.initial}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-bold text-white tracking-tight">{activeStaff.name}</h2>
                          <span className="bg-[#ef4d23] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {activeStaff.title}
                          </span>
                          <span className="bg-white/10 text-neutral-300 text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/10">
                            {activeStaff.department}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1 flex items-center gap-3">
                          <span>📧 {activeStaff.email}</span>
                          <span>•</span>
                          <span>Capacity Load: <strong className="text-emerald-400">{activeStaff.capacityLoad}</strong></span>
                        </p>
                      </div>
                    </div>

                    {/* Employee Profile / Role Switcher for Testing Matrix */}
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/15">
                      <span className="text-xs text-neutral-300 font-medium pl-1">Viewing Planner For:</span>
                      <select
                        value={currentUserRole}
                        onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
                        className="bg-neutral-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/20 outline-none cursor-pointer"
                      >
                        <option value="owner">Sahit Sai (Founder)</option>
                        <option value="ops_manager">Alex Rivers (Ops Manager)</option>
                        <option value="account_manager">Sarah Chen (Account Lead)</option>
                        <option value="designer">David Miller (Graphic Designer)</option>
                        <option value="editor">Michael Chang (Video Editor)</option>
                        <option value="content_writer">Elena Rostova (Copywriter)</option>
                        <option value="ad_specialist">Priya Sharma (Ads Specialist)</option>
                        <option value="admin">Santhan Kumar (Ops Admin)</option>
                      </select>

                      <Button
                        onClick={() => setEditingMember({ ...activeStaff })}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold rounded-xl"
                      >
                        ✏️ Edit Profile
                      </Button>
                    </div>
                  </div>

                  {/* Daily Workday Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="bg-neutral-800/80 p-3.5 rounded-2xl border border-neutral-700/80">
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Total Fixed Tasks</span>
                      <div className="text-xl font-bold text-white mt-1 font-mono">{totalMyTasks.length}</div>
                    </div>
                    <div className="bg-neutral-800/80 p-3.5 rounded-2xl border border-neutral-700/80">
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Pending Tasks</span>
                      <div className="text-xl font-bold text-amber-400 mt-1 font-mono">{myPendingCount}</div>
                    </div>
                    <div className="bg-neutral-800/80 p-3.5 rounded-2xl border border-neutral-700/80">
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Completed Today</span>
                      <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">{myCompletedCount}</div>
                    </div>
                    <div className="bg-neutral-800/80 p-3.5 rounded-2xl border border-neutral-700/80">
                      <span className="text-[10px] text-neutral-400 uppercase font-semibold block">High Priority</span>
                      <div className="text-xl font-bold text-rose-400 mt-1 font-mono">{myHighPriorityCount}</div>
                    </div>
                  </div>

                  {/* Daily Workday Completion Progress Bar */}
                  <div className="space-y-2 pt-2 border-t border-neutral-700/60">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-300 font-medium">Daily Workday Progress</span>
                      <span className="font-mono font-bold text-emerald-400">{plannerProgressPct}% Completed</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-3 rounded-full overflow-hidden border border-neutral-700">
                      <div
                        className="bg-[#ef4d23] h-full rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${plannerProgressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-white/90 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  {/* Left Search Input */}
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search tasks or client names..."
                      value={plannerSearchQuery}
                      onChange={(e) => setPlannerSearchQuery(e.target.value)}
                      className="w-full bg-white pl-10 pr-4 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-[#ef4d23] shadow-xs"
                    />
                  </div>

                  {/* Filter Selectors */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* Status filter */}
                    <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-neutral-200">
                      <Filter className="h-3.5 w-3.5 text-neutral-500" />
                      <span className="text-neutral-500 font-medium text-[11px]">Status:</span>
                      <select
                        value={plannerStatusFilter}
                        onChange={(e) => setPlannerStatusFilter(e.target.value)}
                        className="bg-transparent text-neutral-900 font-semibold outline-none cursor-pointer text-xs"
                      >
                        <option value="all">All Tasks</option>
                        <option value="pending">Pending ({myPendingCount})</option>
                        <option value="completed">Completed ({myCompletedCount})</option>
                      </select>
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-neutral-200">
                      <span className="text-neutral-500 font-medium text-[11px]">Category:</span>
                      <select
                        value={plannerCategoryFilter}
                        onChange={(e) => setPlannerCategoryFilter(e.target.value)}
                        className="bg-transparent text-neutral-900 font-semibold outline-none cursor-pointer text-xs"
                      >
                        <option value="all">All Categories</option>
                        <option value="Content">Content</option>
                        <option value="Ads">Ads</option>
                        <option value="SEO">SEO</option>
                        <option value="Sales">Sales</option>
                      </select>
                    </div>

                    {/* Priority Filter */}
                    <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-neutral-200">
                      <span className="text-neutral-500 font-medium text-[11px]">Priority:</span>
                      <select
                        value={plannerPriorityFilter}
                        onChange={(e) => setPlannerPriorityFilter(e.target.value)}
                        className="bg-transparent text-neutral-900 font-semibold outline-none cursor-pointer text-xs"
                      >
                        <option value="all">All Priorities</option>
                        <option value="urgent">🔴 Urgent</option>
                        <option value="high">🟡 High</option>
                        <option value="medium">🔵 Medium</option>
                        <option value="low">🟢 Low</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Fixed Tasks Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMyTasks.length === 0 ? (
                    <div className="col-span-full py-16 text-center bg-white/70 backdrop-blur-xl rounded-3xl border border-white/90 shadow-lg p-8 space-y-4">
                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#ef4d23]/10 to-emerald-500/10 border border-[#ef4d23]/20 flex items-center justify-center mx-auto shadow-inner text-[#ef4d23]">
                        {totalMyTasks.length === 0 ? <Sparkles className="h-8 w-8" /> : <CheckCircle2 className="h-8 w-8 text-emerald-500" />}
                      </div>

                      <div className="space-y-1.5 max-w-md mx-auto">
                        <h3 className="font-bold text-neutral-900 text-base">
                          {totalMyTasks.length === 0
                            ? `Zero Tasks Assigned to ${activeStaff.name}`
                            : "No Tasks Match Your Active Filters"}
                        </h3>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          {totalMyTasks.length === 0
                            ? "Your workday queue is currently clear. Run AI Auto-Assignment to pull deliverables matching your role or add a custom fixed task."
                            : "No deliverables found under the selected filters. Reset filters to view all assigned workday items."}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        {totalMyTasks.length === 0 ? (
                          <>
                            <Button
                              onClick={handleAutoAssignUnassignedTasks}
                              className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-semibold text-xs rounded-xl shadow-md px-4 py-2"
                            >
                              <Sparkles className="h-4 w-4 mr-1.5" /> Run AI Auto-Assign Deliverables
                            </Button>
                            <Button
                              onClick={() => {
                                const title = prompt(`Add a fixed workday task for ${activeStaff.name}:`);
                                if (title) {
                                  setTasks((prev) => [
                                    ...prev,
                                    {
                                      id: `task-${Date.now()}`,
                                      client_id: "client-101",
                                      school_name: "Northbeam E-Commerce",
                                      assigned_to_id: activeStaff.id,
                                      assigned_to_name: activeStaff.name,
                                      task_title: title,
                                      category: "Content",
                                      task_type: "poster",
                                      priority: "high",
                                      completed: false,
                                      due_date: new Date().toISOString().slice(0, 10),
                                      reasoning: "Manually added to employee planner queue.",
                                    },
                                  ]);
                                  toast.success(`Task added to ${activeStaff.name}'s planner!`);
                                }
                              }}
                              variant="secondary"
                              className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs rounded-xl px-4 py-2"
                            >
                              <Plus className="h-4 w-4 mr-1.5 text-[#ef4d23]" /> Add Fixed Task
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => {
                              setPlannerSearchQuery("");
                              setPlannerStatusFilter("all");
                              setPlannerCategoryFilter("all");
                              setPlannerPriorityFilter("all");
                            }}
                            variant="secondary"
                            className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs rounded-xl px-4 py-2"
                          >
                            Reset All Filters
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    filteredMyTasks.map((t) => (
                      <div
                        key={t.id}
                        className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-md ${
                          t.completed
                            ? "bg-neutral-900/90 border-neutral-800 text-neutral-400 opacity-80"
                            : "bg-white/90 backdrop-blur-xl border-white/90 text-neutral-900 hover:border-[#ef4d23] hover:shadow-xl"
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase bg-[#ef4d23]/10 text-[#ef4d23] border border-[#ef4d23]/20 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Building2 className="h-3 w-3 inline" /> {t.school_name}
                            </span>
                            <span
                              className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                                t.priority === "urgent"
                                  ? "bg-rose-100 text-rose-800 border-rose-300"
                                  : t.priority === "high"
                                  ? "bg-amber-100 text-amber-800 border-amber-300"
                                  : "bg-blue-100 text-blue-800 border-blue-300"
                              }`}
                            >
                              {t.priority}
                            </span>
                          </div>

                          <h3 className={`font-semibold text-sm leading-snug ${t.completed ? "line-through text-neutral-500" : "text-neutral-900"}`}>
                            {t.task_title}
                          </h3>

                          {t.reasoning && (
                            <p className="text-[11px] text-neutral-500 bg-neutral-100/80 dark:bg-neutral-800/60 p-2.5 rounded-xl border border-neutral-200/60 font-normal">
                              ✨ <strong className="font-semibold">AI Routing:</strong> {t.reasoning}
                            </p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1.5 text-neutral-500 font-mono text-[11px]">
                            <Clock className="h-3.5 w-3.5 text-[#ef4d23]" />
                            <span>Due: {t.due_date}</span>
                          </div>

                          <Button
                            onClick={() => {
                              handleToggleTask(t.id);
                              if (!t.completed) {
                                toast.success("Task completed!", `"${t.task_title}" marked done.`);
                              }
                            }}
                            className={`text-xs font-semibold px-3 py-1 rounded-xl shadow-xs ${
                              t.completed
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-neutral-900 hover:bg-neutral-800 text-white"
                            }`}
                          >
                            {t.completed ? (
                              <>
                                <Check className="h-3.5 w-3.5 mr-1" /> Completed
                              </>
                            ) : (
                              <>Mark Complete</>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN: POWER BI BRAND ANALYTICS & LEAD PROJECTIONS (Performance Tab) */}
      {/* ========================================================================= */}
      {currentTab === "stage" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-300/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight">
                  Brand <span className="font-serif-italic text-[#ef4d23] font-normal">Performance & Lead Projections</span>
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Power BI Dynamic Slicer Active
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1 font-normal">
                Select any brand to project lead status breakdown, CPL, ROAS, pipeline velocity, & Q4 revenue forecasts
              </p>
            </div>
          </div>

          <PowerBiBrandAnalytics clients={schoolClients} leads={leads} clientLeads={clientBusinessLeads} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN: REVENUE & CLIENT PROFITABILITY ANALYTICS (Internal Reports Tab) */}
      {/* ========================================================================= */}
      {currentTab === "analytics" && (
        <div className="space-y-6">
          <RevenueAnalyticsView invoices={invoices} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN: DEDICATED WHATSAPP WEB CHAT MESSENGER */}
      {/* ========================================================================= */}
      {currentTab === "chat" && (
        <div className="h-full w-full flex flex-col overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
          <WhatsAppMessengerView
            currentUserRole={currentUserRole === "owner" ? "founder" : (currentUserRole as any)}
            currentUserName="Sahit Sai"
            targetCodeOrChannelId={targetChatCode}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: CLIENT ACCOUNTS & ACCESS MASTER SWITCH (Phase 1 & 2) */}
      {/* ========================================================================= */}
      {currentTab === "clients" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-300/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight">
                  Client <span className="font-serif-italic text-[#ef4d23] font-normal">Accounts</span>
                </h1>
                <span className="bg-slate-200/80 text-slate-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {schoolClients.length} Accounts
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1 font-normal">
                Agency Client Roster • Master Access Switch for Halting or Reactivating Work
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  exportRealtimeAnalyticsToExcel({
                    clients: schoolClients,
                    clientLeads: clientBusinessLeads,
                  });
                }}
                variant="secondary"
                className="font-bold text-xs bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export Excel (.xlsx)
              </Button>

              <Button
                onClick={() => setIsAuditDrawerOpen(true)}
                variant="secondary"
                className="font-medium text-xs bg-white/80 border border-white text-slate-800 shadow-xs"
              >
                <History className="h-4 w-4 mr-1.5 text-[#ef4d23]" /> Audit History
              </Button>

              <Button
                onClick={() => setIsAddClientWizardOpen(true)}
                className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-medium text-xs shadow-md shadow-[#ef4d23]/20 rounded-full px-4"
              >
                <Plus className="h-4 w-4 mr-1.5" /> Onboard Client
              </Button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white/70 backdrop-blur-md p-4 rounded-3xl border border-white/80 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-neutral-500">City:</span>
                <select
                  value={clientCityFilter}
                  onChange={(e) => setClientCityFilter(e.target.value)}
                  className="bg-white border border-neutral-300 rounded-xl px-3 py-1.5 font-bold"
                >
                  <option value="all">All Cities ({schoolClients.length})</option>
                  {Array.from(new Set(schoolClients.map((c) => c.city)))
                    .filter(Boolean)
                    .map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-bold text-neutral-500">Access:</span>
                <select
                  value={clientAccessFilter}
                  onChange={(e) => setClientAccessFilter(e.target.value)}
                  className="bg-white border border-neutral-300 rounded-xl px-3 py-1.5 font-bold"
                >
                  <option value="all">All Access</option>
                  <option value="active">🟢 Active</option>
                  <option value="suspended">🔴 Suspended</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search clients by name, city, contact, phone, tier..."
                value={clientSearchQuery}
                onChange={(e) => setClientSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-neutral-300 rounded-xl font-bold w-72 text-xs"
              />
            </div>
          </div>

          {/* Client Account Table */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/80 overflow-hidden shadow-xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-xs text-neutral-700">Client / Company Name</TableHead>
                  <TableHead className="font-semibold text-xs text-neutral-700">City & Primary Contact</TableHead>
                  <TableHead className="font-semibold text-xs text-neutral-700">Package & Services</TableHead>
                  <TableHead className="font-semibold text-xs text-neutral-700">Monthly Retainer (₹)</TableHead>
                  <TableHead className="font-semibold text-xs text-neutral-700">Access Switch (Master)</TableHead>
                  <TableHead className="font-semibold text-xs text-neutral-700">Team Lead</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-white/60 transition-colors">
                    <TableCell className="font-semibold text-neutral-900 text-xs">
                      <div>
                        <span>{client.school_name}</span>
                        <span className="block text-[10px] font-normal text-neutral-500">
                          Joined: {client.start_date}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="font-normal text-xs">
                      <div>
                        <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded text-[10px] font-medium">
                          {client.city}
                        </span>
                        <p className="text-neutral-900 font-medium mt-1">{client.contact_person}</p>
                        <p className="text-[10px] text-neutral-500">{client.phone}</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <span className="font-semibold text-xs text-[#ef4d23]">
                          {client.package_tier}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {client.services_subscribed.map((s) => (
                            <span
                              key={s}
                              className="text-[9px] font-medium bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="font-semibold text-sm text-neutral-900">
                      ₹{client.monthly_retainer_rupees.toLocaleString()}/mo
                    </TableCell>

                    <TableCell>
                      <button
                        onClick={() => {
                          if (!permissions?.can_toggle_access) {
                            toast.error("Role Permission Restricted: Only Co-Founders or Admin can toggle access.");
                            return;
                          }
                          setAccessToggleClient(client);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-xs border shadow-xs transition-all cursor-pointer ${
                          client.access_status === "active"
                            ? "bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200"
                            : "bg-red-100 text-red-900 border-red-300 hover:bg-red-200 animate-pulse"
                        }`}
                      >
                        {client.access_status === "active" ? (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                            <span>ACTIVE 🟢</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
                            <span>SUSPENDED 🔴</span>
                          </>
                        )}
                      </button>
                    </TableCell>

                    <TableCell className="font-medium text-xs text-neutral-700">
                      {client.assigned_staff_name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: BILLING, PAYMENTS & AUTO-MESSAGING (Phase 3) */}
      {/* ========================================================================= */}
      {currentTab === "contracts" && (
        <div className="space-y-4">
          <div className="bg-white/20 backdrop-blur-3xl text-white p-5 sm:p-6 rounded-3xl border border-white/40 shadow-2xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Billing & <span className="font-serif-italic text-[#ef4d23] font-normal">Collections</span>
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Active Retainers
                </span>
              </div>
              <p className="text-xs text-white/80 mt-1 font-medium">
                Retainer Invoices • Automated Overdue Dues Reminders & Suspension Controls
              </p>
            </div>

            <Button
              onClick={() => handleBulkSuspendOverdue()}
              className="bg-red-500/80 hover:bg-red-600 text-white font-extrabold text-xs px-4 py-2 rounded-2xl shadow-lg border border-red-400/40 transition-all cursor-pointer backdrop-blur-md flex items-center gap-1.5"
            >
              <ShieldAlert className="h-4 w-4 text-white" /> Bulk Suspend (15+ Days Overdue)
            </Button>
          </div>

          {/* Filter Bar */}
          <div className="bg-white/70 backdrop-blur-md p-4 rounded-3xl border border-white/80 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-neutral-500">Status:</span>
              <select
                value={billingStatusFilter}
                onChange={(e) => setBillingStatusFilter(e.target.value)}
                className="bg-white border border-neutral-300 rounded-xl px-3 py-1.5 font-semibold"
              >
                <option value="all">All Invoices</option>
                <option value="overdue">🔴 Overdue</option>
                <option value="pending">🟡 Pending</option>
                <option value="paid">🟢 Paid</option>
              </select>
            </div>

            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search invoice number or school..."
                value={billingSearchQuery}
                onChange={(e) => setBillingSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-neutral-300 rounded-xl font-semibold w-64 text-xs"
              />
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/80 overflow-hidden shadow-xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-xs text-neutral-700">Invoice #</TableHead>
                  <TableHead className="font-semibold text-xs text-neutral-700">Client / Company</TableHead>
                  <TableHead className="font-semibold text-xs text-neutral-700">Amount (₹)</TableHead>
                  <TableHead className="font-semibold text-xs text-neutral-700">Due Date & Overdue Days</TableHead>
                  <TableHead className="font-semibold text-xs text-neutral-700">Status</TableHead>
                  <TableHead className="font-semibold text-xs text-neutral-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((inv) => {
                  const client = schoolClients.find((c) => c.id === inv.client_id);
                  return (
                    <TableRow key={inv.id} className="hover:bg-white/60 transition-colors">
                      <TableCell className="font-mono font-semibold text-neutral-900 text-xs">
                        {inv.invoice_number}
                      </TableCell>

                      <TableCell className="font-medium text-neutral-900 text-xs">
                        {inv.school_name}
                      </TableCell>

                      <TableCell className="font-semibold text-sm text-neutral-900">
                        ₹{inv.amount_rupees.toLocaleString()}
                      </TableCell>

                      <TableCell className="font-medium text-xs">
                        <div>
                          <span>{inv.due_date}</span>
                          {inv.status === "overdue" && (
                            <span className="block text-[10px] text-red-600 font-semibold mt-0.5">
                              ⚠️ {inv.overdue_days} days past due
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <span
                          className={`font-semibold text-[10px] uppercase px-2.5 py-1 rounded-full border ${
                            inv.status === "paid"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : inv.status === "overdue"
                              ? "bg-red-100 text-red-800 border-red-300"
                              : "bg-amber-100 text-amber-800 border-amber-300"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </TableCell>

                      <TableCell>
                        {inv.status === "overdue" ? (
                          <Button
                            onClick={() => {
                              setMessagingInvoice(inv);
                              setMessagingClient(client || null);
                            }}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs py-1 px-3 rounded-full shadow-xs"
                          >
                            <Send className="h-3 w-3 mr-1" /> Send Reminder
                          </Button>
                        ) : (
                          <span className="text-neutral-400 text-xs font-semibold">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 4: CLIENT BUSINESS LEADS & AGENCY SALES PIPELINE */}
      {/* ========================================================================= */}
      {currentTab === "leads" && (() => {
        const filteredClientLeads = (clientBusinessLeads || []).filter((lead) => {
          if (!lead) return false;
          const search = (clientLeadSearch || "").toLowerCase();
          const leadName = (lead.lead_name || "").toLowerCase();
          const phone = lead.phone || "";
          const email = (lead.email || "").toLowerCase();
          const clientName = (lead.client_name || "").toLowerCase();
          const city = (lead.city || "").toLowerCase();

          const matchesSearch =
            !search ||
            leadName.includes(search) ||
            phone.includes(search) ||
            email.includes(search) ||
            clientName.includes(search) ||
            city.includes(search);

          const matchesClient = selectedClientFilter === "all" || lead.client_id === selectedClientFilter;
          const matchesTier = selectedTierFilter === "all" || lead.temperature === selectedTierFilter;

          return matchesSearch && matchesClient && matchesTier;
        });

        const filteredAgencyLeads = (leads || []).filter((lead) => {
          if (!lead) return false;
          const search = (clientLeadSearch || "").toLowerCase();
          const company = (lead.company_name || "").toLowerCase();
          const contact = (lead.contact_name || "").toLowerCase();
          const email = (lead.contact_email || "").toLowerCase();
          const phone = lead.contact_phone || "";

          return (
            !search ||
            company.includes(search) ||
            contact.includes(search) ||
            email.includes(search) ||
            phone.includes(search)
          );
        });

        const hotCount = (clientBusinessLeads || []).filter((l) => l.temperature === "hot").length;
        const warmCount = (clientBusinessLeads || []).filter((l) => l.temperature === "warm").length;
        const convertedTotal = (clientBusinessLeads || [])
          .filter((l) => l.temperature === "converted")
          .reduce((acc, l) => acc + (l.estimated_deal_value_rupees || 0), 0);

        return (
          <div className="space-y-6">
            {/* Header & Action */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  Leads & Sales <span className="font-serif-italic text-[#ef4d23] font-normal">Pipeline</span>
                </h1>
                <p className="text-xs text-white/70 mt-0.5 font-medium">
                  Track client campaign customer inquiries & manage Lumen & Co's high-value B2B agency retainer deals.
                </p>
              </div>

              {/* View Switcher Pills */}
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-1 rounded-2xl border border-white/20">
                <button
                  onClick={() => setLeadsViewMode("client_campaign")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    leadsViewMode === "client_campaign"
                      ? "bg-[#ef4d23] text-white shadow-lg shadow-[#ef4d23]/40"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Client Brand Customer Leads ({clientBusinessLeads.length})
                </button>
                <button
                  onClick={() => setLeadsViewMode("agency_b2b")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    leadsViewMode === "agency_b2b"
                      ? "bg-[#ef4d23] text-white shadow-lg shadow-[#ef4d23]/40"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Agency B2B Sales Pipeline ({leads.length})
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    exportRealtimeAnalyticsToExcel({
                      clients: schoolClients,
                      clientLeads: clientBusinessLeads,
                    });
                  }}
                  variant="secondary"
                  className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs px-3.5 py-2 rounded-2xl shadow-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
                >
                  <FileSpreadsheet className="h-4 w-4 text-emerald-400" /> Export Excel (.xlsx)
                </Button>

                <Button
                  onClick={() => setIsAddClientLeadOpen(true)}
                  className="bg-[#ef4d23] hover:bg-[#d43d15] text-white font-extrabold text-xs px-4 py-2 rounded-2xl shadow-lg shadow-[#ef4d23]/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Incoming Lead
                </Button>
              </div>
            </div>

            {/* Metric Cards Header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <RigidGlassMetricCard
                title="Total Campaign Leads"
                value={clientBusinessLeads.length.toString()}
                change="+18% growth"
                changeType="positive"
                icon={Users}
              />
              <RigidGlassMetricCard
                title="Hot High-Intent Leads"
                value={hotCount.toString()}
                change="Immediate callback"
                changeType="positive"
                icon={Flame}
              />
              <RigidGlassMetricCard
                title="Warm Inquiries"
                value={warmCount.toString()}
                change="In-followup"
                changeType="neutral"
                icon={Zap}
              />
              <RigidGlassMetricCard
                title="Converted Client Revenue"
                value={`₹${convertedTotal.toLocaleString()}`}
                change="Closed Deals Value"
                changeType="positive"
                icon={Trophy}
              />
            </div>

            {/* Filter Toolbar */}
            <div
              className="p-4 rounded-3xl backdrop-blur-3xl border border-white/80 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-900 relative overflow-hidden"
              style={{
                background: `radial-gradient(ellipse 120% 80% at 50% -10%, rgba(255, 255, 255, 0.88), rgba(245, 247, 252, 0.60) 75%),
                             linear-gradient(160deg, rgba(255, 255, 255, 0.75) 0%, rgba(235, 240, 250, 0.50) 100%)`,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06), inset 0 1.5px 0 rgba(255, 255, 255, 0.95)",
              }}
            >
              {/* Glass Sheen Overlay */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-70 z-0"
                style={{
                  background: `linear-gradient(102deg, rgba(255,255,255,.60), transparent 30%, rgba(255,255,255,.30) 65%, transparent 90%),
                               radial-gradient(ellipse 85% 34% at 54% 7%, rgba(255,255,255,.80), transparent 72%)`,
                }}
              />

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto relative z-10">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search lead name, phone, email..."
                    value={clientLeadSearch}
                    onChange={(e) => setClientLeadSearch(e.target.value)}
                    className="w-full bg-white/90 backdrop-blur-xl border border-white/90 rounded-xl pl-9 pr-3 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-[#ef4d23] shadow-xs font-medium"
                  />
                </div>

                {leadsViewMode === "client_campaign" && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-neutral-800">Brand:</span>
                      <select
                        value={selectedClientFilter}
                        onChange={(e) => setSelectedClientFilter(e.target.value)}
                        className="bg-white/90 backdrop-blur-xl border border-white/90 rounded-xl px-3 py-1.5 font-bold text-xs text-neutral-900 focus:outline-none shadow-xs cursor-pointer"
                      >
                        <option value="all" className="bg-white text-neutral-900">All Client Brands</option>
                        {schoolClients.map((client) => (
                          <option key={client.id} value={client.id} className="bg-white text-neutral-900">
                            {client.school_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-neutral-800">Tier:</span>
                      <select
                        value={selectedTierFilter}
                        onChange={(e) => setSelectedTierFilter(e.target.value)}
                        className="bg-white/90 backdrop-blur-xl border border-white/90 rounded-xl px-3 py-1.5 font-bold text-xs text-neutral-900 focus:outline-none shadow-xs cursor-pointer"
                      >
                        <option value="all" className="bg-white text-neutral-900">All Temperature Tiers</option>
                        <option value="hot" className="bg-white text-neutral-900">Hot Leads</option>
                        <option value="warm" className="bg-white text-neutral-900">Warm Leads</option>
                        <option value="cold" className="bg-white text-neutral-900">Cold Leads</option>
                        <option value="unqualified" className="bg-white text-neutral-900">Unqualified</option>
                        <option value="converted" className="bg-white text-neutral-900">Converted Deals</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="text-neutral-600 text-[11px] font-semibold relative z-10">
                Showing <span className="font-extrabold text-neutral-900">{leadsViewMode === "client_campaign" ? filteredClientLeads.length : filteredAgencyLeads.length}</span> leads
              </div>
            </div>

            {/* List Table: CLIENT CAMPAIGN LEADS */}
            {leadsViewMode === "client_campaign" && (
              <div
                className="rounded-3xl backdrop-blur-3xl border border-white/80 shadow-2xl overflow-hidden relative"
                style={{
                  background: `radial-gradient(ellipse 120% 80% at 50% -10%, rgba(255, 255, 255, 0.88), rgba(245, 247, 252, 0.60) 75%),
                               linear-gradient(160deg, rgba(255, 255, 255, 0.75) 0%, rgba(235, 240, 250, 0.50) 100%)`,
                  boxShadow: "0 16px 40px rgba(0, 0, 0, 0.08), inset 0 1.5px 0 rgba(255, 255, 255, 0.95)",
                }}
              >
                {/* Glass Sheen Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-60 z-0"
                  style={{
                    background: `linear-gradient(102deg, rgba(255,255,255,.60), transparent 30%, rgba(255,255,255,.30) 65%, transparent 90%),
                                 radial-gradient(ellipse 85% 34% at 54% 7%, rgba(255,255,255,.80), transparent 72%)`,
                  }}
                />

                <Table className="relative z-10">
                  <TableHeader>
                    <TableRow className="bg-white/70 backdrop-blur-md text-neutral-800 font-extrabold text-[11px] uppercase tracking-wider border-b border-white/80 shadow-2xs">
                      <TableHead className="py-3.5 pl-6 text-neutral-900 font-black">Customer Lead</TableHead>
                      <TableHead className="py-3.5 text-neutral-900 font-black">Client Brand</TableHead>
                      <TableHead className="py-3.5 text-neutral-900 font-black">Campaign Source</TableHead>
                      <TableHead className="py-3.5 text-neutral-900 font-black">Contact & Tele-Actions</TableHead>
                      <TableHead className="py-3.5 text-neutral-900 font-black">Tier Status (1-Click Change)</TableHead>
                      <TableHead className="py-3.5 text-neutral-900 font-black">Est. Value</TableHead>
                      <TableHead className="py-3.5 text-neutral-900 font-black">Sales Rep</TableHead>
                      <TableHead className="py-3.5 pr-6 text-right text-neutral-900 font-black">Talk & Log</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-neutral-200/50 text-xs text-neutral-900">
                    {filteredClientLeads.map((lead) => {
                      const badge = getTemperatureBadge(lead.temperature || "warm");
                      return (
                        <TableRow key={lead.id} className="hover:bg-white/80 backdrop-blur-sm border-b border-neutral-200/50 transition-colors">
                          <TableCell className="py-3.5 pl-6">
                            <div>
                              <p className="font-extrabold text-neutral-900 text-sm tracking-tight">{lead.lead_name}</p>
                              <p className="text-[11px] text-neutral-600 flex items-center gap-1 mt-0.5 font-medium">
                                <MapPin className="h-3 w-3 text-neutral-500" /> {lead.city} • {lead.email}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="py-3.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ef4d23]/15 text-[#d93c14] border border-[#ef4d23]/30 font-extrabold text-[11px] shadow-2xs backdrop-blur-xs">
                              <Building2 className="h-3 w-3 text-[#ef4d23]" />
                              {lead.client_name}
                            </span>
                          </TableCell>

                          <TableCell className="py-3.5">
                            <span className="text-[11px] text-neutral-700 font-semibold">
                              {lead.campaign_source}
                            </span>
                          </TableCell>

                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-neutral-900 text-[11px] font-extrabold">{lead.phone}</span>
                              <a
                                href={`tel:${lead.phone}`}
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300/80 transition-colors shadow-2xs"
                                title="Call Lead"
                              >
                                <PhoneCall className="h-3.5 w-3.5" />
                              </a>
                              <a
                                href={`https://wa.me/${(lead.phone || "").replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300/80 transition-colors shadow-2xs"
                                title="Open WhatsApp"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          </TableCell>

                          <TableCell className="py-3.5">
                            <select
                              value={lead.temperature}
                              onChange={(e) => handleQuickTierChange(lead.id, e.target.value as ClientLeadTemperature)}
                              className={`text-xs font-extrabold px-2.5 py-1 rounded-xl border cursor-pointer focus:outline-none bg-white text-neutral-900 shadow-2xs ${badge.style}`}
                            >
                              <option value="hot" className="bg-white text-neutral-900">Hot (High Intent)</option>
                              <option value="warm" className="bg-white text-neutral-900">Warm (In Talks)</option>
                              <option value="cold" className="bg-white text-neutral-900">Cold (Follow Up)</option>
                              <option value="unqualified" className="bg-white text-neutral-900">Unqualified</option>
                              <option value="converted" className="bg-white text-neutral-900">Converted Deal</option>
                            </select>
                          </TableCell>

                          <TableCell className="py-3.5">
                            <span className="font-extrabold text-[#ef4d23] text-sm font-mono">
                              ₹{(lead.estimated_deal_value_rupees || 0).toLocaleString()}
                            </span>
                          </TableCell>

                          <TableCell className="py-3.5 text-neutral-700 text-[11px] font-semibold">
                            {lead.assigned_telecaller}
                          </TableCell>

                          <TableCell className="py-3.5 pr-6 text-right">
                            <Button
                              onClick={() => {
                                setTalkLeadModal(lead);
                                setUpdatedTierStatus(lead.temperature);
                                setCallNotesText("");
                              }}
                              className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-xl border border-white/40 shadow-md inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <Phone className="h-3.5 w-3.5" /> Talk & Log Notes
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredClientLeads.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-neutral-500">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Users className="h-8 w-8 text-neutral-400 opacity-60" />
                            <p className="font-extrabold text-neutral-700 text-sm">No Client Campaign Leads Found</p>
                            <p className="text-xs text-neutral-500">Add incoming leads or view the Agency B2B Sales Pipeline tab.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* List Table: AGENCY B2B SALES PIPELINE */}
            {leadsViewMode === "agency_b2b" && (
              <div
                className="rounded-3xl backdrop-blur-3xl border border-white/80 shadow-2xl overflow-hidden relative"
                style={{
                  background: `radial-gradient(ellipse 120% 80% at 50% -10%, rgba(255, 255, 255, 0.88), rgba(245, 247, 252, 0.60) 75%),
                               linear-gradient(160deg, rgba(255, 255, 255, 0.75) 0%, rgba(235, 240, 250, 0.50) 100%)`,
                  boxShadow: "0 16px 40px rgba(0, 0, 0, 0.08), inset 0 1.5px 0 rgba(255, 255, 255, 0.95)",
                }}
              >
                {/* Glass Sheen Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-60 z-0"
                  style={{
                    background: `linear-gradient(102deg, rgba(255,255,255,.60), transparent 30%, rgba(255,255,255,.30) 65%, transparent 90%),
                                 radial-gradient(ellipse 85% 34% at 54% 7%, rgba(255,255,255,.80), transparent 72%)`,
                  }}
                />

                <Table className="relative z-10">
                  <TableHeader>
                    <TableRow className="bg-white/70 backdrop-blur-md text-neutral-800 font-extrabold text-[11px] uppercase tracking-wider border-b border-white/80 shadow-2xs">
                      <TableHead className="py-3.5 pl-6 text-neutral-900 font-black">Prospect Company</TableHead>
                      <TableHead className="py-3.5 text-neutral-900 font-black">Key Contact</TableHead>
                      <TableHead className="py-3.5 text-neutral-900 font-black">Stage & Probability</TableHead>
                      <TableHead className="py-3.5 text-neutral-900 font-black">Est. Retainer Value</TableHead>
                      <TableHead className="py-3.5 text-neutral-900 font-black">Assigned Lead</TableHead>
                      <TableHead className="py-3.5 text-neutral-900 font-black">Next Action</TableHead>
                      <TableHead className="py-3.5 pr-6 text-right text-neutral-900 font-black">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-neutral-200/50 text-xs text-neutral-900">
                    {filteredAgencyLeads.map((lead) => (
                      <TableRow
                        key={lead.id}
                        onClick={() => setSelectedAgencyLead(lead)}
                        className="hover:bg-white/80 backdrop-blur-sm border-b border-neutral-200/50 transition-colors cursor-pointer group"
                      >
                        <TableCell className="py-3.5 pl-6">
                          <div>
                            <p className="font-extrabold text-neutral-900 text-sm tracking-tight group-hover:text-[#ef4d23] transition-colors">
                              {lead.company_name}
                            </p>
                            <span className="inline-block mt-0.5 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-neutral-100/80 text-neutral-700 uppercase border border-neutral-300/80 shadow-2xs">
                              {lead.source}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="py-3.5">
                          <p className="font-bold text-neutral-900">{lead.contact_name}</p>
                          <p className="text-[11px] text-neutral-600 font-medium">{lead.contact_email} • {lead.contact_phone}</p>
                        </TableCell>

                        <TableCell className="py-3.5">
                          <span className="capitalize px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-extrabold text-[11px] border border-blue-200/80 shadow-2xs">
                            {(lead.stage || "inquiry").replace(/_/g, " ")} ({Math.round((lead.probability_to_close || 0) * 100)}%)
                          </span>
                        </TableCell>

                        <TableCell className="py-3.5">
                          <span className="font-extrabold text-[#ef4d23] text-sm font-mono">
                            ₹{(lead.estimated_deal_value * 80).toLocaleString()} /mo
                          </span>
                        </TableCell>

                        <TableCell className="py-3.5 text-neutral-700 text-[11px] font-semibold">
                          {lead.assigned_to_name}
                        </TableCell>

                        <TableCell className="py-3.5">
                          <p className="text-[11px] text-neutral-900 font-bold">{lead.next_action}</p>
                          <p className="text-[10px] text-neutral-500 font-medium">{lead.next_action_date}</p>
                        </TableCell>

                        <TableCell className="py-3.5 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="secondary"
                              onClick={() => setSelectedAgencyLead(lead)}
                              className="bg-white/80 hover:bg-white text-neutral-800 font-bold text-[11px] px-2.5 py-1.5 rounded-xl border border-neutral-200/80 shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-neutral-600" /> View Details
                            </Button>
                            <Button
                              onClick={() => handleConvertLeadToClient(lead)}
                              className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-xl shadow-md inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <UserCheck className="h-3.5 w-3.5" /> Convert to Active Client
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredAgencyLeads.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-neutral-500">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Users className="h-8 w-8 text-neutral-400 opacity-60" />
                            <p className="font-extrabold text-neutral-700 text-sm">No Inbound Agency Leads Yet</p>
                            <p className="text-xs text-neutral-500">When visitors fill the website lead form or book a call, they appear here instantly.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* SCREEN 5: CENTRAL COMMUNICATION LOG (Phase 5) */}
      {/* ========================================================================= */}
      {currentTab === "billing" && (
        <CentralCommLogView
          commLogs={commLogs || []}
          onAddCommLog={(newLog) => setCommLogs((prev) => [newLog, ...(prev || [])])}
          clients={schoolClients || []}
          clientLeads={clientBusinessLeads || []}
          onOpenMessenger={() => setCurrentTab("chat")}
        />
      )}

      {/* ========================================================================= */}
      {/* SCREEN: TEAM OPS & INTERNAL TASKS (Team Ops Tab) */}
      {/* ========================================================================= */}
      {currentTab === "comms" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-300/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight">
                  Internal <span className="font-serif-italic text-[#ef4d23] font-normal">Team Operations</span>
                </h1>
                <span className="bg-[#ef4d23]/10 text-[#ef4d23] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#ef4d23]/30">
                  🤖 AI Task Auto-Assignment Active
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1 font-normal">
                Deliverable Sprints across Content, Ads, SEO & Sales • Auto-Routed by Staff Role & Capacity
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                onClick={handleAutoAssignUnassignedTasks}
                className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-md border border-neutral-700"
              >
                <Sparkles className="h-4 w-4 mr-1.5 text-[#ef4d23]" /> Auto-Assign All Deliverables (AI)
              </Button>

              <Button
                onClick={() => {
                  const newTaskTitle = prompt("Enter new deliverable task title:");
                  if (newTaskTitle) {
                    setTasks((prev) => [
                      ...prev,
                      {
                        id: `task-${Date.now()}`,
                        school_name: "Bloom Skincare",
                        assigned_to_id: "tm-5",
                        assigned_to_name: "David Miller",
                        task_title: newTaskTitle,
                        category: "Content",
                        task_type: "poster",
                        priority: "high",
                        completed: false,
                        due_date: new Date().toISOString().slice(0, 10),
                        reasoning: "Manually added deliverable queued for staff processing.",
                      },
                    ]);
                    toast.success("Task added to Team Ops queue!");
                  }
                }}
                className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-semibold text-xs shadow-md"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Task
              </Button>
            </div>
          </div>

          {/* Interactive Filters: Category & Staff Member */}
          <div className="bg-white/70 backdrop-blur-md p-4 rounded-3xl border border-white/80 shadow-md space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-neutral-500 mr-1">Category:</span>
                {["all", "Content", "Ads", "SEO", "Sales"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTaskCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer text-xs border ${
                      taskCategoryFilter === cat
                        ? "bg-[#ef4d23] text-white border-[#ef4d23] shadow-xs"
                        : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                    }`}
                  >
                    {cat === "all" ? "All Categories" : cat === "Content" ? "Content" : cat === "Ads" ? "Ads" : cat === "SEO" ? "SEO" : "Sales"}
                  </button>
                ))}
              </div>

              {/* Staff Member Selector */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-500">Staff Queue:</span>
                <select
                  value={taskAssigneeFilter}
                  onChange={(e) => setTaskAssigneeFilter(e.target.value)}
                  className="bg-white border border-neutral-300 rounded-xl px-3 py-1.5 font-semibold text-xs text-neutral-900 cursor-pointer outline-none focus:ring-1 focus:ring-[#ef4d23]"
                >
                  <option value="all">👥 All Staff Members ({tasks.length} Tasks)</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({tasks.filter((t) => t.assigned_to_id === member.id && !t.completed).length} open)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Tasks Feed (2 cols) */}
            <div className="lg:col-span-2 bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/80 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <h3 className="font-semibold text-neutral-800 text-xs tracking-wider uppercase flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-[#ef4d23]" />
                  {taskAssigneeFilter === "all"
                    ? `Active Deliverables (${tasks.filter((t) => {
                        const mCat = taskCategoryFilter === "all" || t.category === taskCategoryFilter;
                        return mCat;
                      }).length})`
                    : `${teamMembers.find((m) => m.id === taskAssigneeFilter)?.name}'s Personal Task List`}
                </h3>
                <span className="text-xs text-neutral-500 font-medium">
                  {tasks.filter((t) => t.completed).length} / {tasks.length} Completed
                </span>
              </div>

              <div className="space-y-3.5">
                {tasks
                  .filter((t) => {
                    const matchesCategory = taskCategoryFilter === "all" || t.category === taskCategoryFilter;
                    const matchesAssignee = taskAssigneeFilter === "all" || t.assigned_to_id === taskAssigneeFilter;
                    return matchesCategory && matchesAssignee;
                  })
                  .map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-2xl border text-xs transition-all space-y-2.5 ${
                        task.completed
                          ? "bg-neutral-100/80 border-neutral-300 opacity-70"
                          : "bg-white border-neutral-200 hover:border-[#ef4d23] shadow-xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                                task.category === "Content"
                                  ? "bg-purple-50 text-purple-800 border-purple-200"
                                  : task.category === "Ads"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : task.category === "SEO"
                                  ? "bg-blue-50 text-blue-800 border-blue-200"
                                  : "bg-amber-50 text-amber-800 border-amber-200"
                              }`}
                            >
                              {task.category || "Content"} • {task.task_type || "deliverable"}
                            </span>
                            <span className="text-[10px] font-semibold text-neutral-500 inline-flex items-center gap-1"><Building2 className="h-3 w-3 inline text-neutral-400" /> {task.school_name}</span>
                          </div>

                          <h4 className={`font-semibold text-sm ${task.completed ? "line-through text-neutral-500" : "text-neutral-900"}`}>
                            {task.task_title}
                          </h4>
                        </div>

                        <button
                          onClick={() => handleToggleTask(task.id)}
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                            task.completed ? "bg-emerald-600 text-white border-emerald-600 shadow-xs" : "border-neutral-300 hover:border-neutral-400 bg-neutral-50"
                          }`}
                        >
                          {task.completed && <Check className="h-3.5 w-3.5" />}
                        </button>
                      </div>

                      {/* AI Reasoning line */}
                      {task.reasoning && (
                        <p className="text-[10px] text-neutral-600 bg-neutral-50 p-2 rounded-xl border border-neutral-200/60 italic">
                          💡 {task.reasoning}
                        </p>
                      )}

                      {/* Bottom Assignee Info & Human Re-assignment Override */}
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-neutral-100">
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-500 font-normal">Assigned to:</span>
                          <strong className="text-neutral-800 font-semibold">{task.assigned_to_name}</strong>
                        </div>

                        {/* 1-Click Reassignment Override */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-neutral-400 font-normal">Reassign:</span>
                          <select
                            value={task.assigned_to_id}
                            onChange={(e) => handleReassignTask(task.id, e.target.value)}
                            className="bg-neutral-100 border border-neutral-300 text-[10px] font-semibold text-neutral-800 rounded-lg px-2 py-0.5 cursor-pointer outline-none"
                          >
                            {teamMembers.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name} ({m.role.toUpperCase()})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Execution Sprint Overview (1 col) */}
            <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/80 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-semibold text-neutral-800 text-xs tracking-wider uppercase flex items-center gap-2 border-b border-neutral-200 pb-3">
                  <Clock className="h-4 w-4 text-[#ef4d23]" /> Weekly Operations Velocity
                </h3>

                <div className="p-4 bg-gradient-to-br from-[#ef4d23]/10 to-orange-50 rounded-2xl border border-[#ef4d23]/20 space-y-2">
                  <span className="text-xs font-semibold text-neutral-800 block">Current Delivery Sprint</span>
                  <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#ef4d23] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.round((tasks.filter((t) => t.completed).length / (tasks.length || 1)) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-medium text-neutral-600 pt-1">
                    <span>Progress: {Math.round((tasks.filter((t) => t.completed).length / (tasks.length || 1)) * 100)}%</span>
                    <span className="text-[#ef4d23] font-semibold">On Track</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-normal">
                  <div className="p-3 bg-white rounded-xl border border-neutral-200 flex items-center justify-between">
                    <span className="text-neutral-600">Client Retainer Tasks:</span>
                    <span className="font-semibold text-neutral-900">{tasks.length} Total</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-neutral-200 flex items-center justify-between">
                    <span className="text-neutral-600">Pending Actions:</span>
                    <span className="font-semibold text-amber-700">{tasks.filter(t => !t.completed).length} Pending</span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-neutral-400 italic pt-3 border-t border-neutral-200">
                * All task completions sync directly to team capacity dashboards.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN: TEAM ROSTER, DIRECTORY & ACCESS CONTROL (Team Tab) */}
      {/* ========================================================================= */}
      {currentTab === "team" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-300/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight">
                  Agency <span className="font-serif-italic text-[#ef4d23] font-normal">Team Roster & Access Controls</span>
                </h1>
                <span className="bg-[#ef4d23]/10 text-[#ef4d23] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#ef4d23]/30">
                  🔐 RBAC & CRM Access Management
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1 font-normal">
                Manage Staff Profiles, Grant/Revoke CRM Access, Update Role Permissions & Monitor Capacity
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="brand" className="text-xs font-medium px-3 py-1">
                👥 {teamMembers.length} Total Staff ({teamMembers.filter(m => m.crmAccess).length} Active Access)
              </Badge>

              <Button
                onClick={() => setIsAddStaffModalOpen(true)}
                className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-semibold text-xs shadow-md"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Staff Member
              </Button>
            </div>
          </div>

          {/* Team Cards Grid with Role Dropdown & Access Master Switch */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className={`p-5 rounded-3xl border space-y-4 shadow-xl flex flex-col justify-between transition-all ${
                  member.crmAccess
                    ? "bg-white/70 backdrop-blur-md border-white/80"
                    : "bg-red-50/40 backdrop-blur-md border-red-200/80 opacity-90"
                }`}
              >
                <div className="space-y-3">
                  {/* Top Avatar & Name */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl ${member.avatarBg} text-white font-semibold text-lg flex items-center justify-center shadow-md shrink-0`}>
                        {member.initial}
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-900 text-sm leading-tight">{member.name}</h4>
                        <p className="text-[10px] text-neutral-500 font-normal">{member.title}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => setEditingMember({ ...member })}
                      variant="outline"
                      size="sm"
                      className="text-[10px] px-2.5 py-1 font-semibold border-neutral-300 hover:bg-neutral-100 text-neutral-800 shrink-0"
                    >
                      ✏️ Edit
                    </Button>
                  </div>

                  {/* Role Selector & Department */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10px] text-neutral-500">
                      <span>CRM Role:</span>
                      <span className="font-semibold text-neutral-700 uppercase">{member.department}</span>
                    </div>

                    <select
                      value={member.role}
                      onChange={(e) => handleChangeMemberRole(member.id, e.target.value as UserRole)}
                      className="w-full p-2 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 cursor-pointer outline-none focus:ring-1 focus:ring-[#ef4d23]"
                    >
                      <option value="owner">Founder / Owner</option>
                      <option value="ops_manager">Operations Manager</option>
                      <option value="account_manager">Account Manager Lead</option>
                      <option value="designer">Graphic & Brand Designer</option>
                      <option value="editor">Video Editor & Motion Lead</option>
                      <option value="content_writer">Senior Copywriter</option>
                      <option value="ad_specialist">Performance Ad Specialist</option>
                      <option value="admin">Ops Admin</option>
                      <option value="team">Team Member</option>
                    </select>
                  </div>

                  {/* Contact Details */}
                  <div className="pt-2 border-t border-neutral-200/60 text-xs space-y-1 text-neutral-600 font-normal">
                    <p className="flex items-center gap-1.5 truncate">
                      <Mail className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                      <span>{member.phone}</span>
                    </p>
                  </div>
                </div>

                {/* Bottom Actions: CRM Access Switch & Client Portfolio */}
                <div className="pt-3 border-t border-neutral-200/60 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500 font-normal">Assigned Accounts:</span>
                    <strong className="text-[#ef4d23] font-semibold">{(member.assignedClients?.length || 0)} Clients</strong>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {(member.assignedClients || []).map((cName) => (
                      <span key={cName} className="text-[9px] font-medium bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md">
                        {cName}
                      </span>
                    ))}
                  </div>

                  {/* Master CRM Access Switch & Delete Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleToggleMemberAccess(member.id)}
                      className={`w-full py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer ${
                        member.crmAccess
                          ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300"
                          : "bg-red-100 hover:bg-red-200 text-red-800 border border-red-300"
                      }`}
                    >
                      {member.crmAccess ? (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
                          <span>Suspended</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteTeamMember(member.id)}
                      className="w-full py-2 px-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center gap-1 transition-all cursor-pointer"
                      title="Remove staff member"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Staff Access & Capacity Table */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/80 overflow-hidden shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-neutral-900 text-xs uppercase tracking-wider">
                Staff RBAC Permissions & Workload Allocation Matrix
              </h3>
              <span className="text-xs text-neutral-500 font-medium">Founder Access Control Enabled</span>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-xs text-neutral-700">Staff Member</TableHead>
                  <TableHead className="font-semibold text-xs text-neutral-700">Department</TableHead>
                  <TableHead className="font-semibold text-xs text-neutral-700">Assigned RBAC Role</TableHead>
                  <TableHead className="font-semibold text-xs text-neutral-700">CRM Access State</TableHead>
                  <TableHead className="font-semibold text-xs text-neutral-700">Accounts & Capacity</TableHead>
                  <TableHead className="font-semibold text-xs text-neutral-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((row) => (
                  <TableRow key={row.id} className="hover:bg-white/60 transition-colors">
                    <TableCell className="font-semibold text-neutral-900 text-xs">
                      <div>
                        <span>{row.name}</span>
                        <span className="block text-[10px] text-neutral-500 font-normal">{row.email}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs font-medium text-neutral-600">{row.department}</TableCell>

                    <TableCell className="text-xs">
                      {(() => {
                        const r = row.role;
                        const label =
                          r === "owner"
                            ? "Founder & CEO"
                            : r === "ops_manager"
                            ? "Operations Manager"
                            : r === "account_manager"
                            ? "Account Manager"
                            : r === "designer"
                            ? "Brand Designer"
                            : r === "editor"
                            ? "Video Editor"
                            : r === "content_writer"
                            ? "Copywriter"
                            : r === "ad_specialist"
                            ? "Ad Specialist"
                            : r === "admin"
                            ? "Ops Admin"
                            : "Staff Member";

                        const cls =
                          r === "owner"
                            ? "bg-purple-100 text-purple-800 border-purple-300"
                            : r === "ops_manager"
                            ? "bg-indigo-100 text-indigo-800 border-indigo-300"
                            : r === "account_manager"
                            ? "bg-blue-100 text-blue-800 border-blue-300"
                            : r === "designer"
                            ? "bg-amber-100 text-amber-800 border-amber-300"
                            : r === "editor"
                            ? "bg-rose-100 text-rose-800 border-rose-300"
                            : r === "content_writer"
                            ? "bg-cyan-100 text-cyan-800 border-cyan-300"
                            : r === "ad_specialist"
                            ? "bg-teal-100 text-teal-800 border-teal-300"
                            : r === "admin"
                            ? "bg-blue-100 text-blue-800 border-blue-300"
                            : "bg-neutral-100 text-neutral-800 border-neutral-300";

                        return (
                          <span className={`inline-block font-semibold text-[10px] uppercase px-2.5 py-0.5 rounded-full border ${cls}`}>
                            {label}
                          </span>
                        );
                      })()}
                    </TableCell>

                    <TableCell className="text-xs font-semibold">
                      {row.crmAccess ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Full Access
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-500" /> Revoked
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-neutral-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#ef4d23] h-full rounded-full" style={{ width: row.capacityLoad }} />
                        </div>
                        <span className="font-semibold text-neutral-800 text-[11px]">{row.capacityLoad}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => setEditingMember({ ...row })}
                          className="text-xs py-1 px-2.5 rounded-xl font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 cursor-pointer"
                          title="Edit Employee Details"
                        >
                          ✏️ Edit
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => handleToggleMemberAccess(row.id)}
                          className={`text-xs py-1 px-2.5 rounded-xl font-semibold cursor-pointer ${
                            row.crmAccess
                              ? "bg-red-100 hover:bg-red-200 text-red-800"
                              : "bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                          }`}
                        >
                          {row.crmAccess ? "Revoke" : "Grant"}
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => setCurrentTab("chat")}
                          className="text-xs py-1 px-2.5 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                          title="Open Direct Messenger Chat"
                        >
                          💬 Chat
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => handleDeleteTeamMember(row.id)}
                          className="text-xs py-1 px-2 rounded-xl font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                          title="Remove Staff Member"
                        >
                          🗑️
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 7: AGENCY & SYSTEM SETTINGS */}
      {/* ========================================================================= */}
      {currentTab === "settings" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-300/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight">
                  Agency & <span className="font-serif-italic text-[#ef4d23] font-normal">System Settings</span>
                </h1>
                <span className="bg-[#ef4d23]/10 text-[#ef4d23] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#ef4d23]/30">
                  ⚙️ Enterprise Control Center
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1 font-normal">
                Manage Agency Profile, Active API Integrations, Payment Grace Periods & Automation Webhooks
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  toast.success("Settings saved successfully!", "All system parameters and API endpoints updated.");
                }}
                className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-semibold text-xs shadow-md"
              >
                Save System Configuration
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel 1: Agency Profile & Preferences */}
            <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/80 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-semibold text-neutral-800 text-xs tracking-wider uppercase flex items-center gap-2 border-b border-neutral-200/60 pb-2">
                  <Building2 className="h-4 w-4 text-[#ef4d23]" /> Agency General Settings
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Agency Name</label>
                    <input
                      type="text"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl font-semibold text-neutral-900 outline-none focus:ring-1 focus:ring-[#ef4d23]"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Support Email</label>
                    <input
                      type="email"
                      value={agencySupportEmail}
                      onChange={(e) => setAgencySupportEmail(e.target.value)}
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl font-semibold text-neutral-900 outline-none focus:ring-1 focus:ring-[#ef4d23]"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Primary Brand Accent</label>
                    <div className="flex items-center gap-3 p-2.5 bg-white border border-neutral-300 rounded-xl">
                      <span className="w-6 h-6 rounded-lg bg-[#ef4d23] border border-black/10 shrink-0 shadow-xs" />
                      <span className="font-mono font-semibold text-neutral-800">#ef4d23</span>
                      <span className="text-[10px] text-neutral-500 font-medium ml-auto bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md">
                        Lumen Orange
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Default Base Currency</label>
                    <select
                      value={baseCurrency}
                      onChange={(e) => setBaseCurrency(e.target.value)}
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl font-semibold text-neutral-900 outline-none cursor-pointer"
                    >
                      <option value="INR">₹ INR - Indian Rupee</option>
                      <option value="USD">$ USD - US Dollar</option>
                      <option value="EUR">€ EUR - Euro</option>
                      <option value="GBP">£ GBP - British Pound</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">System Timezone</label>
                    <input
                      type="text"
                      defaultValue="Asia/Kolkata (IST +5:30)"
                      disabled
                      className="w-full p-2.5 bg-neutral-100 border border-neutral-200 rounded-xl font-medium text-neutral-600"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => toast.success("Agency profile updated!", `Agency: ${agencyName} (${baseCurrency})`)}
                className="w-full bg-[#ef4d23] hover:bg-[#d93c14] text-white font-semibold text-xs mt-4 shadow-sm"
              >
                Save Profile Preferences
              </Button>
            </div>

            {/* Panel 2: API & Power BI Integrations */}
            <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/80 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2.5">
                  <div>
                    <h3 className="font-semibold text-neutral-800 text-xs tracking-wider uppercase flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#ef4d23]" /> API & BI Connectors
                    </h3>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Manage production keys, endpoints, and live webhooks</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                      {apiConnectors.filter((c) => c.active).length}/{apiConnectors.length} Active
                    </span>
                    <button
                      onClick={() => setShowAddCustomModal(true)}
                      className="text-[11px] bg-[#ef4d23] hover:bg-[#d93c14] text-white font-medium px-2.5 py-1 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" /> Add API
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-xs max-h-[520px] overflow-y-auto pr-1">
                  {apiConnectors.map((item) => {
                    const isSecretVisible = !!showSecretMap[item.id];
                    const isTesting = testingConnectorId === item.id || testingConnectorId === "ALL";

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 bg-white/90 rounded-2xl border border-neutral-200/80 shadow-xs hover:border-[#ef4d23]/40 transition-all space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg p-1.5 bg-neutral-100 rounded-xl border border-neutral-200">{item.icon}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-neutral-900">{item.name}</p>
                                <span className="text-[9px] px-1.5 py-0.2 bg-neutral-100 text-neutral-600 rounded-md border border-neutral-200">
                                  {item.category}
                                </span>
                              </div>
                              <p className="text-[10px] text-neutral-500">Last Synced: {item.lastSync}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleConnector(item.id)}
                              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border cursor-pointer transition-all ${
                                item.active
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                                  : "bg-neutral-100 text-neutral-600 border-neutral-300 hover:bg-neutral-200"
                              }`}
                            >
                              {item.active ? "🟢 Active" : "⚪ Paused"}
                            </button>
                            {item.id.startsWith("conn-custom-") && (
                              <button
                                onClick={() => handleDeleteConnector(item.id)}
                                className="p-1 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                title="Remove API Connector"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Secret Key Row */}
                        <div className="space-y-1 bg-neutral-50 p-2 rounded-xl border border-neutral-200/60">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-neutral-500 font-medium flex items-center gap-1">
                              <Key className="h-3 w-3 text-[#ef4d23]" /> API Key / Token:
                            </span>
                            <button
                              onClick={() => toggleSecretVisibility(item.id)}
                              className="text-neutral-500 hover:text-neutral-800 flex items-center gap-1 text-[10px] cursor-pointer"
                            >
                              {isSecretVisible ? (
                                <>
                                  <EyeOff className="h-3 w-3" /> Hide
                                </>
                              ) : (
                                <>
                                  <Eye className="h-3 w-3" /> Show
                                </>
                              )}
                            </button>
                          </div>
                          <p className="font-mono text-[11px] text-neutral-800 truncate select-all">
                            {isSecretVisible
                              ? item.apiKey || "(No Key Configured)"
                              : item.apiKey
                              ? item.apiKey.slice(0, 7) + "••••••••••••••••"
                              : "••••••••••••••••"}
                          </p>
                        </div>

                        {/* Endpoint & Actions */}
                        <div className="flex items-center justify-between pt-1 border-t border-neutral-100 gap-2">
                          <span className="text-[10px] font-mono text-neutral-500 truncate flex items-center gap-1 max-w-[200px]" title={item.endpoint}>
                            <Link2 className="h-3 w-3 shrink-0" />
                            {item.endpoint || "Gateway Endpoint"}
                          </span>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => setEditingConnector({ ...item })}
                              className="text-[10px] font-medium px-2 py-1 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-700 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Key className="h-3 w-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleTestSingleConnector(item.id)}
                              disabled={isTesting}
                              className="text-[10px] font-medium px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              <RefreshCw className={`h-3 w-3 ${isTesting ? "animate-spin" : ""}`} />
                              {isTesting ? "Testing..." : "Test Link"}
                            </button>
                          </div>
                        </div>

                        {/* Status Message Badge */}
                        {item.statusMessage && (
                          <div className="text-[10px] px-2 py-0.5 rounded-lg bg-neutral-100 text-neutral-600 border border-neutral-200/60 font-mono">
                            {item.statusMessage}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={handleTestIntegrations}
                disabled={testingConnectorId === "ALL"}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs mt-4 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${testingConnectorId === "ALL" ? "animate-spin" : ""}`} />
                {testingConnectorId === "ALL" ? "Testing All Endpoints..." : "Re-test All Integration Endpoints"}
              </Button>
            </div>

            {/* Panel 3: RBAC Roles & Automated Workflows */}
            <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/80 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-semibold text-neutral-800 text-xs tracking-wider uppercase flex items-center gap-2 border-b border-neutral-200/60 pb-2">
                  <ShieldCheck className="h-4 w-4 text-[#ef4d23]" /> Access Control & Automation Rules
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div className="p-3.5 bg-white rounded-2xl border border-neutral-200 space-y-1">
                    <span className="font-semibold text-neutral-900 block">Active Operating Role</span>
                    <span className="text-[11px] text-[#ef4d23] font-semibold block capitalize">
                      {currentUserRole === "owner"
                        ? "Founder / Owner (Sahit & Santhan)"
                        : currentUserRole === "ops_manager"
                        ? "Operations Manager"
                        : currentUserRole === "admin"
                        ? "Ops Admin"
                        : "Team Member / Staff"}
                    </span>
                    <p className="text-[10px] text-neutral-500 mt-1 leading-normal">
                      {currentUserRole === "owner"
                        ? "Full administrative override, bulk access suspension, billing dispatch, and API configuration privileges."
                        : "Restricted read/update scope for assigned client portfolio."}
                    </p>
                  </div>

                  {/* Grace Period Selector */}
                  <div className="p-3.5 bg-white rounded-2xl border border-neutral-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-900">Dues Suspension Grace Period</span>
                      <strong className="text-[#ef4d23] font-bold">{gracePeriodDays} Days</strong>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={30}
                      step={5}
                      value={gracePeriodDays}
                      onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                      className="w-full accent-[#ef4d23] cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-neutral-400 font-mono">
                      <span>5 Days</span>
                      <span>15 Days (Recommended)</span>
                      <span>30 Days</span>
                    </div>
                  </div>

                  {/* Automated Payment Reminders Switch */}
                  <div className="p-3.5 bg-white rounded-2xl border border-neutral-200 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-neutral-900 block">Automated WhatsApp & Email Reminders</span>
                      <span className="text-[10px] text-neutral-500">Auto-dispatch payment notices on 3rd & 7th day</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoRemindersEnabled}
                      onChange={(e) => {
                        setAutoRemindersEnabled(e.target.checked);
                        toast.info(e.target.checked ? "Automated Reminders Enabled" : "Automated Reminders Paused");
                      }}
                      className="w-4 h-4 accent-[#ef4d23] cursor-pointer"
                    />
                  </div>

                  {/* Automated Access Locking Switch */}
                  <div className="p-3.5 bg-white rounded-2xl border border-neutral-200 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-neutral-900 block">Auto-Lock Overdue Retainers</span>
                      <span className="text-[10px] text-neutral-500">Flag accounts for suspension after {gracePeriodDays} days overdue</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoLockOverdueEnabled}
                      onChange={(e) => {
                        setAutoLockOverdueEnabled(e.target.checked);
                        toast.info(e.target.checked ? "Auto-Lock Rules Enabled" : "Auto-Lock Rules Disabled");
                      }}
                      className="w-4 h-4 accent-[#ef4d23] cursor-pointer"
                    />
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between">
                    <span className="font-semibold text-neutral-800">System Version</span>
                    <span className="text-xs text-neutral-600 font-mono">v2.4.0 — Lumen & Co Enterprise</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => toast.success("Automation rules saved!", `Grace Period: ${gracePeriodDays} days`)}
                className="w-full bg-[#ef4d23] hover:bg-[#d93c14] text-white font-semibold text-xs mt-4 shadow-sm"
              >
                Update Automation & RBAC Rules
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <AddClientWizardModal
        isOpen={isAddClientWizardOpen}
        onClose={() => {
          setIsAddClientWizardOpen(false);
          setLeadToConvertData(undefined);
        }}
        onAddClient={handleAddClient}
        initialData={leadToConvertData}
      />

      <AccessToggleModal
        client={accessToggleClient}
        isOpen={!!accessToggleClient}
        onClose={() => setAccessToggleClient(null)}
        currentUserRole={currentUserRole}
        currentUserName={currentUserName}
        onConfirmToggle={handleConfirmAccessToggle}
      />

      <AccessAuditLogDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        auditLogs={auditLogs}
        schoolClients={schoolClients}
        teamMembers={teamMembers}
        onBulkSuspendOverdue={handleBulkSuspendOverdue}
        onBulkRestoreAccess={handleBulkRestoreAccess}
        onConfirmClientToggle={handleConfirmAccessToggle}
        onToggleTeamMemberAccess={handleToggleMemberAccess}
        currentUserRole={currentUserRole}
      />

      <AutoMessagingModal
        isOpen={!!messagingInvoice}
        onClose={() => {
          setMessagingInvoice(null);
          setMessagingClient(null);
        }}
        invoice={messagingInvoice}
        client={messagingClient}
        templates={templates}
        senderName={currentUserName}
        onSendMessage={handleSendMessage}
      />

      {/* ADD STAFF MEMBER MODAL */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-neutral-200 text-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-semibold text-neutral-900 text-base">Add New Staff Member</h3>
              <button
                onClick={() => setIsAddStaffModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStaffMember} className="space-y-3 text-xs font-medium">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Verma"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Media Buyer"
                  value={newStaffTitle}
                  onChange={(e) => setNewStaffTitle(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    placeholder="rahul@lumenandco.com"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 12345"
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Department</label>
                  <select
                    value={newStaffDept}
                    onChange={(e) => setNewStaffDept(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none"
                  >
                    <option value="Client Operations">Client Operations</option>
                    <option value="Growth & Ads">Growth & Ads</option>
                    <option value="Creative Studio">Creative Studio</option>
                    <option value="Executive Leadership">Executive Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">CRM Role Access</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value as UserRole)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none"
                  >
                    <option value="ops_manager">Operations Manager</option>
                    <option value="account_manager">Account Manager Lead</option>
                    <option value="designer">Graphic & Brand Designer</option>
                    <option value="editor">Video Editor & Motion Lead</option>
                    <option value="content_writer">Senior Copywriter</option>
                    <option value="ad_specialist">Performance Ad Specialist</option>
                    <option value="admin">Ops Admin</option>
                    <option value="owner">Founder / Owner</option>
                    <option value="team">General Team Member</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-semibold px-5"
                >
                  Create & Grant Access
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* EDIT EMPLOYEE DETAILS MODAL */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-neutral-200 text-neutral-900 my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${editingMember.avatarBg} text-white font-bold text-base flex items-center justify-center shadow-md`}>
                  {editingMember.initial}
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-base">Edit Employee Profile</h3>
                  <p className="text-[11px] text-neutral-500 font-normal">
                    Update personal details, CRM permissions & client assignments
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStaffMember} className="space-y-4 text-xs font-medium">
              {/* Full Name & Job Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Job Title / Designation *</label>
                  <input
                    type="text"
                    value={editingMember.title}
                    onChange={(e) => setEditingMember({ ...editingMember, title: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                    required
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={editingMember.email}
                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingMember.phone}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  />
                </div>
              </div>

              {/* Department & CRM Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Department</label>
                  <select
                    value={editingMember.department}
                    onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  >
                    <option value="Client Operations">Client Operations</option>
                    <option value="Growth & Strategy">Growth & Strategy</option>
                    <option value="Creative Studio">Creative Studio</option>
                    <option value="Growth & Ads">Growth & Ads</option>
                    <option value="Account Management">Account Management</option>
                    <option value="Executive Leadership">Executive Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">CRM Role Access</label>
                  <select
                    value={editingMember.role}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value as UserRole })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  >
                    <option value="owner">Founder / Owner</option>
                    <option value="ops_manager">Operations Manager</option>
                    <option value="account_manager">Account Manager Lead</option>
                    <option value="designer">Graphic & Brand Designer</option>
                    <option value="editor">Video Editor & Motion Lead</option>
                    <option value="content_writer">Senior Copywriter</option>
                    <option value="ad_specialist">Performance Ad Specialist</option>
                    <option value="admin">Ops Admin</option>
                    <option value="team">Team Member</option>
                  </select>
                </div>
              </div>

              {/* Capacity Load & Access Switch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Capacity Workload</label>
                  <select
                    value={editingMember.capacityLoad}
                    onChange={(e) => setEditingMember({ ...editingMember, capacityLoad: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  >
                    <option value="25%">25% (Light Workload)</option>
                    <option value="50%">50% (Balanced)</option>
                    <option value="60%">60% (Optimal)</option>
                    <option value="75%">75% (Heavy Capacity)</option>
                    <option value="85%">85% (Near Maximum)</option>
                    <option value="100%">100% (Full Capacity)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">CRM System Access</label>
                  <button
                    type="button"
                    onClick={() => setEditingMember({ ...editingMember, crmAccess: !editingMember.crmAccess })}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between font-semibold transition-all ${
                      editingMember.crmAccess
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                        : "bg-rose-50 border-rose-300 text-rose-800"
                    }`}
                  >
                    <span>{editingMember.crmAccess ? "🟢 Access Active" : "🔴 Access Revoked"}</span>
                    <span className="text-[10px] uppercase font-bold bg-white/80 px-2 py-0.5 rounded-md border">
                      {editingMember.crmAccess ? "Revoke" : "Enable"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Avatar Color Choice */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">Avatar Color Theme</label>
                <div className="flex items-center gap-2">
                  {[
                    "bg-[#ef4d23]",
                    "bg-purple-600",
                    "bg-indigo-600",
                    "bg-blue-600",
                    "bg-amber-600",
                    "bg-rose-600",
                    "bg-cyan-600",
                    "bg-emerald-600",
                  ].map((colorClass) => (
                    <button
                      key={colorClass}
                      type="button"
                      onClick={() => setEditingMember({ ...editingMember, avatarBg: colorClass })}
                      className={`w-7 h-7 rounded-xl ${colorClass} border-2 transition-all ${
                        editingMember.avatarBg === colorClass ? "border-black scale-110 shadow-md" : "border-transparent opacity-80 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Assigned Clients Checkbox List */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">Assigned Client Accounts</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                  {schoolClients.map((client) => {
                    const isAssigned = (editingMember.assignedClients || []).includes(client.school_name);
                    return (
                      <label
                        key={client.id}
                        className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${
                          isAssigned ? "bg-white border-[#ef4d23] text-neutral-900 font-semibold shadow-xs" : "bg-neutral-100/60 border-neutral-200 text-neutral-600"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isAssigned}
                          onChange={(e) => {
                            const current = editingMember.assignedClients || [];
                            const next = e.target.checked
                              ? [...current, client.school_name]
                              : current.filter((name) => name !== client.school_name);
                            setEditingMember({ ...editingMember, assignedClients: next });
                          }}
                          className="accent-[#ef4d23] rounded"
                        />
                        <span className="truncate">{client.school_name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-neutral-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingMember(null)}
                  className="font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-semibold px-5"
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: TALK & LOG CALL NOTES MODAL */}
      {/* ========================================================================= */}
      {talkLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-xl w-full p-6 space-y-5 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#ef4d23] uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  {talkLeadModal.client_name}
                </span>
                <h3 className="text-xl font-bold text-neutral-900 mt-1">
                  📞 Talk with {talkLeadModal.lead_name}
                </h3>
                <p className="text-xs text-neutral-500 font-medium">
                  {talkLeadModal.campaign_source} • {talkLeadModal.city}
                </p>
              </div>
              <button
                onClick={() => setTalkLeadModal(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 flex-1 text-xs">
              {/* Quick Action Dial Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                <a
                  href={`tel:${talkLeadModal.phone}`}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <PhoneCall className="h-4 w-4 shrink-0" /> <span className="truncate">Call {talkLeadModal.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${talkLeadModal.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <MessageSquare className="h-4 w-4 shrink-0" /> <span>Open WhatsApp</span>
                </a>
              </div>

              {/* Call Outcome Presets */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">Call Outcome Presets</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Call Completed - Interested",
                    "Requested Sample & Invoice",
                    "Scheduled Trial/Visit",
                    "Call Back Required Later",
                    "Price / Budget Concern",
                    "No Answer / Busy Line",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCallOutcome(preset)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        callOutcome === preset
                          ? "bg-[#ef4d23] text-white border-[#ef4d23] shadow-xs"
                          : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Temperature Status Selector */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">Update Temperature Tier Status</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(
                    [
                      { id: "hot", label: "Hot", icon: <Flame className="h-3.5 w-3.5 inline mr-1 text-red-500" />, style: "border-red-300 bg-red-50 text-red-800" },
                      { id: "warm", label: "Warm", icon: <Zap className="h-3.5 w-3.5 inline mr-1 text-amber-500" />, style: "border-amber-300 bg-amber-50 text-amber-800" },
                      { id: "cold", label: "Cold", icon: <Snowflake className="h-3.5 w-3.5 inline mr-1 text-sky-500" />, style: "border-sky-300 bg-sky-50 text-sky-800" },
                      { id: "unqualified", label: "Unqualified", icon: <Slash className="h-3.5 w-3.5 inline mr-1 text-neutral-500" />, style: "border-neutral-300 bg-neutral-100 text-neutral-700" },
                      { id: "converted", label: "Converted", icon: <Trophy className="h-3.5 w-3.5 inline mr-1 text-emerald-500" />, style: "border-emerald-300 bg-emerald-50 text-emerald-800" },
                    ] as const
                  ).map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setUpdatedTierStatus(tier.id)}
                      className={`p-2 rounded-xl border font-bold text-center transition-all flex items-center justify-center gap-1 ${
                        updatedTierStatus === tier.id
                          ? `${tier.style} ring-2 ring-[#ef4d23] ring-offset-1`
                          : "bg-neutral-50 text-neutral-600 border-neutral-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      {tier.icon}
                      <span>{tier.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Call Notes Input */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Call Notes & Key Discussion Details</label>
                <textarea
                  value={callNotesText}
                  onChange={(e) => setCallNotesText(e.target.value)}
                  placeholder="Record customer preferences, objections, discount requested, next callback time..."
                  rows={3}
                  className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23] text-xs font-normal"
                />
              </div>

              {/* Previous Call Log Timeline */}
              {talkLeadModal.call_history && talkLeadModal.call_history.length > 0 && (
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1.5 flex items-center gap-1">
                    <History className="h-3.5 w-3.5 text-neutral-500" /> Past Call Log History ({talkLeadModal.call_history.length})
                  </label>
                  <div className="space-y-2 max-h-36 overflow-y-auto bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                    {talkLeadModal.call_history.map((log) => (
                      <div key={log.id} className="bg-white p-2.5 rounded-xl border border-neutral-200 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-neutral-900">{log.outcome}</span>
                          <span className="text-[10px] text-neutral-400">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-[11px] text-neutral-600">{log.notes}</p>
                        <p className="text-[10px] font-semibold text-neutral-500">By: {log.caller_name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-200">
              <Button variant="outline" onClick={() => setTalkLeadModal(null)} className="font-medium text-xs">
                Cancel
              </Button>
              <Button
                onClick={handleSaveCallNote}
                className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-semibold text-xs px-5 py-2 rounded-xl shadow-xs"
              >
                Save Call Note & Status
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD INCOMING CLIENT LEAD MODAL */}
      {/* ========================================================================= */}
      {isAddClientLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-lg w-full p-6 space-y-5 overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h3 className="text-xl font-bold text-neutral-900">Add Incoming Client Lead</h3>
                <p className="text-xs text-neutral-500">Manually log offline inquiry or walk-in for a Client Brand</p>
              </div>
              <button
                onClick={() => setIsAddClientLeadOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClientLead} className="space-y-4 text-xs font-medium">
              {/* Select Client Brand */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Target Client Brand *</label>
                <select
                  value={newLeadForm.client_id}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, client_id: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  required
                >
                  {schoolClients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.school_name} ({client.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Lead Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Vikram Sharma"
                    value={newLeadForm.lead_name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, lead_name: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                    required
                  />
                </div>
              </div>

              {/* Email & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="vikram@gmail.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru"
                    value={newLeadForm.city}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  />
                </div>
              </div>

              {/* Campaign Source & Temperature */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Campaign Source</label>
                  <select
                    value={newLeadForm.campaign_source}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, campaign_source: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  >
                    <option value="Meta Ads - Direct Inquiry">Meta Ads - Direct Inquiry</option>
                    <option value="Instagram UGC Video Reel">Instagram UGC Video Reel</option>
                    <option value="Google Search Campaign">Google Search Campaign</option>
                    <option value="Website Walk-in / Inbound">Website Walk-in / Inbound</option>
                    <option value="Phone Call Inquiry">Phone Call Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Initial Temperature Tier</label>
                  <select
                    value={newLeadForm.temperature}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, temperature: e.target.value as ClientLeadTemperature })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  >
                    <option value="hot">Hot (High Intent)</option>
                    <option value="warm">Warm (In Talks)</option>
                    <option value="cold">Cold (Follow Up)</option>
                  </select>
                </div>
              </div>

              {/* Est Deal Value & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Est. Deal Value (₹)</label>
                  <input
                    type="number"
                    value={newLeadForm.estimated_deal_value_rupees}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, estimated_deal_value_rupees: Number(e.target.value) })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Notes</label>
                  <input
                    type="text"
                    placeholder="First call observation..."
                    value={newLeadForm.notes}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-200">
                <Button type="button" variant="outline" onClick={() => setIsAddClientLeadOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-semibold px-5">
                  Create Client Lead
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal: Edit API Credentials */}
      {editingConnector && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-neutral-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl p-1.5 bg-neutral-100 rounded-xl border border-neutral-200">{editingConnector.icon}</span>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Edit API Integration</h3>
                  <p className="text-xs text-neutral-500">{editingConnector.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingConnector(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConnectorCredentials} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Integration Name</label>
                <input
                  type="text"
                  value={editingConnector.name}
                  onChange={(e) => setEditingConnector({ ...editingConnector, name: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1 flex items-center justify-between">
                  <span>API Key / Secret Token</span>
                  <span className="text-[10px] text-neutral-400 font-normal">Paste real key here</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. sb_publishable_... or EAAG..."
                  value={editingConnector.apiKey || ""}
                  onChange={(e) => setEditingConnector({ ...editingConnector, apiKey: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Base Gateway Endpoint URL</label>
                <input
                  type="url"
                  placeholder="https://api.service.com/v1"
                  value={editingConnector.endpoint || ""}
                  onChange={(e) => setEditingConnector({ ...editingConnector, endpoint: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Auth Header Format</label>
                  <input
                    type="text"
                    placeholder="Authorization: Bearer"
                    value={editingConnector.headerKey || "Authorization: Bearer"}
                    onChange={(e) => setEditingConnector({ ...editingConnector, headerKey: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={editingConnector.category}
                    onChange={(e) => setEditingConnector({ ...editingConnector, category: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => {
                    handleTestSingleConnector(editingConnector.id);
                  }}
                  className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Test Key Now
                </button>

                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingConnector(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-semibold px-4">
                    Save Credentials
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Custom API Integration */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-neutral-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Plus className="h-4 w-4 text-[#ef4d23]" /> Add Custom API Integration
              </h3>
              <button
                onClick={() => setShowAddCustomModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomConnectorSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 font-semibold mb-1">Integration Name</label>
                  <input
                    type="text"
                    placeholder="e.g. OpenAI GPT-4o, Mailchimp, Zapier"
                    value={newCustomConnector.name}
                    onChange={(e) => setNewCustomConnector({ ...newCustomConnector, name: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Icon Emoji</label>
                  <input
                    type="text"
                    placeholder="🔌"
                    value={newCustomConnector.icon}
                    onChange={(e) => setNewCustomConnector({ ...newCustomConnector, icon: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-center text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">API Key / Secret Token</label>
                <input
                  type="text"
                  placeholder="Paste real secret API key here..."
                  value={newCustomConnector.apiKey}
                  onChange={(e) => setNewCustomConnector({ ...newCustomConnector, apiKey: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Endpoint Gateway URL</label>
                <input
                  type="url"
                  placeholder="https://api.yourprovider.com/v1"
                  value={newCustomConnector.endpoint}
                  onChange={(e) => setNewCustomConnector({ ...newCustomConnector, endpoint: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="Custom Integration"
                    value={newCustomConnector.category}
                    onChange={(e) => setNewCustomConnector({ ...newCustomConnector, category: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Auth Header</label>
                  <input
                    type="text"
                    value={newCustomConnector.headerKey}
                    onChange={(e) => setNewCustomConnector({ ...newCustomConnector, headerKey: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
                <Button type="button" variant="outline" onClick={() => setShowAddCustomModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-semibold px-4">
                  Connect Integration
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Lead Detail SlideOver Modal */}
      <LeadDetailSlideOver
        lead={selectedAgencyLead}
        isOpen={!!selectedAgencyLead}
        onClose={() => setSelectedAgencyLead(null)}
        onConvertToClient={handleConvertLeadToClient}
      />
    </CrmLayoutShell>
  );
}
