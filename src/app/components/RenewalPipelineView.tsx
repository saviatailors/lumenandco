import { useState } from "react";
import { Calendar, ShieldCheck, Filter, ArrowRight, History, Layers } from "lucide-react";
import { Contract, ContractHistory, SEED_CLIENTS } from "@/lib/crm.functions";

export default function RenewalPipelineView({
  contracts,
}: {
  contracts: Contract[];
}) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedTier, setSelectedTier] = useState<string>("all");

  const sampleContractHistory: ContractHistory[] = [
    {
      id: "ch-1",
      contract_id: "ctr-101",
      version: 1,
      change_type: "initial",
      previous_monthly_value: 0,
      new_monthly_value: 5000,
      changed_by: "Sahit Sai (Founder)",
      timestamp: "2026-01-15T10:00:00Z",
    },
    {
      id: "ch-2",
      contract_id: "ctr-101",
      version: 2,
      change_type: "upgrade",
      previous_monthly_value: 5000,
      new_monthly_value: 6500,
      changed_by: "Sahit Sai (Founder)",
      timestamp: "2026-06-01T14:00:00Z",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#ef4d23]" />
            Contract Renewal Pipeline & Version Audits
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            30/60/90-day contract renewal horizons, version history, and client segmentation.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 font-medium"
          >
            <option value="all">All Package Tiers</option>
            <option value="Scale Retainer">Scale Retainer ($6,500)</option>
            <option value="Growth Retainer">Growth Retainer ($4,200)</option>
            <option value="Creative Studio">Creative Studio ($3,500)</option>
            <option value="SEO & Technical Growth">SEO & Growth ($2,800)</option>
          </select>
        </div>
      </div>

      {/* Renewal Horizon Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Next 30 Days */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Next 30 Days (Urgent Renewals)
            </span>
            <span className="text-xs font-bold text-neutral-400">1</span>
          </div>

          <div className="space-y-3">
            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-neutral-900">Fable Skincare</span>
                <span className="font-bold text-xs text-[#ef4d23]">$4,200/mo</span>
              </div>
              <p className="text-xs text-neutral-600">Growth Retainer • Renewal Date: 2026-09-30</p>
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                <span className="text-amber-800 font-semibold">Status: Pending Renewal</span>
                <button className="text-[#ef4d23] font-bold hover:underline">Prepare Contract →</button>
              </div>
            </div>
          </div>
        </div>

        {/* Next 60 Days */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Next 60 Days
            </span>
            <span className="text-xs font-bold text-neutral-400">2</span>
          </div>

          <div className="space-y-3">
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-neutral-900">Northbeam Outdoors</span>
                <span className="font-bold text-xs text-[#ef4d23]">$6,500/mo</span>
              </div>
              <p className="text-xs text-neutral-600">Scale Retainer • Renewal Date: 2026-10-15</p>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-neutral-900">Kite & Co</span>
                <span className="font-bold text-xs text-[#ef4d23]">$3,500/mo</span>
              </div>
              <p className="text-xs text-neutral-600">Creative Studio • Renewal Date: 2026-10-10</p>
            </div>
          </div>
        </div>

        {/* Next 90 Days */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Next 90 Days
            </span>
            <span className="text-xs font-bold text-neutral-400">1</span>
          </div>

          <div className="space-y-3">
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-neutral-900">Verda Organics</span>
                <span className="font-bold text-xs text-[#ef4d23]">$2,800/mo</span>
              </div>
              <p className="text-xs text-neutral-600">SEO & Growth • Renewal Date: 2026-11-01</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Version Audit History */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm space-y-4">
        <h4 className="text-base font-bold text-neutral-900 flex items-center gap-2">
          <History className="h-4 w-4 text-[#ef4d23]" /> Contract Version Audit Trail
        </h4>

        <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden text-xs">
          {sampleContractHistory.map((h) => (
            <div key={h.id} className="p-4 flex items-center justify-between hover:bg-neutral-50">
              <div>
                <p className="font-bold text-neutral-900">
                  Northbeam Outdoors — Contract v{h.version} ({h.change_type.toUpperCase()})
                </p>
                <p className="text-[11px] text-neutral-400">
                  Value adjusted from ${h.previous_monthly_value.toLocaleString()} to ${h.new_monthly_value.toLocaleString()}/mo by {h.changed_by}
                </p>
              </div>
              <span className="font-mono text-neutral-400 text-[10px]">
                {new Date(h.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
