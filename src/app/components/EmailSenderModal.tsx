import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { sendRealtimeEmail } from "@/lib/email.functions";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  FileText,
  CreditCard,
  Rocket,
  BarChart3,
  Eye,
  Edit3,
  Copy,
  User,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export interface EmailTemplate {
  id: "otp" | "proposal" | "invoice" | "launch" | "report" | "custom";
  label: string;
  badge: string;
  icon: typeof KeyRound;
  subject: string;
  body: string;
}

export const PREMADE_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "otp",
    label: "Client OTP Code",
    badge: "Authentication",
    icon: KeyRound,
    subject: "🔐 Client Portal Access & OTP Verification Code — Lumen & Co",
    body: `Hello {client_name},\n\nYour 6-digit access passcode for the Lumen & Co Client Portal is:\n\n🔐 OTP PASSCODE: 849201\n\nThis passcode expires in 10 minutes. Click below to enter your passcode and view your live campaign leads, video deliverables, and invoices.\n\n🌐 Login URL: https://lumenandco.in/client\n\nBest regards,\nLumen & Co Digital Marketing Agency`,
  },
  {
    id: "proposal",
    label: "Retainer Proposal",
    badge: "Sales & SLA",
    icon: FileText,
    subject: "📄 Omnichannel Marketing Retainer Proposal & SLA Audit — Lumen & Co",
    body: `Dear {client_name} Team,\n\nWe have prepared your customized growth retainer proposal for Q4 2026.\n\n💼 Monthly Retainer: ₹1,50,000 / month\n📦 Deliverables Included:\n• 12 High-Conversion UGC Video Reels & Motion Ads\n• Full Meta & Google Ads Media Buying Strategy\n• Weekly Creative Testing & Copy Scripts\n• Real-Time Lead Portal & Dedicated Account Manager\n\nPlease review your proposal deck and authorize the launch sequence inside your Client Portal.\n\nBest regards,\nSahit Sai — Founder, Lumen & Co`,
  },
  {
    id: "invoice",
    label: "Tax Invoice Notice",
    badge: "Billing & GST",
    icon: CreditCard,
    subject: "💳 Tax Invoice INV-2026-892 Notice — Lumen & Co Retainer",
    body: `Dear {client_name},\n\nYour monthly performance marketing retainer invoice INV-2026-892 (₹1,50,000.00 incl. 18% GST) is now available for download.\n\n🏦 Direct Bank Transfer Details:\n• Account Name: Lumen & Co Digital Private Limited\n• Bank Name: Axis Bank Ltd\n• Account No: 924020048192014\n• IFSC Code: UTIB0000849\n• UPI VPA: lumenandco@axisbank\n\nPlease find the tax invoice PDF attached in your Client Portal.\n\nThank you for partnering with Lumen & Co!`,
  },
  {
    id: "launch",
    label: "Campaign Launch Alert",
    badge: "Operations",
    icon: Rocket,
    subject: "🚀 Deliverables Approved — Campaign Launch Sequence Initiated",
    body: `Hi {client_name},\n\nGreat news! Your latest UGC Video Reels and Meta Ad Sets have been approved and moved into active launch deployment.\n\nOur media buyers are scaling ad budget guardrails with real-time conversion tracking.\n\nYou can view incoming customer inquiries live in your Client Portal.\n\nBest regards,\nLumen & Co Operations Team`,
  },
  {
    id: "report",
    label: "Weekly ROAS Report",
    badge: "Analytics",
    icon: BarChart3,
    subject: "📊 Weekly Campaign Performance & ROAS Summary — Lumen & Co",
    body: `Dear {client_name},\n\nHere is your weekly campaign performance summary:\n\n📈 Blended ROAS: 4.2x (+18% WoW)\n🔥 Hot Customer Leads Generated: 42 Inquiries\n💰 Total Sales Value Converted: ₹4,85,000\n⚡ Avg Cost Per Lead: ₹184 / lead\n\nA full detailed breakdown is available in your PowerBI analytics dashboard.\n\nBest regards,\nLumen & Co Growth Team`,
  },
  {
    id: "custom",
    label: "Custom Email",
    badge: "Blank Canvas",
    icon: Edit3,
    subject: "Message from Lumen & Co Agency",
    body: `Hi {client_name},\n\nWrite your custom update message here...\n\nBest regards,\nLumen & Co Team`,
  },
];

export const QUICK_RECIPIENTS = [
  { label: "Sahit Sai (Owner)", email: "sahitsai7@gmail.com" },
  { label: "Northbeam E-Commerce", email: "mark@northbeam.io" },
  { label: "Bloom Skincare", email: "sneha@bloomskin.in" },
  { label: "UrbanFit Apparel", email: "arjun@urbanfit.co" },
  { label: "ABC School", email: "admin@abcschool.edu" },
];

