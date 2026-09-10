import { useState } from "react";
import {
  Users,
  AlertCircle,
  TrendingUp,
  Layers,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Clock
} from "lucide-react";

import {
  Deliverable,
  SEED_STAFF,
  StaffMember
} from "@/lib/delivery.functions";

export default function WorkloadCapacityView({
  deliverables,
  onReassignTask,
}: {
  deliverables: Deliverable[];
  onReassignTask: (taskId: string, newStaffId: string, newStaffName: string) => void;
}) {
  const [selectedTaskToReassign, setSelectedTaskToReassign] = useState<string>("");
  const [targetStaffId, setTargetStaffId] = useState<string>(SEED_STAFF[0].id);

  const getStaffMetrics = (staffId: string) => {
    const assigned = deliverables.filter((d) => d.assigned_to_staff_id === staffId);
    const inProgress = assigned.filter((d) => d.status === "in_progress");
    const urgent = assigned.filter((d) => d.priority === "urgent");
    const completed = assigned.filter((d) => d.status === "approved" || d.status === "delivered");
    const overdue = assigned.filter(
      (d) =>
        new Date(d.due_date).getTime() < Date.now() &&
        d.status !== "approved" &&
        d.status !== "delivered"
    );

    return {
      total: assigned.length,
      inProgressCount: inProgress.length,
      urgentCount: urgent.length,
      completedCount: completed.length,
      overdueCount: overdue.length,
      assignedTasks: assigned,
    };
  };

  const handleConfirmReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskToReassign) return;
    const targetStaff = SEED_STAFF.find((s) => s.id === targetStaffId);
    if (!targetStaff) return;

    onReassignTask(selectedTaskToReassign, targetStaff.id, targetStaff.name);
    setSelectedTaskToReassign("");
  };

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="bg-white/25 backdrop-blur-3xl p-6 rounded-3xl border border-white/40 shadow-2xl flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-white">Workload & Staff Capacity Engine</h3>
            <span className="bg-[#ef4d23]/20 text-[#fed7aa] border border-[#ef4d23]/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              Ops Manager View
            </span>
          </div>
          <p className="text-xs text-white/70 mt-1 font-medium">
            Monitor real-time task loads per staff member, prevent burnout, and reassign tasks seamlessly.
          </p>
        </div>

        {/* Reassignment Quick Tool */}
        <form onSubmit={handleConfirmReassign} className="flex flex-wrap items-center gap-2 bg-black/30 backdrop-blur-md p-2 rounded-2xl border border-white/20 text-xs">
          <select
            value={selectedTaskToReassign}
            onChange={(e) => setSelectedTaskToReassign(e.target.value)}
            className="bg-black/30 backdrop-blur-md border border-white/20 rounded-xl px-3 py-1.5 font-medium max-w-[200px] text-white focus:outline-none"
            required
          >
            <option value="" className="bg-neutral-900 text-white">Select task to reassign…</option>
            {deliverables
              .filter((d) => d.status !== "delivered" && d.status !== "archived")
              .map((d) => (
                <option key={d.id} value={d.id} className="bg-neutral-900 text-white">
                  {d.client_name} - {d.title.slice(0, 30)}
                </option>
              ))}
          </select>

          <span className="text-white/60 font-bold">→</span>

          <select
            value={targetStaffId}
            onChange={(e) => setTargetStaffId(e.target.value)}
            className="bg-black/30 backdrop-blur-md border border-white/20 rounded-xl px-3 py-1.5 font-medium text-white focus:outline-none"
          >
            {SEED_STAFF.map((s) => (
              <option key={s.id} value={s.id} className="bg-neutral-900 text-white">
                {s.name} ({s.role_label})
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!selectedTaskToReassign}
            className="bg-[#ef4d23] hover:bg-[#d93c14] text-white text-xs font-bold px-3 py-1.5 rounded-xl disabled:opacity-40 transition-colors shadow-md"
          >
            Reassign
          </button>
        </form>
      </div>

      {/* Staff Capacity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SEED_STAFF.map((staff) => {
          const metrics = getStaffMetrics(staff.id);
          const isOverloaded = metrics.inProgressCount >= staff.capacity_limit;

          return (
            <div
              key={staff.id}
              className={`bg-white/25 backdrop-blur-3xl rounded-3xl border p-5 shadow-2xl space-y-4 transition-all text-white ${
                isOverloaded
                  ? "border-red-500/50 ring-2 ring-red-500/30"
                  : "border-white/40 hover:border-white/60"
              }`}
            >
              {/* Staff Header */}
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-2xl flex items-center justify-center font-extrabold text-white text-sm shadow-md"
                    style={{ backgroundColor: staff.avatar_color }}
                  >
                    {staff.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                      <span>{staff.name}</span>
                      <span className="bg-white/20 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-md tracking-wider border border-white/20">
                        {staff.code || `EMP-${staff.id.split("-")[1]}`}
                      </span>
                    </h4>
                    <p className="text-[11px] text-white/60 font-medium">{staff.role_label}</p>
                  </div>
                </div>

                {isOverloaded ? (
                  <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-red-500/40">
                    <ShieldAlert className="h-3 w-3" /> OVERLOADED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-500/40">
                    <CheckCircle2 className="h-3 w-3" /> OPTIMAL LOAD
                  </span>
                )}
              </div>

              {/* Progress Bar & Capacity Indicator */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-white/80">
                  <span className="font-medium">Active "In Progress" Tasks</span>
                  <span className="font-extrabold text-white">
                    {metrics.inProgressCount} / {staff.capacity_limit} max
                  </span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/20">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOverloaded ? "bg-red-500 shadow-md shadow-red-500/50" : "bg-[#ef4d23]"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (metrics.inProgressCount / staff.capacity_limit) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Stat Counters */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/15 text-center text-xs">
                <div className="bg-white/10 p-2 rounded-xl border border-white/20">
                  <span className="block text-white/60 text-[10px] font-bold">Total</span>
                  <span className="font-extrabold text-white">{metrics.total}</span>
                </div>
                <div className="bg-red-500/20 p-2 rounded-xl border border-red-500/40">
                  <span className="block text-red-300 text-[10px] font-bold">Overdue</span>
                  <span className="font-extrabold text-red-200">{metrics.overdueCount}</span>
                </div>
                <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/40">
                  <span className="block text-emerald-300 text-[10px] font-bold">Done</span>
                  <span className="font-extrabold text-emerald-200">{metrics.completedCount}</span>
                </div>
              </div>

              {/* Task List Snippet */}
              <div className="space-y-2 pt-2 border-t border-white/15">
                <p className="text-[10px] font-extrabold text-white/60 uppercase tracking-wider">
                  Assigned Deliverables
                </p>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {metrics.assignedTasks.length === 0 ? (
                    <p className="text-xs text-white/40 italic">No tasks assigned.</p>
                  ) : (
                    metrics.assignedTasks.map((t) => (
                      <div
                        key={t.id}
                        className="p-2 bg-white/10 rounded-xl border border-white/20 text-xs flex items-center justify-between gap-2"
                      >
                        <div className="truncate">
                          <span className="font-bold text-white">{t.client_name}</span>
                          <p className="truncate text-white/70 text-[11px]">{t.title}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 border border-white/30 text-white shrink-0">
                          {t.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
