import { useState } from "react";
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
} from "@/lib/delivery.functions";

import DeliveryTaskModal from "./components/DeliveryTaskModal";
import DeliveryCalendarView from "./components/DeliveryCalendarView";
import WorkloadCapacityView from "./components/WorkloadCapacityView";
import IntelligentPerformanceStage from "./components/IntelligentPerformanceStage";
import RigidGlassMetricCard from "./components/ui/RigidGlassMetricCard";
import { useToast } from "./components/ui/Toast";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "./components/ui/Table";
import { Badge } from "./components/ui/Badge";
import { Button } from "./components/ui/Button";

export default function DeliveryHubPage() {
  const admin = useAdminAuth();
  const toast = useToast();

  // Active Tab State (Wireframe Screen)
  const [currentTab, setCurrentTab] = useState<DeliveryTab>("dashboard");

  // Primary Datasets
  const [deliverables, setDeliverables] = useState<Deliverable[]>(INITIAL_DELIVERABLES);
  const [selectedTask, setSelectedTask] = useState<Deliverable | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Filters & Search
  const [taskSearchQuery, setTaskSearchQuery] = useState("");
  const [taskFilterStatus, setTaskFilterStatus] = useState("all");
  const [taskFilterClient, setTaskFilterClient] = useState("all");

  // New Task Modal
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newClient, setNewClient] = useState("client-1");
  const [newType, setNewType] = useState<Deliverable["type"]>("reel");

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

  // --- Handlers ---
  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setDeliverables((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = (t.subtasks || []).map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st,
        );
        return { ...t, subtasks: updatedSubtasks };
      }),
    );
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Deliverable = {
      id: `deliv-${Date.now()}`,
      title: newTitle.trim(),
      client_id: newClient,
      client_name: SEED_CLIENTS.find((c) => c.id === newClient)?.company_name || "Client",
      type: newType,
      stage: "in_progress",
      priority: "med",
      assigned_staff_id: "staff-3",
      assigned_staff_name: "Priya Sharma",
      account_manager_id: "staff-2",
      account_manager_name: "Sarah Chen",
      due_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      client_visible: false,
      revision_count: 0,
      subtasks: [
        { id: "st-1", label: "Get raw footage / briefing from client", completed: true },
        { id: "st-2", label: "Execute creative design cut", completed: false },
        { id: "st-[#ef4d23]", label: "Internal review & approval", completed: false },
      ],
      created_at: new Date().toISOString(),
    };

    setDeliverables([created, ...deliverables]);
    setNewTitle("");
    setShowCreateTaskModal(false);
    toast.success(`Task "${created.title}" added to Delivery Hub!`);
  };

  // Filtered Tasks for My Tasks
  const filteredTasks = deliverables.filter((t) => {
    const matchesStatus = taskFilterStatus === "all" || t.stage === taskFilterStatus;
    const matchesClient = taskFilterClient === "all" || t.client_id === taskFilterClient;
    const matchesSearch =
      t.title.toLowerCase().includes(taskSearchQuery.toLowerCase()) ||
      t.client_name.toLowerCase().includes(taskSearchQuery.toLowerCase());
    return matchesStatus && matchesClient && matchesSearch;
  });

  return (
    <DeliveryLayoutShell
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      onQuickAction={() => setShowCreateTaskModal(true)}
    >
      {/* ========================================================================= */}
      {/* SCREEN 1: DASHBOARD (Role-Aware — Designer's View) */}
      {/* ========================================================================= */}
      {currentTab === "dashboard" && (
        <div className="space-y-6">
          {/* Header Title */}
          <div className="flex items-center justify-between border-b border-neutral-300/60 pb-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
                Operations <span className="font-serif-italic text-[#ef4d23] font-normal">Dashboard</span>
              </h1>
              <p className="text-xs text-neutral-600 mt-0.5 font-medium">
                Designer Operations Workspace • Daily Priorities & Urgency Matrix
              </p>
            </div>

            <Button
              onClick={() => setShowCreateTaskModal(true)}
              className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-bold text-xs shadow-md shadow-[#ef4d23]/20 rounded-full px-4"
            >
              <Plus className="h-4 w-4 mr-1" /> New Task
            </Button>
          </div>

          {/* 3 RIGID 429x554 UNIFORM SCALING GLASS COMPOSITION CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1: Due Today */}
            <RigidGlassMetricCard
              variant="amber"
              title={<>Operations Schedule<br />Tasks Due Today</>}
              value="4"
              caption={<>🟡 Scheduled For Today<br />Priority Creative Cuts</>}
              buttonText="View Tasks"
              onClick={() => setCurrentTab("tasks")}
            />

            {/* Card 2: Overdue */}
            <RigidGlassMetricCard
              variant="speed"
              title={<>Overdue Delivery<br />Urgency Alert</>}
              value="1"
              unit="🔴"
              caption={<>Requires Immediate<br />Internal Review & Cut</>}
              buttonText="Fix Overdue"
              onClick={() => setCurrentTab("tasks")}
            />

            {/* Card 3: In Review */}
            <RigidGlassMetricCard
              variant="context"
              title={<>Internal Review &<br />Account Approval</>}
              value="2"
              caption={<>🔵 Pending AM Feedback<br />Client Submission Next</>}
              buttonText="Review Cuts"
              onClick={() => setCurrentTab("tasks")}
            />
          </div>

          {/* TODAY'S TASKS Section (Urgency Colored) */}
          <div className="bg-white/45 backdrop-blur-2xl p-6 rounded-3xl border border-white/60 text-neutral-900 shadow-xl shadow-black/5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-300/60 pb-3">
              <h3 className="font-extrabold text-neutral-900 text-sm tracking-wide uppercase">
                Today&apos;s Tasks
              </h3>
              <button
                onClick={() => setCurrentTab("tasks")}
                className="text-xs text-[#ef4d23] font-bold hover:underline"
              >
                [view all tasks]
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Task 1: Overdue */}
              <div
                onClick={() => {
                  if (deliverables[0]) {
                    setSelectedTask(deliverables[0]);
                    setIsTaskModalOpen(true);
                  }
                }}
                className="flex items-center justify-between p-4 bg-red-50/80 border border-red-200/90 rounded-2xl cursor-pointer hover:border-red-400 transition-all shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-red-100 text-red-800 font-extrabold px-2.5 py-1 rounded-full text-[10px] uppercase shadow-xs">
                    🔴 Overdue
                  </span>
                  <span className="font-extrabold text-neutral-900">
                    Instagram Reel — ABC School
                  </span>
                </div>
                <span className="text-neutral-500 font-semibold">Due: Yesterday</span>
              </div>

              {/* Task 2: Due Today */}
              <div
                onClick={() => {
                  if (deliverables[1]) {
                    setSelectedTask(deliverables[1]);
                    setIsTaskModalOpen(true);
                  }
                }}
                className="flex items-center justify-between p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl cursor-pointer hover:border-amber-400 transition-all shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-900 font-extrabold px-2.5 py-1 rounded-full text-[10px] uppercase shadow-xs">
                    🟡 Due today
                  </span>
                  <span className="font-extrabold text-neutral-900">
                    Ad Creative — DEF College
                  </span>
                </div>
                <span className="text-neutral-500 font-semibold">Due: 5:00 PM</span>
              </div>

              {/* Task 3: In Progress */}
              <div
                onClick={() => {
                  if (deliverables[2]) {
                    setSelectedTask(deliverables[2]);
                    setIsTaskModalOpen(true);
                  }
                }}
                className="flex items-center justify-between p-4 bg-sky-50/80 border border-sky-200/90 rounded-2xl cursor-pointer hover:border-sky-400 transition-all shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-sky-100 text-sky-900 font-extrabold px-2.5 py-1 rounded-full text-[10px] uppercase shadow-xs">
                    🔵 In Prog
                  </span>
                  <span className="font-extrabold text-neutral-900">
                    Carousel post — XYZ Academy
                  </span>
                </div>
                <span className="text-neutral-500 font-semibold">Due: Tomorrow</span>
              </div>
            </div>
          </div>

          {/* RECENTLY MENTIONED Section */}
          <div className="bg-white/45 backdrop-blur-2xl p-6 rounded-3xl border border-white/60 text-neutral-900 shadow-xl shadow-black/5 space-y-4">
            <h3 className="font-extrabold text-neutral-900 text-sm tracking-wide uppercase border-b border-neutral-300/60 pb-3">
              Recently Mentioned
            </h3>

            <div className="p-4 bg-white/50 rounded-2xl border border-white/70 shadow-xs flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-800">
                💬 <strong className="font-extrabold text-neutral-900">@Priya</strong> check the new brand colors — Sahit
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">2h ago</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: MY TASKS (List View for Staff) */}
      {/* ========================================================================= */}
      {currentTab === "tasks" && (
        <div className="space-y-4">
          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
                My <span className="font-serif-italic text-[#ef4d23] font-normal">Tasks</span>
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Staff task list view • Click task row to open status stepper drawer
              </p>
            </div>

            <Button
              onClick={() => setShowCreateTaskModal(true)}
              className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-bold text-xs shadow-md shadow-[#ef4d23]/20 rounded-full px-4"
            >
              <Plus className="h-4 w-4 mr-1" /> New Task
            </Button>
          </div>

          {/* Filter Bar */}
          <div className="bg-white/70 backdrop-blur-md p-4 rounded-3xl border border-white/80 shadow-md shadow-black/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-neutral-500">Status:</span>
                <select
                  value={taskFilterStatus}
                  onChange={(e) => setTaskFilterStatus(e.target.value)}
                  className="bg-white/80 border border-white/90 rounded-xl px-3 py-1.5 font-bold text-neutral-900 shadow-2xs"
                >
                  <option value="all">Active</option>
                  <option value="in_progress">In Progress</option>
                  <option value="internal_review">Review</option>
                  <option value="approved">Approved</option>
                </select>
              </div>

              {/* Client Filter */}
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-neutral-500">Client:</span>
                <select
                  value={taskFilterClient}
                  onChange={(e) => setTaskFilterClient(e.target.value)}
                  className="bg-white/80 border border-white/90 rounded-xl px-3 py-1.5 font-bold text-neutral-900 shadow-2xs"
                >
                  <option value="all">All Clients</option>
                  {SEED_CLIENTS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search tasks…"
                value={taskSearchQuery}
                onChange={(e) => setTaskSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white/80 border border-white/90 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-[#ef4d23] w-56 text-xs shadow-2xs text-neutral-900"
              />
            </div>
          </div>

          {/* Dynamic Task Roster View */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/80 shadow-md shadow-black/5 divide-y divide-neutral-200/50 overflow-hidden text-xs">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 font-semibold">
                No matching deliverables found.
              </div>
            ) : (
              filteredTasks.map((task) => {
                const stageLabel = STAGE_LABELS[task.stage] || task.stage;
                const isOverdue = new Date(task.due_date) < new Date() && task.stage !== "client_approved";

                return (
                  <div
                    key={task.id}
                    onClick={() => {
                      setSelectedTask(task);
                      setIsTaskModalOpen(true);
                    }}
                    className="p-4 flex items-center justify-between hover:bg-white/90 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.stage === "client_approved"}
                        onChange={(e) => {
                          e.stopPropagation();
                          setDeliverables((prev) =>
                            prev.map((d) =>
                              d.id === task.id
                                ? { ...d, stage: d.stage === "client_approved" ? "in_progress" : "client_approved" }
                                : d,
                            ),
                          );
                        }}
                        className="h-4 w-4 rounded border-neutral-300 text-[#ef4d23] focus:ring-[#ef4d23]"
                      />
                      <div>
                        <span
                          className={`font-extrabold ${
                            task.stage === "client_approved" ? "line-through text-neutral-400" : "text-neutral-900"
                          }`}
                        >
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-500 font-medium">
                          <span>Assigned: {task.assigned_staff_name}</span>
                          <span>•</span>
                          <span>Type: {task.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full border border-neutral-200">
                        {task.client_name}
                      </span>

                      {isOverdue ? (
                        <span className="bg-red-100 text-red-800 font-extrabold px-2.5 py-1 rounded-full text-[10px] uppercase shadow-xs">
                          🔴 Overdue ({task.due_date})
                        </span>
                      ) : (
                        <span className="bg-[#ef4d23]/10 text-[#ef4d23] font-extrabold px-2.5 py-1 rounded-full text-[10px] uppercase border border-[#ef4d23]/30">
                          {stageLabel}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: CALENDAR */}
      {/* ========================================================================= */}
      {currentTab === "calendar" && <DeliveryCalendarView deliverables={deliverables} />}

      {/* ========================================================================= */}
      {/* SCREEN 3B: LEADS & SALES PIPELINE */}
      {/* ========================================================================= */}
      {currentTab === "leads" && (
        <div className="bg-white/25 backdrop-blur-3xl p-6 rounded-3xl border border-white/40 shadow-2xl text-white space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Leads & Sales <span className="font-serif-italic text-[#ef4d23] font-normal">Pipeline</span>
              </h1>
              <p className="text-xs text-white/70 mt-0.5 font-medium">
                Track client campaign customer inquiries & manage B2B agency retainer deals.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 p-5 rounded-2xl border border-white/20">
              <span className="text-xs font-bold text-white/70 uppercase">Incoming Inquiries</span>
              <p className="text-2xl font-extrabold text-white mt-1">12 Leads</p>
              <span className="text-[10px] text-emerald-400 font-bold">+4 new today</span>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/20">
              <span className="text-xs font-bold text-white/70 uppercase">🔥 Hot Prospects</span>
              <p className="text-2xl font-extrabold text-[#ef4d23] mt-1">5 Hot</p>
              <span className="text-[10px] text-white/70 font-bold">Immediate Follow-up Needed</span>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/20">
              <span className="text-xs font-bold text-white/70 uppercase">🎉 Active Retainer Pipeline</span>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">₹4,50,000 /mo</p>
              <span className="text-[10px] text-white/70 font-bold">Closed Deals Value</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 4: TEAM WORKLOAD (Ops Manager View) */}
      {/* ========================================================================= */}
      {currentTab === "workload" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Team <span className="font-serif-italic text-[#ef4d23] font-normal">Workload</span>
              </h1>
              <p className="text-xs text-white/70 mt-0.5 font-medium">
                Staff capacity utilization and overload risk monitoring
              </p>
            </div>
          </div>

          <div className="bg-white/25 backdrop-blur-3xl rounded-3xl border border-white/40 shadow-2xl overflow-hidden p-2">
            <Table>
              <TableHeader>
                <TableRow className="bg-white/10 text-white/80 font-bold text-[11px] uppercase tracking-wider border-b border-white/15">
                  <TableHead className="py-3.5 pl-6 text-white/80">Staff Member</TableHead>
                  <TableHead className="py-3.5 text-white/80">Active Tasks</TableHead>
                  <TableHead className="py-3.5 text-white/80">Overdue</TableHead>
                  <TableHead className="py-3.5 pr-6 text-white/80">Capacity Utilization</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-white/10 text-xs text-white">
                {[
                  { staff: "Priya Sharma", role: "Ad Specialist", active: 6, overdue: 1, pct: 80 },
                  { staff: "Rahul Verma", role: "Brand Lead", active: 3, overdue: 0, pct: 30 },
                  { staff: "Ananya Roy", role: "Video Editor", active: 9, overdue: 2, pct: 100 },
                ].map((row) => {
                  const isOverloaded = row.pct >= 100;
                  return (
                    <TableRow key={row.staff} className="hover:bg-white/10 border-b border-white/10 transition-colors">
                      <TableCell className="py-3.5 pl-6 font-extrabold text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#ef4d23] text-white flex items-center justify-center font-bold text-xs shadow-md">
                            {row.staff.charAt(0)}
                          </div>
                          <div>
                            <p className="font-extrabold text-white text-sm">{row.staff}</p>
                            <p className="text-[11px] text-white/60 font-medium">{row.role}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 font-bold text-white text-sm">{row.active} tasks</TableCell>
                      <TableCell className="py-3.5">
                        {row.overdue > 0 ? (
                          <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-300 font-extrabold text-xs px-2.5 py-1 rounded-full border border-red-500/40">
                            🚨 {row.overdue} Overdue
                          </span>
                        ) : (
                          <span className="text-white/60 font-medium">0</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3.5 pr-6">
                        <div className="space-y-1.5 max-w-xs">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white">{row.pct}% Utilization</span>
                            {isOverloaded && (
                              <span className="bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-md animate-pulse">
                                ⚠️ Overload Risk
                              </span>
                            )}
                          </div>
                          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5 border border-white/20">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isOverloaded
                                  ? "bg-red-500 shadow-lg shadow-red-500/50"
                                  : row.pct > 75
                                  ? "bg-[#ef4d23] shadow-md shadow-[#ef4d23]/40"
                                  : "bg-emerald-400"
                              }`}
                              style={{ width: `${row.pct}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Full Workload Matrix */}
          <WorkloadCapacityView deliverables={deliverables} onReassignTask={() => {}} />
        </div>
      )}

      {/* AUXILIARY SCREENS */}
      {currentTab === "clients" && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-2xs space-y-4 text-xs">
          <h2 className="text-lg font-bold text-neutral-900">Client Accounts Deliverable Roster</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Company</TableHead>
                <TableHead>Retainer Package</TableHead>
                <TableHead>Active Deliverables</TableHead>
                <TableHead className="text-right">SLA Health</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SEED_CLIENTS.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-bold text-neutral-900">{c.company_name}</TableCell>
                  <TableCell className="font-medium text-neutral-600">{c.package_tier}</TableCell>
                  <TableCell className="font-bold">
                    {deliverables.filter((d) => d.client_id === c.id).length} Active Tasks
                  </TableCell>
                  <TableCell className="text-right font-bold text-emerald-600">🟢 98% On-Time</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {currentTab === "reports" && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-2xs space-y-4 text-xs">
          <h2 className="text-lg font-bold text-neutral-900">Delivery Velocity & SLA Reports</h2>
          <p className="text-neutral-500">
            Average turnaround time: <strong className="text-neutral-900 font-bold">2.4 days per deliverable</strong>
          </p>
        </div>
      )}

      {currentTab === "settings" && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-2xs space-y-4 text-xs">
          <h2 className="text-lg font-bold text-neutral-900">Delivery Templates & Workflow Settings</h2>
          <MediaManager />
        </div>
      )}

      {/* TASK DETAIL SLIDE OVER */}
      <DeliveryTaskModal
        deliverable={selectedTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={() => {
          toast.success("Task updated!");
        }}
        onToggleSubtask={handleToggleSubtask}
      />

      {/* CREATE TASK MODAL */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-neutral-200 text-xs">
            <h3 className="text-lg font-bold text-neutral-900">Create New Delivery Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Instagram Reel — Diwali Offer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Client Account</label>
                <select
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-medium"
                >
                  {SEED_CLIENTS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Deliverable Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as Deliverable["type"])}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-medium"
                >
                  <option value="reel">Instagram Reel</option>
                  <option value="ad_creative">Paid Ad Creative</option>
                  <option value="carousel">Carousel Post</option>
                  <option value="blog">Blog / Article</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setShowCreateTaskModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#ef4d23] hover:bg-[#d9421b] text-white">
                  Create Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DeliveryLayoutShell>
  );
}
