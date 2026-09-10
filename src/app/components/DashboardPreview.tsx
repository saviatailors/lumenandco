import { TrendingUp } from "lucide-react";
import Gauge from "./Gauge";

export default function DashboardPreview() {
  return (
    <div className="w-full max-w-[360px] mx-auto animate-fade-in" style={{ animationDelay: "320ms" }}>
      <div className="bg-[#f5f2ee]/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm text-left">
        <div className="bg-white/80 rounded-2xl p-4">
          <div className="flex items-center justify-between" style={{ fontSize: 12 }}>
            <span style={{ color: "#ef4d23" }}>Meta Ads</span>
            <span className="text-neutral-500">This Month</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span style={{ fontSize: 26, fontWeight: 600 }}>$482K</span>
            <span
              className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 rounded-full px-2 py-0.5"
              style={{ fontSize: 11 }}
            >
              <TrendingUp className="w-3 h-3" />
              +18%
            </span>
          </div>
          <div className="text-neutral-500" style={{ fontSize: 11 }}>
            Ad spend vs last month
          </div>
          <Gauge value={92} color="#ef4d23" />
          <div className="mt-3 flex items-center justify-between" style={{ fontSize: 12 }}>
            <span className="text-neutral-500">ROAS</span>
            <span className="font-semibold">4.6x</span>
          </div>
        </div>
      </div>
    </div>
  );
}
