import { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Send, MessageSquare, Mail, AlertTriangle, CheckCircle2 } from "lucide-react";
import { BillingInvoice, SchoolClient, MessageTemplate, CommLogEntry, CommChannel } from "@/lib/lumenandco.types";

interface AutoMessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: BillingInvoice | null;
  client: SchoolClient | null;
  templates: MessageTemplate[];
  senderName: string;
  onSendMessage: (entry: CommLogEntry) => void;
}

export default function AutoMessagingModal({
  isOpen,
  onClose,
  invoice,
  client,
  templates,
  senderName,
  onSendMessage,
}: AutoMessagingModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [channel, setChannel] = useState<CommChannel>("whatsapp");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (invoice && client && isOpen) {
      // Pick template based on overdue days
      const days = invoice.overdue_days;
      const matched =
        templates.find((t) => days >= t.trigger_days_overdue) || templates[0];

      if (matched) {
        setSelectedTemplateId(matched.id);
        setChannel(matched.channel === "whatsapp" ? "whatsapp" : "email");
        populateTemplate(matched, invoice, client);
      }

      setRecipient(
        matched?.channel === "whatsapp" ? client.phone : client.email
      );
    }
  }, [invoice, client, isOpen, templates]);

  const populateTemplate = (
    tmpl: MessageTemplate,
    inv: BillingInvoice,
    cl: SchoolClient
  ) => {
    let text = tmpl.body_template;
    text = text.replace(/{CONTACT_NAME}/g, cl.contact_person || "Partner");
    text = text.replace(/{SCHOOL_NAME}/g, cl.school_name);
    text = text.replace(/{AMOUNT}/g, inv.amount_rupees.toLocaleString());
    text = text.replace(/{INVOICE_NUM}/g, inv.invoice_number);
    text = text.replace(/{DUE_DATE}/g, inv.due_date);

    setBody(text);

    if (tmpl.subject) {
      let subj = tmpl.subject;
      subj = subj.replace(/{SCHOOL_NAME}/g, cl.school_name);
      subj = subj.replace(/{INVOICE_NUM}/g, inv.invoice_number);
      setSubject(subj);
    } else {
      setSubject(`Lumen & Co Retainer Payment Reminder — ${cl.school_name}`);
    }
  };

  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(id);
    const tmpl = templates.find((t) => t.id === id);
    if (tmpl && invoice && client) {
      setChannel(tmpl.channel === "whatsapp" ? "whatsapp" : "email");
      setRecipient(tmpl.channel === "whatsapp" ? client.phone : client.email);
      populateTemplate(tmpl, invoice, client);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice || !client || !body.trim()) return;

    const entry: CommLogEntry = {
      id: `comm-${Date.now()}`,
      client_id: client.id,
      school_name: client.school_name,
      channel,
      message_type: "payment_reminder",
      recipient: recipient || client.phone,
      content: subject ? `[Subject: ${subject}] ${body}` : body,
      sent_by_name: senderName,
      timestamp: new Date().toISOString(),
    };

    onSendMessage(entry);
    onClose();
  };

  if (!invoice || !client) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Dispatch Overdue Payment Reminder — ${client.school_name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium text-neutral-900">
        <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-amber-950 flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold block text-xs">{invoice.invoice_number}</span>
            <span className="text-[11px] text-amber-800">
              Amount Due: <strong>₹{invoice.amount_rupees.toLocaleString()}</strong> • Overdue by{" "}
              <strong className="text-red-700">{invoice.overdue_days} days</strong>
            </span>
          </div>

          <span className="bg-red-100 text-red-700 font-semibold px-2.5 py-1 rounded-full text-[10px]">
            🔴 OVERDUE
          </span>
        </div>

        {/* Template Selector */}
        <div>
          <label className="block text-neutral-800 font-semibold mb-1">Select Message Template</label>
          <select
            value={selectedTemplateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-medium text-neutral-900 outline-none"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} (Trigger: {t.trigger_days_overdue}+ Days)
              </option>
            ))}
          </select>
        </div>

        {/* Channel Selector */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-neutral-800 font-semibold mb-1">Channel</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setChannel("whatsapp");
                  setRecipient(client.phone);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition-all ${
                  channel === "whatsapp"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-neutral-50 text-neutral-700 border-neutral-300"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
              </button>
              <button
                type="button"
                onClick={() => {
                  setChannel("email");
                  setRecipient(client.email);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition-all ${
                  channel === "email"
                    ? "bg-[#ef4d23] text-white border-[#ef4d23] shadow-sm"
                    : "bg-neutral-50 text-neutral-700 border-neutral-300"
                }`}
              >
                <Mail className="h-3.5 w-3.5" /> Email
              </button>
            </div>
          </div>

          <div>
            <label className="block text-neutral-800 font-semibold mb-1">Recipient Contact</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-medium text-neutral-900 outline-none"
            />
          </div>
        </div>

        {channel === "email" && (
          <div>
            <label className="block text-neutral-800 font-semibold mb-1">Email Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-medium text-neutral-900 outline-none"
            />
          </div>
        )}

        <div>
          <label className="block text-neutral-800 font-semibold mb-1">Message Body</label>
          <textarea
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl font-normal text-neutral-900 outline-none focus:ring-2 focus:ring-[#ef4d23]"
            required
          />
        </div>

        <p className="text-[10px] text-neutral-500 italic">
          * Sending this reminder automatically logs the entry into the Central Communication Log.
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="font-medium">
            Cancel
          </Button>

          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6"
          >
            <Send className="h-3.5 w-3.5 mr-1.5" /> Dispatch Reminder & Log
          </Button>
        </div>
      </form>
    </Modal>
  );
}
