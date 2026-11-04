import { useState } from "react";
import { Calendar, ShieldCheck, Filter, ArrowRight, History, Layers } from "lucide-react";
import { Contract, ContractHistory } from "@/lib/crm.functions";

export default function RenewalPipelineView({
  contracts = [],
}: {
  contracts?: Contract[];
}) {
  const [selectedTier, setSelectedTier] = useState<string>("all");

  const filteredContracts = contracts.filter((c) => {
    if (selectedTier !== "all" && c.package_name !== selectedTier) return false;
    return true;
  });

  const getDaysUntilRenewal = (dateStr: string) => {
    if (!dateStr) return 999;
    const diffMs = new Date(dateStr).getTime() - Date.now();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  const urgent30 = filteredContracts.filter((c) => {
    const d = getDaysUntilRenewal(c.renewal_date);
    return d >= 0 && d <= 30;
  });

  const next60 = filteredContracts.filter((c) => {
    const d = getDaysUntilRenewal(c.renewal_date);
    return d > 30 && d <= 60;
  });

  const next90 = filteredContracts.filter((c) => {
    const d = getDaysUntilRenewal(c.renewal_date);
    return d > 60 && d <= 90;
  });

  const contractHistory: ContractHistory[] = [];

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
            <option value="Scale Retainer">Scale Retainer</option>
            <option value="Growth Retainer">Growth Retainer</option>
            <option value="Performance Starter">Performance Starter</option>
          </select>
        </div>
      </div>

      {contracts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Calendar className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-neutral-900">No Active Retainer Contracts</h4>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            When client agreements are created, their 30/60/90-day renewal timelines and contract audit trails will appear here automatically.
          </p>
        </div>
      ) : (
        /* Renewal Horizon Timeline */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Next 30 Days */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Next 30 Days (Urgent Renewals)
              </span>
              <span className="text-xs font-bold text-neutral-400">{urgent30.length}</span>
            </div>

            <div className="space-y-3">
              {urgent30.length === 0 ? (
                <p className="text-xs text-neutral-400 text-center py-6">No renewals due in next 30 days</p>
              ) : (
                urgent30.map((c) => (
                  <div key={c.id} className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-neutral-900">{c.package_name}</span>
                      <span className="font-bold text-xs text-[#ef4d23]">₹{c.monthly_value.toLocaleString()}/mo</span>
                    </div>
                    <p className="text-xs text-neutral-600">Renewal Date: {c.renewal_date}</p>
                    <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-amber-800 font-semibold capitalize">Status: {c.status.replace("_", " ")}</span>
                      <button className="text-[#ef4d23] font-bold hover:underline">Prepare Contract →</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Next 60 Days */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Next 60 Days
              </span>
              <span className="text-xs font-bold text-neutral-400">{next60.length}</span>
            </div>

            <div className="space-y-3">
              {next60.length === 0 ? (
                <p className="text-xs text-neutral-400 text-center py-6">No renewals due in 31-60 days</p>
              ) : (
                next60.map((c) => (
                  <div key={c.id} className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-neutral-900">{c.package_name}</span>
                      <span className="font-bold text-xs text-[#ef4d23]">₹{c.monthly_value.toLocaleString()}/mo</span>
                    </div>
                    <p className="text-xs text-neutral-600">Renewal Date: {c.renewal_date}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Next 90 Days */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Next 90 Days
              </span>
              <span className="text-xs font-bold text-neutral-400">{next90.length}</span>
            </div>

            <div className="space-y-3">
              {next90.length === 0 ? (
                <p className="text-xs text-neutral-400 text-center py-6">No renewals due in 61-90 days</p>
              ) : (
                next90.map((c) => (
                  <div key={c.id} className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-neutral-900">{c.package_name}</span>
                      <span className="font-bold text-xs text-[#ef4d23]">₹{c.monthly_value.toLocaleString()}/mo</span>
                    </div>
                    <p className="text-xs text-neutral-600">Renewal Date: {c.renewal_date}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contract Version Audit History */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm space-y-4">
        <h4 className="text-base font-bold text-neutral-900 flex items-center gap-2">
          <History className="h-4 w-4 text-[#ef4d23]" /> Contract Version Audit Trail
        </h4>

        {contractHistory.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400 border border-neutral-100 rounded-2xl">
            No contract adjustments or version amendments recorded.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden text-xs">
            {contractHistory.map((h) => (
              <div key={h.id} className="p-4 flex items-center justify-between hover:bg-neutral-50">
                <div>
                  <p className="font-bold text-neutral-900">
                    Contract v{h.version} ({h.change_type.toUpperCase()})
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Value adjusted from ₹{h.previous_monthly_value.toLocaleString()} to ₹{h.new_monthly_value.toLocaleString()}/mo by {h.changed_by}
                  </p>
                </div>
                <span className="font-mono text-neutral-400 text-[10px]">
                  {new Date(h.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
