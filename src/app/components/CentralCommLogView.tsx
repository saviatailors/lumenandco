import { useState, useMemo } from "react";
import {
  MessageSquare,
  Mail,
  Phone,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Eye,
  FileSpreadsheet,
  ShieldCheck,
  Building2,
  UserCheck,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Tag,
  Radio,
} from "lucide-react";
import {
  CommLogEntry,
  CommChannel,
  CommMessageType,
  CommDeliveryStatus,
  SchoolClient,
  ClientBusinessLead,
  INITIAL_COMM_LOG,
  INITIAL_SCHOOL_CLIENTS,
} from "@/lib/lumenandco.types";
import { useToast } from "./ui/Toast";
import { exportRealtimeAnalyticsToExcel } from "@/lib/excelExport";

export interface CentralCommLogViewProps {
  commLogs?: CommLogEntry[];
  onAddCommLog: (log: CommLogEntry) => void;
  clients?: SchoolClient[];
  clientLeads?: ClientBusinessLead[];
  onOpenEmailModal?: (recipient?: string) => void;
  onOpenMessenger?: (channelCodeOrId?: string) => void;
}

export default function CentralCommLogView({
  commLogs = INITIAL_COMM_LOG,
  onAddCommLog,
  clients = INITIAL_SCHOOL_CLIENTS,
  clientLeads = [],
  onOpenEmailModal,
  onOpenMessenger,
}: CentralCommLogViewProps) {
  const toast = useToast();

  // Filter States
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [selectedClientId, setSelectedClientId] = useState<string>("all");
  const [selectedMessageType, setSelectedMessageType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "timeline">("table");

  // Modal & Drawer States
  const [isNewLogModalOpen, setIsNewLogModalOpen] = useState(false);
  const [selectedLogDetail, setSelectedLogDetail] = useState<CommLogEntry | null>(null);

  // New Log Form State
  const [formClientId, setFormClientId] = useState<string>("");
  const [formChannel, setFormChannel] = useState<CommChannel>("whatsapp");
  const [formMessageType, setFormMessageType] = useState<CommMessageType>("manual_note");
  const [formRecipient, setFormRecipient] = useState<string>("");
  const [formSubject, setFormSubject] = useState<string>("");
  const [formContent, setFormContent] = useState<string>("");
  const [formSentBy, setFormSentBy] = useState<string>("Sahit Sai [EMP-100]");

  // Filtered Comm Logs
  const filteredLogs = useMemo(() => {
    const safeLogs = commLogs && commLogs.length > 0 ? commLogs : INITIAL_COMM_LOG;
    return safeLogs.filter((log) => {
      // Channel Filter
      if (selectedChannel !== "all" && log.channel !== selectedChannel) {
        return false;
      }
      // Client Filter
      if (selectedClientId !== "all" && log.client_id !== selectedClientId) {
        return false;
      }
      // Message Type Filter
      if (selectedMessageType !== "all" && log.message_type !== selectedMessageType) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchSchool = (log.school_name || "").toLowerCase().includes(query);
        const matchContent = (log.content || "").toLowerCase().includes(query);
        const matchRecipient = (log.recipient || "").toLowerCase().includes(query);
        const matchSender = (log.sent_by_name || "").toLowerCase().includes(query);
        const matchSubject = (log.subject || "").toLowerCase().includes(query);
        const matchCode = (log.sender_code || "").toLowerCase().includes(query);

        if (!matchSchool && !matchContent && !matchRecipient && !matchSender && !matchSubject && !matchCode) {
          return false;
        }
      }
      return true;
    });
  }, [commLogs, selectedChannel, selectedClientId, selectedMessageType, searchQuery]);

  // Analytics Metrics
  const stats = useMemo(() => {
    const safeLogs = commLogs && commLogs.length > 0 ? commLogs : INITIAL_COMM_LOG;
    const total = safeLogs.length;
    const whatsapp = safeLogs.filter((l) => l.channel === "whatsapp").length;
    const email = safeLogs.filter((l) => l.channel === "email").length;
    const callNotes = safeLogs.filter((l) => l.channel === "call_note").length;
    const suspensions = safeLogs.filter((l) => l.channel === "suspension_notice").length;
    const delivered = safeLogs.filter((l) => l.delivery_status === "delivered" || l.delivery_status === "read").length;
    const deliveryRate = total > 0 ? Math.round((delivered / total) * 100) : 100;

    return { total, whatsapp, email, callNotes, suspensions, deliveryRate };
  }, [commLogs]);

  // Export Logs to Excel
  const handleExportLogs = () => {
    try {
      const exportData = filteredLogs.map((log) => ({
        "Log ID": log.id,
        "Client / Brand": log.school_name,
        "Channel": log.channel.toUpperCase(),
        "Message Type": log.message_type.toUpperCase(),
        "Subject": log.subject || "N/A",
        "Recipient": log.recipient,
        "Content": log.content,
        "Sent By": `${log.sent_by_name} (${log.sender_code || "EMP-100"})`,
        "Delivery Status": (log.delivery_status || "delivered").toUpperCase(),
        "Timestamp": new Date(log.timestamp).toLocaleString(),
      }));

      exportRealtimeAnalyticsToExcel(exportData, `Lumen_Comm_Log_${new Date().toISOString().split("T")[0]}.xlsx`);
      toast.success(`Exported ${exportData.length} communication log records to Excel.`);
    } catch (err) {
      toast.error("Failed to export communication log.");
    }
  };

  // Dispatch / Add New Comm Log
  const handleDispatchNewLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formContent.trim()) {
      toast.error("Please enter message content.");
      return;
    }

    const matchedClient = clients.find((c) => c.id === formClientId);
    const clientName = matchedClient ? matchedClient.company_name : "Bloom Skincare";
    const clientId = formClientId || matchedClient?.id || "client-101";

    const newEntry: CommLogEntry = {
      id: `comm-${Date.now()}`,
      client_id: clientId,
      school_name: clientName,
      channel: formChannel,
      message_type: formMessageType,
      recipient: formRecipient.trim() || "+91 98490 00000",
      subject: formSubject.trim() || `${formChannel.toUpperCase()} Notice`,
      content: formContent.trim(),
      sent_by_name: formSentBy.split("[")[0].trim() || "Sahit Sai",
      sender_code: formSentBy.includes("102") ? "EMP-102" : "EMP-100",
      delivery_status: "delivered",
      timestamp: new Date().toISOString(),
    };

    onAddCommLog(newEntry);
    toast.success(`Communication log recorded under ${clientName}!`);

    // Reset Form
    setFormContent("");
    setFormSubject("");
    setFormRecipient("");
    setIsNewLogModalOpen(false);
  };

  const getChannelBadge = (channel: CommChannel) => {
    switch (channel) {
      case "whatsapp":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-xs">
            <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </span>
        );
      case "email":
        return (
          <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-800 border border-purple-300 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-xs">
            <Mail className="h-3.5 w-3.5 text-purple-600" />
            <span>Email</span>
          </span>
        );
      case "call_note":
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-300 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-xs">
            <Phone className="h-3.5 w-3.5 text-blue-600" />
            <span>Call Note</span>
          </span>
        );
      case "suspension_notice":
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-xs">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
            <span>Suspension Alert</span>
          </span>
        );
    }
  };

  const getDeliveryStatusBadge = (status?: CommDeliveryStatus) => {
    switch (status) {
      case "read":
        return (
          <span className="inline-flex items-center gap-1 text-emerald-700 text-[10px] font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Read & Seen
          </span>
        );
      case "delivered":
      case "sent":
        return (
          <span className="inline-flex items-center gap-1 text-blue-700 text-[10px] font-extrabold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            <Check className="h-3 w-3 text-blue-600" /> Delivered
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 text-rose-700 text-[10px] font-extrabold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <XCircle className="h-3 w-3 text-rose-600" /> Failed / Bounced
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-amber-700 text-[10px] font-extrabold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <Clock className="h-3 w-3 text-amber-600" /> Logged
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans isolate">
      {/* ========================================================================= */}
      {/* 1. EXECUTIVE METRIC BANNER */}
      {/* ========================================================================= */}
      <div className="bg-white/80 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl border border-white/90 shadow-2xl relative overflow-hidden isolate">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-[#ef4d23]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#ef4d23]/10 border border-[#ef4d23]/30 text-[#ef4d23] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              <MessageSquare className="h-3.5 w-3.5 text-[#ef4d23]" />
              <span>Multi-Channel Communication & Audit Log</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <span>Central Communication Log</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Searchable, immutable real-time audit trail of all <span className="text-[#ef4d23] font-bold">WhatsApp broadcasts</span>, official emails, call notes, and suspension notices dispatched across client accounts.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleExportLogs}
              className="bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-xs border border-slate-200 px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <span>Export Log (Excel)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsNewLogModalOpen(true)}
              className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl transition-all shadow-lg shadow-[#ef4d23]/30 flex items-center gap-2 cursor-pointer border border-white/30"
            >
              <Plus className="h-4 w-4" />
              <span>Log New Communication</span>
            </button>
          </div>
        </div>

        {/* Real-time Counter Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-200/80 text-xs">
          <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-slate-500 text-[10px] uppercase font-extrabold block">Total Logged</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">{stats.total}</span>
          </div>

          <div className="bg-emerald-500/10 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-500/30">
            <span className="text-emerald-800 text-[10px] uppercase font-extrabold block flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> WhatsApp
            </span>
            <span className="text-xl font-extrabold text-emerald-900 mt-0.5 block">{stats.whatsapp}</span>
          </div>

          <div className="bg-purple-500/10 backdrop-blur-md p-3.5 rounded-2xl border border-purple-500/30">
            <span className="text-purple-800 text-[10px] uppercase font-extrabold block flex items-center gap-1">
              <Mail className="h-3 w-3" /> Emails
            </span>
            <span className="text-xl font-extrabold text-purple-900 mt-0.5 block">{stats.email}</span>
          </div>

          <div className="bg-blue-500/10 backdrop-blur-md p-3.5 rounded-2xl border border-blue-500/30">
            <span className="text-blue-800 text-[10px] uppercase font-extrabold block flex items-center gap-1">
              <Phone className="h-3 w-3" /> Call Notes
            </span>
            <span className="text-xl font-extrabold text-blue-900 mt-0.5 block">{stats.callNotes}</span>
          </div>

          <div className="bg-rose-500/10 backdrop-blur-md p-3.5 rounded-2xl border border-rose-500/30">
            <span className="text-rose-800 text-[10px] uppercase font-extrabold block flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Suspensions
            </span>
            <span className="text-xl font-extrabold text-rose-900 mt-0.5 block">{stats.suspensions}</span>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-slate-500 text-[10px] uppercase font-extrabold block">Delivery Rate</span>
            <span className="text-xl font-extrabold text-emerald-600 mt-0.5 block">{stats.deliveryRate}%</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FILTER & SEARCH CONTROL BAR */}
      {/* ========================================================================= */}
      <div className="bg-white/80 backdrop-blur-3xl p-4 sm:p-5 rounded-3xl border border-white/90 shadow-xl space-y-4 text-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Channel Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mr-1 shrink-0">
              Channel:
            </span>
            {[
              { id: "all", label: "All Channels", icon: Filter },
              { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
              { id: "email", label: "Email", icon: Mail },
              { id: "call_note", label: "Call Notes", icon: Phone },
              { id: "suspension_notice", label: "Suspension Alerts", icon: AlertTriangle },
            ].map((ch) => {
              const Icon = ch.icon;
              const isActive = selectedChannel === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannel(ch.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? "bg-[#ef4d23] text-white border border-[#ef4d23] shadow-md"
                      : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{ch.label}</span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle (Table vs Timeline) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer font-bold ${
                viewMode === "table" ? "bg-[#ef4d23] text-white shadow-md" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer font-bold ${
                viewMode === "timeline" ? "bg-[#ef4d23] text-white shadow-md" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Timeline Feed
            </button>
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/80 text-xs">
          {/* Client Filter Dropdown */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Filter by Client Account</label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200/90 rounded-2xl text-slate-900 font-bold outline-none focus:ring-2 focus:ring-[#ef4d23] shadow-xs"
            >
              <option value="all" className="bg-white text-slate-900">All Client Accounts</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-white text-slate-900">
                  {c.company_name} ({c.code || c.id})
                </option>
              ))}
            </select>
          </div>

          {/* Message Type Filter */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Filter by Message Type</label>
            <select
              value={selectedMessageType}
              onChange={(e) => setSelectedMessageType(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200/90 rounded-2xl text-slate-900 font-bold outline-none focus:ring-2 focus:ring-[#ef4d23] shadow-xs"
            >
              <option value="all" className="bg-white text-slate-900">All Message Types</option>
              <option value="payment_reminder" className="bg-white text-slate-900">Payment Reminder</option>
              <option value="suspension" className="bg-white text-slate-900">Account Suspension</option>
              <option value="onboarding" className="bg-white text-slate-900">Onboarding & Retainer</option>
              <option value="proposal" className="bg-white text-slate-900">Retainer Proposal</option>
              <option value="manual_note" className="bg-white text-slate-900">Manual Phone Call Note</option>
            </select>
          </div>

          {/* Real-time Search Box */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Search Content or Sender</label>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search text, phone, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-slate-900 placeholder:text-slate-400 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#ef4d23] shadow-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. LOG LIST / TABLE CONTAINER */}
      {/* ========================================================================= */}
      <div className="bg-white/80 backdrop-blur-3xl rounded-3xl border border-white/90 shadow-2xl overflow-hidden">
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-900">
              <thead className="bg-slate-100/90 text-slate-700 font-extrabold uppercase tracking-wider border-b border-slate-200/80 text-[10px]">
                <tr>
                  <th className="py-4 px-5">Channel</th>
                  <th className="py-4 px-5">Client Brand & Code</th>
                  <th className="py-4 px-5">Subject / Message Snippet</th>
                  <th className="py-4 px-5">Recipient</th>
                  <th className="py-4 px-5">Dispatched By</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5">Date & Time</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">
                      No communication logs match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5">{getChannelBadge(log.channel)}</td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-[#ef4d23]" />
                          <div>
                            <div className="font-extrabold text-slate-900">{log.school_name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{log.client_id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 max-w-xs">
                        <div className="font-bold text-slate-900 truncate">{log.subject || "Message Content"}</div>
                        <div className="text-[11px] text-slate-600 truncate line-clamp-1">{log.content}</div>
                      </td>

                      <td className="py-4 px-5 font-mono text-slate-700 text-[11px]">
                        {log.recipient}
                      </td>

                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-slate-200">
                          {log.sender_code || "EMP-100"} • {log.sent_by_name}
                        </span>
                      </td>

                      <td className="py-4 px-5">{getDeliveryStatusBadge(log.delivery_status)}</td>

                      <td className="py-4 px-5 text-[11px] text-slate-500 font-mono">
                        {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedLogDetail(log)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer border border-slate-200"
                            title="Inspect Message Payload & Details"
                          >
                            <Eye className="h-4 w-4 text-emerald-600" />
                          </button>

                          {log.channel === "whatsapp" && onOpenMessenger && (
                            <button
                              type="button"
                              onClick={() => onOpenMessenger(log.recipient)}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-all cursor-pointer border border-emerald-300"
                              title="Open WhatsApp Messenger"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </button>
                          )}

                          {log.channel === "email" && onOpenEmailModal && (
                            <button
                              type="button"
                              onClick={() => onOpenEmailModal(log.recipient)}
                              className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-all cursor-pointer border border-purple-300"
                              title="Resend Email"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Timeline Feed View */
          <div className="p-6 space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200/90 shadow-md space-y-3 relative hover:border-[#ef4d23]/40 transition-all text-slate-900"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-3">
                    {getChannelBadge(log.channel)}
                    <span className="font-extrabold text-slate-900 text-sm">{log.school_name}</span>
                    <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 border border-slate-200">
                      {log.client_id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {getDeliveryStatusBadge(log.delivery_status)}
                    <span className="text-xs font-mono text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-[#ef4d23] uppercase tracking-wider">
                    {log.subject || `${log.message_type.toUpperCase()} Log`}
                  </h4>
                  <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 font-sans">
                    {log.content}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 pt-1">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-3.5 w-3.5 text-[#ef4d23]" />
                    <span>Dispatched by: <strong className="text-slate-900 font-bold">{log.sent_by_name}</strong> [{log.sender_code || "EMP-100"}]</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-600">To: {log.recipient}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedLogDetail(log)}
                      className="text-[#ef4d23] hover:underline font-bold ml-2 cursor-pointer"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL: DISPATCH / LOG NEW COMMUNICATION */}
      {/* ========================================================================= */}
      {isNewLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white/95 backdrop-blur-3xl border border-white/90 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-slate-900 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#ef4d23] flex items-center justify-center text-white font-bold">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Log & Dispatch Communication</h3>
                  <p className="text-[11px] text-slate-500">Record official WhatsApp, Email, or Call Note into central log</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewLogModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchNewLog} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Channel *</label>
                  <select
                    value={formChannel}
                    onChange={(e) => setFormChannel(e.target.value as CommChannel)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-slate-900 font-bold outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  >
                    <option value="whatsapp" className="bg-white text-slate-900">WhatsApp Broadcast</option>
                    <option value="email" className="bg-white text-slate-900">Official Email</option>
                    <option value="call_note" className="bg-white text-slate-900">Manual Call Note</option>
                    <option value="suspension_notice" className="bg-white text-slate-900">Suspension Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Select Client Account *</label>
                  <select
                    value={formClientId}
                    onChange={(e) => {
                      setFormClientId(e.target.value);
                      const matched = clients.find((c) => c.id === e.target.value);
                      if (matched && matched.contact_person) {
                        setFormRecipient(matched.contact_person.phone || matched.contact_person.email || "");
                      }
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-slate-900 font-bold outline-none focus:ring-2 focus:ring-[#ef4d23]"
                    required
                  >
                    <option value="" className="bg-white text-slate-900">-- Select Client Account --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id} className="bg-white text-slate-900">
                        {c.company_name} ({c.code || c.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Recipient (Phone or Email)</label>
                  <input
                    type="text"
                    placeholder="+91 98490 00000 / client@company.com"
                    value={formRecipient}
                    onChange={(e) => setFormRecipient(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-slate-900 placeholder:text-slate-400 font-semibold outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Message Type Category</label>
                  <select
                    value={formMessageType}
                    onChange={(e) => setFormMessageType(e.target.value as CommMessageType)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-slate-900 font-bold outline-none focus:ring-2 focus:ring-[#ef4d23]"
                  >
                    <option value="manual_note" className="bg-white text-slate-900">Manual Phone Call Note</option>
                    <option value="payment_reminder" className="bg-white text-slate-900">Payment Reminder</option>
                    <option value="proposal" className="bg-white text-slate-900">Retainer Proposal</option>
                    <option value="onboarding" className="bg-white text-slate-900">Onboarding Intake</option>
                    <option value="suspension" className="bg-white text-slate-900">Suspension Notice</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Subject Header</label>
                <input
                  type="text"
                  placeholder="e.g. Q4 Performance Sync Call Notes / August Retainer Reminder"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-slate-900 placeholder:text-slate-400 font-semibold outline-none focus:ring-2 focus:ring-[#ef4d23]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Log Content / Message Payload *</label>
                <textarea
                  rows={4}
                  placeholder="Type message text or call summary notes here..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200/90 rounded-2xl text-slate-900 placeholder:text-slate-400 font-normal outline-none focus:ring-2 focus:ring-[#ef4d23] leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Logged By Staff Identity</label>
                <select
                  value={formSentBy}
                  onChange={(e) => setFormSentBy(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-slate-900 font-bold outline-none focus:ring-2 focus:ring-[#ef4d23]"
                >
                  <option value="Sahit Sai [EMP-100]" className="bg-white text-slate-900">Sahit Sai [Code: EMP-100] (Founder)</option>
                  <option value="Sarah Chen [EMP-102]" className="bg-white text-slate-900">Sarah Chen [Code: EMP-102] (Account Manager)</option>
                  <option value="Priya Sharma [EMP-103]" className="bg-white text-slate-900">Priya Sharma [Code: EMP-103] (Creative Strategist)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setIsNewLogModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold cursor-pointer border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#ef4d23] hover:bg-[#d93c14] text-white rounded-2xl font-extrabold shadow-lg cursor-pointer flex items-center gap-2 border border-white/30"
                >
                  <Send className="h-4 w-4" />
                  <span>Dispatch & Log</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DRAWER: DETAILED MESSAGE AUDIT & PAYLOAD INSPECTOR */}
      {/* ========================================================================= */}
      {selectedLogDetail && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white/95 backdrop-blur-3xl border-l border-slate-200 p-6 text-slate-900 overflow-y-auto space-y-6 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#ef4d23]" />
                <h3 className="font-extrabold text-base text-slate-900">Comm Audit Trail Payload</h3>
              </div>
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[10px] uppercase font-extrabold">Log Record ID:</span>
                  <span className="font-mono font-bold text-emerald-700">{selectedLogDetail.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[10px] uppercase font-extrabold">Dispatched Channel:</span>
                  {getChannelBadge(selectedLogDetail.channel)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[10px] uppercase font-extrabold">Delivery Status:</span>
                  {getDeliveryStatusBadge(selectedLogDetail.delivery_status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[10px] uppercase font-extrabold">Timestamp:</span>
                  <span className="font-mono text-slate-700">{new Date(selectedLogDetail.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-[#ef4d23] uppercase tracking-wider">Client & Recipient</span>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                  <p className="font-extrabold text-slate-900 text-sm">{selectedLogDetail.school_name}</p>
                  <p className="text-slate-600 font-mono">Account ID: {selectedLogDetail.client_id}</p>
                  <p className="text-slate-700 font-mono pt-1">To: {selectedLogDetail.recipient}</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-[#ef4d23] uppercase tracking-wider">Message Payload Body</span>
                <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 text-slate-900 leading-relaxed font-sans font-normal whitespace-pre-wrap">
                  {selectedLogDetail.content}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Dispatched By Staff</span>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-900">{selectedLogDetail.sent_by_name}</span>
                  <span className="bg-[#ef4d23] text-white px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                    {selectedLogDetail.sender_code || "EMP-100"}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(selectedLogDetail, null, 2));
                    toast.success("Comm log JSON payload copied to clipboard!");
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center gap-2 cursor-pointer border border-slate-200"
                >
                  <Copy className="h-3.5 w-3.5 text-emerald-600" /> Copy JSON
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLogDetail(null)}
                  className="px-5 py-2 bg-[#ef4d23] hover:bg-[#d93c14] text-white rounded-xl font-bold cursor-pointer shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
