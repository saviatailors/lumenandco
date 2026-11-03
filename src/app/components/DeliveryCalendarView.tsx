import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

import { Deliverable, SEED_STAFF, SEED_CLIENTS } from "@/lib/delivery.functions";

export default function DeliveryCalendarView({
  deliverables,
  onSelectTask,
  onUpdateDueDate,
}: {
  deliverables: Deliverable[];
  onSelectTask: (task: Deliverable) => void;
  onUpdateDueDate: (taskId: string, newDate: string) => void;
}) {
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [selectedStaff, setSelectedStaff] = useState<string>("all");
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [dateField, setDateField] = useState<"due_date" | "publish_date">("due_date");

  // Simple date state
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 0-indexed: September (8)

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Filter deliverables
  const filtered = deliverables.filter((d) => {
    const matchesStaff = selectedStaff === "all" || d.assigned_to_staff_id === selectedStaff;
    const matchesClient = selectedClient === "all" || d.client_id === selectedClient;
    return matchesStaff && matchesClient;
  });

  // Days in month calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getDeliverablesForDate = (dayNum: number) => {
    const dayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    return filtered.filter((d) => {
      const targetDate = dateField === "due_date" ? d.due_date : d.publish_date;
      return targetDate === dayStr;
    });
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm space-y-6">
      {/* Calendar Controls & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#ef4d23]/10 text-[#ef4d23] rounded-2xl">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <p className="text-xs text-neutral-500">
              Content Calendar & Publication Schedule
            </p>
          </div>

          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl ml-2">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-white rounded-lg transition-all"
            >
              <ChevronLeft className="h-4 w-4 text-neutral-600" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-white rounded-lg transition-all"
            >
              <ChevronRight className="h-4 w-4 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Filters & Toggles */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Toggle Date Field */}
          <div className="bg-neutral-100 p-1 rounded-xl flex items-center gap-1 font-medium">
            <button
              onClick={() => setDateField("due_date")}
              className={`px-3 py-1 rounded-lg transition-all ${
                dateField === "due_date" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
              }`}
            >
              Due Dates
            </button>
            <button
              onClick={() => setDateField("publish_date")}
              className={`px-3 py-1 rounded-lg transition-all ${
                dateField === "publish_date" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
              }`}
            >
              Publish Dates
            </button>
          </div>

          {/* Filter Staff */}
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 font-medium"
          >
            <option value="all">All Staff Members</option>
            {SEED_STAFF.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.role_label})
              </option>
            ))}
          </select>

          {/* Filter Client */}
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 font-medium"
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

      {/* Calendar Grid Container (scrolls smoothly on mobile, maintains structure) */}
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-300 pb-2">
        <div className="grid grid-cols-7 gap-2 min-w-[680px]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-[11px] font-bold text-neutral-400 uppercase py-1">
            {day}
          </div>
        ))}

        {/* Empty padding cells for start of month */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[100px] bg-neutral-50/50 rounded-2xl border border-transparent" />
        ))}

        {/* Day Cells */}
        {daysArray.map((dayNum) => {
          const dayTasks = getDeliverablesForDate(dayNum);
          const isToday = dayNum === 10 && currentMonth === 8 && currentYear === 2026;

          return (
            <div
              key={dayNum}
              className={`min-h-[110px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                isToday
                  ? "bg-blue-50/50 border-blue-300 ring-2 ring-blue-500/20"
                  : "bg-white border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold ${
                    isToday
                      ? "bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                      : "text-neutral-700"
                  }`}
                >
                  {dayNum}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] font-bold text-neutral-400">
                    {dayTasks.length} {dayTasks.length === 1 ? "task" : "tasks"}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 mt-1 overflow-y-auto max-h-[85px]">
                {dayTasks.map((t) => {
                  const isOverdue =
                    new Date(t.due_date).getTime() < Date.now() &&
                    t.status !== "approved" &&
                    t.status !== "delivered";

                  return (
                    <div
                      key={t.id}
                      onClick={() => onSelectTask(t)}
                      className={`p-1.5 rounded-xl border text-[10px] font-medium cursor-pointer shadow-2xs hover:scale-[1.02] transition-all ${
                        isOverdue
                          ? "bg-red-50 border-red-200 text-red-900"
                          : t.status === "approved" || t.status === "delivered"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                          : "bg-neutral-50 border-neutral-200 text-neutral-800"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold truncate">{t.client_name}</span>
                        {isOverdue && <AlertTriangle className="h-3 w-3 text-red-600 shrink-0" />}
                      </div>
                      <p className="truncate text-neutral-600">{t.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
