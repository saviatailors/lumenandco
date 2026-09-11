import { useState, useMemo } from "react";
import {
  Rocket,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Filter,
  Video,
  Sparkles,
  FileText,
  Search,
  ExternalLink,
  ChevronRight,
  User,
  Calendar as CalendarIcon,
  Layers,
  Inbox,
  ArrowRight,
  Upload,
  RefreshCw,
  LogOut,
  Send,
  Lock,
  MessageSquare,
  ShieldCheck,
  Users,
  CheckSquare,
  Command,
  HeartPulse,
  BarChart3,
  Flame,
  Wand2,
  X,
  MoreVertical,
  ChevronDown,
  Building2,
  Film,
  HelpCircle,
  Folder,
} from "lucide-react";

import DeliveryLayoutShell, { DeliveryTab } from "./components/DeliveryLayoutShell";
import AdminGate from "./components/AdminGate";
import { useAdminAuth } from "./components/useAdminAuth";
import MediaManager from "./components/MediaManager";

import {
  Deliverable,
  DeliveryStage,
  DELIVERY_STAGES,
  STAGE_LABELS,
  INITIAL_DELIVERABLES,
  SEED_STAFF,
  SEED_CLIENTS,
  SEED_TEMPLATES,
  StaffRole,
  ClientHealthSnapshot,
  AttachmentVersion,
  ClientInfo,
} from "@/lib/delivery.functions";

import DeliveryTaskModal from "./components/DeliveryTaskModal";
import DeliveryCalendarView from "./components/DeliveryCalendarView";
import WorkloadCapacityView from "./components/WorkloadCapacityView";
import RigidGlassMetricCard from "./components/ui/RigidGlassMetricCard";
import { useToast } from "./components/ui/Toast";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "./components/ui/Table";
import { Badge } from "./components/ui/Badge";
import { Button } from "./components/ui/Button";

