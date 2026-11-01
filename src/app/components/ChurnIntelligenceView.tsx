import { useState } from "react";
import { HeartPulse, AlertTriangle, TrendingUp, ShieldAlert, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { CompositeHealthScore } from "@/lib/crm.functions";

export default function ChurnIntelligenceView() {
  const compositeScores: CompositeHealthScore[] = [
    {
      client_id: "client-1",
      company_name: "Northbeam Outdoors",
      execution_score: 92,
      financial_score: 100, // Invoice paid on time
      engagement_score: 95,
      composite_score: 95,
      churn_risk_level: "low",
      contributing_factors: ["High on-time delivery (92%)", "Invoices paid on schedule", "Frequent founder contact"],
      suggested_retention_action: "Candidate for Retainer Expansion ($8,500/mo Scale Tier)",
    },
    {
      client_id: "client-2",
      company_name: "Fable Skincare",
      execution_score: 75,
      financial_score: 40, // Invoice overdue!
      engagement_score: 60,
      composite_score: 58,
      churn_risk_level: "high",
      contributing_factors: ["Invoice INV-2026-002 overdue by 5 days", "Multiple revision requests (22%)"],
      suggested_retention_action: "Schedule Founder Sync & follow up on invoice INV-2026-002",
    },
    {
      client_id: "client-3",
      company_name: "Kite & Co",
      execution_score: 95,
      financial_score: 100,
      engagement_score: 90,
      composite_score: 94,
      churn_risk_level: "low",
      contributing_factors: ["Zero SLA breaches", "Paid on time"],
      suggested_retention_action: "Pitch Video Reel add-on package",
    },
    {
      client_id: "client-4",
      company_name: "Verda Organics",
      execution_score: 90,
      financial_score: 85,
      engagement_score: 80,
      composite_score: 86,
      churn_risk_level: "low",
      contributing_factors: ["Consistent technical SEO output"],
      suggested_retention_action: "Standard quarterly review",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-neutral-900">Composite Churn Intelligence & Relationship Health</h3>
            <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              BI Intelligence
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Combines Delivery Hub execution metrics, financial payment histories, and communication recency into an overall 0-100% score.
          </p>
        </div>
      </div>

      {/* Churn Risk Warning Banner */}
      {compositeScores.some((c) => c.churn_risk_level === "high" || c.churn_risk_level === "critical") && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-3xl flex items-center justify-between gap-4 text-xs text-red-900 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 text-white rounded-xl">
              <ShieldAlert className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <p className="font-bold text-sm">High Churn Risk Account Detected</p>
              <p className="text-red-700 mt-0.5">
                Fable Skincare composite health score dropped to 58% due to overdue invoice & high revision frequency.
              </p>
            </div>
          </div>

          <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs shrink-0">
            View Retention Plan →
          </button>
        </div>
      )}

      {/* Composite Health Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {compositeScores.map((c) => (
          <div
            key={c.client_id}
            className={`bg-white rounded-3xl border p-6 shadow-sm space-y-4 transition-all ${
              c.churn_risk_level === "high" || c.churn_risk_level === "critical"
                ? "border-red-300 ring-2 ring-red-500/20"
                : "border-neutral-200"
            }`}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h4 className="text-base font-bold text-neutral-900">{c.company_name}</h4>
                <p className="text-xs text-neutral-400">Client Relationship Health</p>
              </div>

              <span
                className={`text-base font-extrabold px-3 py-1 rounded-2xl ${
                  c.composite_score >= 85
                    ? "bg-emerald-100 text-emerald-800"
                    : c.composite_score >= 70
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {c.composite_score}% Health
              </span>
            </div>

            {/* Score Component Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200/80">
                <span className="block text-[10px] text-neutral-400 uppercase font-bold">Execution</span>
                <span className="font-extrabold text-neutral-900 text-sm">{c.execution_score}%</span>
              </div>
              <div className="bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200/80">
                <span className="block text-[10px] text-neutral-400 uppercase font-bold">Financial</span>
                <span className="font-extrabold text-neutral-900 text-sm">{c.financial_score}%</span>
              </div>
              <div className="bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200/80">
                <span className="block text-[10px] text-neutral-400 uppercase font-bold">Engagement</span>
                <span className="font-extrabold text-neutral-900 text-sm">{c.engagement_score}%</span>
              </div>
            </div>

            {/* Suggested Retention Action */}
            <div className="bg-purple-50 border border-purple-200/80 p-3 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-purple-900 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-purple-600" /> Recommended Action
              </span>
              <p className="text-purple-800">{c.suggested_retention_action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
