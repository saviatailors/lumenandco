import { useState } from "react";
import { SlideOver } from "./ui/SlideOver";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { AdvancedLead, STAGE_LABELS, AdvancedLeadStage } from "@/lib/crm.functions";
import { Building2, Mail, Phone, Calendar, DollarSign, UserCheck, Flame, ArrowRight, Activity, CheckCircle2 } from "lucide-react";
import { useToast } from "./ui/Toast";

export default function LeadDetailSlideOver({
  lead,
  isOpen,
  onClose,
  onConvertToClient,
}: {
  lead: AdvancedLead | null;
  isOpen: boolean;
  onClose: () => void;
  onConvertToClient?: (lead: AdvancedLead) => void;
}) {
  const toast = useToast();

  if (!lead) return null;

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title={lead.company_name}
      subtitle={`Sales Lead • ${lead.source.toUpperCase()} Source`}
      width="max-w-2xl"
    >
      {/* Header Metric Summary */}
      <div className="bg-neutral-900 text-white p-5 rounded-3xl flex items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            Estimated Monthly Deal Value
          </span>
          <p className="text-2xl font-extrabold text-[#ef4d23] mt-0.5">
            ₹{(lead.estimated_deal_value * 80).toLocaleString()}/mo
          </p>
        </div>

        <div className="text-right space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
            Lead Temp & Score
          </span>
          <span
            className={`inline-block font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider ${
              lead.lead_temp === "hot"
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : lead.lead_temp === "warm"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-neutral-800 text-neutral-300"
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 inline mr-1" />
              {lead.lead_score} pts • {lead.lead_temp}
            </span>
          </span>
        </div>
      </div>

      {/* Stage Stepper Banner */}
      <div className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-neutral-500">Pipeline Stage:</span>
          <Badge variant="purple">{STAGE_LABELS[lead.stage]}</Badge>
        </div>
        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#ef4d23] h-full transition-all duration-300"
            style={{
              width: `${
                lead.stage === "won"
                  ? 100
                  : lead.stage === "negotiating"
                  ? 80
                  : lead.stage === "proposal_sent"
                  ? 60
                  : lead.stage === "qualified"
                  ? 40
                  : lead.stage === "contacted"
                  ? 20
                  : 10
              }%`,
            }}
          />
        </div>
      </div>

      {/* Contact & Deal Details */}
      <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-2xs space-y-3 text-xs">
        <h4 className="font-extrabold text-neutral-900 border-b border-neutral-100 pb-2">
          Contact & Account Lead
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Primary Contact</span>
            <p className="font-bold text-neutral-900">{lead.contact_name}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Email</span>
            <p className="font-medium text-neutral-700">{lead.contact_email || "N/A"}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Phone</span>
            <p className="font-medium text-neutral-700">{lead.contact_phone || "N/A"}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Assigned Account Owner</span>
            <p className="font-bold text-neutral-900">{lead.assigned_to_name}</p>
          </div>
        </div>
      </div>

      {/* Next Action & Activity Log */}
      <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-2xs space-y-3 text-xs">
        <h4 className="font-extrabold text-neutral-900 border-b border-neutral-100 pb-2 flex items-center justify-between">
          <span>Next Planned Action</span>
          <span className="text-[10px] font-bold text-neutral-400">{lead.next_action_date}</span>
        </h4>
        <p className="font-semibold text-neutral-800 bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
          📌 {lead.next_action}
        </p>
      </div>

      {/* Actions */}
      <div className="pt-2 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        {onConvertToClient && (
          <Button
            onClick={() => {
              onConvertToClient(lead);
              toast.success(`Lead "${lead.company_name}" converted to Active Client!`);
              onClose();
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Convert to Active Client
          </Button>
        )}
      </div>
    </SlideOver>
  );
}
