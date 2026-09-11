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

  // Selected Active Client (Default to first client "Aachi Global school")
  const [selectedClientId, setSelectedClientId] = useState<string>("client-aachi");
  const [clientSearchQuery, setClientSearchQuery] = useState("");

  // Primary Datasets
  const [deliverables, setDeliverables] = useState<Deliverable[]>(INITIAL_DELIVERABLES);
  const [selectedTask, setSelectedTask] = useState<Deliverable | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Sub-tabs in workspace: "deliverables" | "queries"
  const [workspaceSubTab, setWorkspaceSubTab] = useState<"deliverables" | "queries">("deliverables");

  // Delivery Hub Grid Filters
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("pending");
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
    return deliverables.filter((d) => d.client_id === selectedClientId);
  }, [deliverables, selectedClientId]);

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
    toast.success(`Deliverable added for ${activeClient.company_name}!`);
  };

  const handleRefresh = () => {
    toast.info("Refreshing client deliverables data...");
  };

  return (
    <DeliveryLayoutShell currentTab={currentTab} onTabChange={setCurrentTab} onQuickAction={() => setIsAddDrawerOpen(true)}>
      {/* Primary Workspace View (Client Delivery Hub structure matching screenshots) */}
      {(currentTab === "dashboard" || currentTab === "clients") && (
        <div className="flex flex-col lg:flex-row h-full gap-5 min-h-[calc(100vh-100px)]">
          {/* ========================================================================= */}
          {/* LEFT CLIENT SELECTOR SIDEBAR (SCHOOLS / CLIENTS ROSTER) */}
          {/* ========================================================================= */}
          <aside className="w-full lg:w-[320px] shrink-0 bg-[#161822]/90 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-white tracking-wider uppercase">
                  SCHOOLS ({SEED_CLIENTS.length})
                </span>
                <span className="bg-[#ef4d23] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs animate-pulse">
                  35 needs attention
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  placeholder="Search schools..."
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-medium text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#ef4d23]"
                />
              </div>
            </div>

            {/* Client List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-white/5">
              {filteredClients.map((client) => {
                const isSelected = client.id === selectedClientId;
                const clientDelivsCount = deliverables.filter((d) => d.client_id === client.id).length;

                return (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className={`group p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-white/20 border border-white/30 text-white shadow-lg"
                        : "hover:bg-white/10 text-white/80 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar Circle with Badge */}
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center font-extrabold text-xs text-white shadow-inner">
                          {client.company_name.charAt(0)}
                        </div>
                        {client.needs_attention_count && client.needs_attention_count > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ef4d23] text-white font-extrabold text-[9px] flex items-center justify-center border border-[#161822]">
                            {client.needs_attention_count}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-bold text-xs truncate group-hover:text-white">{client.company_name}</p>
                        <p className="text-[10px] text-white/50 truncate uppercase font-semibold">
                          {client.location || "Chennai, India"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar User Footer */}
            <div className="p-3 border-t border-white/15 bg-black/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#ef4d23] text-white font-extrabold text-xs flex items-center justify-center border border-white/30 shadow-md">
                  S
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Sahit</p>
                  <p className="text-[10px] text-white/50 truncate max-w-[130px]">sahitsai6@gmail.com</p>
                </div>
              </div>

              <button
                onClick={() => admin.signOut()}
                className="flex items-center gap-1 text-[11px] font-bold text-white/70 hover:text-red-400 transition-colors bg-white/10 hover:bg-red-500/20 px-2.5 py-1.5 rounded-xl border border-white/10"
              >
                <LogOut className="h-3 w-3" /> Logout
              </button>
            </div>
          </aside>

          {/* ========================================================================= */}
          {/* MAIN CLIENT DELIVERABLES WORKSPACE */}
          {/* ========================================================================= */}
          <main className="flex-1 bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-2xl p-5 sm:p-7 text-neutral-900 flex flex-col overflow-y-auto">
            {/* 1. Active Client Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  {activeClient.company_name}
                </h1>
                <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500 font-semibold">
                  <span className="uppercase">{activeClient.location || "AYANAMBAKKAM, Chennai"}</span>
                  <span>•</span>
                  <span>👥 {activeClient.contacts_count || 5} contacts</span>
                  <span>•</span>
                  <span>📄 {clientDeliverables.length} deliverables</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs border border-neutral-200 transition-all cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </button>

                <button
                  onClick={() => setIsAddDrawerOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1e232a] hover:bg-[#12151a] text-white font-bold text-xs transition-all cursor-pointer shadow-md"
                >
                  <Plus className="h-4 w-4" /> Add Deliverable
                </button>
              </div>
            </div>

            {/* 2. Sub Navigation Tabs (Deliverables vs Client Queries) */}
            <div className="flex items-center gap-6 border-b border-neutral-200 pt-3 text-sm font-bold">
              <button
                onClick={() => setWorkspaceSubTab("deliverables")}
                className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  workspaceSubTab === "deliverables"
                    ? "border-[#ef4d23] text-neutral-900 font-extrabold"
                    : "border-transparent text-neutral-500 hover:text-neutral-800"
                }`}
              >
                <FileText className="h-4 w-4 text-[#ef4d23]" />
                Deliverables
                <span className="bg-neutral-200 text-neutral-800 text-xs px-2 py-0.5 rounded-full font-extrabold">
                  {clientDeliverables.length}
                </span>
              </button>

              <button
                onClick={() => setWorkspaceSubTab("queries")}
                className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  workspaceSubTab === "queries"
                    ? "border-[#ef4d23] text-neutral-900 font-extrabold"
                    : "border-transparent text-neutral-500 hover:text-neutral-800"
                }`}
              >
                <HelpCircle className="h-4 w-4 text-amber-500" />
                Client Queries
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs px-2 py-0.5 rounded-full font-extrabold">
                  {activeClient.open_queries_count || 1} open
                </span>
              </button>
            </div>

            {/* 3. Deliverables Tab View */}
            {workspaceSubTab === "deliverables" && (
              <div className="mt-5 space-y-6">
                {/* Filter Controls Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold bg-neutral-50 p-3 rounded-2xl border border-neutral-200/80">
                  {/* Left Filters (Type & Status) */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Type Filters */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-500 font-bold">Type:</span>
                      <div className="flex items-center bg-neutral-200/80 p-0.5 rounded-xl border border-neutral-300">
                        <button
                          onClick={() => setFilterType("all")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            filterType === "all" ? "bg-[#1e232a] text-white shadow-xs" : "text-neutral-700 hover:text-neutral-900"
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setFilterType("blogs")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            filterType === "blogs" ? "bg-[#1e232a] text-white shadow-xs" : "text-neutral-700 hover:text-neutral-900"
                          }`}
                        >
                          <FileText className="h-3 w-3" /> Blogs
                        </button>
                        <button
                          onClick={() => setFilterType("videos")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            filterType === "videos" ? "bg-[#1e232a] text-white shadow-xs" : "text-neutral-700 hover:text-neutral-900"
                          }`}
                        >
                          <Video className="h-3 w-3" /> Videos
                        </button>
                      </div>
                    </div>

                    {/* Status Filters */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-500 font-bold">Status:</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setFilterStatus("all")}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            filterStatus === "all" ? "bg-neutral-800 text-white" : "text-neutral-700 hover:bg-neutral-200"
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setFilterStatus("approved")}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            filterStatus === "approved" ? "bg-emerald-600 text-white" : "text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Approved
                        </button>
                        <button
                          onClick={() => setFilterStatus("pending")}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            filterStatus === "pending" ? "bg-[#1e232a] text-white" : "text-neutral-800 hover:bg-neutral-200"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending
                        </button>
                        <button
                          onClick={() => setFilterStatus("revision")}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            filterStatus === "revision" ? "bg-red-600 text-white" : "text-red-700 hover:bg-red-100"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-red-500" /> Needs Revision
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Selectors (Month & Year) */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-neutral-500 font-bold">Month:</span>
                      <select
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className="bg-white border border-neutral-300 rounded-xl px-3 py-1 font-bold text-neutral-800 shadow-2xs text-xs"
                      >
                        <option value="all">All</option>
                        <option value="august">August</option>
                        <option value="july">July</option>
                        <option value="june">June</option>
                        <option value="april">April</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-neutral-500 font-bold">Year:</span>
                      <select
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className="bg-white border border-neutral-300 rounded-xl px-3 py-1 font-bold text-neutral-800 shadow-2xs text-xs"
                      >
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Deliverables 3-Column Card Grid */}
                {gridDeliverables.length === 0 ? (
                  <div className="p-12 text-center text-neutral-400 bg-neutral-50 rounded-3xl border border-dashed border-neutral-300">
                    <Inbox className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
                    <p className="font-extrabold text-neutral-700">No deliverables found for this filter criteria.</p>
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

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedTask(item);
                            setIsTaskModalOpen(true);
                          }}
                          className="group bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer border-t-4 border-t-transparent hover:border-t-[#ef4d23]"
                        >
                          {/* Card Header: Icon & Status Badge & Options */}
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-700 border border-neutral-200 shadow-2xs group-hover:bg-[#ef4d23]/10 group-hover:text-[#ef4d23] transition-colors">
                                {item.type === "blog" ? <FileText className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="bg-amber-100 text-amber-900 border border-amber-200 font-extrabold text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Pending
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  className="text-neutral-400 hover:text-neutral-800 p-1 rounded-lg hover:bg-neutral-100"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Card Title */}
                            <h3 className="font-extrabold text-neutral-900 text-sm leading-snug group-hover:text-[#ef4d23] transition-colors line-clamp-3 mb-3">
                              {item.title}
                            </h3>

                            {/* Delivery Month Tag */}
                            <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-500 mb-4">
                              <CalendarIcon className="h-3.5 w-3.5 text-neutral-400" />
                              <span>{monthYearString}</span>
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 font-semibold">
                            <span>{formattedDate}</span>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 hover:text-neutral-600">
                                <MessageSquare className="h-3.5 w-3.5" />
                              </span>
                              <span className="flex items-center gap-1 hover:text-neutral-600">
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
                <div className="bg-amber-50/90 border border-amber-200 rounded-3xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-200 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full uppercase">
                      Open Query • 1h ago
                    </span>
                    <span className="text-xs text-neutral-500 font-bold">Assigned to: Sarah Chen</span>
                  </div>
                  <h4 className="font-extrabold text-neutral-900 text-sm">
                    &ldquo;Can we modify the hero section image for the upcoming admissions blog post?&rdquo;
                  </h4>
                  <p className="text-xs text-neutral-600">
                    From: Principal Dr. Rajesh Kumar • Aachi Global School
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type reply to client..."
                      className="flex-1 bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#ef4d23]"
                    />
                    <Button className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-bold text-xs px-4">
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
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-xl font-bold text-neutral-900">My Tasks Tasklist</h2>
          <div className="space-y-2 text-xs">
            {deliverables.map((task) => (
              <div key={task.id} className="p-3 bg-neutral-50 rounded-2xl flex items-center justify-between border border-neutral-200">
                <span className="font-bold text-neutral-900">{task.title}</span>
                <span className="text-neutral-500 font-semibold">{task.client_name}</span>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAddDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-neutral-200 text-neutral-900">
              {/* Drawer Header */}
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#ef4d23]/10 text-[#ef4d23] flex items-center justify-center font-bold">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-neutral-900">Add Deliverable</h2>
                    <p className="text-xs font-semibold text-neutral-500">{activeClient.company_name}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddDrawerOpen(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-800 rounded-full hover:bg-neutral-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Form Body */}
              <form onSubmit={handleAddDeliverable} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
                {/* 1. Deliverable Type */}
                <div>
                  <label className="block font-bold text-neutral-800 mb-2">Deliverable Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDrawerType("blog")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-2xl border font-bold transition-all ${
                        drawerType === "blog"
                          ? "border-neutral-900 bg-neutral-900 text-white shadow-md"
                          : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <FileText className="h-4 w-4" /> Blog Post
                    </button>

                    <button
                      type="button"
                      onClick={() => setDrawerType("video")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-2xl border font-bold transition-all ${
                        drawerType === "video"
                          ? "border-neutral-900 bg-neutral-900 text-white shadow-md"
                          : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <Video className="h-4 w-4" /> Video
                    </button>
                  </div>
                </div>

                {/* 2. Delivery Month * */}
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">📅 Delivery Month *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={drawerMonth}
                      onChange={(e) => setDrawerMonth(e.target.value)}
                      className="bg-white border border-neutral-300 rounded-xl p-2.5 font-bold text-neutral-900 focus:ring-1 focus:ring-[#ef4d23]"
                    >
                      <option value="September">September</option>
                      <option value="August">August</option>
                      <option value="July">July</option>
                      <option value="June">June</option>
                    </select>

                    <select
                      value={drawerYear}
                      onChange={(e) => setDrawerYear(e.target.value)}
                      className="bg-white border border-neutral-300 rounded-xl p-2.5 font-bold text-neutral-900 focus:ring-1 focus:ring-[#ef4d23]"
                    >
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-neutral-500 font-medium mt-1">
                    Select the month this deliverable is for
                  </p>
                </div>

                {/* 3. Select Draft Blog Post */}
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Select Draft Blog Post</label>
                  <div className="relative">
                    <select
                      value={drawerDraft}
                      onChange={(e) => {
                        setDrawerDraft(e.target.value);
                        if (e.target.value) setDrawerTitle(e.target.value);
                      }}
                      className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-medium text-neutral-700 focus:ring-1 focus:ring-[#ef4d23]"
                    >
                      <option value="">Search draft posts...</option>
                      <option value="Is Aachi Global School Ayanambakkam the Right Choice for Your Child?">
                        Is Aachi Global School Ayanambakkam the Right Choice for Your Child?
                      </option>
                      <option value="Wall of Fame: Student Achievements at Aachi Global School">
                        Wall of Fame: Student Achievements at Aachi Global School
                      </option>
                    </select>
                  </div>
                  <p className="text-[11px] text-neutral-500 font-medium mt-1">
                    Search and select a draft, or enter details manually below
                  </p>
                </div>

                {/* 4. Title * */}
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Title *</label>
                  <input
                    type="text"
                    placeholder="Enter blog post title"
                    value={drawerTitle}
                    onChange={(e) => setDrawerTitle(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-medium text-neutral-900 focus:ring-1 focus:ring-[#ef4d23]"
                    required
                  />
                </div>

                {/* 5. Description */}
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Add a brief description (optional)"
                    value={drawerDescription}
                    onChange={(e) => setDrawerDescription(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-medium text-neutral-900 focus:ring-1 focus:ring-[#ef4d23]"
                  />
                </div>

                {/* Action Footer */}
                <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsAddDrawerOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-bold px-5">
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
