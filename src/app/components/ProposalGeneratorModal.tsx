import { useState } from "react";
import { X, FileText, Download, Send, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { AdvancedLead } from "@/lib/crm.functions";

export default function ProposalGeneratorModal({
  lead,
  onClose,
  onSendProposal,
}: {
  lead: AdvancedLead;
  onClose: () => void;
  onSendProposal: (leadId: string, monthlyValue: number, services: string[]) => void;
}) {
  const [packageName, setPackageName] = useState(`${lead.company_name} Growth Retainer`);
  const [monthlyVal, setMonthlyVal] = useState(lead.estimated_deal_value || 5000);
  const [services, setServices] = useState<string[]>([
    "Paid Search & Meta Campaigns",
    "Short-Form Video Reel Studio (8 Reels/mo)",
    "Conversion Rate Optimization (CRO)",
  ]);

  const toggleService = (srv: string) => {
    setServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  const handleSend = () => {
    onSendProposal(lead.id, monthlyVal, services);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-200">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ef4d23]/20 text-[#ef4d23] rounded-xl">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Proposal & Contract Generator</h3>
              <p className="text-xs text-neutral-400">
                Auto-generate client agreements with customized retainer packages and pricing terms.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Proposal Body Preview */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-neutral-50 text-xs">
          <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6 text-neutral-900">
            {/* Header branding */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <img src="/lumen-and-co-logo.png" alt="Lumen & Co" className="h-8 w-auto object-contain" />
              <div className="text-right">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Agreement Proposal</span>
                <span className="font-mono text-xs text-neutral-600">PROP-{lead.id.slice(-6).toUpperCase()}</span>
              </div>
            </div>

            {/* Client & Agency Details */}
            <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Prepared For</span>
                <p className="font-bold text-sm text-neutral-900">{lead.company_name}</p>
                <p className="text-neutral-600">{lead.contact_name} ({lead.contact_email})</p>
                <p className="text-neutral-500">{lead.contact_phone}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Prepared By</span>
                <p className="font-bold text-sm text-neutral-900">Lumen & Co Digital Marketing Agency</p>
                <p className="text-neutral-600">Founder Command Center</p>
                <p className="text-neutral-500">hello@lumenandco.in</p>
              </div>
            </div>

            {/* Package Configuration */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm border-b border-neutral-200 pb-2">1. Scope of Retainer Services</h4>

              <div className="space-y-2">
                {[
                  "Paid Search & Meta Campaigns",
                  "Short-Form Video Reel Studio (8 Reels/mo)",
                  "Conversion Rate Optimization (CRO)",
                  "Gen AI Creative Concepting & Static Banners",
                  "Technical SEO & Schema Optimization",
                ].map((srv) => (
                  <label
                    key={srv}
                    className="flex items-center gap-2 cursor-pointer bg-neutral-50 p-3 rounded-xl border border-neutral-200 hover:bg-neutral-100 transition-all font-medium"
                  >
                    <input
                      type="checkbox"
                      checked={services.includes(srv)}
                      onChange={() => toggleService(srv)}
                      className="rounded text-[#ef4d23] focus:ring-[#ef4d23]"
                    />
                    <span>{srv}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pricing Terms */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm border-b border-neutral-200 pb-2">2. Investment & Monthly Value</h4>
              <div className="flex items-center justify-between bg-neutral-900 text-white p-4 rounded-2xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#ef4d23] tracking-widest">Monthly Retainer</span>
                  <p className="text-xl font-bold mt-0.5">${monthlyVal.toLocaleString()} / month</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Edit Value:</span>
                  <input
                    type="number"
                    value={monthlyVal}
                    onChange={(e) => setMonthlyVal(Number(e.target.value))}
                    className="bg-neutral-800 border border-neutral-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl w-28 text-right focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-200 bg-white flex items-center justify-between shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-neutral-600">
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSend}
              className="bg-[#ef4d23] hover:bg-[#d9421b] text-white text-xs font-bold px-5 py-2.5 rounded-2xl shadow-sm transition-all flex items-center gap-2"
            >
              <Send className="h-4 w-4" /> Send Proposal & Update Stage →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
