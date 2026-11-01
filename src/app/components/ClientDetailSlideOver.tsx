import { useState } from "react";
import { SlideOver } from "./ui/SlideOver";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Building2, Mail, Phone, Calendar, DollarSign, FileText, HeartPulse, Layers, ExternalLink } from "lucide-react";
import { Contract, Invoice } from "@/lib/crm.functions";
import { ClientInfo, Deliverable } from "@/lib/delivery.functions";

export default function ClientDetailSlideOver({
  client,
  isOpen,
  onClose,
  contracts = [],
  invoices = [],
}: {
  client: ClientInfo | null;
  isOpen: boolean;
  onClose: () => void;
  contracts?: Contract[];
  invoices?: Invoice[];
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "contracts" | "invoices">("overview");

  if (!client) return null;

  const clientContracts = contracts.filter((c) => c.client_id === client.id);
  const clientInvoices = invoices.filter((i) => i.client_id === client.id);

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title={client.company_name}
      subtitle={`Client Account • ${client.package_tier}`}
      width="max-w-3xl"
    >
      {/* Header Metric Summary */}
      <div className="bg-neutral-900 text-white p-5 rounded-3xl flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Active Tier</span>
          <p className="text-lg font-bold text-white mt-0.5">{client.package_tier}</p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Status</span>
          <div>
            <Badge variant="green">Active Client Account</Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 text-xs font-bold pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            activeTab === "overview" ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Overview 360°
        </button>
        <button
          onClick={() => setActiveTab("contracts")}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            activeTab === "contracts" ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Contracts ({clientContracts.length})
        </button>
        <button
          onClick={() => setActiveTab("invoices")}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            activeTab === "invoices" ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Invoices ({clientInvoices.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-4 text-xs">
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-3">
            <h4 className="font-bold text-neutral-900 border-b border-neutral-200 pb-2">Account Contact Info</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">Contact Person:</span>
                <span className="font-bold text-neutral-900">Mark (Founder)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Email Address:</span>
                <span className="font-semibold text-neutral-800">mark@{client.company_name.toLowerCase().replace(/\s+/g, "")}.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Account Manager:</span>
                <span className="font-semibold text-neutral-900">Sarah Chen</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTRACTS */}
      {activeTab === "contracts" && (
        <div className="space-y-3 text-xs">
          {clientContracts.length === 0 ? (
            <p className="text-neutral-400">No contracts found.</p>
          ) : (
            clientContracts.map((c) => (
              <div key={c.id} className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
                <div className="flex justify-between font-bold text-neutral-900">
                  <span>{c.package_name}</span>
                  <span className="text-[#ef4d23]">${c.monthly_value.toLocaleString()}/mo</span>
                </div>
                <p className="text-neutral-500 text-[11px]">Renewal Date: {c.renewal_date}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: INVOICES */}
      {activeTab === "invoices" && (
        <div className="space-y-3 text-xs">
          {clientInvoices.length === 0 ? (
            <p className="text-neutral-400">No invoices generated yet.</p>
          ) : (
            clientInvoices.map((inv) => (
              <div key={inv.id} className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 flex justify-between items-center">
                <div>
                  <p className="font-bold text-neutral-900">{inv.invoice_number}</p>
                  <p className="text-[10px] text-neutral-400">Due: {inv.due_date}</p>
                </div>
                <span className="font-bold text-sm text-neutral-900">${(inv.amount_cents / 100).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      )}
    </SlideOver>
  );
}
