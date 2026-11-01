import { useState, useMemo } from "react";
import {
  QrCode,
  Tag,
  Search,
  UserCheck,
  Building2,
  Users,
  Plus,
  Copy,
  Check,
  MessageSquare,
  ShieldCheck,
  KeyRound,
  Sparkles,
  BadgeCheck,
  FolderPlus,
  Trash2,
  Mail,
} from "lucide-react";

import { SEED_STAFF, SEED_CLIENTS, StaffMember, ClientInfo } from "@/lib/delivery.functions";

export interface CodeLibraryViewProps {
  onOpenMessengerWithChannel?: (channelId?: string) => void;
}

export default function CodeLibraryView({ onOpenMessengerWithChannel }: CodeLibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Individual Code Issuance Modal
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [newCodeType, setNewCodeType] = useState<"emp" | "clt">("emp");
  const [newCodeNumber, setNewCodeNumber] = useState("");
  const [newCodeName, setNewCodeName] = useState("");
  const [newCodeEmail, setNewCodeEmail] = useState("");
  const [newCodeRole, setNewCodeRole] = useState("");

  // Create Custom Group Modal
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lumen_staff_codes_v4");
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return SEED_STAFF;
  });

  const [clientList, setClientList] = useState<ClientInfo[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lumen_client_codes_v4");
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return SEED_CLIENTS;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDeleteStaff = (id: string) => {
    const staff = staffList.find((s) => s.id === id);
    if (!staff) return;
    setStaffList((prev) => prev.filter((s) => s.id !== id));
  };

  // Filtered and deduplicated lists
  const filteredStaff = useMemo(() => {
    const map = new Map<string, StaffMember>();
    staffList.forEach((s) => {
      const key = s.code.toUpperCase().trim() || s.id;
      if (!map.has(key)) {
        map.set(key, s);
      }
    });
    const unique = Array.from(map.values());
    if (!searchQuery.trim()) return unique;
    const q = searchQuery.toLowerCase();
    return unique.filter(
      (s) =>
        s.code.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.role_label.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
  }, [staffList, searchQuery]);

  const filteredClients = useMemo(() => {
    const map = new Map<string, ClientInfo>();
    clientList.forEach((c) => {
      const key = c.code.toUpperCase().trim() || c.id;
      if (!map.has(key)) {
        map.set(key, c);
      }
    });
    const unique = Array.from(map.values());
    if (!searchQuery.trim()) return unique;
    const q = searchQuery.toLowerCase();
    return unique.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.company_name.toLowerCase().includes(q) ||
        c.package_tier.toLowerCase().includes(q)
    );
  }, [clientList, searchQuery]);

  const deriveCodeFromEmail = (email: string, name: string, type: "emp" | "clt"): string => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail && cleanEmail.includes("@")) {
      let hash = 0;
      for (let i = 0; i < cleanEmail.length; i++) {
        hash = (hash * 31 + cleanEmail.charCodeAt(i)) & 0x7fffffff;
      }
      const codeNum = 100 + (hash % 899);
      return `${type.toUpperCase()}-${codeNum}`;
    }
    const cleanName = name.trim().toLowerCase();
    if (cleanName) {
      let hash = 0;
      for (let i = 0; i < cleanName.length; i++) {
        hash = (hash * 31 + cleanName.charCodeAt(i)) & 0x7fffffff;
      }
      const codeNum = 100 + (hash % 899);
      return `${type.toUpperCase()}-${codeNum}`;
    }
    const listLen = type === "emp" ? staffList.length : clientList.length;
    return `${type.toUpperCase()}-${100 + listLen}`;
  };

  const handleIssueNewCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodeName.trim() && !newCodeEmail.trim()) return;

    const generatedCode =
      newCodeNumber.trim().toUpperCase() || deriveCodeFromEmail(newCodeEmail, newCodeName, newCodeType);

    if (newCodeType === "emp") {
      const newStaff: StaffMember = {
        id: `staff-${Date.now()}`,
        code: generatedCode,
        name: newCodeName.trim() || newCodeEmail.split("@")[0],
        email: newCodeEmail.trim() || `${newCodeName.toLowerCase().replace(/\s+/g, ".")}@lumenandco.in`,
        role: "designer",
        role_label: newCodeRole.trim() || "Creative Team Specialist",
        avatar_color: "#10b981",
        capacity_limit: 5,
        weeks_at_high_capacity: 0,
      };
      setStaffList((prev) => [...prev, newStaff]);
    } else {
      const newClient: ClientInfo = {
        id: `client-${Date.now()}`,
        code: generatedCode,
        company_name: newCodeName.trim() || newCodeEmail.split("@")[0].toUpperCase(),
        package_tier: newCodeRole.trim() || "Growth Retainer ($4,500/mo)",
        account_manager_id: "staff-2",
      };
      setClientList((prev) => [...prev, newClient]);
    }

    setNewCodeName("");
    setNewCodeNumber("");
    setNewCodeEmail("");
    setNewCodeRole("");
    setIsIssueModalOpen(false);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    setIsCreateGroupModalOpen(false);
    onOpenMessengerWithChannel?.();
  };

  const toggleSelectCode = (code: string) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  return (
    <div className="space-y-8 text-[#222222]">
      {/* Executive Header Metric Glass Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-black text-white p-6 sm:p-8 rounded-3xl border border-neutral-700 shadow-2xl relative overflow-hidden isolate">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#ef4d23]/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#ef4d23]/20 border border-[#ef4d23]/40 text-[#fed7aa] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              <KeyRound className="h-3.5 w-3.5 text-[#ef4d23]" />
              <span>Individual Identity Code Master Registry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Individual Codes Registry</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
              Assigned individual codes for employees (<code className="bg-neutral-800 text-[#00a884] font-mono px-1.5 py-0.5 rounded">EMP-xxx</code>) and client partners (<code className="bg-neutral-800 text-amber-400 font-mono px-1.5 py-0.5 rounded">CLT-xxx</code>). Use these individual codes to assemble custom chat groups anytime!
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setIsCreateGroupModalOpen(true)}
              className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs px-4 py-3 rounded-2xl border border-neutral-600 shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            >
              <FolderPlus className="h-4 w-4 text-[#00a884]" />
              <span>Assemble Custom Group</span>
            </button>

            <button
              type="button"
              onClick={() => setIsIssueModalOpen(true)}
              className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-2 border border-white/20 shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Assign New Individual Code</span>
            </button>
          </div>
        </div>

        {/* Real-time Search Bar */}
        <div className="mt-6 pt-6 border-t border-neutral-700/80 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by Individual Code (EMP-100 / CLT-777), Name, or Email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 text-xs text-white placeholder:text-neutral-400 rounded-2xl outline-none focus:ring-2 focus:ring-[#ef4d23]"
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <BadgeCheck className="h-4 w-4" /> {staffList.length} EMP Individual Codes
            </span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <BadgeCheck className="h-4 w-4" /> {clientList.length} CLT Individual Codes
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BLOCK 1: INDIVIDUAL EMPLOYEE CODES (EMP-xxx) */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-emerald-50/50 via-white to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-900 flex items-center gap-2">
                <span>Individual Employee Codes Directory</span>
                <span className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full font-mono">
                  {filteredStaff.length} EMP Codes
                </span>
              </h3>
              <p className="text-xs text-neutral-500">
                Individual employee identity codes for 1-on-1 direct messaging and group assembly.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-100 text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Individual EMP Code</th>
                <th className="py-3.5 px-5">Employee Name & ID</th>
                <th className="py-3.5 px-5">Designated Role</th>
                <th className="py-3.5 px-5">Work Email Address</th>
                <th className="py-3.5 px-5">Task Capacity</th>
                <th className="py-3.5 px-5 text-right">Direct Chat Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-4 px-5">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(staff.code)}
                      className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono font-extrabold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer shadow-xs group"
                      title="Click to Copy Individual Employee Code"
                    >
                      <Tag className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{staff.code}</span>
                      {copiedCode === staff.code ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-emerald-600/40 group-hover:opacity-100" />
                      )}
                    </button>
                  </td>

                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-xs"
                        style={{ backgroundColor: staff.avatar_color }}
                      >
                        {staff.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900">{staff.name}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">{staff.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-5 font-semibold text-neutral-700">
                    {staff.role_label}
                  </td>

                  <td className="py-4 px-5 font-mono text-neutral-600">
                    {staff.email}
                  </td>

                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-neutral-200">
                      {staff.capacity_limit} tasks limit
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenMessengerWithChannel?.(staff.code)}
                        className="inline-flex items-center gap-1 bg-[#00a884] hover:bg-[#008f70] text-white font-bold px-2.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs text-xs"
                        title={`Direct Chat with ${staff.name} [${staff.code}]`}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Chat</span>
                      </button>

                      <a
                        href={`mailto:${staff.email}`}
                        className="inline-flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold px-2.5 py-1.5 rounded-xl transition-all cursor-pointer text-xs"
                        title={`Send Email to ${staff.email}`}
                      >
                        <Mail className="h-3.5 w-3.5 text-purple-600" />
                        <span>Email</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="inline-flex items-center p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl transition-all cursor-pointer text-xs"
                        title={`Remove ${staff.name} Code`}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BLOCK 2: INDIVIDUAL CLIENT CODES (CLT-xxx) */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-amber-50/50 via-white to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-900 flex items-center gap-2">
                <span>Individual Client Partner Codes Directory</span>
                <span className="bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full font-mono">
                  {filteredClients.length} CLT Codes
                </span>
              </h3>
              <p className="text-xs text-neutral-500">
                Individual client account codes for direct communication and client group assembly.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-100 text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Individual CLT Code</th>
                <th className="py-3.5 px-5">Company / Partner Account</th>
                <th className="py-3.5 px-5">Retainer Package Tier</th>
                <th className="py-3.5 px-5">Assigned Account Manager</th>
                <th className="py-3.5 px-5 text-right">Direct Client Chat Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-4 px-5">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(client.code)}
                      className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-mono font-extrabold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer shadow-xs group"
                      title="Click to Copy Individual Client Code"
                    >
                      <Tag className="h-3.5 w-3.5 text-amber-600" />
                      <span>{client.code}</span>
                      {copiedCode === client.code ? (
                        <Check className="h-3.5 w-3.5 text-amber-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-amber-600/40 group-hover:opacity-100" />
                      )}
                    </button>
                  </td>

                  <td className="py-4 px-5">
                    <div className="font-bold text-neutral-900 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>{client.company_name}</span>
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1 bg-amber-100/70 text-amber-900 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-200">
                      {client.package_tier}
                    </span>
                  </td>

                  <td className="py-4 px-5 font-semibold text-neutral-700">
                    Sarah Chen (Account Manager Lead)
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenMessengerWithChannel?.(client.code)}
                      className="inline-flex items-center gap-1.5 bg-[#ef4d23] hover:bg-[#d93c14] text-white font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs text-xs"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Support [{client.code}]</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ISSUE NEW INDIVIDUAL CODE MODAL */}
      {/* ========================================================================= */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 text-neutral-900 border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-[#ef4d23]" />
                <h3 className="text-base font-bold">Assign New Individual Code</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsIssueModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-800 p-1 rounded-full hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueNewCode} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Target Entity Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewCodeType("emp");
                      if (newCodeEmail.trim() || newCodeName.trim()) {
                        setNewCodeNumber(deriveCodeFromEmail(newCodeEmail, newCodeName, "emp"));
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      newCodeType === "emp"
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                        : "bg-neutral-50 text-neutral-600 border-neutral-200"
                    }`}
                  >
                    <UserCheck className="h-3.5 w-3.5" /> Employee (EMP Code)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewCodeType("clt");
                      if (newCodeEmail.trim() || newCodeName.trim()) {
                        setNewCodeNumber(deriveCodeFromEmail(newCodeEmail, newCodeName, "clt"));
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      newCodeType === "clt"
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                        : "bg-neutral-50 text-neutral-600 border-neutral-200"
                    }`}
                  >
                    <Building2 className="h-3.5 w-3.5" /> Client (CLT Code)
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  {newCodeType === "emp" ? "Employee Work Email Address" : "Client Account Email Address"}
                </label>
                <input
                  type="email"
                  placeholder={newCodeType === "emp" ? "e.g. daniel@lumenandco.in" : "e.g. client@brand.com"}
                  value={newCodeEmail}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewCodeEmail(val);
                    const autoCode = deriveCodeFromEmail(val, newCodeName, newCodeType);
                    setNewCodeNumber(autoCode);
                  }}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    Individual Code ({newCodeType === "emp" ? "EMP-xxx" : "CLT-xxx"})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const autoCode = deriveCodeFromEmail(newCodeEmail, newCodeName, newCodeType);
                      setNewCodeNumber(autoCode);
                    }}
                    className="text-[10px] font-extrabold text-[#ef4d23] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3" /> Auto-Generate from Email
                  </button>
                </div>
                <input
                  type="text"
                  placeholder={newCodeType === "emp" ? "e.g. EMP-248" : "e.g. CLT-591"}
                  value={newCodeNumber}
                  onChange={(e) => setNewCodeNumber(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 font-mono font-extrabold uppercase outline-none focus:ring-2 focus:ring-neutral-900"
                />
                {newCodeEmail.includes("@") && (
                  <p className="text-[10px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                    <Check className="h-3 w-3 inline" /> Auto-generated from email: <span className="font-mono font-bold">{deriveCodeFromEmail(newCodeEmail, newCodeName, newCodeType)}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  {newCodeType === "emp" ? "Employee Full Name" : "Client Company Name"}
                </label>
                <input
                  type="text"
                  placeholder={newCodeType === "emp" ? "e.g. Daniel Vance" : "e.g. Pulse Energy"}
                  value={newCodeName}
                  onChange={(e) => {
                    const nameVal = e.target.value;
                    setNewCodeName(nameVal);
                    if (!newCodeEmail.trim()) {
                      const autoCode = deriveCodeFromEmail(newCodeEmail, nameVal, newCodeType);
                      setNewCodeNumber(autoCode);
                    }
                  }}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  {newCodeType === "emp" ? "Role Label" : "Retainer Package Tier"}
                </label>
                <input
                  type="text"
                  placeholder={newCodeType === "emp" ? "e.g. Motion Designer" : "e.g. Growth Retainer ($4,500/mo)"}
                  value={newCodeRole}
                  onChange={(e) => setNewCodeRole(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-600 hover:text-neutral-900 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ef4d23] hover:bg-[#d93c14] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Assign Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ASSEMBLE CUSTOM GROUP MODAL */}
      {/* ========================================================================= */}
      {isCreateGroupModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 text-neutral-900 border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2">
                <FolderPlus className="h-5 w-5 text-[#00a884]" />
                <h3 className="text-base font-bold">Assemble Custom Group Chat</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateGroupModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-800 p-1 rounded-full hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Group Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q4 Performance Strategy Group"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-[#00a884]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Assign Group Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. GRP-STRATEGY"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-mono font-extrabold uppercase outline-none focus:ring-2 focus:ring-[#00a884]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Select Individual Member Codes to Add
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-neutral-50 border border-neutral-200 rounded-2xl">
                  {staffList.map((s) => (
                    <label
                      key={s.code}
                      className="flex items-center justify-between p-2 hover:bg-white rounded-xl cursor-pointer text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(s.code)}
                          onChange={() => toggleSelectCode(s.code)}
                          className="rounded text-[#00a884] focus:ring-0"
                        />
                        <span className="font-bold text-neutral-900">{s.name}</span>
                        <span className="text-[10px] text-neutral-500">({s.role_label})</span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] px-2 py-0.5 rounded-md">
                        {s.code}
                      </span>
                    </label>
                  ))}
                  {clientList.map((c) => (
                    <label
                      key={c.code}
                      className="flex items-center justify-between p-2 hover:bg-white rounded-xl cursor-pointer text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCodes.includes(c.code)}
                          onChange={() => toggleSelectCode(c.code)}
                          className="rounded text-[#00a884] focus:ring-0"
                        />
                        <span className="font-bold text-neutral-900">{c.company_name}</span>
                        <span className="text-[10px] text-neutral-500">(Client)</span>
                      </div>
                      <span className="bg-amber-100 text-amber-900 font-mono font-bold text-[10px] px-2 py-0.5 rounded-md">
                        {c.code}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateGroupModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-600 hover:text-neutral-900 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00a884] hover:bg-[#008f70] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Create & Open Messenger</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
