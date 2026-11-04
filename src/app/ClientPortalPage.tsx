import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import LiveBackgroundVideo from "./components/LiveBackgroundVideo";
import {
  Loader2,
  LogOut,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Receipt,
  Download,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  Building2,
  Sparkles,
  Zap,
  Play,
  ThumbsUp,
  RotateCcw,
  UserCheck,
  Users,
  Search,
  Filter,
  Phone,
  Flame,
  Snowflake,
  CheckSquare,
  ArrowUpRight,
  Video,
  Copy,
  FolderDown,
  Layers,
  FileCode,
  Image as ImageIcon,
  BarChart3,
  Lock,
  X,
  FileCheck,
  History,
  Send,
  Eye,
  Mail,
  Calendar,
  KeyRound,
  ShieldAlert,
  HelpCircle,
  Check,
} from "lucide-react";

import { getMyEnquiries, generateLeadsCsv, buildConsentAuditRecord, buildLoginHistoryRecord } from "@/lib/client-portal.functions";
import ClientLayoutShell, { ClientTab } from "./components/ClientLayoutShell";
import RigidGlassMetricCard from "./components/ui/RigidGlassMetricCard";
import DocumentVaultView from "./components/DocumentVaultView";
import { useToast } from "./components/ui/Toast";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "./components/ui/Table";
import { Badge } from "./components/ui/Badge";
import { Button } from "./components/ui/Button";

import {
  ClientBusinessLead,
  INITIAL_CLIENT_BUSINESS_LEADS,
  CURRENT_POLICY_VERSION,
  LUMEN_POLICY_CONTENT_V1,
  UserConsentRecord,
  UserLoginHistoryEntry,
  INITIAL_USER_CONSENT_RECORDS,
  INITIAL_USER_LOGIN_HISTORY,
  CreativeApprovalItem,
  INITIAL_CREATIVE_APPROVALS,
} from "@/lib/lumenandco.types";

