import { useState } from "react";
import {
  Users,
  AlertCircle,
  TrendingUp,
  Layers,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { Deliverable, SEED_STAFF, StaffMember } from "@/lib/delivery.functions";

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
      {/* Overview Header (Luminous White Frosted Glass) */}
      <div className="bg-white/80 backdrop-blur-3xl p-6 sm:p-7 rounded-3xl border border-white/90 shadow-xl shadow-black/5 flex flex-wrap items-center justify-between gap-4 text-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-extrabold text-slate-900">Workload & Staff Capacity Engine</h3>
            <span className="bg-[#ef4d23]/10 text-[#ef4d23] border border-[#ef4d23]/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              Ops Manager View
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-semibold">
            Monitor real-time task loads per staff member, prevent burnout, and reassign tasks seamlessly.
          </p>
        </div>

        {/* Reassignment Quick Tool */}
        <form
          onSubmit={handleConfirmReassign}
          className="flex flex-wrap items-center gap-2.5 bg-slate-100/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200/80 text-xs shadow-2xs"
        >
          <select
            value={selectedTaskToReassign}
            onChange={(e) => setSelectedTaskToReassign(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-bold max-w-[220px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#ef4d23]"
            required
          >
            <option value="" className="text-slate-500 font-bold">Select task to reassign…</option>
            {deliverables
              .filter((d) => d.status !== "delivered" && d.status !== "archived")
              .map((d) => (
                <option key={d.id} value={d.id} className="text-slate-900 font-bold">
                  {d.client_name} - {d.title.slice(0, 30)}
                </option>
              ))}
          </select>

          <span className="text-slate-400 font-bold">→</span>

          <select
            value={targetStaffId}
            onChange={(e) => setTargetStaffId(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#ef4d23]"
          >
            {SEED_STAFF.map((s) => (
              <option key={s.id} value={s.id} className="text-slate-900 font-bold">
                {s.name} ({s.role_label})
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!selectedTaskToReassign}
            className="bg-[#ef4d23] hover:bg-[#d93c14] text-white text-xs font-extrabold px-4 py-1.5 rounded-xl disabled:opacity-40 transition-colors shadow-md shadow-[#ef4d23]/20"
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
              className={`bg-white/80 hover:bg-white backdrop-blur-3xl rounded-3xl border p-5 shadow-xl shadow-black/5 space-y-4 transition-all text-slate-900 ${
                isOverloaded
                  ? "border-red-400 ring-2 ring-red-400/30"
                  : "border-white/90 hover:border-slate-300"
              }`}
            >
              {/* Staff Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-white text-xs shadow-md border border-white/40"
                    style={{ backgroundColor: staff.avatar_color }}
                  >
                    {staff.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                      <span>{staff.name}</span>
                      <span className="bg-slate-100 text-slate-700 font-extrabold text-[9px] px-2 py-0.5 rounded-md tracking-wider border border-slate-200">
                        {staff.code || `EMP-${staff.id.split("-")[1]}`}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 font-bold">{staff.role_label}</p>
                  </div>
                </div>

                {isOverloaded ? (
                  <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-red-200">
                    <ShieldAlert className="h-3 w-3" /> OVERLOADED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3" /> OPTIMAL LOAD
                  </span>
                )}
              </div>

              {/* Progress Bar & Capacity Indicator */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-700 font-extrabold">
                  <span>Active "In Progress" Tasks</span>
                  <span className="text-slate-900">
                    {metrics.inProgressCount} / {staff.capacity_limit} max
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOverloaded ? "bg-red-500 shadow-md shadow-red-500/40" : "bg-[#ef4d23]"
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
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="block text-slate-500 text-[10px] font-extrabold uppercase">Total</span>
                  <span className="font-extrabold text-slate-900 text-sm">{metrics.total}</span>
                </div>
                <div className="bg-red-50 p-2.5 rounded-xl border border-red-200/80 shadow-2xs">
                  <span className="block text-red-700 text-[10px] font-extrabold uppercase">Overdue</span>
                  <span className="font-extrabold text-red-700 text-sm">{metrics.overdueCount}</span>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/80 shadow-2xs">
                  <span className="block text-emerald-800 text-[10px] font-extrabold uppercase">Done</span>
                  <span className="font-extrabold text-emerald-700 text-sm">{metrics.completedCount}</span>
                </div>
              </div>

              {/* Task List Snippet */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Assigned Deliverables
                </p>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {metrics.assignedTasks.length === 0 ? (
                    <p className="text-xs text-slate-400 font-medium italic">No tasks assigned.</p>
                  ) : (
                    metrics.assignedTasks.map((t) => (
                      <div
                        key={t.id}
                        className="p-2.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200/80 text-xs flex items-center justify-between gap-2 shadow-2xs transition-colors"
                      >
                        <div className="truncate">
                          <span className="font-extrabold text-slate-900">{t.client_name}</span>
                          <p className="truncate text-slate-600 text-[11px] font-semibold">{t.title}</p>
                        </div>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 shrink-0 uppercase">
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
