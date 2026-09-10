import { useState, useEffect } from "react";
import { Play, Square, Clock, Plus, AlertTriangle } from "lucide-react";
import { Deliverable, TimeEntry } from "@/lib/delivery.functions";

export default function TimeTrackerWidget({
  deliverable,
  onLogTime,
}: {
  deliverable: Deliverable;
  onLogTime: (hours: number, description: string) => void;
}) {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [manualHours, setManualHours] = useState("");
  const [manualDesc, setManualDesc] = useState("");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    const loggedHours = Math.max(0.1, Number((seconds / 3600).toFixed(2)));
    onLogTime(loggedHours, "Timer logged session");
    setSeconds(0);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(manualHours);
    if (isNaN(h) || h <= 0) return;
    onLogTime(h, manualDesc.trim() || "Manual time entry");
    setManualHours("");
    setManualDesc("");
  };

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const totalLogged = deliverable.actual_hours_logged;
  const estimated = deliverable.estimated_hours || 4;
  const isScopeCreep = totalLogged > estimated * 1.3;

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#ef4d23]" />
          <h4 className="text-sm font-bold text-neutral-900">Time Tracking & Scope Creep</h4>
        </div>
        {isScopeCreep && (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-red-200">
            <AlertTriangle className="h-3 w-3" /> SCOPE CREEP DETECTED
          </span>
        )}
      </div>

      {/* Live Timer Control */}
      <div className="bg-neutral-900 text-white p-4 rounded-2xl flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Live Task Timer</span>
          <p className="text-2xl font-mono font-bold mt-0.5">{formatTimer(seconds)}</p>
        </div>

        <div>
          {!isTimerRunning ? (
            <button
              onClick={() => setIsTimerRunning(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm"
            >
              <Play className="h-4 w-4 fill-white" /> Start Timer
            </button>
          ) : (
            <button
              onClick={handleStopTimer}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm"
            >
              <Square className="h-4 w-4 fill-white" /> Stop & Save
            </button>
          )}
        </div>
      </div>

      {/* Logged Hours Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-neutral-600">
          <span>Logged vs Estimated</span>
          <span className="font-bold">
            {totalLogged.toFixed(1)}h / {estimated}h est
          </span>
        </div>
        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isScopeCreep ? "bg-red-500" : "bg-[#ef4d23]"
            }`}
            style={{ width: `${Math.min(100, (totalLogged / estimated) * 100)}%` }}
          />
        </div>
      </div>

      {/* Manual Time Entry Form */}
      <form onSubmit={handleManualSubmit} className="flex gap-2 pt-2 border-t border-neutral-100 text-xs">
        <input
          type="number"
          step="0.5"
          placeholder="Hours (e.g. 2.5)"
          value={manualHours}
          onChange={(e) => setManualHours(e.target.value)}
          className="w-28 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 font-medium"
          required
        />
        <input
          type="text"
          placeholder="Activity description…"
          value={manualDesc}
          onChange={(e) => setManualDesc(e.target.value)}
          className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 font-medium"
        />
        <button
          type="submit"
          className="bg-neutral-900 text-white font-semibold px-3 py-1.5 rounded-xl hover:bg-black"
        >
          Add Log
        </button>
      </form>
    </div>
  );
}
