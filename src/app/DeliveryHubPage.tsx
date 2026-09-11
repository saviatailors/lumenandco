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
  LayoutGrid,
  Kanban,
  Zap,
  TrendingUp,
  Check,
  Eye,
  SlidersHorizontal,
  Share2,
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
import { useToast } from "./components/ui/Toast";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "./components/ui/Table";
import { Badge } from "./components/ui/Badge";
import { Button } from "./components/ui/Button";

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

  // Primary Deliverables Dataset
  const [deliverables, setDeliverables] = useState<Deliverable[]>(INITIAL_DELIVERABLES);
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

  // Quick Action Handler
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
        {/* 1. EXECUTIVE PULSE BANNER (LUMEN & CO BRAND OPS STAGE) */}
        {/* ========================================================================= */}
        <div className="relative overflow-hidden bg-gradient-to-r from-black/60 via-[#181924]/80 to-[#221715]/70 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl text-white">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[#ef4d23]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="bg-[#ef4d23] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md shadow-[#ef4d23]/30 tracking-wider">
                  Live Operations Command
                </span>
                <span className="text-white/40 text-xs">•</span>
                <span className="text-white/70 text-xs font-semibold">Q3 Creative Deliverables Sprint</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Delivery <span className="font-serif-italic text-[#ef4d23] font-normal">Hub</span>
              </h1>
              <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-xl font-medium">
                Real-time campaign proofing, SLA compliance velocity, and client deliverable stage management.
              </p>
            </div>

            {/* Metric Counter Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/10 backdrop-blur-xl p-3.5 rounded-2xl border border-white/20 shadow-inner">
                <span className="text-[10px] font-extrabold text-white/60 uppercase tracking-wider block">SLA On-Time</span>
                <p className="text-xl font-extrabold text-emerald-400 mt-0.5">98.4%</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl p-3.5 rounded-2xl border border-white/20 shadow-inner">
                <span className="text-[10px] font-extrabold text-white/60 uppercase tracking-wider block">In Sprint</span>
                <p className="text-xl font-extrabold text-white mt-0.5">{deliverables.length} Items</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl p-3.5 rounded-2xl border border-white/20 shadow-inner">
                <span className="text-[10px] font-extrabold text-white/60 uppercase tracking-wider block">Needs Review</span>
                <p className="text-xl font-extrabold text-amber-400 mt-0.5">3 Pending</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl p-3.5 rounded-2xl border border-white/20 shadow-inner">
                <span className="text-[10px] font-extrabold text-white/60 uppercase tracking-wider block">Client Approved</span>
                <p className="text-xl font-extrabold text-sky-400 mt-0.5">
                  {deliverables.filter((d) => d.status === "approved" || d.status === "delivered").length} Total
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. DYNAMIC WORKSPACE VIEW SWITCHER DOCK */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-black/40 backdrop-blur-3xl p-3 rounded-3xl border border-white/20 shadow-xl">
          {/* Segmented View Mode Tabs */}
          <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-2xl border border-white/15">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#ef4d23] text-white shadow-md shadow-[#ef4d23]/30"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <LayoutGrid className="h-4 w-4" /> Creative Grid
            </button>

            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-[#ef4d23] text-white shadow-md shadow-[#ef4d23]/30"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Kanban className="h-4 w-4" /> Pipeline Stage Board
            </button>

            <button
              onClick={() => setViewMode("clients")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                viewMode === "clients"
                  ? "bg-[#ef4d23] text-white shadow-md shadow-[#ef4d23]/30"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Building2 className="h-4 w-4" /> Client Retainers
            </button>

            <button
              onClick={() => setViewMode("proofs")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                viewMode === "proofs"
                  ? "bg-[#ef4d23] text-white shadow-md shadow-[#ef4d23]/30"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <MessageSquare className="h-4 w-4" /> Proofing & Reviews
            </button>
          </div>

          {/* New Deliverable Action Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-[#ef4d23] hover:bg-[#d93c14] text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-lg shadow-[#ef4d23]/30 border border-white/30 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" /> Create Deliverable
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 3. INTERACTIVE HORIZONTAL CLIENT FILTER & TAG DOCK */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          {/* Client Filter Pill Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-white/50 shrink-0 uppercase tracking-wider mr-1">Client:</span>
            <button
              onClick={() => setSelectedClientFilter("all")}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                selectedClientFilter === "all"
                  ? "bg-white text-neutral-900 shadow-md scale-[1.02]"
                  : "bg-white/10 hover:bg-white/20 text-white/80 border border-white/15"
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
                      ? "bg-[#ef4d23] text-white shadow-lg shadow-[#ef4d23]/30 border border-white/30 scale-[1.02]"
                      : "bg-white/10 hover:bg-white/20 text-white/80 border border-white/15"
                  }`}
                >
                  <span>{client.company_name}</span>
                  <span className="bg-black/30 px-2 py-0.5 rounded-full text-[10px] text-white/90">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Type & Search Filter Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white/10 backdrop-blur-2xl p-3 rounded-2xl border border-white/15">
            <div className="flex flex-wrap items-center gap-3">
              {/* Type Filter Buttons */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-white/60 font-bold mr-1">Type:</span>
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
                    className={`px-3 py-1 rounded-xl font-bold transition-all ${
                      typeFilter === t.id ? "bg-white text-neutral-900 shadow-xs" : "text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-1 text-xs pl-3 border-l border-white/15">
                <span className="text-white/60 font-bold mr-1">Status:</span>
                {[
                  { id: "all", label: "All" },
                  { id: "in_progress", label: "⚡ In Production" },
                  { id: "client_review", label: "🟡 In Review" },
                  { id: "approved", label: "🟢 Approved" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStatusFilter(s.id)}
                    className={`px-3 py-1 rounded-xl font-bold transition-all ${
                      statusFilter === s.id ? "bg-white text-neutral-900 shadow-xs" : "text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Instant Search Bar */}
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search deliverable title…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-black/40 border border-white/20 rounded-xl text-xs font-medium text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#ef4d23] w-60"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. MODE 1: CREATIVE GRID VIEW (WITH VISUAL MEDIA COVER PREVIEWS) */}
        {/* ========================================================================= */}
        {viewMode === "grid" && (
          <div>
            {filteredDeliverables.length === 0 ? (
              <div className="p-12 text-center text-white/50 bg-white/5 rounded-3xl border border-dashed border-white/20">
                <Inbox className="h-10 w-10 mx-auto text-white/40 mb-3" />
                <p className="font-extrabold text-white text-base">No deliverables match this filter combination.</p>
                <button
                  onClick={() => {
                    setSelectedClientFilter("all");
                    setTypeFilter("all");
                    setStatusFilter("all");
                    setSearchQuery("");
                  }}
                  className="mt-3 text-xs font-bold text-[#ef4d23] hover:underline"
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
                      className="group bg-white/10 backdrop-blur-3xl rounded-3xl overflow-hidden border border-white/20 shadow-xl hover:shadow-2xl hover:border-[#ef4d23]/80 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                    >
                      {/* Media Card Cover Thumbnail */}
                      <div className="relative h-44 w-full overflow-hidden bg-black/40">
                        <img
                          src={coverImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-full border border-white/20 uppercase tracking-wider">
                            {item.type.replace("_", " ")}
                          </span>

                          {isApproved ? (
                            <span className="bg-emerald-500 text-white font-extrabold text-[10px] px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                              <Check className="h-3 w-3" /> Approved
                            </span>
                          ) : (
                            <span className="bg-amber-500 text-white font-extrabold text-[10px] px-3 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse">
                              <Clock className="h-3 w-3" /> In Production
                            </span>
                          )}
                        </div>

                        {/* Bottom Client Tag */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="text-[11px] font-extrabold text-white/90 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 inline-block">
                            🏢 {item.client_name}
                          </span>
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-white">
                        <div>
                          <h3 className="font-extrabold text-sm text-white leading-snug group-hover:text-[#ef4d23] transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-[11px] text-white/60 mt-1 line-clamp-2 font-medium">
                            {item.brief_description || "Standard creative deliverable sprint item."}
                          </p>
                        </div>

                        {/* Progress Stepper & Subtask Count */}
                        <div className="space-y-1.5 pt-2 border-t border-white/10">
                          <div className="flex items-center justify-between text-[11px] font-bold text-white/70">
                            <span>Sprint Progress</span>
                            <span>{progressPct}% ({completedSubtasks}/{totalSubtasks})</span>
                          </div>
                          <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden p-0.5 border border-white/10">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isApproved ? "bg-emerald-400 shadow-md shadow-emerald-400/50" : "bg-[#ef4d23]"
                              }`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Card Footer: Assignee & Date */}
                        <div className="pt-2 flex items-center justify-between text-[11px] text-white/60 font-semibold">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#ef4d23] text-white text-[9px] font-extrabold flex items-center justify-center border border-white/30">
                              {item.assigned_to_name.charAt(0)}
                            </div>
                            <span className="truncate max-w-[100px]">{item.assigned_to_name}</span>
                          </div>
                          <span>Due: {item.due_date}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. MODE 2: PIPELINE STAGE BOARD (KANBAN SWIMLANES) */}
        {/* ========================================================================= */}
        {viewMode === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
            {[
              { id: "in_progress", label: "⚡ In Production", color: "border-sky-500/50 bg-sky-500/10 text-sky-300" },
              { id: "internal_review", label: "🔍 Internal QA", color: "border-purple-500/50 bg-purple-500/10 text-purple-300" },
              { id: "client_review", label: "🟡 Client Proofing", color: "border-amber-500/50 bg-amber-500/10 text-amber-300" },
              { id: "approved", label: "🟢 Approved & Ready", color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" },
            ].map((column) => {
              const columnDeliverables = filteredDeliverables.filter((d) => {
                if (column.id === "approved") return d.status === "approved" || d.status === "delivered";
                return d.status === column.id;
              });

              return (
                <div key={column.id} className="bg-white/10 backdrop-blur-2xl p-4 rounded-3xl border border-white/20 shadow-xl space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-white/15">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${column.color}`}>
                      {column.label}
                    </span>
                    <span className="text-xs font-extrabold text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
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
                        className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/15 hover:border-[#ef4d23] text-white shadow-md cursor-pointer space-y-2.5 transition-all hover:-translate-y-0.5"
                      >
                        <span className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">
                          {item.client_name}
                        </span>
                        <h4 className="font-extrabold text-xs text-white leading-snug">{item.title}</h4>
                        <div className="flex items-center justify-between text-[10px] text-white/60 pt-2 border-t border-white/10">
                          <span>👤 {item.assigned_to_name}</span>
                          <span className="bg-white/10 px-2 py-0.5 rounded-full text-white/80 font-bold">{item.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. MODE 3: CLIENT RETAINERS DIRECTORY */}
        {/* ========================================================================= */}
        {viewMode === "clients" && (
          <div className="bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl p-6 text-white space-y-4">
            <h3 className="text-lg font-extrabold text-white">Client Retainers Portfolio & Delivery SLA</h3>
            <Table>
              <TableHeader>
                <TableRow className="bg-white/10 text-white/70 font-extrabold text-xs uppercase border-b border-white/15">
                  <TableHead className="py-3.5 text-white/80">Client Company</TableHead>
                  <TableHead className="py-3.5 text-white/80">Retainer Tier</TableHead>
                  <TableHead className="py-3.5 text-white/80">Location</TableHead>
                  <TableHead className="py-3.5 text-white/80">In-Flight Tasks</TableHead>
                  <TableHead className="py-3.5 text-white/80 text-right">SLA Health</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-white/10 text-xs text-white font-medium">
                {SEED_CLIENTS.map((c) => {
                  const tasksCount = deliverables.filter((d) => d.client_id === c.id || d.client_name === c.company_name).length;
                  return (
                    <TableRow key={c.id} className="hover:bg-white/10 border-b border-white/10 transition-colors">
                      <TableCell className="py-4 font-extrabold text-white text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#ef4d23] text-white flex items-center justify-center font-bold text-xs shadow-md">
                            {c.company_name.charAt(0)}
                          </div>
                          <span>{c.company_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-white/80 font-bold">{c.package_tier}</TableCell>
                      <TableCell className="py-4 text-white/60">{c.location || "Global"}</TableCell>
                      <TableCell className="py-4 font-extrabold text-[#ef4d23]">{tasksCount} Active Deliverables</TableCell>
                      <TableCell className="py-4 text-right font-extrabold text-emerald-400">🟢 98.4% On-Time SLA</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. MODE 4: CLIENT PROOFING & REVIEWS LOG */}
        {/* ========================================================================= */}
        {viewMode === "proofs" && (
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/20 p-6 shadow-2xl space-y-4 text-white">
              <h3 className="text-lg font-extrabold text-white">Recent Client Review Requests & Proofing Activity</h3>

              <div className="space-y-3">
                {[
                  { client: "Northbeam Outdoors", task: "Q4 Performance Video Reel", time: "2h ago", text: "Approved second cut! Ready for campaign publication." },
                  { client: "Fable Skincare", task: "Gen AI UGC Ad Concepts", time: "4h ago", text: "Requested color grading adjustment on slide 3 background." },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-black/30 rounded-2xl border border-white/15 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white">{item.client}</span>
                        <span className="text-white/40">•</span>
                        <span className="text-[#ef4d23] font-bold">{item.task}</span>
                      </div>
                      <p className="text-white/80">{item.text}</p>
                    </div>
                    <span className="text-[10px] text-white/50 font-bold">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CREATE DELIVERABLE MODAL */}
        {/* ========================================================================= */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#181924] text-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-white/20 text-xs">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Plus className="h-5 w-5 text-[#ef4d23]" /> Create New Deliverable
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-white/60 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDeliverable} className="space-y-4">
                <div>
                  <label className="block font-bold text-white/80 mb-1">Deliverable Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Q4 Instagram Reel & Motion Graphics Cut"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 font-medium text-white placeholder:text-white/40 focus:ring-1 focus:ring-[#ef4d23]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-white/80 mb-1">Client Retainer Account</label>
                  <select
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 font-medium text-white focus:ring-1 focus:ring-[#ef4d23]"
                  >
                    {SEED_CLIENTS.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#181924]">
                        {c.company_name} ({c.location || "Retainer"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-white/80 mb-1">Deliverable Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as Deliverable["type"])}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 font-medium text-white focus:ring-1 focus:ring-[#ef4d23]"
                  >
                    <option value="reel" className="bg-[#181924]">Instagram Reel / Short Video</option>
                    <option value="ad_creative" className="bg-[#181924]">Paid Ad Creative Set</option>
                    <option value="carousel" className="bg-[#181924]">Carousel Slide Deck</option>
                    <option value="blog" className="bg-[#181924]">SEO Article / Blog</option>
                    <option value="email_campaign" className="bg-[#181924]">Email Campaign Template</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-white/80 mb-1">Brief & Objectives</label>
                  <textarea
                    rows={3}
                    placeholder="Key requirements and targets..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 font-medium text-white placeholder:text-white/40 focus:ring-1 focus:ring-[#ef4d23]"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-white/15">
                  <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="text-white/70 hover:text-white">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-extrabold px-5 shadow-lg shadow-[#ef4d23]/30">
                    Create Deliverable
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TASK DETAIL SLIDE OVER */}
        <DeliveryTaskModal
          deliverable={selectedTask}
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSave={() => toast.success("Task updated!")}
          onToggleSubtask={() => {}}
        />
      </div>
    </DeliveryLayoutShell>
  );
}