export default function EmailSenderModal({
  isOpen,
  onClose,
  defaultRecipient = "sahitsai7@gmail.com",
  defaultSubject = "Client Portal Access & OTP Verification Code — Lumen & Co",
  defaultMessage = "",
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultRecipient?: string;
  defaultSubject?: string;
  defaultMessage?: string;
}) {
  const sendEmail = useServerFn(sendRealtimeEmail);

  const [to, setTo] = useState(defaultRecipient);
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState(
    defaultMessage || PREMADE_EMAIL_TEMPLATES[0].body
  );
  const [activeTemplateId, setActiveTemplateId] = useState<string>("otp");
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const applyTemplate = (tmpl: EmailTemplate) => {
    setActiveTemplateId(tmpl.id);
    setSubject(tmpl.subject);
    setMessage(tmpl.body);
    setStatus(null);
    toast.info(`Applied "${tmpl.label}" template`);
  };

  const insertVariable = (varTag: string) => {
    setMessage((prev) => `${prev} ${varTag}`);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim() || !subject.trim() || !message.trim()) {
      toast.error("Please fill in all required email fields.");
      return;
    }

    setLoading(true);
    setStatus(null);

    const formattedHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0f1015; padding: 32px 16px; color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; background: #161722; border-radius: 24px; border: 1px solid rgba(255,255,255,0.15); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <!-- Header Bar -->
          <div style="background: linear-gradient(135deg, #181924 0%, #0e0f14 100%); padding: 24px 32px; border-b: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h1 style="color: #ef4d23; font-size: 22px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">LUMEN & CO AGENCY</h1>
              <p style="color: rgba(255,255,255,0.5); font-size: 11px; margin: 4px 0 0 0; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;">Real-Time Dispatch Engine</p>
            </div>
          </div>

          <!-- Body Content -->
          <div style="padding: 32px; font-size: 14px; line-height: 1.7; color: #e2e8f0;">
            <p style="font-size: 12px; color: #94a3b8; margin-bottom: 20px; padding: 8px 14px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); display: inline-block;">
              <strong>Recipient:</strong> ${to}
            </p>
            <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.7; color: #f8fafc;">${message}</div>
          </div>

          <!-- Footer Bar -->
          <div style="background: #0f1015; padding: 20px 32px; text-align: center; border-t: 1px solid rgba(255,255,255,0.1);">
            <p style="font-size: 11px; color: #64748b; margin: 0;">Sent securely via Lumen & Co Real-Time Mail Engine • sahitsai6@gmail.com</p>
            <p style="font-size: 10px; color: #475569; margin-top: 4px;">© 2026 Lumen & Co Digital Marketing Agency. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    try {
      const res = await sendEmail({
        data: {
          to: to.trim().toLowerCase(),
          subject: subject.trim(),
          html: formattedHtml,
          text: message,
        },
      });

      setLoading(false);
      if (res.success) {
        setStatus({
          type: "success",
          text: `Email successfully delivered to ${to}! Message ID: msg_${Date.now().toString(36)}`,
        });
        toast.success(`Real-time email dispatched to ${to}`);
      } else {
        setStatus({
          type: "error",
          text: res.message || "Failed to send email. Please check recipient format.",
        });
      }
    } catch (err: unknown) {
      setLoading(false);
      const errMsg = err instanceof Error ? err.message : String(err);
      setStatus({
        type: "error",
        text: `Dispatch Error: ${errMsg}`,
      });
      toast.error("Error dispatching real-time email.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dispatch Real-Time Email" maxWidth="max-w-3xl">
      <form onSubmit={handleSend} className="space-y-5 text-xs">
        {/* Header Sender Info & Badge */}
        <div className="bg-gradient-to-r from-[#181924] via-[#12131a] to-[#0c0d12] text-white p-4 sm:p-5 rounded-3xl border border-white/20 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#ef4d23] text-white rounded-2xl shadow-lg shadow-[#ef4d23]/40 border border-white/20">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                  Verified Sender Account
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  LIVE API ACTIVE
                </span>
              </div>
              <p className="font-extrabold text-base text-white mt-0.5">sahitsai6@gmail.com</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-2xl border border-white/20">
            <button
              type="button"
              onClick={() => setMode("edit")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === "edit" ? "bg-[#ef4d23] text-white shadow-md" : "text-white/70 hover:text-white"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Content
            </button>
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === "preview" ? "bg-[#ef4d23] text-white shadow-md" : "text-white/70 hover:text-white"
              }`}
            >
              <Eye className="h-3.5 w-3.5" /> HTML Preview
            </button>
          </div>
        </div>

        {/* Premade Template Cards */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-extrabold text-neutral-900 flex items-center gap-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#ef4d23]" /> Premade Email Templates (1-Click Select)
            </label>
            <span className="text-[11px] text-neutral-500 font-medium">Select to auto-fill subject & body</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {PREMADE_EMAIL_TEMPLATES.map((tmpl) => {
              const Icon = tmpl.icon;
              const isActive = activeTemplateId === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => applyTemplate(tmpl)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-20 ${
                    isActive
                      ? "bg-[#ef4d23] text-white border-[#ef4d23] shadow-lg shadow-[#ef4d23]/30 scale-[1.02]"
                      : "bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200 shadow-xs hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#ef4d23]"}`} />
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        isActive ? "bg-white/30 text-white" : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {tmpl.badge}
                    </span>
                  </div>
                  <p className="font-extrabold text-[11px] truncate mt-1">{tmpl.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode 1: EDIT MODE */}
        {mode === "edit" && (
          <div className="space-y-4">
            {/* Quick Recipient Chips */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-neutral-800">Recipient Email (To)</label>
                <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                  <User className="h-3 w-3 text-neutral-400" /> Quick select:
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {QUICK_RECIPIENTS.map((rec) => (
                  <button
                    key={rec.email}
                    type="button"
                    onClick={() => {
                      setTo(rec.email);
                      toast.info(`Recipient set to ${rec.label}`);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                      to === rec.email
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200"
                    }`}
                  >
                    {rec.label}
                  </button>
                ))}
              </div>

              <input
                type="email"
                required
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="sahitsai7@gmail.com or client@company.com"
                className="w-full bg-white border border-neutral-300 rounded-2xl p-3 font-semibold text-neutral-900 focus:ring-2 focus:ring-[#ef4d23] focus:outline-none shadow-xs text-xs"
              />
            </div>

            {/* Subject Input */}
            <div>
              <label className="block font-bold text-neutral-800 mb-1">Subject Line</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. 🔐 Client Portal Access & OTP Code"
                className="w-full bg-white border border-neutral-300 rounded-2xl p-3 font-semibold text-neutral-900 focus:ring-2 focus:ring-[#ef4d23] focus:outline-none shadow-xs text-xs"
              />
            </div>

            {/* Message Body & Variable Chips */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-neutral-800">Email Body Content</label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-neutral-400 font-semibold">Insert Tag:</span>
                  {["{client_name}", "{otp_code}", "{amount}", "{portal_url}"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => insertVariable(tag)}
                      className="text-[10px] font-mono bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold px-2 py-0.5 rounded-lg border border-neutral-200 transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-neutral-900 text-neutral-100 border border-neutral-700 rounded-2xl p-3.5 font-mono text-xs leading-relaxed focus:ring-2 focus:ring-[#ef4d23] focus:outline-none shadow-inner"
              />
            </div>
          </div>
        )}

        {/* Mode 2: LIVE HTML PREVIEW MODE */}
        {mode === "preview" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-neutral-500 text-[11px] font-medium">
              <span>Previewing formatted HTML mail layout before sending:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> High Deliverability Guaranteed
              </span>
            </div>

            <div className="bg-[#0f1015] p-6 rounded-3xl border border-neutral-800 shadow-2xl text-white max-h-72 overflow-y-auto">
              <div className="max-w-xl mx-auto bg-[#161722] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                <div className="bg-gradient-to-r from-[#181924] to-[#0e0f14] p-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-[#ef4d23] font-extrabold text-sm tracking-tight">LUMEN & CO AGENCY</h4>
                    <p className="text-[9px] text-white/50 font-bold uppercase tracking-wider">Official Real-Time Email</p>
                  </div>
                  <span className="bg-[#ef4d23]/20 text-[#fed7aa] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#ef4d23]/30">
                    Live Preview
                  </span>
                </div>

                <div className="p-5 text-neutral-200 text-xs leading-relaxed">
                  <p className="text-[11px] text-neutral-400 mb-3 bg-white/5 p-2 rounded-xl border border-white/10 inline-block font-mono">
                    <strong>Subject:</strong> {subject}
                  </p>
                  <div className="whitespace-pre-wrap font-sans text-xs text-white leading-relaxed">{message}</div>
                </div>

                <div className="bg-[#0f1015] p-3 text-center border-t border-white/10 text-[10px] text-neutral-400">
                  Sent securely via Lumen & Co Real-Time Mail Engine • sahitsai6@gmail.com
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Callout */}
        {status && (
          <div
            className={`p-3.5 rounded-2xl border flex items-start gap-3 text-xs font-semibold ${
              status.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                : "bg-red-50 border-red-300 text-red-950"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-bold text-xs">{status.type === "success" ? "Email Dispatched Successfully!" : "Dispatch Error"}</p>
              <p className="text-[11px] font-medium mt-0.5 opacity-90">{status.text}</p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-neutral-200">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium">
            <Zap className="h-3.5 w-3.5 text-[#ef4d23]" /> Real-time Node Mailer Service Active
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl text-xs font-bold">
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={loading}
              className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-lg shadow-[#ef4d23]/30 cursor-pointer flex items-center gap-1.5"
            >
              <Send className="h-4 w-4" /> Dispatch Real-Time Email
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