export default function ClientPortalPage() {
  const fetchMine = useServerFn(getMyEnquiries);
  const toast = useToast();

  // Auth State
  const [checking, setChecking] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [currentTab, setCurrentTab] = useState<ClientTab>("overview");
  const [step, setStep] = useState<"email" | "code">("email");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [otpInput, setOtpInput] = useState("");

  // Client Identity State
  const [userId, setUserId] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Consent Audit & Login History State
  const [consentRecords, setConsentRecords] = useState<UserConsentRecord[]>(INITIAL_USER_CONSENT_RECORDS);
  const [loginHistory, setLoginHistory] = useState<UserLoginHistoryEntry[]>(INITIAL_USER_LOGIN_HISTORY);
  
  // Consent Gate Form State (Multi-Doc Sequential Reading Process)
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [hasScrolledPrivacy, setHasScrolledPrivacy] = useState(false);
  const [hasScrolledTerms, setHasScrolledTerms] = useState(false);
  const [consentTab, setConsentTab] = useState<"privacy" | "terms">("privacy");

  // Scroll detection handler for policy document reader
  const handleDocumentScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Unlocks when user scrolls near the bottom (within 40px of bottom)
    if (scrollHeight - scrollTop - clientHeight < 40) {
      if (consentTab === "privacy") {
        setHasScrolledPrivacy(true);
      } else if (consentTab === "terms") {
        setHasScrolledTerms(true);
      }
    }
  };

  // Modals for Footer Policy View
  const [viewPolicyModal, setViewPolicyModal] = useState<"privacy" | "terms" | null>(null);

  // Creative Approvals State
  const [activeOrderTab, setActiveOrderTab] = useState<string>("active");
  const [creativeApprovals, setCreativeApprovals] = useState<CreativeApprovalItem[]>(INITIAL_CREATIVE_APPROVALS);
  const [rejectModalItem, setRejectModalItem] = useState<CreativeApprovalItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [historyModalItem, setHistoryModalItem] = useState<CreativeApprovalItem | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  // Business Leads State
  const [businessLeads, setBusinessLeads] = useState<ClientBusinessLead[]>(INITIAL_CLIENT_BUSINESS_LEADS);
  const [leadSearchQuery, setLeadSearchQuery] = useState("");
  const [leadFilterTemp, setLeadFilterTemp] = useState<string>("all");
  const [leadFilterDate, setLeadFilterDate] = useState<string>("all");

  // Profile Password Change State
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // Support Request State
  const [supportSubject, setSupportSubject] = useState("");
  const [supportCategory, setSupportCategory] = useState("dpdp_data_request");
  const [supportMessage, setSupportMessage] = useState("");

  // Notifications Feed State
  const [notifications, setNotifications] = useState<
    { id: string; title: string; desc: string; time: string; type: string; read: boolean }[]
  >([]);

  // Sign In Submission
  const handlePerformSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      toast.show("Please enter a valid account email address.", "error");
      return;
    }

    const cleanEmail = emailInput.trim();
    const domainPart = cleanEmail.split("@")[1]?.split(".")[0] || "Client";
    const compName = domainPart.charAt(0).toUpperCase() + domainPart.slice(1);
    const userNamePart = cleanEmail.split("@")[0] || "Client";
    const derivedName = userNamePart.charAt(0).toUpperCase() + userNamePart.slice(1);

    const clientAcc = {
      userId: `user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, "_")}`,
      clientId: `client-${cleanEmail.replace(/[^a-zA-Z0-9]/g, "_")}`,
      name: derivedName,
      company: compName,
      email: cleanEmail,
    };

    setUserId(clientAcc.userId);
    setClientId(clientAcc.clientId);
    setClientName(clientAcc.name);
    setClientCompany(clientAcc.company);
    setUserEmail(clientAcc.email);

    const hasAccepted = consentRecords.some(
      (r) => r.user_email.toLowerCase() === clientAcc.email.toLowerCase() && r.policy_version === CURRENT_POLICY_VERSION
    );

    setSignedIn(true);
    setConsentAccepted(hasAccepted);
    setPrivacyChecked(false);
    setTermsChecked(false);
    setConsentTab("privacy");

    const newLog = buildLoginHistoryRecord({
      userId: clientAcc.userId,
      userEmail: clientAcc.email,
      status: hasAccepted ? "success" : "consent_pending",
    });
    setLoginHistory((prev) => [newLog, ...prev]);

    if (hasAccepted) {
      toast.show(`Welcome back, ${clientAcc.name}! Logged into ${clientAcc.company}.`, "success");
    } else {
      toast.show(`Logged in as ${clientAcc.name}. Please complete mandatory consent gate to proceed.`, "info");
    }
  };

  // Accept Consent Gate Action
  const handleAcceptConsentGate = () => {
    if (!privacyChecked || !termsChecked) {
      toast.show("Please read and acknowledge both Privacy Policy and Terms of Service to continue.", "error");
      return;
    }

    // Create consent record
    const newRecord = buildConsentAuditRecord({
      userId,
      clientId,
      userEmail,
      policyVersion: CURRENT_POLICY_VERSION,
    });

    setConsentRecords((prev) => [newRecord, ...prev]);
    setConsentAccepted(true);

    // Add login success history record
    const loginRecord = buildLoginHistoryRecord({
      userId,
      userEmail,
      status: "success",
    });
    setLoginHistory((prev) => [loginRecord, ...prev]);

    toast.show("Consent audit record saved (v1.0). Both policies verified. Dashboard unlocked!", "success");
  };

  // Reject Consent / Logout Action
  const handleRejectConsentAndLogout = () => {
    setSignedIn(false);
    setConsentAccepted(false);
    setPrivacyChecked(false);
    setTermsChecked(false);
    setConsentTab("privacy");
    toast.show("Session terminated. You must accept both Privacy Policy & Terms of Service to access the portal.", "info");
  };


  // Handle Approve Creative
  const handleApproveCreative = (itemId: string) => {
    setCreativeApprovals((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updatedHistory = item.history.map((h) =>
            h.version === item.current_version
              ? { ...h, status: "approved" as const, action_by: clientName, action_at: new Date().toISOString() }
              : h
          );
          return {
            ...item,
            status: "approved" as const,
            action_at: new Date().toISOString(),
            action_by: clientName,
            history: updatedHistory,
          };
        }
        return item;
      })
    );

    toast.show("Creative asset officially APPROVED! Agency team notified for campaign deployment.", "success");
  };

  // Handle Reject Creative with Comment
  const handleConfirmRejectCreative = () => {
    if (!rejectModalItem) return;

    setCreativeApprovals((prev) =>
      prev.map((item) => {
        if (item.id === rejectModalItem.id) {
          const updatedHistory = item.history.map((h) =>
            h.version === item.current_version
              ? {
                  ...h,
                  status: "rejected" as const,
                  feedback: rejectReason || "Revision requested by client.",
                  action_by: clientName,
                  action_at: new Date().toISOString(),
                }
              : h
          );
          return {
            ...item,
            status: "rejected" as const,
            client_comment: rejectReason || "Revision requested by client.",
            action_at: new Date().toISOString(),
            action_by: clientName,
            history: updatedHistory,
          };
        }
        return item;
      })
    );

    toast.show("Creative asset REJECTED with feedback comments. Agency video team alerted for revision.", "info");
    setRejectModalItem(null);
    setRejectReason("");
  };

  // Handle Lead CSV Export
  const handleExportLeadsCsv = () => {
    const csvContent = generateLeadsCsv(myClientLeads);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `lumen_and_co_leads_${clientCompany.toLowerCase().replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.show(`Exported ${myClientLeads.length} leads to CSV successfully.`, "success");
  };

  // Password Change Submission
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currPass) {
      toast.show("Please enter your current password.", "error");
      return;
    }
    if (newPass.length < 8) {
      toast.show("New password must be at least 8 characters long.", "error");
      return;
    }
    if (newPass !== confirmPass) {
      toast.show("New password and confirmation do not match.", "error");
      return;
    }

    setCurrPass("");
    setNewPass("");
    setConfirmPass("");
    toast.show("Password updated successfully! Next login will require your new credentials.", "success");
  };

  // Support Query Submission
  const handleSendSupportQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportSubject || !supportMessage) {
      toast.show("Please enter subject and message details.", "error");
      return;
    }

    setSupportSubject("");
    setSupportMessage("");
    toast.show("Support request & DPDP data query transmitted to Grievance Officer (Sahit Sai). Ticket #DPDP-8921 opened.", "success");
  };

  // Filtered Leads
  const myClientLeads = businessLeads.filter((lead) => {
    const isMatchingClient =
      lead.client_id === clientId ||
      lead.client_name.toLowerCase().includes(clientCompany.toLowerCase().substring(0, 4));
    const matchesTemp = leadFilterTemp === "all" || lead.temperature === leadFilterTemp;
    const matchesSearch =
      lead.lead_name.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
      lead.phone.includes(leadSearchQuery) ||
      lead.campaign_source.toLowerCase().includes(leadSearchQuery.toLowerCase());

    return isMatchingClient && matchesTemp && matchesSearch;
  });

  // Count pending approvals
  const pendingApprovalsCount = creativeApprovals.filter(
    (c) => c.status === "pending" && (c.client_id === clientId || c.client_id === "client-101")
  ).length;

  // Render Loader while checking auth
  if (checking) {
    return (
      <div className="fixed inset-0 bg-[#0c0d12] text-white flex flex-col items-center justify-center space-y-4 font-sans">
        <span className="bg-white/95 rounded-2xl px-3 py-1.5 border border-white/40 shadow-lg inline-block">
          <img src="/lumen-and-co-logo.png" alt="Lumen & Co" className="h-8 w-auto object-contain animate-pulse" />
        </span>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#ef4d23]">
          <Loader2 className="h-4 w-4 animate-spin text-[#ef4d23]" />
          <span>Authenticating Client Portal Session...</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 1. UNAUTHENTICATED LOGIN / OTP SCREEN (MANDATORY PAGE #1)
  // =========================================================================
  if (!signedIn) {
    return (
      <div className="fixed inset-0 overflow-hidden bg-[#0c0d12] text-white flex items-center justify-center p-4 font-sans isolate">
        {/* Background Motion Stage */}
        <LiveBackgroundVideo
          containerClassName="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-gradient-to-br from-[#0c0d12] via-[#12131c] to-[#08090d]"
          className="opacity-70"
          overlayClassName=""
        />

        <div className="w-full max-w-md bg-white/25 backdrop-blur-3xl border border-white/40 rounded-3xl p-8 shadow-2xl space-y-6 relative isolate text-white">
          {/* Header Branding */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center p-2.5 bg-white/95 rounded-2xl border border-white/40 shadow-lg">
              <img src="/lumen-and-co-logo.png" alt="Lumen & Co" className="h-8 w-auto object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Client Portal Sign In</h1>
              <p className="text-xs text-white/70 mt-1">
                Access your real-time campaign performance, creative approvals & leads.
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handlePerformSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/80 uppercase tracking-wider block">
                Authorized Client Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ef4d23] focus:ring-2 focus:ring-[#ef4d23]/40 transition-all font-medium"
                />
                <Mail className="absolute right-4 top-3.5 h-4 w-4 text-white/40 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-white/80 uppercase tracking-wider block">
                  Password / OTP Code
                </label>
                <button
                  type="button"
                  onClick={() => setStep(step === "email" ? "code" : "email")}
                  className="text-[10px] font-bold text-[#ef4d23] hover:underline"
                >
                  {step === "email" ? "Use One-Time Passcode (OTP)" : "Use Email Password"}
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={step === "email" ? passwordInput : otpInput}
                  onChange={(e) => (step === "email" ? setPasswordInput(e.target.value) : setOtpInput(e.target.value))}
                  placeholder="••••••••••••"
                  className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ef4d23] focus:ring-2 focus:ring-[#ef4d23]/40 transition-all font-medium"
                />
                <KeyRound className="absolute right-4 top-3.5 h-4 w-4 text-white/40 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#ef4d23] hover:bg-[#d83f17] text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-[#ef4d23]/30 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span>Authenticate & Enter Portal</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </form>


          <div className="text-center pt-2">
            <p className="text-[10px] text-white/50">
              Compliant with India's Digital Personal Data Protection (DPDP) Act, 2023.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. BLOCKING FIRST-LOGIN CONSENT GATE SCREEN (FROSTED DARK GLASS MULTI-DOC PROCESS)
  // =========================================================================
  if (signedIn && !consentAccepted) {
    const isBothChecked = privacyChecked && termsChecked;

    return (
      <div className="fixed inset-0 overflow-y-auto bg-[#0c0d12] text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans isolate z-50">
        {/* Background Motion Stage */}
        <LiveBackgroundVideo
          containerClassName="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-gradient-to-br from-[#0c0d12] via-[#12131c] to-[#08090d]"
          className="opacity-70"
          overlayClassName=""
        />

        {/* Full Size Frosted Dark Glass Container */}
        <div className="w-full max-w-5xl bg-white/25 backdrop-blur-3xl border border-white/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto flex flex-col max-h-[95vh] text-white isolate">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/15 pb-5 gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#ef4d23]/20 border border-[#ef4d23]/40 rounded-2xl text-[#ef4d23] shadow-lg shadow-[#ef4d23]/20">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-white/95 rounded-xl px-2 py-0.5 border border-white/40 shadow-sm inline-block">
                    <img src="/lumen-and-co-logo.png" alt="Lumen & Co" className="h-5 w-auto object-contain" />
                  </span>
                  <span className="text-white/30">•</span>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    Mandatory Policy & Consent Gate
                  </h2>
                  <span className="bg-[#ef4d23] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-white/30 shadow-md shadow-[#ef4d23]/30">
                    Policy v{CURRENT_POLICY_VERSION}
                  </span>
                </div>
                <p className="text-xs text-white/70 mt-1">
                  Client Account: <span className="font-bold text-white">{clientName}</span> ({clientCompany}) • <span className="text-emerald-400 font-mono font-bold">{userEmail}</span>
                </p>
              </div>
            </div>

            {/* Logout Action Button */}
            <button
              type="button"
              onClick={handleRejectConsentAndLogout}
              className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white/80 border border-white/20 text-xs font-bold transition-colors flex items-center gap-2 shrink-0 cursor-pointer shadow-xs"
            >
              <LogOut className="h-4 w-4" />
              <span>Decline & Exit</span>
            </button>
          </div>

          {/* Sequential Process Steps Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-black/40 p-2 rounded-2xl border border-white/15 shrink-0">
            {/* Step 1 Chip */}
            <button
              type="button"
              onClick={() => setConsentTab("privacy")}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                consentTab === "privacy"
                  ? "bg-[#ef4d23] text-white border-orange-400/40 shadow-lg shadow-[#ef4d23]/30"
                  : "bg-white/5 hover:bg-white/10 text-white/80 border-white/10"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  privacyChecked ? "bg-emerald-500 text-white shadow-xs" : "bg-white/20 text-white"
                }`}>
                  {privacyChecked ? "✓" : "1"}
                </span>
                <div>
                  <p className="text-xs font-extrabold">Document 1: Privacy Policy (v1.0)</p>
                  <p className="text-[10px] opacity-80">DPDP Act 2023 Compliant</p>
                </div>
              </div>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                privacyChecked ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              }`}>
                {privacyChecked ? "Accepted" : "Required"}
              </span>
            </button>

            {/* Step 2 Chip */}
            <button
              type="button"
              disabled={!privacyChecked}
              onClick={() => setConsentTab("terms")}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                !privacyChecked
                  ? "opacity-50 cursor-not-allowed bg-black/20 text-white/40 border-white/10"
                  : consentTab === "terms"
                  ? "bg-[#ef4d23] text-white border-orange-400/40 shadow-lg shadow-[#ef4d23]/30"
                  : "bg-white/5 hover:bg-white/10 text-white/80 border-white/10"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  termsChecked ? "bg-emerald-500 text-white shadow-xs" : "bg-white/20 text-white"
                }`}>
                  {termsChecked ? "✓" : "2"}
                </span>
                <div>
                  <p className="text-xs font-extrabold">Document 2: Terms of Service (v1.0)</p>
                  <p className="text-[10px] opacity-80">Client Scope & SLA Governance</p>
                </div>
              </div>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                termsChecked
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : !privacyChecked
                  ? "bg-white/10 text-white/40 border border-white/15"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              }`}>
                {termsChecked ? "Accepted" : !privacyChecked ? "Locked (Complete Step 1)" : "Required"}
              </span>
            </button>
          </div>

          {/* Scroll Status Banner */}
          {consentTab === "privacy" ? (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-center justify-between gap-3 shrink-0 transition-all duration-300 shadow-md ${
                hasScrolledPrivacy
                  ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-200"
                  : "bg-amber-500/15 border border-amber-500/40 text-amber-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {hasScrolledPrivacy ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
                )}
                <span>
                  {hasScrolledPrivacy ? (
                    <>
                      <strong>Document 1 Verified:</strong> Privacy Policy fully read. Checkbox unlocked below!
                    </>
                  ) : (
                    <>
                      <strong>Action Required:</strong> Scroll to the bottom of Document 1 (Privacy Policy) to unlock the agreement checkbox.
                    </>
                  )}
                </span>
              </div>
              {!hasScrolledPrivacy && (
                <span className="text-[10px] bg-amber-500/30 text-amber-200 font-extrabold px-3 py-1 rounded-full border border-amber-400 animate-pulse shrink-0">
                  Scroll Down ↓
                </span>
              )}
            </div>
          ) : (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-center justify-between gap-3 shrink-0 transition-all duration-300 shadow-md ${
                hasScrolledTerms
                  ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-200"
                  : "bg-amber-500/15 border border-amber-500/40 text-amber-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {hasScrolledTerms ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
                )}
                <span>
                  {hasScrolledTerms ? (
                    <>
                      <strong>Document 2 Verified:</strong> Terms of Service fully read. Checkbox unlocked below!
                    </>
                  ) : (
                    <>
                      <strong>Action Required:</strong> Scroll to the bottom of Document 2 (Terms of Service) to unlock the agreement checkbox.
                    </>
                  )}
                </span>
              </div>
              {!hasScrolledTerms && (
                <span className="text-[10px] bg-amber-500/30 text-amber-200 font-extrabold px-3 py-1 rounded-full border border-amber-400 animate-pulse shrink-0">
                  Scroll Down ↓
                </span>
              )}
            </div>
          )}

          {/* Full Size Glassmorphic Document Reader (with scroll detector) */}
          <div
            onScroll={handleDocumentScroll}
            className="flex-1 overflow-y-auto bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/15 p-6 sm:p-7 space-y-6 text-xs text-white/90 font-sans leading-relaxed shadow-inner scrollbar-thin scrollbar-thumb-white/20 hover:scrollbar-thumb-[#ef4d23]/60 transition-colors"
          >
            {consentTab === "privacy" ? (
              <div className="space-y-6">
                <div className="border-b border-white/15 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-white tracking-tight">
                      {LUMEN_POLICY_CONTENT_V1.privacy_policy.title}
                    </h3>
                    <p className="text-[10px] text-white/50 mt-0.5">
                      Last updated: {LUMEN_POLICY_CONTENT_V1.last_updated} • Version 1.0 (DPDP Act 2023 Compliant)
                    </p>
                  </div>
                  <span className="bg-[#ef4d23]/20 text-[#ef4d23] border border-[#ef4d23]/40 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase shadow-xs">
                    Document 1 of 2
                  </span>
                </div>

                {LUMEN_POLICY_CONTENT_V1.privacy_policy.sections.map((sec) => (
                  <div
                    key={sec.section_number}
                    className="space-y-2 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xs hover:border-[#ef4d23]/50 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="bg-[#ef4d23]/20 border border-[#ef4d23]/30 text-[#ef4d23] font-mono text-[11px] font-black px-2.5 py-0.5 rounded-lg shadow-2xs">
                        Section {sec.section_number}
                      </span>
                      <h4 className="font-bold text-white text-xs group-hover:text-[#ef4d23] transition-colors">
                        {sec.title}
                      </h4>
                    </div>
                    <p className="text-white/80 whitespace-pre-line text-[11px] leading-relaxed pl-1 font-medium">
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border-b border-white/15 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-white tracking-tight">
                      {LUMEN_POLICY_CONTENT_V1.terms_of_service.title}
                    </h3>
                    <p className="text-[10px] text-white/50 mt-0.5">
                      Last updated: {LUMEN_POLICY_CONTENT_V1.last_updated} • Version 1.0 (Client SLA Governance)
                    </p>
                  </div>
                  <span className="bg-[#ef4d23]/20 text-[#ef4d23] border border-[#ef4d23]/40 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase shadow-xs">
                    Document 2 of 2
                  </span>
                </div>

                {LUMEN_POLICY_CONTENT_V1.terms_of_service.sections.map((sec) => (
                  <div
                    key={sec.section_number}
                    className="space-y-2 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xs hover:border-[#ef4d23]/50 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="bg-[#ef4d23]/20 border border-[#ef4d23]/30 text-[#ef4d23] font-mono text-[11px] font-black px-2.5 py-0.5 rounded-lg shadow-2xs">
                        Section {sec.section_number}
                      </span>
                      <h4 className="font-bold text-white text-xs group-hover:text-[#ef4d23] transition-colors">
                        {sec.title}
                      </h4>
                    </div>
                    <p className="text-white/80 whitespace-pre-line text-[11px] leading-relaxed pl-1 font-medium">
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Document Checkbox & Sequential Navigation */}
          <div className="space-y-4 pt-3 border-t border-white/15 shrink-0">
            {consentTab === "privacy" ? (
              <div className="space-y-3">
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border transition-all select-none ${
                    !hasScrolledPrivacy
                      ? "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                      : "bg-white/10 hover:bg-white/15 border-white/20 cursor-pointer shadow-xs"
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={!hasScrolledPrivacy}
                    checked={privacyChecked}
                    onChange={(e) => setPrivacyChecked(e.target.checked)}
                    className="mt-0.5 h-4 w-4 text-[#ef4d23] rounded focus:ring-[#ef4d23] border-white/30 bg-black/40 accent-[#ef4d23] disabled:cursor-not-allowed"
                  />
                  <div className="text-xs">
                    <span className="text-white font-bold">
                      I have read, understand, and agree to the <strong>Privacy Policy (Version 1.0)</strong> under DPDP Act 2023 guidelines.
                    </span>
                    {!hasScrolledPrivacy && (
                      <p className="text-[10px] text-amber-300 font-extrabold mt-1">
                        🔒 Scroll to the bottom of the Privacy Policy document above to unlock this checkbox.
                      </p>
                    )}
                  </div>
                </label>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleRejectConsentAndLogout}
                    className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-400 border border-white/15 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Decline & Exit</span>
                  </button>

                  <button
                    type="button"
                    disabled={!privacyChecked}
                    onClick={() => setConsentTab("terms")}
                    className={`px-8 py-3.5 rounded-2xl font-extrabold text-xs transition-all duration-200 flex items-center gap-2 shadow-lg ${
                      privacyChecked
                        ? "bg-[#ef4d23] hover:bg-[#d83f17] text-white shadow-[#ef4d23]/40 cursor-pointer transform hover:scale-[1.02]"
                        : "bg-white/10 text-white/40 cursor-not-allowed border border-white/15"
                    }`}
                  >
                    <span>Proceed to Document 2: Terms of Service</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border transition-all select-none ${
                    !hasScrolledTerms
                      ? "bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                      : "bg-white/10 hover:bg-white/15 border-white/20 cursor-pointer shadow-xs"
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={!hasScrolledTerms}
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                    className="mt-0.5 h-4 w-4 text-[#ef4d23] rounded focus:ring-[#ef4d23] border-white/30 bg-black/40 accent-[#ef4d23] disabled:cursor-not-allowed"
                  />
                  <div className="text-xs">
                    <span className="text-white font-bold">
                      I have read, understand, and agree to the <strong>Terms of Service (Version 1.0)</strong> governing Client Portal usage.
                    </span>
                    {!hasScrolledTerms && (
                      <p className="text-[10px] text-amber-300 font-extrabold mt-1">
                        🔒 Scroll to the bottom of the Terms of Service document above to unlock this checkbox.
                      </p>
                    )}
                  </div>
                </label>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setConsentTab("privacy")}
                    className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    ← Back to Privacy Policy
                  </button>

                  <button
                    type="button"
                    disabled={!isBothChecked}
                    onClick={handleAcceptConsentGate}
                    className={`px-9 py-3.5 rounded-2xl font-black text-xs transition-all duration-200 flex items-center gap-2.5 shadow-xl ${
                      isBothChecked
                        ? "bg-[#ef4d23] hover:bg-[#d83f17] text-white shadow-[#ef4d23]/40 cursor-pointer transform hover:scale-[1.02]"
                        : "bg-white/10 text-white/40 cursor-not-allowed border border-white/15"
                    }`}
                  >
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    <span>Accept All Policies & Unlock Client Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }


  // =========================================================================
  // MAIN FULL CLIENT PORTAL SHELL & 10 MANDATORY PAGES
  // =========================================================================
  return (
    <ClientLayoutShell
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      clientName={clientName}
      clientCompany={clientCompany}
      onSignOut={() => {
        setSignedIn(false);
        setConsentAccepted(false);
        toast.show("Signed out of Client Portal.", "info");
      }}
      onOpenPrivacyPolicy={() => setViewPolicyModal("privacy")}
      onOpenTermsOfService={() => setViewPolicyModal("terms")}
    >
      {/* ========================================================================= */}
      {/* PAGE #3: DASHBOARD OVERVIEW (MOTION LABS AESTHETIC REPLICA) */}
      {/* ========================================================================= */}
      {currentTab === "overview" && (
        <div className="space-y-6 font-sans">
          {/* Top Row: Stat Cards & Mini Calendar Widget matching Motion Labs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Active Projects Stat Card */}
            <div className="md:col-span-4 bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-md flex flex-col justify-between h-[150px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500">Active projects</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div
                className="text-4xl font-normal text-neutral-900"
                style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
              >
                0
              </div>
            </div>

            {/* Waiting on you Stat Card */}
            <div className="md:col-span-4 bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-md flex flex-col justify-between h-[150px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500">Waiting on you</span>
                <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div
                className="text-4xl font-normal text-neutral-900"
                style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
              >
                {pendingApprovalsCount}
              </div>
            </div>

            {/* Calendar Widget Card (Right Panel) */}
            <div className="md:col-span-4 bg-white/90 backdrop-blur-xl rounded-3xl p-5 border border-white/60 shadow-md flex flex-col justify-between row-span-2">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-neutral-800">Sep 2026</span>
                  <Calendar className="w-4 h-4 text-neutral-400" />
                </div>

                <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-neutral-400 mb-2">
                  <span>S</span>
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  <span className="py-1 text-neutral-300">31</span>
                  <span className="py-1 text-neutral-700">1</span>
                  <span className="py-1 text-neutral-700">2</span>
                  <span className="py-1 text-neutral-700">3</span>
                  <span className="py-1 text-neutral-700">4</span>
                  <span className="py-1 text-neutral-700">5</span>
                  <span className="py-1 text-neutral-700">6</span>
                  {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((d) => (
                    <span key={d} className="py-1 text-neutral-700 font-medium">
                      {d}
                    </span>
                  ))}
                  <span className="py-1 bg-[#ef4d23] text-white rounded-lg font-bold text-xs flex items-center justify-center shadow-2xs">
                    25
                  </span>
                  {[26, 27, 28, 29, 30].map((d) => (
                    <span key={d} className="py-1 text-neutral-700 font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setCurrentTab("approvals")}
                className="text-xs font-semibold text-[#ef4d23] hover:underline cursor-pointer pt-3 block text-left"
              >
                Open calendar
              </button>
            </div>

            {/* Middle Row: Next Delivery Card */}
            <div className="md:col-span-8 bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-neutral-500 block mb-1">Next delivery</span>
                <h3 className="text-2xl font-bold text-neutral-900 tracking-tight">Nothing yet</h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-orange-100/80 text-[#ef4d23] flex items-center justify-center">
                <Calendar className="w-4.5 h-4.5" />
              </div>
            </div>
          </div>

          {/* Bottom Section: Order Filter Pills + New Order Button + Main Table / Empty State */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {["Active", "Needs review", "Delivered", "All"].map((tabName) => {
                  const isTabActive = activeOrderTab === tabName.toLowerCase();
                  return (
                    <button
                      key={tabName}
                      type="button"
                      onClick={() => setActiveOrderTab(tabName.toLowerCase())}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        isTabActive
                          ? "bg-[#ef4d23] text-white shadow-2xs"
                          : "bg-white/90 backdrop-blur-md text-neutral-700 hover:bg-white border border-white/60"
                      }`}
                    >
                      {tabName}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  window.dispatchEvent(new Event("convix:open-lead-form"));
                }}
                className="bg-[#ef4d23] hover:bg-[#d83f17] text-white px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <span>+ New order</span>
              </button>
            </div>

            {/* Large Main Empty / Active Orders Container */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/60 shadow-md min-h-[280px] flex flex-col items-center justify-center">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3
                className="text-xl font-normal text-neutral-900 mb-1"
                style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
              >
                Nothing here yet
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm font-medium leading-relaxed">
                Start a project and you will be able to track every stage of it from this tab.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE: DOCUMENT VAULT SECTION */}
      {/* ========================================================================= */}
      {currentTab === "documents" && (
        <DocumentVaultView
          isClientView={true}
          clientName={clientName}
          clientCompany={clientCompany}
          clientEmail={userEmail}
        />
      )}

      {/* ========================================================================= */}
      {/* PAGE #4: VIDEO / CREATIVE APPROVALS */}
      {/* ========================================================================= */}
      {currentTab === "approvals" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/80 p-5 rounded-3xl border border-white/90 backdrop-blur-3xl shadow-xl text-slate-900">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#ef4d23]" />
                <h2 className="text-xl font-extrabold text-slate-900">Video & Creative Approvals</h2>
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                Review submitted video reels, carousel graphics, and motion banners. Approving an asset gives official sign-off for campaign launch.
              </p>
            </div>
            <span className="bg-[#ef4d23] text-white px-3.5 py-1 rounded-full text-xs font-extrabold shadow-lg shadow-[#ef4d23]/30">
              {pendingApprovalsCount} Awaiting Decision
            </span>
          </div>

          {/* Approvals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creativeApprovals.map((item) => (
              <div
                key={item.id}
                className="bg-white/80 backdrop-blur-3xl rounded-3xl border border-white/90 overflow-hidden flex flex-col shadow-xl hover:shadow-2xl transition-all group text-slate-900"
              >
                {/* Media Thumbnail Container */}
                <div className="relative h-48 bg-black/60 overflow-hidden">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  {item.videoUrl && (
                    <button
                      onClick={() => setPreviewVideoUrl(item.videoUrl || null)}
                      className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#ef4d23] hover:bg-[#d83f17] text-white flex items-center justify-center shadow-2xl cursor-pointer transform hover:scale-110 transition-all"
                    >
                      <Play className="h-6 w-6 ml-1 fill-current" />
                    </button>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                      {item.type}
                    </span>
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">
                      v{item.current_version}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <Badge
                      variant={
                        item.status === "approved"
                          ? "success"
                          : item.status === "rejected"
                          ? "destructive"
                          : "warning"
                      }
                      className="uppercase text-[9px] font-black tracking-wider px-2.5 py-1"
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm line-clamp-2">{item.title}</h3>
                    <p className="text-[11px] text-slate-600 font-semibold mt-1">
                      Submitted on {new Date(item.submitted_at).toLocaleDateString()}
                    </p>

                    {item.client_comment && (
                      <div className="mt-3 bg-red-50 p-3 rounded-2xl border border-red-200 text-xs text-red-700 font-semibold">
                        <span className="text-[10px] font-extrabold text-red-600 block mb-0.5">Rejection Comment:</span>
                        "{item.client_comment}"
                      </div>
                    )}
                  </div>

                  {/* Actions & Version History */}
                  <div className="pt-3 border-t border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => setHistoryModalItem(item)}
                        className="text-[11px] font-extrabold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <History className="h-3.5 w-3.5 text-[#ef4d23]" />
                        <span>Version History ({item.history.length})</span>
                      </button>

                      {item.status === "pending" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveCreative(item.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectModalItem(item)}
                            className="bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shadow-xs cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE #5: BUSINESS LEADS */}
      {/* ========================================================================= */}
      {currentTab === "leads" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/80 p-5 rounded-3xl border border-white/90 backdrop-blur-3xl shadow-xl text-slate-900">
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#ef4d23]" />
                <h2 className="text-xl font-extrabold text-slate-900">Business Leads Directory</h2>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Leads collected through active ad campaigns for <strong className="text-slate-900">{clientCompany}</strong>. Filter, search, and export.
              </p>
            </div>

            <button
              onClick={handleExportLeadsCsv}
              className="bg-[#ef4d23] hover:bg-[#d83f17] text-white px-5 py-2.5 rounded-2xl text-xs font-extrabold shadow-lg shadow-[#ef4d23]/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Export Leads to CSV</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/80 p-4 rounded-3xl border border-white/90 backdrop-blur-xl shadow-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={leadSearchQuery}
                onChange={(e) => setLeadSearchQuery(e.target.value)}
                placeholder="Search leads by name, email, phone..."
                className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#ef4d23] shadow-xs"
              />
            </div>

            <div>
              <select
                value={leadFilterTemp}
                onChange={(e) => setLeadFilterTemp(e.target.value)}
                className="w-full bg-white text-slate-900 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-xs font-extrabold focus:outline-none focus:border-[#ef4d23] shadow-xs"
              >
                <option value="all" className="bg-white text-slate-900">Filter by Temperature (All)</option>
                <option value="hot" className="bg-white text-slate-900">Hot Lead</option>
                <option value="warm" className="bg-white text-slate-900">Warm Lead</option>
                <option value="cold" className="bg-white text-slate-900">Cold Lead</option>
                <option value="converted" className="bg-white text-slate-900">Converted</option>
              </select>
            </div>

            <div>
              <select
                value={leadFilterDate}
                onChange={(e) => setLeadFilterDate(e.target.value)}
                className="w-full bg-white text-slate-900 border border-slate-200/90 rounded-2xl px-3.5 py-2.5 text-xs font-extrabold focus:outline-none focus:border-[#ef4d23] shadow-xs"
              >
                <option value="all" className="bg-white text-slate-900">Date Range (All Time)</option>
                <option value="7days" className="bg-white text-slate-900">Last 7 Days</option>
                <option value="30days" className="bg-white text-slate-900">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* Leads Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead Name & Contact</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Campaign Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Est. Value</TableHead>
                <TableHead>Date Collected</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myClientLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div>
                      <p className="font-extrabold text-slate-900 text-xs">{lead.lead_name}</p>
                      <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
                        {lead.email} • {lead.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-800 font-extrabold">{lead.city}</TableCell>
                  <TableCell className="text-xs text-slate-800 font-extrabold">{lead.campaign_source}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        lead.temperature === "hot"
                          ? "destructive"
                          : lead.temperature === "warm"
                          ? "warning"
                          : lead.temperature === "converted"
                          ? "success"
                          : "secondary"
                      }
                      className="uppercase text-[9px] font-black"
                    >
                      {lead.temperature}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-black text-emerald-700">
                    ₹{lead.estimated_deal_value_rupees.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 font-semibold">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE #6: REPORTS & CAMPAIGN PERFORMANCE (READ-ONLY) */}
      {/* ========================================================================= */}
      {currentTab === "reports" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/80 p-5 rounded-3xl border border-white/90 backdrop-blur-3xl shadow-xl text-slate-900">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#ef4d23]" />
                <h2 className="text-xl font-extrabold text-slate-900">Campaign Performance & ROAS Analytics</h2>
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                Read-only analytics view. Internal agency profit margins and ad costs are restricted under client role policies.
              </p>
            </div>
            <span className="bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
              Live Channel Feed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <RigidGlassMetricCard title="Blended ROAS" value="4.42x" caption="Target: 3.50x" variant="context" />
            <RigidGlassMetricCard title="Monthly Ad Spend" value="₹4,80,000" caption="Meta & Google" variant="speed" />
            <RigidGlassMetricCard title="Total Orders" value="1,240" caption="CPA: ₹387" variant="emerald" />
            <RigidGlassMetricCard title="Impressions" value="2.4M Views" caption="3.8% Avg CTR" variant="connections" />
          </div>

          {/* Ad Channel Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-3xl p-5 rounded-3xl border border-white/90 shadow-xl space-y-3 text-slate-900">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center justify-between">
                <span>Meta Ads (FB & Insta)</span>
                <span className="text-xs text-emerald-700 font-black">4.8x ROAS</span>
              </h3>
              <p className="text-xs text-slate-600 font-semibold">Total Spend: ₹2,90,000 • 890 Conversions</p>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/80">
                <div className="bg-[#ef4d23] h-full w-[65%]" />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-3xl p-5 rounded-3xl border border-white/90 shadow-xl space-y-3 text-slate-900">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center justify-between">
                <span>Google Search & Shopping</span>
                <span className="text-xs text-emerald-700 font-black">3.9x ROAS</span>
              </h3>
              <p className="text-xs text-slate-600 font-semibold">Total Spend: ₹1,40,000 • 280 Conversions</p>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/80">
                <div className="bg-blue-600 h-full w-[45%]" />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-3xl p-5 rounded-3xl border border-white/90 shadow-xl space-y-3 text-slate-900">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center justify-between">
                <span>TikTok & UGC Reels</span>
                <span className="text-xs text-emerald-700 font-black">5.2x ROAS</span>
              </h3>
              <p className="text-xs text-slate-600 font-semibold">Total Spend: ₹50,000 • 170 Conversions</p>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/80">
                <div className="bg-purple-600 h-full w-[80%]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE #7: NOTIFICATIONS FEED */}
      {/* ========================================================================= */}
      {currentTab === "notifications" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white/80 p-5 rounded-3xl border border-white/90 backdrop-blur-3xl shadow-xl text-slate-900">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Notifications & Account Alerts</h2>
              <p className="text-xs text-slate-600 mt-1">Real-time alerts for new leads, creative approvals, and campaign milestones.</p>
            </div>
            <button
              onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
              className="text-xs font-extrabold text-[#ef4d23] hover:underline cursor-pointer"
            >
              Mark All as Read
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-3xl border transition-all flex items-start gap-4 ${
                  n.read
                    ? "bg-white/70 border-white/80 text-slate-700 backdrop-blur-xl shadow-md"
                    : "bg-white/95 border-[#ef4d23]/40 text-slate-900 shadow-xl ring-1 ring-[#ef4d23]/30 backdrop-blur-3xl"
                }`}
              >
                <div className="p-2.5 rounded-2xl bg-[#ef4d23]/10 border border-[#ef4d23]/30 text-[#ef4d23] shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-slate-900">{n.title}</h3>
                    <span className="text-[10px] font-bold text-slate-500">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE #8: PROFILE & ACCOUNT SETTINGS (LOGIN HISTORY) */}
      {/* ========================================================================= */}
      {currentTab === "profile" && (
        <div className="space-y-6">
          <div className="bg-white/80 p-5 rounded-3xl border border-white/90 backdrop-blur-3xl shadow-xl text-slate-900">
            <h2 className="text-xl font-extrabold text-slate-900">Profile & Security Settings</h2>
            <p className="text-xs text-slate-600 mt-1">Manage credentials and inspect your login session audit history.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Account Card */}
            <div className="bg-white/80 backdrop-blur-3xl p-6 rounded-3xl border border-white/90 shadow-xl space-y-4 text-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#ef4d23] text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-[#ef4d23]/30">
                  {clientName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{clientName}</h3>
                  <p className="text-xs text-slate-600 font-semibold">{clientCompany}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-3 border-t border-slate-200/80">
                <p className="text-slate-600 font-semibold">Email: <span className="font-extrabold text-slate-900">{userEmail}</span></p>
                <p className="text-slate-600 font-semibold">Role: <span className="font-extrabold text-slate-900">Verified Client Account</span></p>
                <p className="text-slate-600 font-semibold">DPDP Consent: <span className="font-black text-emerald-700">Accepted (v1.0)</span></p>
              </div>
            </div>

            {/* Password Form */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-3xl p-6 rounded-3xl border border-white/90 shadow-xl space-y-4 text-slate-900">
              <h3 className="font-extrabold text-slate-900 text-sm">Change Account Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-800 block mb-1.5 font-bold">Current Password</label>
                  <input
                    type="password"
                    value={currPass}
                    onChange={(e) => setCurrPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200/90 rounded-2xl px-4 py-2.5 font-semibold focus:outline-none focus:border-[#ef4d23] shadow-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-800 block mb-1.5 font-bold">New Password</label>
                    <input
                      type="password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200/90 rounded-2xl px-4 py-2.5 font-semibold focus:outline-none focus:border-[#ef4d23] shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-800 block mb-1.5 font-bold">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200/90 rounded-2xl px-4 py-2.5 font-semibold focus:outline-none focus:border-[#ef4d23] shadow-xs"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-[#ef4d23] hover:bg-[#d83f17] text-white px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-lg shadow-[#ef4d23]/30 cursor-pointer"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>

          {/* Own Login History Table */}
          <div className="bg-white/80 backdrop-blur-3xl rounded-3xl border border-white/90 p-6 space-y-4 shadow-xl text-slate-900">
            <h3 className="font-extrabold text-slate-900 text-sm">Your Account Login Audit History</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Device & Browser Specs</TableHead>
                  <TableHead>Auth Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loginHistory.map((lh) => (
                  <TableRow key={lh.id}>
                    <TableCell className="text-xs text-slate-700 font-semibold">
                      {new Date(lh.login_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-emerald-700 font-black">{lh.ip_address}</TableCell>
                    <TableCell className="text-xs text-slate-700 font-medium">{lh.device_browser}</TableCell>
                    <TableCell>
                      <Badge
                        variant={lh.status === "success" ? "success" : "warning"}
                        className="uppercase text-[9px] font-black"
                      >
                        {lh.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE #10: SUPPORT / DPDP ACT 2023 GRIEVANCE CONTACT */}
      {/* ========================================================================= */}
      {currentTab === "support" && (
        <div className="space-y-6">
          <div className="bg-white/80 p-5 rounded-3xl border border-white/90 backdrop-blur-3xl shadow-xl text-slate-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-[#ef4d23]" />
              <h2 className="text-xl font-extrabold text-slate-900">Support & Data Rights (DPDP Act 2023)</h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Contact our designated Grievance Officer or submit data access / erasure requests under India's Digital Personal Data Protection Act, 2023.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Grievance Officer Card */}
            <div className="bg-white/80 backdrop-blur-3xl p-6 rounded-3xl border border-white/90 shadow-xl space-y-4 text-slate-900">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#ef4d23]">Statutory Grievance Officer</h3>
              <div className="space-y-2 text-xs text-slate-700">
                <p><strong className="text-slate-900">Officer Name:</strong> Sahit Sai</p>
                <p><strong className="text-slate-900">Designation:</strong> Data Protection Lead</p>
                <p><strong className="text-slate-900">Email:</strong> privacy@lumenandco.in</p>
                <p><strong className="text-slate-900">Direct Phone:</strong> +91 98490 00000</p>
                <p><strong className="text-slate-900">Address:</strong> Level 4, Jubilee Hills, Hyderabad 500033</p>
              </div>
            </div>

            {/* Submit Query Form */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-3xl p-6 rounded-3xl border border-white/90 shadow-xl space-y-4 text-slate-900">
              <h3 className="font-extrabold text-slate-900 text-sm">Submit Data Request / Support Ticket</h3>
              <form onSubmit={handleSendSupportQuery} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-800 block mb-1.5 font-bold">Request Category</label>
                  <select
                    value={supportCategory}
                    onChange={(e) => setSupportCategory(e.target.value)}
                    className="w-full bg-white text-slate-900 border border-slate-200/90 rounded-2xl px-4 py-2.5 font-semibold focus:outline-none focus:border-[#ef4d23] shadow-xs"
                  >
                    <option value="dpdp_data_request" className="bg-white text-slate-900">DPDP Data Access / Copy Request</option>
                    <option value="dpdp_correction" className="bg-white text-slate-900">DPDP Data Correction Request</option>
                    <option value="dpdp_erasure" className="bg-white text-slate-900">DPDP Erasure / Deletion Request</option>
                    <option value="agency_support" className="bg-white text-slate-900">General Campaign Support</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-800 block mb-1.5 font-bold">Subject</label>
                  <input
                    type="text"
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    placeholder="e.g. Request copy of client audit logs"
                    className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200/90 rounded-2xl px-4 py-2.5 font-semibold focus:outline-none focus:border-[#ef4d23] shadow-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-800 block mb-1.5 font-bold">Message / Request Details</label>
                  <textarea
                    rows={4}
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Provide details regarding your request..."
                    className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200/90 rounded-2xl px-4 py-2.5 font-semibold focus:outline-none focus:border-[#ef4d23] shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#ef4d23] hover:bg-[#d83f17] text-white px-6 py-3 rounded-2xl font-bold text-xs transition-all shadow-lg shadow-[#ef4d23]/30 flex items-center gap-2 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Transmit Ticket to Grievance Officer</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Default Fallback for other tabs (invoices, scope, creatives) */}
      {(currentTab === "creatives" || currentTab === "invoices" || currentTab === "scope") && (
        <div className="bg-white/80 backdrop-blur-3xl p-8 rounded-3xl border border-white/90 text-center space-y-4 shadow-xl text-slate-900">
          <Sparkles className="h-12 w-12 text-[#ef4d23] mx-auto animate-bounce" />
          <h2 className="text-xl font-extrabold text-slate-900 capitalize">{currentTab} Section</h2>
          <p className="text-xs text-slate-600 font-semibold max-w-md mx-auto">
            This module is active under your retainer package. All assets, deliverables, and documents are synchronized with the agency delivery hub.
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AUXILIARY MODALS */}
      {/* ========================================================================= */}

      {/* 1. Rejection Comment Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white/95 border border-white/90 rounded-3xl p-6 space-y-4 text-slate-900 shadow-2xl backdrop-blur-3xl">
            <h3 className="font-extrabold text-base text-slate-900">Provide Rejection Feedback</h3>
            <p className="text-xs text-slate-600 font-semibold">
              Please explain what changes or revisions are needed for "{rejectModalItem.title}".
            </p>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Please add promo code overlay in first 3 seconds..."
              className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200/90 rounded-2xl p-3 text-xs font-semibold focus:outline-none focus:border-red-500 shadow-xs"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectModalItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-extrabold text-slate-700 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejectCreative}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-extrabold text-white shadow-md cursor-pointer transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Version History Modal */}
      {historyModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white/95 border border-white/90 rounded-3xl p-6 space-y-4 text-slate-900 max-h-[85vh] flex flex-col shadow-2xl backdrop-blur-3xl">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Version History Timeline</h3>
              <button onClick={() => setHistoryModalItem(null)} className="text-slate-500 hover:text-slate-900 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {historyModalItem.history.map((ver) => (
                <div key={ver.version} className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#ef4d23] text-xs">Version v{ver.version}</span>
                    <Badge
                      variant={ver.status === "approved" ? "success" : ver.status === "rejected" ? "destructive" : "warning"}
                      className="uppercase text-[9px] font-black"
                    >
                      {ver.status}
                    </Badge>
                  </div>
                  <p className="text-slate-800 font-semibold">{ver.notes}</p>
                  {ver.feedback && (
                    <div className="bg-red-50 border border-red-200 p-2.5 rounded-xl text-red-700 text-[11px] font-bold">
                      <strong>Feedback:</strong> "{ver.feedback}"
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500 font-medium text-right">
                    Submitted: {new Date(ver.submitted_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Video Player Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-black border border-white/20 rounded-3xl overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setPreviewVideoUrl(null)}
              className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black p-2 rounded-full text-white border border-white/20 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <video src={previewVideoUrl} controls autoPlay className="w-full max-h-[75vh] object-contain" />
          </div>
        </div>
      )}

      {/* 4. Persistent Footer Policy Reader Modals */}
      {viewPolicyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white/95 border border-white/90 rounded-3xl p-6 space-y-4 text-slate-900 max-h-[90vh] flex flex-col shadow-2xl backdrop-blur-3xl">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900">
                {viewPolicyModal === "privacy" ? LUMEN_POLICY_CONTENT_V1.privacy_policy.title : LUMEN_POLICY_CONTENT_V1.terms_of_service.title}
              </h3>
              <button onClick={() => setViewPolicyModal(null)} className="text-slate-500 hover:text-slate-900 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-xs">
              {(viewPolicyModal === "privacy"
                ? LUMEN_POLICY_CONTENT_V1.privacy_policy.sections
                : LUMEN_POLICY_CONTENT_V1.terms_of_service.sections
              ).map((sec) => (
                <div key={sec.section_number} className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                  <h4 className="font-extrabold text-[#ef4d23]">
                    {sec.section_number}. {sec.title}
                  </h4>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed font-medium">{sec.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ClientLayoutShell>
  );
}
