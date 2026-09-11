import { useState, useMemo, useEffect } from "react";
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
  LayoutGrid,
  Kanban,
  Zap,
  TrendingUp,
  Check,
  Eye,
  SlidersHorizontal,
  Share2,
  Settings,
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
  Subtask,
} from "@/lib/delivery.functions";

import DeliveryTaskModal from "./components/DeliveryTaskModal";
import DeliveryCalendarView from "./components/DeliveryCalendarView";
import WorkloadCapacityView from "./components/WorkloadCapacityView";
import { useToast } from "./components/ui/Toast";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "./components/ui/Table";
import { Badge } from "./components/ui/Badge";
import { Button } from "./components/ui/Button";
import { loadStoredData, saveStoredData, STORAGE_KEYS } from "@/lib/db-sync";

// Card Media Mockup Mapping (Rich agency visual covers)
const CARD_COVER_MOCKUPS: Record<string, string> = {
  "del-nb-1": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  "del-nb-2": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
  "del-nb-3": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
  "del-nb-4": "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
  "del-nb-5": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
  "del-102": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
  "del-103": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  "del-104": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  "del-105": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  "del-108": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
};

export default function DeliveryHubPage() {
  const admin = useAdminAuth();
  const toast = useToast();

  // Navigation tab in layout shell
  const [currentTab, setCurrentTab] = useState<DeliveryTab>("dashboard");

  // View Mode inside Delivery Hub: "grid" | "kanban" | "clients" | "proofs"
  const [viewMode, setViewMode] = useState<"grid" | "kanban" | "clients" | "proofs">("grid");

  // Selected Active Client Filter ("all" or client_id)
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Primary Deliverables Dataset with Optimized Storage Persistence
  const [deliverables, setDeliverables] = useState<Deliverable[]>(() =>
    loadStoredData(STORAGE_KEYS.DELIVERY_DELIVERABLES, INITIAL_DELIVERABLES)
  );

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.DELIVERY_DELIVERABLES, deliverables);
  }, [deliverables]);
  const [selectedTask, setSelectedTask] = useState<Deliverable | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // New Deliverable Modal / Drawer State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newClient, setNewClient] = useState("client-northbeam");
  const [newType, setNewType] = useState<Deliverable["type"]>("reel");
  const [newDesc, setNewDesc] = useState("");

  // Filtered Deliverables
  const filteredDeliverables = useMemo(() => {
    return deliverables.filter((item) => {
      const matchesClient = selectedClientFilter === "all" || item.client_id === selectedClientFilter;

      let matchesType = true;
      if (typeFilter === "reels") matchesType = item.type === "reel";
      else if (typeFilter === "ads") matchesType = item.type === "ad_creative";
      else if (typeFilter === "blogs") matchesType = item.type === "blog";
      else if (typeFilter === "carousels") matchesType = item.type === "carousel";

      let matchesStatus = true;
      if (statusFilter === "approved") matchesStatus = item.status === "approved" || item.status === "delivered";
      else if (statusFilter === "in_progress") matchesStatus = item.status === "in_progress" || item.status === "internal_review";
      else if (statusFilter === "client_review") matchesStatus = item.status === "client_review";

      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client_name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesClient && matchesType && matchesStatus && matchesSearch;
    });
  }, [deliverables, selectedClientFilter, typeFilter, statusFilter, searchQuery]);

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

  // Handle Task Update from Modal
  const handleUpdateTask = (updatedTask: Deliverable) => {
    setDeliverables((prev) => prev.map((d) => (d.id === updatedTask.id ? updatedTask : d)));
    setSelectedTask(updatedTask);
    toast.success(`Updated "${updatedTask.title}"!`);
  };

  // Toggle Subtask Completion
  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setDeliverables((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = (t.subtasks || []).map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subtasks: updatedSubtasks };
      })
    );
    toast.success("Subtask updated!");
  };

  // Quick Action Handler for New Task
  const handleCreateDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const selectedClientObj = SEED_CLIENTS.find((c) => c.id === newClient);

    const created: Deliverable = {
      id: `del-${Date.now()}`,
      client_id: newClient,
      client_name: selectedClientObj?.company_name || "Client Account",
      title: newTitle.trim(),
      type: newType,
      brief_description: newDesc.trim(),
      assigned_to_staff_id: "staff-3",
      assigned_to_name: "David Miller",
      created_by_staff_id: "staff-1",
      priority: "urgent",
      due_date: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0],
      publish_date: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0],
      status: "in_progress",
      client_visible: true,
      estimated_hours: 6,
      actual_hours_logged: 0,
      tags: [newType],
      subtasks: [
        { id: "st-1", label: "Creative briefing & concept approval", completed: true },
        { id: "st-2", label: "Production & design cut", completed: false },
        { id: "st-3", label: "Internal QA & client sign-off", completed: false },
      ],
      attachments: [],
      internal_comments: [],
      client_comments: [],
      activity_logs: [],
      time_entries: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setDeliverables([created, ...deliverables]);
    setNewTitle("");
    setNewDesc("");
    setIsCreateModalOpen(false);
    toast.success(`Deliverable "${created.title}" added to active sprint!`);
  };

  return (
    <DeliveryLayoutShell currentTab={currentTab} onTabChange={setCurrentTab} onQuickAction={() => setIsCreateModalOpen(true)}>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
        {/* ========================================================================= */}
        {/* TAB 1: DASHBOARD VIEW (LUMINOUS WHITE FROSTED GLASSMORPHISM STAGE) */}
        {/* ========================================================================= */}
        {currentTab === "dashboard" && (
          <div className="space-y-6">
            {/* Luminous Frosted Glass Pulse Banner */}
            <div className="relative overflow-hidden bg-white/80 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 border border-white/90 shadow-2xl shadow-black/5 text-slate-900">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[#ef4d23]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="bg-[#ef4d23] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md shadow-[#ef4d23]/20 tracking-wider">
                      Live Operations Command
                    </span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-slate-600 text-xs font-extrabold">Q3 Creative Deliverables Sprint</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Delivery <span className="font-serif-italic text-[#ef4d23] font-normal">Hub</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-semibold">
                    Real-time campaign proofing, SLA compliance velocity, and client deliverable stage management.
                  </p>
                </div>

                {/* Metric Counter Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div
                    className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm cursor-pointer hover:border-[#ef4d23] transition-all"
                    onClick={() => setViewMode("clients")}
                  >
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">SLA On-Time</span>
                    <p className="text-xl font-extrabold text-emerald-600 mt-0.5">98.4%</p>
                  </div>

                  <div
                    className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm cursor-pointer hover:border-[#ef4d23] transition-all"
                    onClick={() => setViewMode("grid")}
                  >
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">In Sprint</span>
                    <p className="text-xl font-extrabold text-slate-900 mt-0.5">{deliverables.length} Items</p>
                  </div>

                  <div
                    className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm cursor-pointer hover:border-[#ef4d23] transition-all"
                    onClick={() => setStatusFilter("client_review")}
                  >
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Needs Review</span>
                    <p className="text-xl font-extrabold text-amber-600 mt-0.5">3 Pending</p>
                  </div>

                  <div
                    className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm cursor-pointer hover:border-[#ef4d23] transition-all"
                    onClick={() => setStatusFilter("approved")}
                  >
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Client Approved</span>
                    <p className="text-xl font-extrabold text-sky-600 mt-0.5">
                      {deliverables.filter((d) => d.status === "approved" || d.status === "delivered").length} Total
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Segmented View Switcher Dock (Luminous Frosted Glass) */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/80 backdrop-blur-3xl p-3 rounded-3xl border border-white/90 shadow-xl shadow-black/5">
              <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-[#ef4d23] text-white shadow-md shadow-[#ef4d23]/30"
                      : "text-slate-700 hover:text-slate-900 hover:bg-white"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" /> Creative Grid
                </button>

                <button
                  onClick={() => setViewMode("kanban")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    viewMode === "kanban"
                      ? "bg-[#ef4d23] text-white shadow-md shadow-[#ef4d23]/30"
                      : "text-slate-700 hover:text-slate-900 hover:bg-white"
                  }`}
                >
                  <Kanban className="h-4 w-4" /> Pipeline Stage Board
                </button>

                <button
                  onClick={() => setViewMode("clients")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    viewMode === "clients"
                      ? "bg-[#ef4d23] text-white shadow-md shadow-[#ef4d23]/30"
                      : "text-slate-700 hover:text-slate-900 hover:bg-white"
                  }`}
                >
                  <Building2 className="h-4 w-4" /> Client Retainers
                </button>

                <button
                  onClick={() => setViewMode("proofs")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    viewMode === "proofs"
                      ? "bg-[#ef4d23] text-white shadow-md shadow-[#ef4d23]/30"
                      : "text-slate-700 hover:text-slate-900 hover:bg-white"
                  }`}
                >
                  <MessageSquare className="h-4 w-4" /> Proofing & Reviews
                </button>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-[#ef4d23] hover:bg-[#d93c14] text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-lg shadow-[#ef4d23]/30 border border-white/40 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Plus className="h-4 w-4" /> Create Deliverable
              </button>
            </div>

            {/* Filter Dock (Luminous White Glass) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-extrabold text-slate-500 shrink-0 uppercase tracking-wider mr-1">Client:</span>
                <button
                  onClick={() => setSelectedClientFilter("all")}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                    selectedClientFilter === "all"
                      ? "bg-slate-900 text-white shadow-md scale-[1.02]"
                      : "bg-white/80 hover:bg-white text-slate-800 border border-white/90 shadow-xs"
                  }`}
                >
                  All Retainers ({deliverables.length})
                </button>

                {SEED_CLIENTS.map((client) => {
                  const count = deliverables.filter(
                    (d) => d.client_id === client.id || d.client_name === client.company_name
                  ).length;
                  const isSelected = selectedClientFilter === client.id;

                  return (
                    <button
                      key={client.id}
                      onClick={() => setSelectedClientFilter(client.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                        isSelected
                          ? "bg-[#ef4d23] text-white shadow-md shadow-[#ef4d23]/30 border border-white/40 scale-[1.02]"
                          : "bg-white/80 hover:bg-white text-slate-800 border border-white/90 shadow-xs"
                      }`}
                    >
                      <span>{client.company_name}</span>
                      <span className="bg-slate-200/80 px-2 py-0.5 rounded-full text-[10px] text-slate-900 font-extrabold">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Secondary Type & Search Filter Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-2xl p-3.5 rounded-2xl border border-white/90 shadow-md shadow-black/5">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-600 font-extrabold mr-1">Type:</span>
                    {[
                      { id: "all", label: "All" },
                      { id: "reels", label: "📹 Reels" },
                      { id: "ads", label: "✨ Ad Sets" },
                      { id: "blogs", label: "📄 Articles" },
                      { id: "carousels", label: "📱 Carousels" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTypeFilter(t.id)}
                        className={`px-3 py-1.5 rounded-xl font-extrabold transition-all ${
                          typeFilter === t.id ? "bg-slate-900 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs pl-3 border-l border-slate-200/80">
                    <span className="text-slate-600 font-extrabold mr-1">Status:</span>
                    {[
                      { id: "all", label: "All" },
                      { id: "in_progress", label: "⚡ In Production" },
                      { id: "client_review", label: "🟡 In Review" },
                      { id: "approved", label: "🟢 Approved" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStatusFilter(s.id)}
                        className={`px-3 py-1.5 rounded-xl font-extrabold transition-all ${
                          statusFilter === s.id ? "bg-slate-900 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search deliverable title…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-white border border-slate-200/80 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ef4d23] w-60 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Creative Grid View Mode */}
            {viewMode === "grid" && (
              <div>
                {filteredDeliverables.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 bg-white/70 backdrop-blur-md rounded-3xl border border-dashed border-slate-300 shadow-sm">
                    <Inbox className="h-10 w-10 mx-auto text-slate-400 mb-3" />
                    <p className="font-extrabold text-slate-800 text-base">No deliverables match this filter combination.</p>
                    <button
                      onClick={() => {
                        setSelectedClientFilter("all");
                        setTypeFilter("all");
                        setStatusFilter("all");
                        setSearchQuery("");
                      }}
                      className="mt-3 text-xs font-extrabold text-[#ef4d23] hover:underline"
                    >
                      Reset all filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredDeliverables.map((item) => {
                      const coverImage = CARD_COVER_MOCKUPS[item.id] || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
                      const completedSubtasks = (item.subtasks || []).filter((s) => s.completed).length;
                      const totalSubtasks = item.subtasks?.length || 1;
                      const progressPct = Math.round((completedSubtasks / totalSubtasks) * 100);

                      const isApproved = item.status === "approved" || item.status === "delivered";

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedTask(item);
                            setIsTaskModalOpen(true);
                          }}
                          className="group bg-white/80 hover:bg-white backdrop-blur-3xl rounded-3xl overflow-hidden border border-white/90 shadow-lg hover:shadow-2xl hover:border-[#ef4d23]/80 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                        >
                          {/* Cover Image */}
                          <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                            <img
                              src={coverImage}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                              <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-extrabold px-3 py-1 rounded-full border border-white/40 uppercase tracking-wider shadow-sm">
                                {item.type.replace("_", " ")}
                              </span>

                              {isApproved ? (
                                <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                                  <Check className="h-3 w-3" /> Approved
                                </span>
                              ) : (
                                <span className="bg-amber-500 text-white font-extrabold text-[10px] px-3 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse">
                                  <Clock className="h-3 w-3" /> In Production
                                </span>
                              )}
                            </div>

                            <div className="absolute bottom-3 left-3 right-3">
                              <span className="text-[11px] font-extrabold text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 inline-block shadow-sm">
                                🏢 {item.client_name}
                              </span>
                            </div>
                          </div>

                          {/* Content Body */}
                          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-slate-900">
                            <div>
                              <h3 className="font-extrabold text-sm text-slate-900 leading-snug group-hover:text-[#ef4d23] transition-colors line-clamp-2">
                                {item.title}
                              </h3>
                              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 font-medium">
                                {item.brief_description || "Standard creative deliverable sprint item."}
                              </p>
                            </div>

                            <div className="space-y-1.5 pt-2 border-t border-slate-100">
                              <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-600">
                                <span>Sprint Progress</span>
                                <span>{progressPct}% ({completedSubtasks}/{totalSubtasks})</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isApproved ? "bg-emerald-500 shadow-sm" : "bg-[#ef4d23]"
                                  }`}
                                  style={{ width: `${progressPct}%` }}
                                />
                              </div>
                            </div>

                            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-extrabold border-t border-slate-100">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#ef4d23] text-white text-[9px] font-extrabold flex items-center justify-center border border-white/40 shadow-sm">
                                  {item.assigned_to_name.charAt(0)}
                                </div>
                                <span className="truncate max-w-[100px] text-slate-700">{item.assigned_to_name}</span>
                              </div>
                              <span className="text-slate-500">Due: {item.due_date}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Kanban Stage Board Mode */}
            {viewMode === "kanban" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
                {[
                  { id: "in_progress", label: "⚡ In Production", color: "border-sky-300 bg-sky-50 text-sky-900" },
                  { id: "internal_review", label: "🔍 Internal QA", color: "border-purple-300 bg-purple-50 text-purple-900" },
                  { id: "client_review", label: "🟡 Client Proofing", color: "border-amber-300 bg-amber-50 text-amber-900" },
                  { id: "approved", label: "🟢 Approved & Ready", color: "border-emerald-300 bg-emerald-50 text-emerald-900" },
                ].map((column) => {
                  const columnDeliverables = filteredDeliverables.filter((d) => {
                    if (column.id === "approved") return d.status === "approved" || d.status === "delivered";
                    return d.status === column.id;
                  });

                  return (
                    <div key={column.id} className="bg-white/80 backdrop-blur-2xl p-4 rounded-3xl border border-white/90 shadow-xl shadow-black/5 space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full border shadow-2xs ${column.color}`}>
                          {column.label}
                        </span>
                        <span className="text-xs font-extrabold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                          {columnDeliverables.length}
                        </span>
                      </div>

                      <div className="space-y-3 min-h-[300px]">
                        {columnDeliverables.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setSelectedTask(item);
                              setIsTaskModalOpen(true);
                            }}
                            className="bg-white p-4 rounded-2xl border border-slate-200/90 hover:border-[#ef4d23] text-slate-900 shadow-md cursor-pointer space-y-2.5 transition-all hover:-translate-y-0.5"
                          >
                            <span className="text-[10px] font-extrabold text-[#ef4d23] uppercase tracking-wider block">
                              {item.client_name}
                            </span>
                            <h4 className="font-extrabold text-xs text-slate-900 leading-snug">{item.title}</h4>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100 font-extrabold">
                              <span>👤 {item.assigned_to_name}</span>
                              <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full text-slate-800 font-bold">{item.type}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Client Retainers Directory Mode */}
            {viewMode === "clients" && (
              <div className="bg-white/80 backdrop-blur-3xl rounded-3xl border border-white/90 shadow-xl shadow-black/5 p-6 text-slate-900 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <h3 className="text-lg font-extrabold text-slate-900">Client Retainers Portfolio & Delivery SLA</h3>
                  <span className="text-xs font-extrabold bg-[#ef4d23] text-white px-3 py-1 rounded-full shadow-md">
                    Luminous White Glass View
                  </span>
                </div>

                <Table containerClassName="bg-white/90 border border-slate-200">
                  <TableHeader className="bg-slate-100">
                    <TableRow className="border-b border-slate-200">
                      <TableHead className="py-4 text-slate-900 font-extrabold text-xs tracking-wider">Client Company</TableHead>
                      <TableHead className="py-4 text-slate-900 font-extrabold text-xs tracking-wider">Retainer Tier</TableHead>
                      <TableHead className="py-4 text-slate-900 font-extrabold text-xs tracking-wider">Location</TableHead>
                      <TableHead className="py-4 text-slate-900 font-extrabold text-xs tracking-wider">In-Flight Tasks</TableHead>
                      <TableHead className="py-4 text-slate-900 font-extrabold text-xs tracking-wider text-right">SLA Health</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-200 text-xs text-slate-900">
                    {SEED_CLIENTS.map((c) => {
                      const tasksCount = deliverables.filter((d) => d.client_id === c.id || d.client_name === c.company_name).length;
                      return (
                        <TableRow key={c.id} className="hover:bg-slate-50 border-b border-slate-200 transition-colors cursor-pointer" onClick={() => { setCurrentTab("dashboard"); setSelectedClientFilter(c.id); }}>
                          <TableCell className="py-4 font-extrabold text-slate-900 text-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#ef4d23] text-white flex items-center justify-center font-extrabold text-xs shadow-md border border-white/30">
                                {c.company_name.charAt(0)}
                              </div>
                              <span className="text-slate-900 font-extrabold text-sm">{c.company_name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-slate-700 font-extrabold text-xs">{c.package_tier}</TableCell>
                          <TableCell className="py-4 text-slate-600 font-bold text-xs">{c.location || "Global"}</TableCell>
                          <TableCell className="py-4 font-extrabold text-[#ef4d23] text-xs">{tasksCount} Active Deliverables</TableCell>
                          <TableCell className="py-4 text-right font-extrabold text-emerald-600 text-xs">🟢 98.4% On-Time SLA</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Proofs Mode */}
            {viewMode === "proofs" && (
              <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-3xl rounded-3xl border border-white/90 p-6 shadow-xl shadow-black/5 space-y-4 text-slate-900">
                  <h3 className="text-lg font-extrabold text-slate-900">Recent Client Review Requests & Proofing Activity</h3>

                  <div className="space-y-3">
                    {[
                      { client: "Northbeam Outdoors", task: "Q4 Performance Video Reel", time: "2h ago", text: "Approved second cut! Ready for campaign publication." },
                      { client: "Fable Skincare", task: "Gen AI UGC Ad Concepts", time: "4h ago", text: "Requested color grading adjustment on slide 3 background." },
                      { client: "Kite & Co", task: "Autumn Promotion Static & Carousel Banners", time: "1d ago", text: "Internal QA approved slide copy deck." },
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200/90 flex items-center justify-between text-xs shadow-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">{item.client}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-[#ef4d23] font-extrabold">{item.task}</span>
                          </div>
                          <p className="text-slate-700 font-semibold">{item.text}</p>
                        </div>
                        <span className="text-xs text-slate-500 font-extrabold bg-slate-100 px-3 py-1 rounded-full">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MY TASKS (STAFF TASKLIST VIEW) */}
        {/* ========================================================================= */}
        {currentTab === "tasks" && (
          <div className="bg-white/80 backdrop-blur-3xl rounded-3xl border border-white/90 p-6 shadow-xl shadow-black/5 space-y-5 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">My Deliverable Tasks</h2>
                <p className="text-xs text-slate-500 mt-0.5 font-semibold">Click any task row to view details, update status steppers, or upload files.</p>
              </div>

              <Button onClick={() => setIsCreateModalOpen(true)} className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-extrabold text-xs px-4">
                <Plus className="h-4 w-4 mr-1" /> New Task
              </Button>
            </div>

            <div className="space-y-3">
              {deliverables.map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setIsTaskModalOpen(true);
                  }}
                  className="p-4 bg-white hover:bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-200/90 cursor-pointer transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.status === "approved" || task.status === "delivered"}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleUpdateTask({
                          ...task,
                          status: task.status === "approved" ? "in_progress" : "approved",
                        });
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-[#ef4d23] focus:ring-[#ef4d23]"
                    />
                    <div>
                      <span className={`font-extrabold text-sm ${task.status === "approved" ? "line-through text-slate-400" : "text-slate-900"}`}>
                        {task.title}
                      </span>
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                        Assigned: {task.assigned_to_name} • Category: {task.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-xs text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      {task.client_name}
                    </span>
                    <span className="bg-[#ef4d23]/10 text-[#ef4d23] font-extrabold text-xs px-3 py-1 rounded-full border border-[#ef4d23]/30">
                      {STAGE_LABELS[task.status] || task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: LEADS & SALES PIPELINE */}
        {/* ========================================================================= */}
        {currentTab === "leads" && (
          <div className="bg-white/80 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl border border-white/90 shadow-xl shadow-black/5 text-slate-900 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  Leads & Sales <span className="font-serif-italic text-[#ef4d23] font-normal">Pipeline</span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5 font-semibold">
                  Track client campaign customer inquiries & manage B2B agency retainer deals.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase">Incoming Inquiries</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">12 Leads</p>
                <span className="text-[10px] text-emerald-600 font-bold">+4 new today</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase">🔥 Hot Prospects</span>
                <p className="text-2xl font-extrabold text-[#ef4d23] mt-1">5 Hot Deals</p>
                <span className="text-[10px] text-slate-600 font-bold">Immediate Follow-up Needed</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase">🎉 Active Retainer Pipeline</span>
                <p className="text-2xl font-extrabold text-emerald-600 mt-1">$45,000 /mo</p>
                <span className="text-[10px] text-slate-600 font-bold">Closed Deals Value</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CALENDAR VIEW */}
        {/* ========================================================================= */}
        {currentTab === "calendar" && <DeliveryCalendarView deliverables={deliverables} />}

        {/* ========================================================================= */}
        {/* TAB 5: CLIENTS RETAINERS TAB */}
        {/* ========================================================================= */}
        {currentTab === "clients" && (
          <div className="bg-white/80 backdrop-blur-3xl rounded-3xl border border-white/90 shadow-xl shadow-black/5 p-6 text-slate-900 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">Client Retainers Portfolio & Delivery SLA</h3>
            <Table containerClassName="bg-white border border-slate-200">
              <TableHeader className="bg-slate-100">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="py-4 text-slate-900 font-extrabold text-xs tracking-wider">Client Company</TableHead>
                  <TableHead className="py-4 text-slate-900 font-extrabold text-xs tracking-wider">Retainer Tier</TableHead>
                  <TableHead className="py-4 text-slate-900 font-extrabold text-xs tracking-wider">Location</TableHead>
                  <TableHead className="py-4 text-slate-900 font-extrabold text-xs tracking-wider">In-Flight Tasks</TableHead>
                  <TableHead className="py-4 text-slate-900 font-extrabold text-xs tracking-wider text-right">SLA Health</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-200 text-xs text-slate-900">
                {SEED_CLIENTS.map((c) => {
                  const tasksCount = deliverables.filter((d) => d.client_id === c.id || d.client_name === c.company_name).length;
                  return (
                    <TableRow key={c.id} className="hover:bg-slate-50 border-b border-slate-200 transition-colors cursor-pointer" onClick={() => { setCurrentTab("dashboard"); setSelectedClientFilter(c.id); }}>
                      <TableCell className="py-4 font-extrabold text-slate-900 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#ef4d23] text-white flex items-center justify-center font-extrabold text-xs shadow-md">
                            {c.company_name.charAt(0)}
                          </div>
                          <span className="text-slate-900 font-extrabold text-sm">{c.company_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-slate-700 font-extrabold text-xs">{c.package_tier}</TableCell>
                      <TableCell className="py-4 text-slate-600 font-bold text-xs">{c.location || "Global"}</TableCell>
                      <TableCell className="py-4 font-extrabold text-[#ef4d23] text-xs">{tasksCount} Active Deliverables</TableCell>
                      <TableCell className="py-4 text-right font-extrabold text-emerald-600 text-xs">🟢 98.4% On-Time SLA</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: WORKLOAD CAPACITY VIEW */}
        {/* ========================================================================= */}
        {currentTab === "workload" && <WorkloadCapacityView deliverables={deliverables} onReassignTask={() => {}} />}

        {/* ========================================================================= */}
        {/* TAB 7: REPORTS VIEW */}
        {/* ========================================================================= */}
        {currentTab === "reports" && (
          <div className="bg-white/80 backdrop-blur-3xl rounded-3xl border border-white/90 p-6 sm:p-8 shadow-xl shadow-black/5 space-y-6 text-slate-900">
            <div className="border-b border-slate-200/80 pb-4">
              <h2 className="text-2xl font-extrabold text-slate-900">Delivery Velocity & SLA Analytics</h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Operational turnaround speeds and SLA breach prevention reporting.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase">Average Delivery Speed</span>
                <p className="text-3xl font-extrabold text-emerald-600">2.4 Days</p>
                <span className="text-[10px] text-slate-400 font-bold">Per creative deliverable</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase">Client SLA Compliance</span>
                <p className="text-3xl font-extrabold text-[#ef4d23]">98.4%</p>
                <span className="text-[10px] text-slate-400 font-bold">Target: &gt; 95%</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase">Revision Rate</span>
                <p className="text-3xl font-extrabold text-sky-600">4.2%</p>
                <span className="text-[10px] text-slate-400 font-bold">Low client rework</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: SETTINGS VIEW */}
        {/* ========================================================================= */}
        {currentTab === "settings" && (
          <div className="bg-white/80 backdrop-blur-3xl rounded-3xl border border-white/90 p-6 sm:p-8 shadow-xl shadow-black/5 space-y-6 text-slate-900">
            <div className="border-b border-slate-200/80 pb-4">
              <h2 className="text-2xl font-extrabold text-slate-900">Delivery Templates & Media Library</h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Configure asset templates, media uploads, and team operational settings.</p>
            </div>

            <MediaManager />
          </div>
        )}

        {/* ========================================================================= */}
        {/* CREATE DELIVERABLE MODAL */}
        {/* ========================================================================= */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-200 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-[#ef4d23]" /> Create New Deliverable
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDeliverable} className="space-y-4">
                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">Deliverable Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Q4 Instagram Reel & Motion Graphics Cut"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold text-slate-900 focus:ring-1 focus:ring-[#ef4d23]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">Client Retainer Account</label>
                  <select
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold text-slate-900 focus:ring-1 focus:ring-[#ef4d23]"
                  >
                    {SEED_CLIENTS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name} ({c.location || "Retainer"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">Deliverable Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as Deliverable["type"])}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold text-slate-900 focus:ring-1 focus:ring-[#ef4d23]"
                  >
                    <option value="reel">Instagram Reel / Short Video</option>
                    <option value="ad_creative">Paid Ad Creative Set</option>
                    <option value="carousel">Carousel Slide Deck</option>
                    <option value="blog">SEO Article / Blog</option>
                    <option value="email_campaign">Email Campaign Template</option>
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">Brief & Objectives</label>
                  <textarea
                    rows={3}
                    placeholder="Key requirements and targets..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold text-slate-900 focus:ring-1 focus:ring-[#ef4d23]"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                  <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="text-slate-600 hover:text-slate-900">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-extrabold px-5 shadow-md shadow-[#ef4d23]/30">
                    Create Deliverable
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TASK DETAIL SLIDE OVER MODAL */}
        <DeliveryTaskModal
          deliverable={selectedTask}
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleUpdateTask}
          onUpdate={handleUpdateTask}
          onToggleSubtask={handleToggleSubtask}
        />
      </div>
    </DeliveryLayoutShell>
  );
}
