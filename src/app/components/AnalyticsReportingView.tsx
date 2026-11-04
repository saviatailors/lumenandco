import { useState } from "react";
import { BarChart3, Download, TrendingUp, AlertTriangle, CheckCircle2, Clock, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { Deliverable, SEED_CLIENTS, SEED_STAFF } from "@/lib/delivery.functions";
import { downloadWorkbook, sanitizeExcelCell } from "@/lib/excelExport";

export default function AnalyticsReportingView({
  deliverables,
}: {
  deliverables: Deliverable[];
}) {
  const totalTasks = deliverables.length;
  const completedTasks = deliverables.filter((d) => d.status === "approved" || d.status === "delivered");
  const onTimeTasks = completedTasks.filter((d) => new Date(d.due_date).getTime() >= new Date(d.updated_at).getTime());
  const onTimeRate = completedTasks.length ? Math.round((onTimeTasks.length / completedTasks.length) * 100) : 100;

  // Scope Creep Tasks
  const scopeCreepTasks = deliverables.filter((d) => d.actual_hours_logged > d.estimated_hours * 1.25);

  const exportExcel = () => {
    const rows = deliverables.map((d) => ({
      "Deliverable ID": sanitizeExcelCell(d.id),
      "Client Brand": sanitizeExcelCell(d.client_name),
      "Deliverable Title": sanitizeExcelCell(d.title),
      "Asset Type": sanitizeExcelCell(d.type.toUpperCase()),
      "Status": sanitizeExcelCell(d.status.toUpperCase()),
      "Assigned Member": sanitizeExcelCell(d.assigned_to_name),
      "Estimated Hours": d.estimated_hours,
      "Actual Hours Logged": d.actual_hours_logged,
      "Scope Creep Variance": sanitizeExcelCell(d.actual_hours_logged > d.estimated_hours ? `+${Math.round(((d.actual_hours_logged - d.estimated_hours) / d.estimated_hours) * 100)}% OVER` : "ON TARGET"),
      "Due Date": sanitizeExcelCell(d.due_date),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 16 },
      { wch: 25 },
      { wch: 35 },
      { wch: 15 },
      { wch: 15 },
      { wch: 22 },
      { wch: 16 },
      { wch: 20 },
      { wch: 22 },
      { wch: 15 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Operations & Scope Creep");
    downloadWorkbook(workbook, `lumen_operations_analytics_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#ef4d23]" />
            Delivery Analytics & Scope Creep Engine
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Turnaround times, on-time delivery rates, and scope creep detection across agency retainers.
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            exportExcel();
          }}
          className="inline-flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition-all shadow-sm cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4" /> Export Operations Excel (.xlsx)
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm">
          <span className="text-xs text-neutral-500 block">Total Deliverables</span>
          <p className="text-3xl font-bold text-neutral-900 mt-1">{totalTasks}</p>
          <span className="text-[11px] text-neutral-400">Across 8 retainers</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm">
          <span className="text-xs text-neutral-500 block">On-Time Delivery Rate</span>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{onTimeRate}%</p>
          <span className="text-[11px] text-emerald-600 font-medium">Target: &gt;90%</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm">
          <span className="text-xs text-neutral-500 block">Scope Creep Tasks</span>
          <p className="text-3xl font-bold text-red-600 mt-1">{scopeCreepTasks.length}</p>
          <span className="text-[11px] text-red-600 font-medium">Actual hours &gt; 125% est</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm">
          <span className="text-xs text-neutral-500 block">Avg Turnaround Time</span>
          <p className="text-3xl font-bold text-blue-600 mt-1">3.4 Days</p>
          <span className="text-[11px] text-neutral-400">From In Progress to Approved</span>
        </div>
      </div>

      {/* Scope Creep Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-neutral-900">Scope Creep Detector (Estimated vs Logged Hours)</h4>
            <p className="text-xs text-neutral-500">Tasks where actual execution hours significantly exceeded initial estimates.</p>
          </div>
        </div>

        <div className="divide-y divide-neutral-100 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-neutral-400 uppercase tracking-wider text-[10px]">
                <th className="py-2 font-bold">Client</th>
                <th className="py-2 font-bold">Deliverable</th>
                <th className="py-2 font-bold">Assignee</th>
                <th className="py-2 font-bold">Estimated</th>
                <th className="py-2 font-bold">Logged Hours</th>
                <th className="py-2 font-bold">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {scopeCreepTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-neutral-400">
                    No scope creep detected. All tasks within estimated hour budgets!
                  </td>
                </tr>
              ) : (
                scopeCreepTasks.map((t) => {
                  const variancePct = Math.round(((t.actual_hours_logged - t.estimated_hours) / t.estimated_hours) * 100);

                  return (
                    <tr key={t.id} className="hover:bg-neutral-50">
                      <td className="py-3 font-bold text-[#ef4d23]">{t.client_name}</td>
                      <td className="py-3 font-bold text-neutral-900">{t.title}</td>
                      <td className="py-3 text-neutral-600">{t.assigned_to_name}</td>
                      <td className="py-3 font-semibold">{t.estimated_hours}h</td>
                      <td className="py-3 font-bold text-red-600">{t.actual_hours_logged}h</td>
                      <td className="py-3">
                        <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          +{variancePct}% OVER
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
