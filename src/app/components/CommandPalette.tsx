import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  BarChart3,
  Calendar,
  Layers,
  ArrowRight,
  Video,
  Building2,
  Users,
  PhoneCall,
  X,
  Sparkles,
} from "lucide-react";

import { Deliverable } from "@/lib/delivery.functions";
import { SchoolClient, ClientBusinessLead } from "@/lib/lumenandco.types";

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  clients?: SchoolClient[];
  deliverables?: Deliverable[];
  clientLeads?: ClientBusinessLead[];
  onSelectClient?: (client: SchoolClient) => void;
  onSelectDeliverable?: (task: Deliverable) => void;
  onCreateNew?: () => void;
  onNavigateTab?: (tab: string) => void;
  onSelectAction?: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  clients = [],
  deliverables = [],
  clientLeads = [],
  onSelectClient,
  onSelectDeliverable,
  onCreateNew,
  onNavigateTab,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  // Keyboard shortcut listener for Cmd+K / Ctrl+K / '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery("");
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Filter Clients
  const matchedClients = clients.filter(
    (c) =>
      !q ||
      c.school_name.toLowerCase().includes(q) ||
      c.contact_person.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.package_tier.toLowerCase().includes(q) ||
      c.assigned_staff_name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q)
  );

  // Filter Tasks
  const matchedTasks = deliverables.filter(
    (d) =>
      !q ||
      d.title.toLowerCase().includes(q) ||
      d.client_name.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q) ||
      d.assigned_to_name.toLowerCase().includes(q)
  );

  // Filter Customer Leads
  const matchedLeads = clientLeads.filter(
    (l) =>
      !q ||
      l.lead_name.toLowerCase().includes(q) ||
      l.client_name.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.temperature.toLowerCase().includes(q)
  );

  const actions = [
    {
      id: "clients",
      label: "View All Client Accounts Roster",
      icon: Building2,
      action: () => {
        if (onNavigateTab) onNavigateTab("clients");
        onClose();
      },
    },
    {
      id: "leads",
      label: "Open Customer Leads Pipeline & Call Notes",
      icon: PhoneCall,
      action: () => {
        if (onNavigateTab) onNavigateTab("leads");
        onClose();
      },
    },
    {
      id: "create",
      label: "Onboard New Client Brand",
      icon: Plus,
      action: () => {
        if (onCreateNew) onCreateNew();
        onClose();
      },
    },
    {
      id: "kanban",
      label: "Jump to Task Pipeline Kanban",
      icon: Layers,
      action: () => {
        if (onNavigateTab) onNavigateTab("stage");
        onClose();
      },
    },
    {
      id: "analytics",
      label: "Open Power BI & Performance Analytics",
      icon: BarChart3,
      action: () => {
        if (onNavigateTab) onNavigateTab("analytics");
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div className="bg-[#141419]/95 backdrop-blur-2xl text-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header Console */}
        <div className="p-4 border-b border-white/15 flex items-center gap-3">
          <Search className="h-5 w-5 text-[#ef4d23] shrink-0" />
          <input
            type="text"
            placeholder="Search clients by name, city, contact, phone, deliverables, or commands… (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm font-semibold bg-transparent border-none focus:outline-none text-white placeholder:text-white/40"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-semibold text-white/70 bg-white/10 rounded-full border border-white/20">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 text-white/40 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Console List */}
        <div className="max-h-[420px] overflow-y-auto p-3 space-y-4">
          {/* Quick Command Actions */}
          {!q && (
            <div>
              <p className="px-3 py-1 text-[10px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-[#ef4d23]" /> Quick Command Shortcuts
              </p>
              <div className="space-y-1">
                {actions.map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.id}
                      onClick={act.action}
                      className="w-full text-left px-3.5 py-2.5 rounded-2xl hover:bg-white/10 flex items-center justify-between text-xs font-semibold text-white/90 hover:text-white transition-all border border-transparent hover:border-white/10 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-[#ef4d23]/20 text-[#fed7aa] border border-[#ef4d23]/30 rounded-xl">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span>{act.label}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-white/40" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Client Brands Search Section */}
          <div>
            <p className="px-3 py-1 text-[10px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
              <Building2 className="h-3 w-3 text-emerald-400" /> Client Accounts ({matchedClients.length})
            </p>
            <div className="space-y-1">
              {matchedClients.length === 0 ? (
                <p className="px-3 py-2 text-xs text-white/40">No matching clients found.</p>
              ) : (
                matchedClients.slice(0, 6).map((client) => (
                  <div
                    key={client.id}
                    onClick={() => {
                      if (onSelectClient) onSelectClient(client);
                      else if (onNavigateTab) onNavigateTab("clients");
                      onClose();
                    }}
                    className="px-3.5 py-2.5 rounded-2xl hover:bg-white/10 cursor-pointer flex items-center justify-between gap-3 text-xs transition-all border border-transparent hover:border-white/10"
                  >
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{client.school_name}</span>
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                          {client.city}
                        </span>
                        <span className="bg-white/10 text-white/80 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {client.package_tier}
                        </span>
                      </div>
                      <p className="text-white/60 text-[11px] truncate mt-0.5">
                        Contact: <strong>{client.contact_person}</strong> ({client.contact_role}) • {client.phone}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-emerald-400">
                        ₹{client.monthly_retainer_rupees.toLocaleString()}/mo
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Customer Leads Pipeline Section */}
          {matchedLeads.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[10px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
                <PhoneCall className="h-3 w-3 text-amber-400" /> Customer Leads ({matchedLeads.length})
              </p>
              <div className="space-y-1">
                {matchedLeads.slice(0, 5).map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab("leads");
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-2xl hover:bg-white/10 cursor-pointer flex items-center justify-between text-xs transition-all"
                  >
                    <div>
                      <span className="font-bold text-white">{lead.lead_name}</span>
                      <span className="text-white/50 ml-2 text-[11px]">({lead.client_name})</span>
                      <p className="text-white/60 text-[10px]">{lead.phone} • {lead.city}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {lead.temperature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deliverables Search Section */}
          {matchedTasks.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[10px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="h-3 w-3 text-blue-400" /> Deliverable Tasks ({matchedTasks.length})
              </p>
              <div className="space-y-1">
                {matchedTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => {
                      if (onSelectDeliverable) onSelectDeliverable(task);
                      onClose();
                    }}
                    className="px-3.5 py-2.5 rounded-2xl hover:bg-white/10 cursor-pointer flex items-center justify-between gap-3 text-xs transition-all border border-transparent hover:border-white/10"
                  >
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#fed7aa]">{task.client_name}</span>
                        <span className="bg-white/10 text-white/80 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/15">
                          {task.type}
                        </span>
                      </div>
                      <p className="font-semibold text-white truncate mt-0.5">{task.title}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/15 uppercase">
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Console Bar */}
        <div className="p-3 border-t border-white/15 bg-black/30 text-[11px] text-white/50 flex justify-between items-center px-4">
          <span>
            Press <kbd className="font-mono text-white/80 bg-white/10 px-1.5 py-0.5 rounded-md">Cmd + K</kbd> to open Search Console
          </span>
          <span className="text-[#fed7aa] font-bold">Lumen & Co Global Search</span>
        </div>
      </div>
    </div>
  );
}
