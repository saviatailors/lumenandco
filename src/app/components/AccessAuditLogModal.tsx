import { useState } from "react";
import { Modal } from "./ui/Modal";
import { SlideOver } from "./ui/SlideOver";
import { Button } from "./ui/Button";
import { ShieldAlert, ShieldCheck, History, AlertTriangle, AlertCircle, Lock, Play, CheckCircle2, Building2, UserCheck } from "lucide-react";
import { SchoolClient, AccessAuditEntry, UserRole, TeamMember } from "@/lib/lumenandco.types";

interface AccessToggleModalProps {
  client: SchoolClient | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: UserRole;
  currentUserName: string;
  onConfirmToggle: (clientId: string, newStatus: "active" | "suspended", reason: string) => void;
}

export function AccessToggleModal({
  client,
  isOpen,
  onClose,
  currentUserRole,
  currentUserName,
  onConfirmToggle,
}: AccessToggleModalProps) {
  const [reason, setReason] = useState("");

  if (!client) return null;

  const targetStatus = client.access_status === "active" ? "suspended" : "active";
  const isSuspension = targetStatus === "suspended";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirmToggle(client.id, targetStatus, reason.trim());
    setReason("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isSuspension ? `Suspend Client Access — ${client.school_name}` : `Grant / Restore Client Access — ${client.school_name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-neutral-900">
        <div
          className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
            isSuspension
              ? "bg-red-50 border-red-200 text-red-950"
              : "bg-emerald-50 border-emerald-200 text-emerald-950"
          }`}
        >
          <div className="flex items-center gap-2 font-black text-sm">
            {isSuspension ? (
              <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
            ) : (
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            )}
            <span>
              Master Access Switch: {isSuspension ? "SUSPEND ACCESS" : "GRANT / RESTORE ACCESS"}
            </span>
          </div>

          <p className="text-[11px] leading-relaxed font-medium">
            {isSuspension
              ? "Suspending access halts all digital campaigns, client portal listings, and internal delivery authorizations. This is the single source of truth for Lumen & Co ops."
              : "Granting access restores digital campaigns, client portal login, and active team workflow execution for this client retainer."}
          </p>
        </div>

        <div>
          <label className="block text-neutral-800 font-extrabold mb-1">
            Audit Log Reason ({isSuspension ? "Why are you suspending access?" : "Reason for granting access / payment clearance"}) *
          </label>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {isSuspension ? (
              <>
                <button
                  type="button"
                  onClick={() => setReason("Non-payment of monthly retainer invoice past 30 days despite reminders.")}
                  className="text-[10px] font-bold bg-red-100 text-red-800 hover:bg-red-200 border border-red-200 px-2.5 py-1 rounded-full cursor-pointer transition-all"
                >
                  ⚡ Overdue Retainer (30+ Days)
                </button>
                <button
                  type="button"
                  onClick={() => setReason("Pending advance renewal clearance before next billing cycle deliverables.")}
                  className="text-[10px] font-bold bg-red-100 text-red-800 hover:bg-red-200 border border-red-200 px-2.5 py-1 rounded-full cursor-pointer transition-all"
                >
                  ⏳ Pending Advance Clearance
                </button>
                <button
                  type="button"
                  onClick={() => setReason("Master account access revoked by Founder & Financial Operations.")}
                  className="text-[10px] font-bold bg-red-100 text-red-800 hover:bg-red-200 border border-red-200 px-2.5 py-1 rounded-full cursor-pointer transition-all"
                >
                  ⛔ Revoked by Founder
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setReason("Payment clearance verified via Axis Bank NEFT transfer. Restoring active retainer access.")}
                  className="text-[10px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200 px-2.5 py-1 rounded-full cursor-pointer transition-all"
                >
                  🟢 NEFT Bank Transfer Cleared
                </button>
                <button
                  type="button"
                  onClick={() => setReason("UPI Payment verified (lumenandco@axisbank). Reactivating digital campaigns.")}
                  className="text-[10px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200 px-2.5 py-1 rounded-full cursor-pointer transition-all"
                >
                  💳 UPI Payment Verified
                </button>
                <button
                  type="button"
                  onClick={() => setReason("Grace period extension approved by Founder. Restoring temporary portal access.")}
                  className="text-[10px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200 px-2.5 py-1 rounded-full cursor-pointer transition-all"
                >
                  🤝 Grace Extension Approved
                </button>
              </>
            )}
          </div>

          <textarea
            rows={3}
            placeholder={
              isSuspension
                ? "e.g. Non-payment of ₹35,000 monthly retainer for 35 days despite WhatsApp reminders."
                : "e.g. Payment clearance verified via bank transfer. Restoring active retainer access."
            }
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl font-medium text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
            required
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-200">
          <span>
            Authorized by: <strong className="text-neutral-800">{currentUserName}</strong> ({(currentUserRole || "owner").toUpperCase()})
          </span>
          <span className="font-mono text-[10px]">
            {new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
          </span>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="font-bold">
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={!reason.trim()}
            className={`font-bold text-white px-5 ${
              isSuspension ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isSuspension ? "Confirm Access Suspension" : "Grant / Restore Access"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs: AccessAuditEntry[];
  schoolClients?: SchoolClient[];
  teamMembers?: TeamMember[];
  onBulkSuspendOverdue: () => void;
  onBulkRestoreAccess?: () => void;
  onConfirmClientToggle?: (clientId: string, newStatus: "active" | "suspended", reason: string) => void;
  onToggleTeamMemberAccess?: (memberId: string) => void;
  currentUserRole: UserRole;
}

export function AccessAuditLogDrawer({
  isOpen,
  onClose,
  auditLogs,
  schoolClients = [],
  teamMembers = [],
  onBulkSuspendOverdue,
  onBulkRestoreAccess,
  onConfirmClientToggle,
  onToggleTeamMemberAccess,
  currentUserRole,
}: AuditLogDrawerProps) {
  const [activeTab, setActiveTab] = useState<"clients" | "employees" | "history">("clients");

  const suspendedClients = schoolClients.filter((c) => c.access_status === "suspended");
  const suspendedEmployees = teamMembers.filter((m) => !m.crmAccess);

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Access Control & Suspended Accounts Center"
      subtitle="Master controls to grant/revoke access for suspended clients & staff profiles with immutable audit trail"
      width="max-w-2xl"
    >
      <div className="space-y-5 text-xs text-neutral-900">
        {/* Bulk Action Header Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-neutral-900 text-white p-4 rounded-2xl space-y-2 shadow-lg border border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Overdue Dues Lock</span>
              <ShieldAlert className="h-4 w-4 text-rose-400" />
            </div>
            <h4 className="text-xs font-bold text-white">Emergency Bulk Suspension</h4>
            <p className="text-[10px] text-neutral-400 leading-tight">
              Instantly lock access for clients with retainer dues overdue by 15+ days.
            </p>
            <Button
              disabled={currentUserRole !== "owner"}
              onClick={onBulkSuspendOverdue}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] py-1.5 shadow-md mt-1"
            >
              Bulk Suspend (15+ Days)
            </Button>
          </div>

          <div className="bg-emerald-950 text-white p-4 rounded-2xl space-y-2 shadow-lg border border-emerald-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Payment Clearance</span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <h4 className="text-xs font-bold text-white">Bulk Restore All Access</h4>
            <p className="text-[10px] text-emerald-200/80 leading-tight">
              Grant access back to all suspended client & employee accounts in 1 click.
            </p>
            <Button
              disabled={currentUserRole !== "owner" && currentUserRole !== "admin"}
              onClick={onBulkRestoreAccess}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] py-1.5 shadow-md mt-1"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Grant / Restore All Access
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 border-b border-neutral-200 pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("clients")}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "clients"
                ? "bg-[#ef4d23] text-white shadow-xs"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Suspended Clients ({suspendedClients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("employees")}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "employees"
                ? "bg-[#ef4d23] text-white shadow-xs"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Suspended Staff ({suspendedEmployees.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "history"
                ? "bg-[#ef4d23] text-white shadow-xs"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>Audit History ({auditLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: SUSPENDED CLIENT ACCOUNTS */}
        {activeTab === "clients" && (
          <div className="space-y-3">
            {suspendedClients.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50/60 rounded-2xl border border-emerald-200 text-emerald-900 space-y-1">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">All Client Accounts Active</h4>
                <p className="text-xs text-emerald-700">Zero client retainers are currently suspended.</p>
              </div>
            ) : (
              suspendedClients.map((client) => (
                <div
                  key={client.id}
                  className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 text-sm">{client.school_name}</span>
                      <span className="text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full uppercase">
                        🔴 Access Suspended
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {client.city} • Retainer: <strong className="text-neutral-900">₹{client.monthly_retainer_rupees.toLocaleString()}/mo</strong> • Contact: {client.contact_person} ({client.phone})
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      if (onConfirmClientToggle) {
                        onConfirmClientToggle(
                          client.id,
                          "active",
                          "Access restored by Founder / Admin via Suspended Accounts Center upon payment clearance."
                        );
                      }
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl shadow-xs"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Grant / Restore Access
                  </Button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: SUSPENDED EMPLOYEE ACCOUNTS */}
        {activeTab === "employees" && (
          <div className="space-y-3">
            {suspendedEmployees.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50/60 rounded-2xl border border-emerald-200 text-emerald-900 space-y-1">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">All Staff Accounts Active</h4>
                <p className="text-xs text-emerald-700">Zero employee accounts have revoked CRM access.</p>
              </div>
            ) : (
              suspendedEmployees.map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${member.avatarBg} text-white font-bold text-base flex items-center justify-center shadow-xs`}>
                      {member.initial}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 text-sm">{member.name}</span>
                        <span className="text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full uppercase">
                          🔴 Access Revoked
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {member.title} • {member.department} • {member.email}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      if (onToggleTeamMemberAccess) {
                        onToggleTeamMemberAccess(member.id);
                      }
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl shadow-xs"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Grant CRM Access
                  </Button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: AUDIT HISTORY TRAIL */}
        {activeTab === "history" && (
          <div className="space-y-3">
            <h4 className="font-semibold text-neutral-800 text-xs uppercase tracking-wide flex items-center gap-2 border-b pb-2">
              <History className="h-4 w-4 text-[#ef4d23]" /> Access Change Audit Trail ({auditLogs.length})
            </h4>

            {auditLogs.length === 0 ? (
              <p className="text-center py-8 text-neutral-400 italic">No access suspension records found.</p>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-4 rounded-2xl border space-y-2 text-xs transition-all ${
                    log.new_status === "suspended"
                      ? "bg-red-50/60 border-red-200"
                      : "bg-emerald-50/60 border-emerald-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900 text-xs">{log.school_name}</span>
                    <span
                      className={`font-semibold text-[10px] uppercase px-2.5 py-0.5 rounded-full border ${
                        log.new_status === "suspended"
                          ? "bg-red-100 text-red-700 border-red-300"
                          : "bg-emerald-100 text-emerald-700 border-emerald-300"
                      }`}
                    >
                      {log.new_status === "suspended" ? "🔴 SUSPENDED" : "🟢 REACTIVATED / GRANTED"}
                    </span>
                  </div>

                  <p className="text-neutral-700 font-medium text-[11px] leading-relaxed bg-white/70 p-2.5 rounded-xl border border-neutral-200/60">
                    "{log.reason}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-0.5">
                    <span className="font-semibold text-neutral-700">
                      By: {log.changed_by_name} ({(log.changed_by_role || "owner").toUpperCase()})
                    </span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </SlideOver>
  );
}