export default function DeliveryHubPage() {
  const admin = useAdminAuth();
  const toast = useToast();

  // Navigation tab in shell
  const [currentTab, setCurrentTab] = useState<DeliveryTab>("dashboard");

  // Selected Active Client (Default to Northbeam Outdoors)
  const [selectedClientId, setSelectedClientId] = useState<string>("client-northbeam");
  const [clientSearchQuery, setClientSearchQuery] = useState("");

  // Primary Datasets
  const [deliverables, setDeliverables] = useState<Deliverable[]>(INITIAL_DELIVERABLES);
  const [selectedTask, setSelectedTask] = useState<Deliverable | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Sub-tabs in workspace: "deliverables" | "queries"
  const [workspaceSubTab, setWorkspaceSubTab] = useState<"deliverables" | "queries">("deliverables");

  // Delivery Hub Grid Filters
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("2026");

  // "Add Deliverable" Slide-Over Drawer State
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<"blog" | "video">("blog");
  const [drawerMonth, setDrawerMonth] = useState("September");
  const [drawerYear, setDrawerYear] = useState("2026");
  const [drawerDraft, setDrawerDraft] = useState("");
  const [drawerTitle, setDrawerTitle] = useState("");
  const [drawerDescription, setDrawerDescription] = useState("");

  // Get active client details
  const activeClient = useMemo(() => {
    return SEED_CLIENTS.find((c) => c.id === selectedClientId) || SEED_CLIENTS[0];
  }, [selectedClientId]);

  // Filter clients by sidebar search
  const filteredClients = useMemo(() => {
    return SEED_CLIENTS.filter(
      (c) =>
        c.company_name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
        (c.location && c.location.toLowerCase().includes(clientSearchQuery.toLowerCase()))
    );
  }, [clientSearchQuery]);

  // Calculate deliverables for selected client
  const clientDeliverables = useMemo(() => {
    return deliverables.filter((d) => d.client_id === selectedClientId || d.client_name === activeClient.company_name);
  }, [deliverables, selectedClientId, activeClient]);

  // Filtered deliverables for main grid view
  const gridDeliverables = useMemo(() => {
    return clientDeliverables.filter((item) => {
      // Type match
      let matchesType = true;
      if (filterType === "blogs") matchesType = item.type === "blog";
      else if (filterType === "videos") matchesType = item.type === "reel" || item.type === "ad_creative";

      // Status match
      let matchesStatus = true;
      if (filterStatus === "approved") matchesStatus = item.status === "approved" || item.status === "delivered";
      else if (filterStatus === "pending") matchesStatus = item.status === "in_progress" || item.status === "client_review" || item.status === "internal_review";
      else if (filterStatus === "revision") matchesStatus = item.status === "internal_revision" || item.status === "client_revision";

      // Month match
      let matchesMonth = true;
      if (filterMonth !== "all") {
        const itemDate = new Date(item.due_date);
        const monthName = itemDate.toLocaleString("default", { month: "long" });
        matchesMonth = monthName.toLowerCase() === filterMonth.toLowerCase();
      }

      // Year match
      let matchesYear = true;
      if (filterYear !== "all") {
        const itemYear = new Date(item.due_date).getFullYear().toString();
        matchesYear = itemYear === filterYear;
      }

      return matchesType && matchesStatus && matchesMonth && matchesYear;
    });
  }, [clientDeliverables, filterType, filterStatus, filterMonth, filterYear]);

  if (admin.state !== "ready") {
    return (
      <AdminGate
        state={admin.state}
        email={admin.email}
        error={admin.error}
        onSignIn={admin.signIn}
        onPasswordSignIn={admin.signInWithPassword}
        onSignOut={admin.signOut}
        title="Delivery Hub — Operations Workspace"
      />
    );
  }

  // Handle Create Deliverable from Slide-Over Drawer
  const handleAddDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drawerTitle.trim()) {
      toast.error("Please enter a deliverable title");
      return;
    }

    const newDeliverable: Deliverable = {
      id: `del-${Date.now()}`,
      client_id: activeClient.id,
      client_name: activeClient.company_name,
      title: drawerTitle.trim(),
      type: drawerType === "blog" ? "blog" : "reel",
      brief_description: drawerDescription.trim(),
      assigned_to_staff_id: "staff-3",
      assigned_to_name: "David Miller",
      created_by_staff_id: "staff-1",
      priority: "med",
      due_date: `2026-09-20`,
      publish_date: `2026-09-20`,
      status: "in_progress",
      client_visible: true,
      estimated_hours: 4,
      actual_hours_logged: 0,
      tags: [drawerType],
      subtasks: [],
      attachments: [],
      internal_comments: [],
      client_comments: [],
      activity_logs: [],
      time_entries: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setDeliverables([newDeliverable, ...deliverables]);
    setIsAddDrawerOpen(false);
    setDrawerTitle("");
    setDrawerDescription("");
    toast.success(`Deliverable created for ${activeClient.company_name}!`);
  };

  const handleRefresh = () => {
    toast.info("Refreshing client deliverables status...");
  };

  return (
    <DeliveryLayoutShell currentTab={currentTab} onTabChange={setCurrentTab} onQuickAction={() => setIsAddDrawerOpen(true)}>
      {/* Primary Delivery Workspace Structure */}
      {(currentTab === "dashboard" || currentTab === "clients") && (
        <div className="flex flex-col lg:flex-row h-full gap-5 min-h-[calc(100vh-100px)]">
          {/* ========================================================================= */}
          {/* LEFT CLIENT ROSTER SIDEBAR (PREMIUM GLASSWORK) */}
          {/* ========================================================================= */}
          <aside className="w-full lg:w-[320px] shrink-0 bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden text-white">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-white/90 tracking-wider uppercase flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-[#ef4d23]" />
                  CLIENT ACCOUNTS ({SEED_CLIENTS.length})
                </span>
                <span className="bg-[#ef4d23] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md shadow-[#ef4d23]/20 animate-pulse">
                  Active Retainers
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  placeholder="Search client accounts..."
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-medium text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#ef4d23] transition-all"
                />
              </div>
            </div>

            {/* Client List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 divide-y divide-white/5">
              {filteredClients.map((client) => {
                const isSelected = client.id === selectedClientId;
                const clientDelivsCount = deliverables.filter(
                  (d) => d.client_id === client.id || d.client_name === client.company_name
                ).length;

                return (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className={`group p-3 rounded-2xl cursor-pointer transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? "bg-gradient-to-r from-[#ef4d23]/30 via-white/20 to-white/10 border border-[#ef4d23]/60 text-white shadow-lg backdrop-blur-xl"
                        : "hover:bg-white/10 text-white/80 hover:text-white border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar Circle with Badge */}
                      <div className="relative shrink-0">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs shadow-md border ${
                            isSelected
                              ? "bg-[#ef4d23] text-white border-white/40"
                              : "bg-white/15 text-white/90 border-white/20"
                          }`}
                        >
                          {client.company_name.charAt(0)}
                        </div>
                        {client.needs_attention_count && client.needs_attention_count > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ef4d23] text-white font-extrabold text-[9px] flex items-center justify-center border border-black shadow-xs">
                            {client.needs_attention_count}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-extrabold text-xs truncate group-hover:text-white">{client.company_name}</p>
                        <p className="text-[10px] text-white/50 truncate uppercase font-semibold">
                          {client.location || "Global Retainer"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/15 text-white/90 border border-white/20">
                        {clientDelivsCount} Tasks
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar User Footer */}
            <div className="p-3.5 border-t border-white/15 bg-black/40 backdrop-blur-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#ef4d23] text-white font-extrabold text-xs flex items-center justify-center border border-white/40 shadow-md">
                  S
                </div>
                <div>
                  <p className="text-xs font-extrabold text-white">Sahit Sai</p>
                  <p className="text-[10px] text-white/50 truncate max-w-[130px]">sahitsai6@gmail.com</p>
                </div>
              </div>

              <button
                onClick={() => admin.signOut()}
                className="flex items-center gap-1 text-[11px] font-bold text-white/70 hover:text-red-400 transition-colors bg-white/10 hover:bg-red-500/20 px-2.5 py-1.5 rounded-xl border border-white/20"
              >
                <LogOut className="h-3 w-3" /> Logout
              </button>
            </div>
          </aside>

          {/* ========================================================================= */}
          {/* MAIN CLIENT DELIVERABLES WORKSPACE PANEL */}
          {/* ========================================================================= */}
          <main className="flex-1 bg-white/25 backdrop-blur-3xl rounded-3xl border border-white/40 shadow-2xl p-5 sm:p-7 text-white flex flex-col overflow-y-auto isolate">
            {/* 1. Active Client Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/20">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  {activeClient.company_name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-white/70 font-semibold">
                  <span className="uppercase tracking-wider text-amber-300 font-extrabold">
                    📍 {activeClient.location || "Client Account"}
                  </span>
                  <span>•</span>
                  <span>👥 {activeClient.contacts_count || 4} Key Contacts</span>
                  <span>•</span>
                  <span>📄 {clientDeliverables.length} Deliverables</span>
                  <span>•</span>
                  <span className="bg-white/15 px-2.5 py-0.5 rounded-full text-[10px] text-white border border-white/20 font-bold">
                    {activeClient.package_tier}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/30 backdrop-blur-md transition-all cursor-pointer shadow-md"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </button>

                <button
                  onClick={() => setIsAddDrawerOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ef4d23] hover:bg-[#d93c14] text-white font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-[#ef4d23]/30 border border-white/30"
                >
                  <Plus className="h-4 w-4" /> Add Deliverable
                </button>
              </div>
            </div>

            {/* 2. Sub Navigation Tabs (Deliverables vs Client Queries) */}
            <div className="flex items-center gap-6 border-b border-white/15 pt-3 text-sm font-bold">
              <button
                onClick={() => setWorkspaceSubTab("deliverables")}
                className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  workspaceSubTab === "deliverables"
                    ? "border-[#ef4d23] text-white font-extrabold"
                    : "border-transparent text-white/60 hover:text-white"
                }`}
              >
                <FileText className="h-4 w-4 text-[#ef4d23]" />
                Deliverables
                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-extrabold border border-white/30">
                  {clientDeliverables.length}
                </span>
              </button>

              <button
                onClick={() => setWorkspaceSubTab("queries")}
                className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  workspaceSubTab === "queries"
                    ? "border-[#ef4d23] text-white font-extrabold"
                    : "border-transparent text-white/60 hover:text-white"
                }`}
              >
                <HelpCircle className="h-4 w-4 text-amber-400" />
                Client Queries
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2 py-0.5 rounded-full font-extrabold">
                  {activeClient.open_queries_count || 1} open
                </span>
              </button>
            </div>

            {/* 3. Deliverables Tab View */}
            {workspaceSubTab === "deliverables" && (
              <div className="mt-5 space-y-6">
                {/* Filter Controls Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold bg-white/10 backdrop-blur-2xl p-3.5 rounded-2xl border border-white/20 shadow-inner">
                  {/* Left Filters (Type & Status) */}
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Type Filters */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/70 font-bold">Type:</span>
                      <div className="flex items-center bg-black/30 p-0.5 rounded-xl border border-white/15">
                        <button
                          onClick={() => setFilterType("all")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            filterType === "all" ? "bg-[#ef4d23] text-white shadow-md" : "text-white/70 hover:text-white"
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setFilterType("blogs")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            filterType === "blogs" ? "bg-[#ef4d23] text-white shadow-md" : "text-white/70 hover:text-white"
                          }`}
                        >
                          <FileText className="h-3 w-3" /> Blogs
                        </button>
                        <button
                          onClick={() => setFilterType("videos")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            filterType === "videos" ? "bg-[#ef4d23] text-white shadow-md" : "text-white/70 hover:text-white"
                          }`}
                        >
                          <Video className="h-3 w-3" /> Videos
                        </button>
                      </div>
                    </div>

                    {/* Status Filters */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/70 font-bold">Status:</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setFilterStatus("all")}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            filterStatus === "all" ? "bg-white/20 text-white border border-white/30" : "text-white/70 hover:bg-white/10"
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setFilterStatus("approved")}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            filterStatus === "approved" ? "bg-emerald-500/80 text-white" : "text-emerald-300 hover:bg-emerald-500/20"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-400" /> Approved
                        </button>
                        <button
                          onClick={() => setFilterStatus("pending")}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            filterStatus === "pending" ? "bg-amber-500/80 text-white" : "text-amber-300 hover:bg-amber-500/20"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-amber-400" /> Pending
                        </button>
                        <button
                          onClick={() => setFilterStatus("revision")}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            filterStatus === "revision" ? "bg-red-500/80 text-white" : "text-red-300 hover:bg-red-500/20"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-red-400" /> Revision
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Selectors (Month & Year) */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-white/70 font-bold">Month:</span>
                      <select
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className="bg-black/40 border border-white/20 rounded-xl px-3 py-1 font-bold text-white shadow-2xs text-xs focus:outline-none focus:ring-1 focus:ring-[#ef4d23]"
                      >
                        <option value="all" className="bg-[#181924]">All</option>
                        <option value="september" className="bg-[#181924]">September</option>
                        <option value="august" className="bg-[#181924]">August</option>
                        <option value="july" className="bg-[#181924]">July</option>
                        <option value="june" className="bg-[#181924]">June</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-white/70 font-bold">Year:</span>
                      <select
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className="bg-black/40 border border-white/20 rounded-xl px-3 py-1 font-bold text-white shadow-2xs text-xs focus:outline-none focus:ring-1 focus:ring-[#ef4d23]"
                      >
                        <option value="2026" className="bg-[#181924]">2026</option>
                        <option value="2025" className="bg-[#181924]">2025</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Deliverables 3-Column Card Grid */}
                {gridDeliverables.length === 0 ? (
                  <div className="p-12 text-center text-white/50 bg-white/5 rounded-3xl border border-dashed border-white/20">
                    <Inbox className="h-8 w-8 mx-auto text-white/40 mb-2" />
                    <p className="font-extrabold text-white">No deliverables match this filter query.</p>
                    <button
                      onClick={() => {
                        setFilterType("all");
                        setFilterStatus("all");
                        setFilterMonth("all");
                      }}
                      className="mt-3 text-xs font-bold text-[#ef4d23] hover:underline"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {gridDeliverables.map((item) => {
                      const formattedDate = new Date(item.due_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                      const monthYearString = new Date(item.due_date).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      });

                      const isApproved = item.status === "approved" || item.status === "delivered";

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedTask(item);
                            setIsTaskModalOpen(true);
                          }}
                          className="group bg-white/10 backdrop-blur-2xl rounded-3xl p-5 border border-white/20 shadow-xl hover:shadow-2xl hover:border-[#ef4d23]/70 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                        >
                          {/* Card Header: Icon & Status Badge & Options */}
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white border border-white/20 shadow-inner group-hover:bg-[#ef4d23] group-hover:border-[#ef4d23] transition-colors">
                                {item.type === "blog" ? (
                                  <FileText className="h-5 w-5" />
                                ) : item.type === "reel" ? (
                                  <Video className="h-5 w-5" />
                                ) : (
                                  <Sparkles className="h-5 w-5" />
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {isApproved ? (
                                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-extrabold text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Approved
                                  </span>
                                ) : (
                                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 font-extrabold text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Pending
                                  </span>
                                )}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  className="text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Card Title */}
                            <h3 className="font-extrabold text-white text-sm leading-snug group-hover:text-[#ef4d23] transition-colors line-clamp-3 mb-3">
                              {item.title}
                            </h3>

                            {/* Delivery Month Tag */}
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-white/60 mb-4">
                              <CalendarIcon className="h-3.5 w-3.5 text-[#ef4d23]" />
                              <span>{monthYearString}</span>
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs text-white/50 font-semibold">
                            <span>{formattedDate}</span>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 hover:text-white">
                                <MessageSquare className="h-3.5 w-3.5" />
                              </span>
                              <span className="flex items-center gap-1 hover:text-white">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 5. Client Queries Tab View */}
            {workspaceSubTab === "queries" && (
              <div className="mt-5 space-y-4">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 font-extrabold text-xs px-3 py-1 rounded-full uppercase">
                      Open Client Query • 1h ago
                    </span>
                    <span className="text-xs text-white/70 font-bold">Assigned: Sarah Chen</span>
                  </div>
                  <h4 className="font-extrabold text-white text-sm">
                    &ldquo;Can we update the CTA button color on the new Q4 Video Reel cut before ad launch?&rdquo;
                  </h4>
                  <p className="text-xs text-white/60">
                    From: Marketing Director • {activeClient.company_name}
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type reply to client portal..."
                      className="flex-1 bg-black/30 border border-white/20 rounded-xl px-3.5 py-2 text-xs font-medium text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#ef4d23]"
                    />
                    <Button className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-bold text-xs px-4 shadow-md">
                      Send Reply
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* Auxiliary views for other tabs */}
      {currentTab === "tasks" && (
        <div className="bg-white/25 backdrop-blur-3xl rounded-3xl border border-white/40 p-6 shadow-2xl space-y-4 text-white">
          <h2 className="text-xl font-bold text-white">My Tasks Tasklist</h2>
          <div className="space-y-2 text-xs">
            {deliverables.map((task) => (
              <div key={task.id} className="p-3.5 bg-white/10 rounded-2xl flex items-center justify-between border border-white/20">
                <span className="font-bold text-white">{task.title}</span>
                <span className="text-white/70 font-semibold">{task.client_name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentTab === "calendar" && <DeliveryCalendarView deliverables={deliverables} />}

      {currentTab === "workload" && <WorkloadCapacityView deliverables={deliverables} onReassignTask={() => {}} />}

      {/* ========================================================================= */}
      {/* RIGHT SLIDE-OVER DRAWER ("ADD DELIVERABLE") */}
      {/* ========================================================================= */}
      {isAddDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={() => setIsAddDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#121318]/95 backdrop-blur-3xl shadow-2xl flex flex-col border-l border-white/20 text-white">
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#ef4d23]/20 border border-[#ef4d23]/40 text-[#ef4d23] flex items-center justify-center font-bold">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-white">Add Deliverable</h2>
                    <p className="text-xs font-semibold text-white/60">{activeClient.company_name}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddDrawerOpen(false)}
                  className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Form Body */}
              <form onSubmit={handleAddDeliverable} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
                {/* 1. Deliverable Type */}
                <div>
                  <label className="block font-bold text-white/90 mb-2">Deliverable Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDrawerType("blog")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-2xl border font-bold transition-all ${
                        drawerType === "blog"
                          ? "border-[#ef4d23] bg-[#ef4d23] text-white shadow-lg shadow-[#ef4d23]/30"
                          : "border-white/20 bg-white/10 text-white/80 hover:bg-white/20"
                      }`}
                    >
                      <FileText className="h-4 w-4" /> Blog Post
                    </button>

                    <button
                      type="button"
                      onClick={() => setDrawerType("video")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-2xl border font-bold transition-all ${
                        drawerType === "video"
                          ? "border-[#ef4d23] bg-[#ef4d23] text-white shadow-lg shadow-[#ef4d23]/30"
                          : "border-white/20 bg-white/10 text-white/80 hover:bg-white/20"
                      }`}
                    >
                      <Video className="h-4 w-4" /> Video / Reel
                    </button>
                  </div>
                </div>

                {/* 2. Delivery Month * */}
                <div>
                  <label className="block font-bold text-white/90 mb-1">📅 Delivery Month *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={drawerMonth}
                      onChange={(e) => setDrawerMonth(e.target.value)}
                      className="bg-black/50 border border-white/20 rounded-xl p-2.5 font-bold text-white focus:ring-1 focus:ring-[#ef4d23]"
                    >
                      <option value="September" className="bg-[#181924]">September</option>
                      <option value="August" className="bg-[#181924]">August</option>
                      <option value="July" className="bg-[#181924]">July</option>
                      <option value="June" className="bg-[#181924]">June</option>
                    </select>

                    <select
                      value={drawerYear}
                      onChange={(e) => setDrawerYear(e.target.value)}
                      className="bg-black/50 border border-white/20 rounded-xl p-2.5 font-bold text-white focus:ring-1 focus:ring-[#ef4d23]"
                    >
                      <option value="2026" className="bg-[#181924]">2026</option>
                      <option value="2025" className="bg-[#181924]">2025</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-white/50 font-medium mt-1">
                    Select the month this deliverable is scheduled for
                  </p>
                </div>

                {/* 3. Select Draft Post */}
                <div>
                  <label className="block font-bold text-white/90 mb-1">Select Draft Post / Template</label>
                  <div className="relative">
                    <select
                      value={drawerDraft}
                      onChange={(e) => {
                        setDrawerDraft(e.target.value);
                        if (e.target.value) setDrawerTitle(e.target.value);
                      }}
                      className="w-full bg-black/50 border border-white/20 rounded-xl p-2.5 font-medium text-white focus:ring-1 focus:ring-[#ef4d23]"
                    >
                      <option value="" className="bg-[#181924]">Select a template or draft...</option>
                      <option value="Q4 Campaign Main Video Reel & Hook Cuts" className="bg-[#181924]">
                        Q4 Campaign Main Video Reel & Hook Cuts
                      </option>
                      <option value="Social Media Graphic & Carousel Slide Deck" className="bg-[#181924]">
                        Social Media Graphic & Carousel Slide Deck
                      </option>
                    </select>
                  </div>
                  <p className="text-[11px] text-white/50 font-medium mt-1">
                    Select a draft template, or enter title manually below
                  </p>
                </div>

                {/* 4. Title * */}
                <div>
                  <label className="block font-bold text-white/90 mb-1">Title *</label>
                  <input
                    type="text"
                    placeholder="Enter deliverable title"
                    value={drawerTitle}
                    onChange={(e) => setDrawerTitle(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-xl p-2.5 font-medium text-white placeholder:text-white/40 focus:ring-1 focus:ring-[#ef4d23]"
                    required
                  />
                </div>

                {/* 5. Description */}
                <div>
                  <label className="block font-bold text-white/90 mb-1">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Add a brief description (optional)"
                    value={drawerDescription}
                    onChange={(e) => setDrawerDescription(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-xl p-2.5 font-medium text-white placeholder:text-white/40 focus:ring-1 focus:ring-[#ef4d23]"
                  />
                </div>

                {/* Action Footer */}
                <div className="pt-4 border-t border-white/15 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsAddDrawerOpen(false)} className="text-white/70 hover:text-white hover:bg-white/10">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-extrabold px-5 shadow-lg shadow-[#ef4d23]/30">
                    Save Deliverable
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TASK DETAIL MODAL */}
      <DeliveryTaskModal
        deliverable={selectedTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={() => toast.success("Task updated!")}
        onToggleSubtask={() => {}}
      />
    </DeliveryLayoutShell>
  );
}
