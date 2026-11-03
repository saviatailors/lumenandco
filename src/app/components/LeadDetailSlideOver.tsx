import { useState } from "react";
import { SlideOver } from "./ui/SlideOver";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { AdvancedLead, STAGE_LABELS, AdvancedLeadStage } from "@/lib/crm.functions";
import {
  Building2,
  Mail,
  Phone,
  PhoneCall,
  Calendar,
  DollarSign,
  UserCheck,
  Flame,
  ArrowRight,
  Activity,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Globe,
  Clock,
} from "lucide-react";
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
      subtitle={`Inbound Lead • ${lead.source.toUpperCase()} Source • Created ${new Date(lead.created_at).toLocaleDateString()}`}
      width="max-w-2xl"
    >
      {/* Header Metric Summary */}
      <div className="bg-neutral-900 text-white p-5 rounded-3xl flex items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            Estimated Monthly Deal Value
          </span>
          <p className="text-2xl font-extrabold text-[#ef4d23] mt-0.5">
            ₹{(lead.estimated_deal_value * 80).toLocaleString()} /mo
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

      {/* Quick Contact & WhatsApp Action Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {lead.contact_phone && lead.contact_phone !== "N/A" && (
          <>
            <a
              href={`tel:${lead.contact_phone}`}
              className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              <PhoneCall className="h-3.5 w-3.5" /> Call {lead.contact_phone}
            </a>
            <a
              href={`https://wa.me/${lead.contact_phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-xs transition-all"
            >
              <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
            </a>
          </>
        )}
        {lead.contact_email && (
          <a
            href={`mailto:${lead.contact_email}`}
            className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-900 text-white font-bold text-xs shadow-xs transition-all"
          >
            <Mail className="h-3.5 w-3.5" /> Email Contact
          </a>
        )}
      </div>

      {/* Stage Stepper Banner */}
      <div className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-neutral-500">Pipeline Stage:</span>
          <Badge variant="purple">{STAGE_LABELS[lead.stage] || lead.stage}</Badge>
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

      {/* Contact & Account Lead */}
      <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-2xs space-y-3 text-xs">
        <h4 className="font-extrabold text-neutral-900 border-b border-neutral-100 pb-2">
          Contact & Company Info
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Primary Contact</span>
            <p className="font-bold text-neutral-900">{lead.contact_name}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Company</span>
            <p className="font-bold text-neutral-900">{lead.company_name}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Email</span>
            <p className="font-medium text-neutral-700">{lead.contact_email || "N/A"}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Phone</span>
            <p className="font-medium text-neutral-700">{lead.contact_phone || "N/A"}</p>
          </div>

          {lead.website && (
            <div className="space-y-1 col-span-2">
              <span className="text-[10px] text-neutral-400 font-bold uppercase">Website</span>
              <p>
                <a
                  href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#ef4d23] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" /> {lead.website} <ExternalLink className="h-3 w-3 ml-0.5" />
                </a>
              </p>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Assigned Account Owner</span>
            <p className="font-bold text-neutral-900">{lead.assigned_to_name}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Lead Source</span>
            <p className="font-bold text-neutral-900 capitalize">{lead.source}</p>
          </div>
        </div>
      </div>

      {/* Inbound Specifications & Message */}
      {(lead.goal || lead.budget || lead.scheduled_meeting_date || lead.notes) && (
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-2xs space-y-3 text-xs">
          <h4 className="font-extrabold text-neutral-900 border-b border-neutral-100 pb-2">
            Inbound Inquiry Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lead.goal && (
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-150">
                <span className="text-[10px] text-neutral-500 font-bold uppercase block">Target Service</span>
                <span className="font-bold text-neutral-900">{lead.goal}</span>
              </div>
            )}

            {lead.budget && (
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-150">
                <span className="text-[10px] text-neutral-500 font-bold uppercase block">Monthly Budget</span>
                <span className="font-bold text-[#ef4d23]">{lead.budget}</span>
              </div>
            )}

            {lead.scheduled_meeting_date && (
              <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 col-span-1 sm:col-span-2">
                <span className="text-[10px] text-[#ef4d23] font-bold uppercase block flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Scheduled 30-Min Strategy Meeting
                </span>
                <span className="font-extrabold text-neutral-900 text-sm mt-0.5 block">
                  {lead.scheduled_meeting_date}
                </span>
              </div>
            )}

            {lead.notes && (
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-150 col-span-1 sm:col-span-2">
                <span className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">Inquiry Message / Notes</span>
                <p className="text-neutral-700 leading-relaxed italic">
                  "{lead.notes}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}

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
            className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-bold"
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Convert to Active Client
          </Button>
        )}
      </div>
    </SlideOver>
  );
}
