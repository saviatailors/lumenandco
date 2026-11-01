import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Eye,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  FolderDown,
  FileCode,
  FileCheck,
  X,
  UploadCloud,
  Lock,
  Sparkles,
  Building2,
  Calendar,
} from "lucide-react";

import { MSA_CONTRACT_HTML_TEMPLATE, INVOICE_HTML_TEMPLATE, fillTemplate, downloadHtmlAsPdf } from "@/lib/document-templates";

// Global in-memory cache for instant 0ms document template loading
const TEMPLATE_CACHE: Record<string, string> = {};

export interface VaultDocument {
  id: string;
  title: string;
  category: "contracts" | "reports" | "brand" | "legal";
  clientName: string;
  fileSize: string;
  fileType: "pdf" | "zip" | "docx" | "xlsx";
  uploadedAt: string;
  status: "Signed" | "Active SLA" | "Verified" | "Action Required" | "Compliant";
  description: string;
  templateType?: "msa" | "invoice" | "sow" | "custom";
  templatePath?: string;
  rawHtmlOverride?: string;
  customPlaceholders?: Record<string, string>;
}

const INITIAL_DOCUMENTS: VaultDocument[] = [];

interface DocumentVaultViewProps {
  isClientView?: boolean;
  clientName?: string;
  clientCompany?: string;
  clientEmail?: string;
}

export default function DocumentVaultView({
  isClientView = false,
  clientName = "Mark Davis",
  clientCompany = "Northbeam E-Commerce",
  clientEmail = "mark@northbeam.io",
}: DocumentVaultViewProps) {
  const [documents, setDocuments] = useState<VaultDocument[]>(INITIAL_DOCUMENTS);

  // Pre-load all template HTML files into memory on mount for instant 0ms preview & editing
  useEffect(() => {
    INITIAL_DOCUMENTS.forEach(async (doc) => {
      if (doc.templatePath && !TEMPLATE_CACHE[doc.templatePath]) {
        try {
          const res = await fetch(doc.templatePath);
          if (res.ok) {
            TEMPLATE_CACHE[doc.templatePath] = await res.text();
          }
        } catch (e) {}
      }
    });
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [previewDoc, setPreviewDoc] = useState<VaultDocument | null>(null);
  const [previewHtmlText, setPreviewHtmlText] = useState<string | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // CRM Edit & Customize Document Details Modal state
  const [editDoc, setEditDoc] = useState<VaultDocument | null>(null);
  const [editTab, setEditTab] = useState<"fields" | "code">("fields");
  const [editTitle, setEditTitle] = useState("");
  const [editClientName, setEditClientName] = useState("");
  const [editClientCompany, setEditClientCompany] = useState("");
  const [editClientEmail, setEditClientEmail] = useState("");
  const [editClientSector, setEditClientSector] = useState("");
  const [editInvoiceNo, setEditInvoiceNo] = useState("LC/26-27/202");
  const [editRetainerFee, setEditRetainerFee] = useState("₹2,50,000 / mo");
  const [editTotalAmount, setEditTotalAmount] = useState("₹2,50,000");
  const [editScope, setEditScope] = useState("");
  const [editStatus, setEditStatus] = useState<VaultDocument["status"]>("Signed");
  const [editDate, setEditDate] = useState("2026-09-25");
  const [editPhone, setEditPhone] = useState("+91 98765 43210");
  const [editAddress, setEditAddress] = useState("Visakhapatnam, AP, India");
  const [editState, setEditState] = useState("Andhra Pradesh");
  const [editGstin, setEditGstin] = useState("37AAAAA0000A1Z5");
  const [editMonthPeriod, setEditMonthPeriod] = useState("September 2026");
  const [editCampaignTargets, setEditCampaignTargets] = useState("150 leads / month");
  const [editCostPerLead, setEditCostPerLead] = useState("₹38 / lead");
  const [editReachTarget, setEditReachTarget] = useState("250,000 Impressions");
  const [editSignatoryName, setEditSignatoryName] = useState("Mark Davis");
  const [editSignatoryTitle, setEditSignatoryTitle] = useState("Managing Director");
  const [editAuditSummary, setEditAuditSummary] = useState("4k followers, posting twice a month, no paid ads running currently, most enquiries come from word of mouth.");
  const [editPainPoint1, setEditPainPoint1] = useState("Organic reach under 10% of total followers; no dedicated reels strategy.");
  const [editPainPoint2, setEditPainPoint2] = useState("No automated ads, forms or follow-up sequence — enquiries rely on manual outreach.");
  const [editPainPoint3, setEditPainPoint3] = useState("Brand colors, tone of voice, and ad creative templates lack visual consistency.");
  const [editPoint1, setEditPoint1] = useState("Raise budget on best performing ad set & scale top UGC reel");
  const [editPoint2, setEditPoint2] = useState("Launch 2 new UGC video ad hooks weekly to prevent ad fatigue");
  const [editPoint3, setEditPoint3] = useState("Optimize CRO checkout flow & meta pixel telemetry tracking");
  const [editGrowthInsight, setEditGrowthInsight] = useState("High-intent UGC hooks combined with automated retargeting produced a 32% increase in leads.");
  const [editRawHtml, setEditRawHtml] = useState<string>("");

  // CRM Send to Client Account Modal state
  const [sendDoc, setSendDoc] = useState<VaultDocument | null>(null);
  const [selectedClientAcc, setSelectedClientAcc] = useState<{
    name: string;
    company: string;
    email: string;
  }>({
    name: "Mark Davis",
    company: "Northbeam E-Commerce",
    email: "mark@northbeam.io",
  });
  const [sendSuccessToast, setSendSuccessToast] = useState<string | null>(null);

  const CLIENT_ACCOUNTS = [
    { name: "Mark Davis", company: "Northbeam E-Commerce", email: "mark@northbeam.io", plan: "Scale Retainer" },
    { name: "Ananya Roy", company: "Bloom Skincare", email: "ananya@bloomskincare.in", plan: "Growth Retainer" },
    { name: "Rahul Verma", company: "UrbanFit Fitness", email: "rahul@urbanfit.in", plan: "Starter Retainer" },
    { name: "Sahit Sai", company: "Lumen & Co Master", email: "sahitsai7@gmail.com", plan: "Founder Account" },
  ];

  // New Document Upload Form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"contracts" | "reports" | "brand" | "legal">("contracts");
  const [newClient, setNewClient] = useState(clientCompany);
  const [newDescription, setNewDescription] = useState("");

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const getDocHtmlContent = async (doc: VaultDocument): Promise<string> => {
    if (doc.rawHtmlOverride) {
      return doc.rawHtmlOverride;
    }

    const custom = doc.customPlaceholders || {};
    const cName = custom.CLIENT_NAME || (doc.clientName ? doc.clientName.split(" ")[0] : clientName);
    const compName = custom.COMPANY_NAME || doc.clientName || clientCompany;
    const cEmail = custom.CLIENT_EMAIL || clientEmail;
    const cSector = custom.CLIENT_SECTOR || `${compName} · Performance Marketing`;
    const invNo = custom.INVOICE_NUMBER || `LC/26-27/${doc.id.slice(-3)}`;
    const retFee = custom.RETAINER_FEE || "₹2,50,000 / mo";
    const totAmt = custom.TOTAL_AMOUNT || "₹2,50,000";
    const docDate = custom.DOCUMENT_DATE || doc.uploadedAt || "2026-09-25";
    const phone = custom.PHONE || "+91 98765 43210";
    const address = custom.ADDRESS || "Visakhapatnam, AP, India";
    const state = custom.STATE || "Andhra Pradesh";
    const gstin = custom.GSTIN || "37AAAAA0000A1Z5";
    const monthPeriod = custom.MONTH_PERIOD || "September 2026";
    const campaignTargets = custom.CAMPAIGN_TARGETS || "150 leads / month";
    const costPerLead = custom.COST_PER_LEAD || "₹38 / lead";
    const reachTarget = custom.REACH_TARGET || "250,000 Impressions";
    const signatoryName = custom.SIGNATORY_NAME || cName;
    const signatoryTitle = custom.SIGNATORY_TITLE || "Managing Director";
    const auditSummary = custom.AUDIT_SUMMARY || "4k followers, posting twice a month, no paid ads running currently, most enquiries come from word of mouth.";
    const pain1 = custom.PAIN_POINT_1 || "Organic reach under 10% of total followers; no dedicated reels strategy.";
    const pain2 = custom.PAIN_POINT_2 || "No automated ads, forms or follow-up sequence — enquiries rely on manual outreach.";
    const pain3 = custom.PAIN_POINT_3 || "Brand colors, tone of voice, and ad creative templates lack visual consistency.";
    const pt1 = custom.POINT_1 || "Raise budget on best performing ad set & scale top UGC reel";
    const pt2 = custom.POINT_2 || "Launch 2 new UGC video ad hooks weekly to prevent ad fatigue";
    const pt3 = custom.POINT_3 || "Optimize CRO checkout flow & meta pixel telemetry tracking";
    const growthInsight = custom.GROWTH_INSIGHT || "High-intent UGC hooks combined with automated retargeting produced a 32% increase in leads.";

    const replacements: Record<string, string> = {
      CLIENT_NAME: cName,
      COMPANY_NAME: compName,
      CLIENT_EMAIL: cEmail,
      CONTRACT_ID: doc.id.toUpperCase(),
      DOCUMENT_DATE: docDate,
      EFFECTIVE_DATE: docDate,
      TOTAL_AMOUNT: totAmt,
      RETAINER_FEE: retFee,
      SCOPE_SUMMARY: doc.description,
      PAYMENT_TERMS: "Net 15 days from monthly invoice issue.",
      GOVERNING_LAW: "DPDP Act 2023 & Laws of Telangana, India",
      AGENCY_SIGNATORY: "Sahit Sai (Lumen & Co)",
      CLIENT_SIGNATORY: signatoryName,
      INVOICE_NUMBER: invNo,
      DUE_DATE: custom.DUE_DATE || "2026-10-15",
      STATUS: doc.status.toUpperCase(),

      // Bracketed variations across all templates
      "[Client Name]": cName,
      "[CLIENT NAME]": compName || cName,
      "[CLIENT_NAME]": cName,
      "[COMPANY NAME]": compName,
      "[COMPANY_NAME]": compName,
      "[company name]": compName,
      "[Brand]": compName,
      "[email]": cEmail,
      "[CLIENT EMAIL]": cEmail,
      "[phone]": phone,
      "[Phone]": phone,
      "[Address]": address,
      "[Visakhapatnam]": address,
      "[State]": state,
      "[GSTIN]": gstin,
      "[001]": invNo,
      "[INVOICE NUMBER]": invNo,
      "[DD/MM/YYYY]": docDate,
      "[Date]": docDate,
      "[Month YYYY]": monthPeriod,
      "[Month]": monthPeriod,
      "[Client name · sector]": cSector,
      "[2–3 lines on the client today: e.g. 4k followers, posting twice a month, no ads running, most enquiries come from word of mouth.]": auditSummary,
      "[Posts reach under 10% of followers; no reels strategy.]": pain1,
      "[No ads, forms or follow-up — enquiries depend on luck.]": pain2,
      "[Colours, tone and templates change post to post.]": pain3,
      "[150 leads / month]": campaignTargets,
      "[Cost per lead]": costPerLead,
      "[₹38]": costPerLead,
      "[Reach in 60 days]": reachTarget,
      "[setup / month]": retFee,
      "[TOTAL AMOUNT]": totAmt,
      "[Client Signatory]": signatoryName,
      "[Name, Title]": signatoryTitle,
      "[Contact person]": cName,
      "[Point 1]": pt1,
      "[Raise budget on best ad set]": pt1,
      "[Point 1 → fix]": pt1,
      "[Point 2]": pt2,
      "[Test 2 new hooks]": pt2,
      "[Point 2 → fix]": pt2,
      "[Point 3]": pt3,
      "[Launch a lead form]": pt3,
      "[Why it worked]": growthInsight,

      // Mustache variations
      "{{CLIENT_NAME}}": cName,
      "{{COMPANY_NAME}}": compName,
      "{{CLIENT_EMAIL}}": cEmail,
      "{{INVOICE_NUMBER}}": invNo,
      "{{RETAINER_FEE}}": retFee,
      "{{TOTAL_AMOUNT}}": totAmt,
      "{{SCOPE_SUMMARY}}": doc.description,
      "{{DOCUMENT_DATE}}": docDate,
    };

    if (doc.templatePath) {
      try {
        let rawHtml = TEMPLATE_CACHE[doc.templatePath];
        if (!rawHtml) {
          const res = await fetch(doc.templatePath);
          if (res.ok) {
            rawHtml = await res.text();
            TEMPLATE_CACHE[doc.templatePath] = rawHtml;
          }
        }

        if (rawHtml) {
          Object.entries(replacements).forEach(([key, val]) => {
            if (val !== undefined && val !== null) {
              const p1 = new RegExp(`{{\\s*${key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*}}`, "gi");
              rawHtml = rawHtml.replace(p1, val);
              rawHtml = rawHtml.replaceAll(key, val);
            }
          });

          // Inject script & style patches so bundler unpacks immediately inside iframe, hides loading placeholders, and replaces DOM placeholders dynamically
          const patchStyle = `<style>
            #__bundler_loading, #__bundler_placeholder, #__bundler_thumbnail { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; height: 0 !important; width: 0 !important; overflow: hidden !important; }
            html, body { height: auto !important; min-height: 100% !important; overflow-y: auto !important; background: #ffffff !important; margin: 0 !important; padding: 0 !important; }
          </style>`;

          const domMap = replacements;

          const unpackScript = `<script>
            (function() {
              var map = ${JSON.stringify(domMap)};

              function runDomReplace(targetNode) {
                if (!targetNode) return;
                try {
                  var walker = document.createTreeWalker(
                    targetNode,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                  );
                  var node;
                  while (node = walker.nextNode()) {
                    var val = node.nodeValue;
                    if (!val) continue;
                    var changed = false;
                    Object.keys(map).forEach(function(k) {
                      if (val.indexOf(k) !== -1) {
                        val = val.split(k).join(map[k]);
                        changed = true;
                      }
                    });
                    if (changed) node.nodeValue = val;
                  }
                } catch(e) {}
              }

              function forceUnpack() {
                var el1 = document.getElementById('__bundler_loading');
                var el2 = document.getElementById('__bundler_placeholder');
                var el3 = document.getElementById('__bundler_thumbnail');
                if (el1) el1.style.display = 'none';
                if (el2) el2.style.display = 'none';
                if (el3) el3.style.display = 'none';

                runDomReplace(document.body || document.documentElement);

                try {
                  var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(m) {
                      m.addedNodes.forEach(function(n) {
                        if (n.nodeType === 1 || n.nodeType === 3) {
                          runDomReplace(n);
                        }
                      });
                    });
                  });
                  observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
                } catch(e) {}
              }

              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', forceUnpack);
              } else {
                setTimeout(forceUnpack, 40);
                setTimeout(forceUnpack, 250);
                setTimeout(forceUnpack, 650);
              }
            })();
          </script>`;

          if (rawHtml.includes("</head>")) {
            rawHtml = rawHtml.replace("</head>", `${patchStyle}${unpackScript}</head>`);
          } else {
            rawHtml = patchStyle + unpackScript + rawHtml;
          }

          return rawHtml;
        }
      } catch (e) {
        console.warn("Could not fetch template file, using fallback template:", e);
      }
    }

    if (doc.templateType === "invoice") {
      return fillTemplate(INVOICE_HTML_TEMPLATE, replacements);
    }
    return fillTemplate(MSA_CONTRACT_HTML_TEMPLATE, replacements);
  };

  const openPreviewModal = async (doc: VaultDocument) => {
    const html = await getDocHtmlContent(doc);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    setPreviewBlobUrl(blobUrl);
    setPreviewHtmlText(html);
    setPreviewDoc(doc);
  };

  const openEditModal = async (doc: VaultDocument) => {
    setEditTab("fields");
    setEditTitle(doc.title);
    setEditClientCompany(doc.clientName);
    setEditClientName(doc.customPlaceholders?.CLIENT_NAME || doc.clientName.split(" ")[0] || "Client");
    setEditClientEmail(doc.customPlaceholders?.CLIENT_EMAIL || clientEmail);
    setEditClientSector(doc.customPlaceholders?.CLIENT_SECTOR || `${doc.clientName} · E-Commerce`);
    setEditInvoiceNo(doc.customPlaceholders?.INVOICE_NUMBER || `LC/26-27/${doc.id.slice(-3)}`);
    setEditRetainerFee(doc.customPlaceholders?.RETAINER_FEE || "₹2,50,000 / mo");
    setEditTotalAmount(doc.customPlaceholders?.TOTAL_AMOUNT || "₹2,50,000");
    setEditScope(doc.description);
    setEditStatus(doc.status);
    setEditDate(doc.uploadedAt || "2026-09-25");
    setEditPhone(doc.customPlaceholders?.PHONE || "+91 98765 43210");
    setEditAddress(doc.customPlaceholders?.ADDRESS || "Visakhapatnam, AP, India");
    setEditState(doc.customPlaceholders?.STATE || "Andhra Pradesh");
    setEditGstin(doc.customPlaceholders?.GSTIN || "37AAAAA0000A1Z5");
    setEditMonthPeriod(doc.customPlaceholders?.MONTH_PERIOD || "September 2026");
    setEditCampaignTargets(doc.customPlaceholders?.CAMPAIGN_TARGETS || "150 leads / month");
    setEditCostPerLead(doc.customPlaceholders?.COST_PER_LEAD || "₹38 / lead");
    setEditReachTarget(doc.customPlaceholders?.REACH_TARGET || "250,000 Impressions");
    setEditSignatoryName(doc.customPlaceholders?.SIGNATORY_NAME || doc.clientName.split(" ")[0] || "Mark Davis");
    setEditSignatoryTitle(doc.customPlaceholders?.SIGNATORY_TITLE || "Managing Director");
    setEditAuditSummary(doc.customPlaceholders?.AUDIT_SUMMARY || "4k followers, posting twice a month, no paid ads running currently, most enquiries come from word of mouth.");
    setEditPainPoint1(doc.customPlaceholders?.PAIN_POINT_1 || "Organic reach under 10% of total followers; no dedicated reels strategy.");
    setEditPainPoint2(doc.customPlaceholders?.PAIN_POINT_2 || "No automated ads, forms or follow-up sequence — enquiries rely on manual outreach.");
    setEditPainPoint3(doc.customPlaceholders?.PAIN_POINT_3 || "Brand colors, tone of voice, and ad creative templates lack visual consistency.");
    setEditPoint1(doc.customPlaceholders?.POINT_1 || "Raise budget on best performing ad set & scale top UGC reel");
    setEditPoint2(doc.customPlaceholders?.POINT_2 || "Launch 2 new UGC video ad hooks weekly to prevent ad fatigue");
    setEditPoint3(doc.customPlaceholders?.POINT_3 || "Optimize CRO checkout flow & meta pixel telemetry tracking");
    setEditGrowthInsight(doc.customPlaceholders?.GROWTH_INSIGHT || "High-intent UGC hooks combined with automated retargeting produced a 32% increase in leads.");

    const initialHtml = await getDocHtmlContent(doc);
    setEditRawHtml(initialHtml);
    setEditDoc(doc);
  };

  const computeLiveEditHtml = () => {
    if (editTab === "code" && editRawHtml) {
      return editRawHtml;
    }

    if (!editDoc) return editRawHtml;

    let html = editRawHtml;
    if (!html) return "";

    const replacements: Record<string, string> = {
      CLIENT_NAME: editClientName,
      COMPANY_NAME: editClientCompany,
      CLIENT_EMAIL: editClientEmail,
      INVOICE_NUMBER: editInvoiceNo,
      RETAINER_FEE: editRetainerFee,
      TOTAL_AMOUNT: editTotalAmount,
      SCOPE_SUMMARY: editScope,
      DOCUMENT_DATE: editDate,
      STATUS: editStatus.toUpperCase(),

      "[Client Name]": editClientName,
      "[CLIENT NAME]": editClientCompany || editClientName,
      "[CLIENT_NAME]": editClientName,
      "[COMPANY NAME]": editClientCompany,
      "[COMPANY_NAME]": editClientCompany,
      "[company name]": editClientCompany,
      "[Brand]": editClientCompany,
      "[email]": editClientEmail,
      "[CLIENT EMAIL]": editClientEmail,
      "[phone]": editPhone,
      "[Phone]": editPhone,
      "[Address]": editAddress,
      "[Visakhapatnam]": editAddress,
      "[State]": editState,
      "[GSTIN]": editGstin,
      "[001]": editInvoiceNo,
      "[INVOICE NUMBER]": editInvoiceNo,
      "[DD/MM/YYYY]": editDate,
      "[Date]": editDate,
      "[Month YYYY]": editMonthPeriod,
      "[Month]": editMonthPeriod,
      "[Client name · sector]": editClientSector || `${editClientCompany} · Performance Marketing`,
      "[2–3 lines on the client today: e.g. 4k followers, posting twice a month, no ads running, most enquiries come from word of mouth.]": editAuditSummary,
      "[Posts reach under 10% of followers; no reels strategy.]": editPainPoint1,
      "[No ads, forms or follow-up — enquiries depend on luck.]": editPainPoint2,
      "[Colours, tone and templates change post to post.]": editPainPoint3,
      "[150 leads / month]": editCampaignTargets,
      "[150]": editCampaignTargets,
      "[Cost per lead]": editCostPerLead,
      "[₹38]": editCostPerLead,
      "[Reach in 60 days]": editReachTarget,
      "[setup / month]": editRetainerFee,
      "[TOTAL AMOUNT]": editTotalAmount,
      "[Client Signatory]": editSignatoryName,
      "[Name, Title]": editSignatoryTitle,
      "[Contact person]": editClientName,
      "[Point 1]": editPoint1,
      "[Raise budget on best ad set]": editPoint1,
      "[Point 1 → fix]": editPoint1,
      "[Point 2]": editPoint2,
      "[Test 2 new hooks]": editPoint2,
      "[Point 2 → fix]": editPoint2,
      "[Point 3]": editPoint3,
      "[Launch a lead form]": editPoint3,
      "[Why it worked]": editGrowthInsight,

      "{{CLIENT_NAME}}": editClientName,
      "{{COMPANY_NAME}}": editClientCompany,
      "{{CLIENT_EMAIL}}": editClientEmail,
      "{{INVOICE_NUMBER}}": editInvoiceNo,
      "{{RETAINER_FEE}}": editRetainerFee,
      "{{TOTAL_AMOUNT}}": editTotalAmount,
      "{{SCOPE_SUMMARY}}": editScope,
      "{{DOCUMENT_DATE}}": editDate,
    };

    Object.entries(replacements).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        const p1 = new RegExp(`{{\\s*${key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*}}`, "gi");
        html = html.replace(p1, val);
        html = html.replaceAll(key, val);
      }
    });

    const domMap = replacements;

    const domUpdateScript = `<script>
      (function() {
        var map = ${JSON.stringify(domMap)};
        function runDomReplace(targetNode) {
          if (!targetNode) return;
          try {
            var walker = document.createTreeWalker(
              targetNode,
              NodeFilter.SHOW_TEXT,
              null,
              false
            );
            var node;
            while (node = walker.nextNode()) {
              var val = node.nodeValue;
              if (!val) continue;
              var changed = false;
              Object.keys(map).forEach(function(k) {
                if (val.indexOf(k) !== -1) {
                  val = val.split(k).join(map[k]);
                  changed = true;
                }
              });
              if (changed) node.nodeValue = val;
            }
          } catch(e) {}
        }
        runDomReplace(document.body || document.documentElement);
        setTimeout(function() { runDomReplace(document.body || document.documentElement); }, 50);
        setTimeout(function() { runDomReplace(document.body || document.documentElement); }, 300);
      })();
    </script>`;

    if (html.includes("</body>")) {
      html = html.replace("</body>", `${domUpdateScript}</body>`);
    } else {
      html = html + domUpdateScript;
    }

    return html;
  };

  const handleSaveEditDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDoc) return;

    const finalHtml = computeLiveEditHtml();

    setDocuments((prev) =>
      prev.map((d) =>
        d.id === editDoc.id
          ? {
              ...d,
              title: editTitle,
              clientName: editClientCompany,
              description: editScope,
              status: editStatus,
              rawHtmlOverride: editTab === "code" ? editRawHtml : finalHtml,
              customPlaceholders: {
                CLIENT_NAME: editClientName,
                COMPANY_NAME: editClientCompany,
                CLIENT_EMAIL: editClientEmail,
                CLIENT_SECTOR: editClientSector,
                INVOICE_NUMBER: editInvoiceNo,
                RETAINER_FEE: editRetainerFee,
                TOTAL_AMOUNT: editTotalAmount,
                DOCUMENT_DATE: editDate,
                PHONE: editPhone,
                ADDRESS: editAddress,
                STATE: editState,
                GSTIN: editGstin,
                MONTH_PERIOD: editMonthPeriod,
                CAMPAIGN_TARGETS: editCampaignTargets,
                COST_PER_LEAD: editCostPerLead,
                REACH_TARGET: editReachTarget,
                SIGNATORY_NAME: editSignatoryName,
                SIGNATORY_TITLE: editSignatoryTitle,
                AUDIT_SUMMARY: editAuditSummary,
                PAIN_POINT_1: editPainPoint1,
                PAIN_POINT_2: editPainPoint2,
                PAIN_POINT_3: editPainPoint3,
                POINT_1: editPoint1,
                POINT_2: editPoint2,
                POINT_3: editPoint3,
                GROWTH_INSIGHT: editGrowthInsight,
              },
            }
          : d
      )
    );

    setEditDoc(null);
    setSendSuccessToast(`Saved updated template content & details for "${editTitle}".`);
    setTimeout(() => setSendSuccessToast(null), 4000);
  };

  const handleConfirmSendToClient = () => {
    if (!sendDoc) return;

    // Update document target client in state
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === sendDoc.id
          ? {
              ...d,
              clientName: selectedClientAcc.company,
              status: "Signed",
            }
          : d
      )
    );

    const msg = `Successfully sent "${sendDoc.title}" to ${selectedClientAcc.name} (${selectedClientAcc.company})! Notification alert dispatched.`;
    setSendSuccessToast(msg);
    setSendDoc(null);
    setTimeout(() => setSendSuccessToast(null), 5000);
  };

  const downloadDocument = async (doc: VaultDocument) => {
    setDownloadingId(doc.id);
    const htmlContent = await getDocHtmlContent(doc);
    const fileName = doc.title.endsWith(".pdf") ? doc.title : `${doc.title}.pdf`;
    await downloadHtmlAsPdf(htmlContent, fileName);
    setDownloadingId(null);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: VaultDocument = {
      id: `doc-${Date.now()}`,
      title: newTitle.trim().endsWith(".pdf") ? newTitle.trim() : `${newTitle.trim()}.pdf`,
      category: newCategory,
      clientName: newClient || clientCompany,
      fileSize: "1.8 MB",
      fileType: "pdf",
      uploadedAt: new Date().toISOString().split("T")[0],
      status: "Verified",
      description: newDescription.trim() || "Document uploaded to agency vault.",
    };

    setDocuments([created, ...documents]);
    setNewTitle("");
    setNewDescription("");
    setIsUploadOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header Card */}
      <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#ef4d23] text-white font-semibold text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-2xs">
              {isClientView ? "Client Vault" : "Agency Master Vault"}
            </span>
            <span className="text-xs text-neutral-600 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> DPDP 2023 Encrypted
            </span>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight mt-1">
            {isClientView ? "Document Vault & Legal Scope" : "Master Agency Document Vault"}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5 font-medium">
            Centralized repository for contracts, SOWs, brand assets, NDAs, and monthly audit reports.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="bg-[#ef4d23] hover:bg-[#d83f17] text-white px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Vault Summary Stat Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl border border-white/60 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100/80 text-[#ef4d23] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-neutral-500">Total Vault Documents</p>
            <p className="text-lg font-bold text-neutral-900">{documents.length} Files</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl border border-white/60 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-neutral-500">Active Contracts & SOWs</p>
            <p className="text-lg font-bold text-neutral-900">
              {documents.filter((d) => d.category === "contracts").length} Active
            </p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl border border-white/60 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100/80 text-sky-800 flex items-center justify-center shrink-0">
            <FolderDown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-neutral-500">Storage Telemetry</p>
            <p className="text-lg font-bold text-neutral-900">51.7 MB Used</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white/90 backdrop-blur-xl p-4 rounded-3xl border border-white/60 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "All Documents" },
              { id: "contracts", label: "Contracts & SOWs" },
              { id: "reports", label: "Reports" },
              { id: "brand", label: "Brand Assets" },
              { id: "legal", label: "Legal & NDAs" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-[#ef4d23] text-white shadow-2xs"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full bg-neutral-100 border border-neutral-200 rounded-full pl-9 pr-4 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#ef4d23] transition-all"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white/90 rounded-2xl p-4.5 border border-neutral-200/80 hover:border-[#ef4d23]/50 transition-all flex flex-col justify-between space-y-4 group hover:shadow-md min-h-[210px]"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center shrink-0 font-extrabold text-[11px] text-[#ef4d23] uppercase shadow-2xs">
                      {doc.fileType}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200/80 uppercase tracking-wider">
                      {doc.category}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    {doc.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-neutral-900 group-hover:text-[#ef4d23] transition-colors leading-snug line-clamp-2 h-8">
                    {doc.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-neutral-500 line-clamp-2 leading-relaxed h-8">
                    {doc.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-[11px] text-neutral-500">
                <span className="font-medium text-[10px] text-neutral-400 shrink-0">
                  {doc.fileSize} • {doc.uploadedAt}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!isClientView && (
                    <>
                      <button
                        type="button"
                        onClick={() => openEditModal(doc)}
                        className="px-2.5 py-1 text-[10px] font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors cursor-pointer border border-neutral-200/60"
                        title="Edit Details & Placeholders"
                      >
                        Edit Details
                      </button>
                      <button
                        type="button"
                        onClick={() => setSendDoc(doc)}
                        className="px-2.5 py-1 text-[10px] font-bold bg-[#ef4d23] hover:bg-[#d83f17] text-white rounded-lg transition-colors cursor-pointer shadow-2xs"
                        title="Send to Client Account"
                      >
                        Send
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => openPreviewModal(doc)}
                    className="p-1.5 text-neutral-600 hover:text-[#ef4d23] hover:bg-orange-50 rounded-lg transition-colors cursor-pointer border border-neutral-200/50"
                    title="Preview Document"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={downloadingId === doc.id}
                    onClick={() => downloadDocument(doc)}
                    className="p-1.5 text-neutral-600 hover:text-[#ef4d23] hover:bg-orange-50 rounded-lg transition-colors cursor-pointer border border-neutral-200/50 disabled:opacity-50"
                    title="Download File"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="col-span-full py-12 text-center text-neutral-500">
              <FileText className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-xs font-semibold">No documents found matching your filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-start justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ef4d23] flex items-center justify-center font-bold text-xs uppercase shadow-2xs">
                  {previewDoc.fileType}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 leading-snug">{previewDoc.title}</h3>
                  <p className="text-xs text-neutral-500">
                    Client: <strong className="text-neutral-800">{previewDoc.clientName || clientCompany}</strong> • {previewDoc.uploadedAt}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPreviewDoc(null);
                  setPreviewHtmlText(null);
                }}
                className="p-1.5 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formatted HTML Live Template Preview */}
            <div className="flex-1 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 min-h-[500px] h-[65vh] relative shadow-inner">
              {previewBlobUrl ? (
                <iframe
                  title="Document Preview"
                  src={previewBlobUrl}
                  className="w-full h-full border-0 bg-white"
                />
              ) : previewHtmlText ? (
                <iframe
                  title="Document Preview"
                  srcDoc={previewHtmlText}
                  className="w-full h-full border-0 bg-white"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-neutral-500">
                  Loading preview...
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-100">
              <span className="text-xs text-neutral-500 font-medium">
                Verified template • Auto-filled with {clientName}'s details
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 rounded-full border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
                >
                  Close
                </button>
                <button
                  disabled={downloadingId === previewDoc.id}
                  onClick={() => {
                    downloadDocument(previewDoc);
                  }}
                  className="px-5 py-2 rounded-full bg-[#ef4d23] hover:bg-[#d83f17] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-60"
                >
                  <Download className="w-3.5 h-3.5" />
                  {downloadingId === previewDoc.id ? "Generating PDF..." : "Download as PDF"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload New Document Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-[#ef4d23]" />
                Upload New Document
              </h3>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1 text-neutral-500 hover:text-black rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <label className="block">
                <span className="font-semibold text-neutral-700 mb-1 block">Document Title</span>
                <input
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Q4 Master Campaign Agreement.pdf"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 outline-none focus:border-[#ef4d23]"
                />
              </label>

              <label className="block">
                <span className="font-semibold text-neutral-700 mb-1 block">Category</span>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 outline-none focus:border-[#ef4d23] cursor-pointer"
                >
                  <option value="contracts">Contracts & SOWs</option>
                  <option value="reports">Performance Reports</option>
                  <option value="brand">Brand Assets</option>
                  <option value="legal">Legal & NDAs</option>
                </select>
              </label>

              <label className="block">
                <span className="font-semibold text-neutral-700 mb-1 block">Target Client</span>
                <input
                  type="text"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 outline-none focus:border-[#ef4d23]"
                />
              </label>

              <label className="block">
                <span className="font-semibold text-neutral-700 mb-1 block">Description & Scope</span>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief summary of document clauses and scope..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 outline-none focus:border-[#ef4d23] resize-none"
                />
              </label>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-full border border-neutral-200 font-semibold text-neutral-700 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#ef4d23] hover:bg-[#d83f17] text-white font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  Upload to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Document Content & Visual Editor Modal (CRM Mode) */}
      {editDoc && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-[96vw] lg:max-w-6xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-neutral-200 space-y-4 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <FileCode className="w-4.5 h-4.5 text-[#ef4d23]" />
                  Live Document Content & Template Editor
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Customize template content & placeholders for <strong>"{editDoc.title}"</strong> with real-time live preview.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Mode Switcher */}
                <div className="inline-flex bg-neutral-100 p-1 rounded-full border border-neutral-200 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setEditTab("fields")}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      editTab === "fields" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500"
                    }`}
                  >
                    📝 Field Values
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditTab("code")}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      editTab === "code" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500"
                    }`}
                  >
                    💻 HTML Source Code
                  </button>
                </div>

                <button
                  onClick={() => setEditDoc(null)}
                  className="p-1.5 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Split Screen Editor Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[440px] overflow-hidden">
              {/* Left Column (5 Cols): Inputs or Raw Code */}
              <div className="lg:col-span-5 bg-neutral-50 rounded-2xl p-4 border border-neutral-200 overflow-y-auto space-y-3.5 text-xs">
                {editTab === "fields" ? (
                  <>
                    {/* Category 1: Document Title & References */}
                    <div className="space-y-2 pb-2 border-b border-neutral-200/60">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ef4d23]">
                        📄 Document & Ref Identifiers
                      </span>
                      <div>
                        <label className="font-semibold text-neutral-700 block mb-0.5">Document Title</label>
                        <input
                          required
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-semibold text-neutral-900 outline-none focus:border-[#ef4d23]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-0.5">Invoice / Ref No <code className="text-[9px] text-neutral-400">[001]</code></label>
                          <input
                            type="text"
                            value={editInvoiceNo}
                            onChange={(e) => setEditInvoiceNo(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23]"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-0.5">Document Date <code className="text-[9px] text-neutral-400">[Date]</code></label>
                          <input
                            type="text"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23]"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-0.5">Billing Period <code className="text-[9px] text-neutral-400">[Month YYYY]</code></label>
                          <input
                            type="text"
                            value={editMonthPeriod}
                            onChange={(e) => setEditMonthPeriod(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23]"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-0.5">Status</label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as any)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-900 outline-none cursor-pointer"
                          >
                            <option value="Signed">Signed</option>
                            <option value="Active SLA">Active SLA</option>
                            <option value="Verified">Verified</option>
                            <option value="Action Required">Action Required</option>
                            <option value="Compliant">Compliant</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Category 2: Client & Company Information */}
                    <div className="space-y-2 pb-2 border-b border-neutral-200/60">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ef4d23]">
                        🏢 Client & Contact Details
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-0.5">Brand Name <code className="text-[9px] text-neutral-400">[company name]</code></label>
                          <input
                            required
                            type="text"
                            value={editClientCompany}
                            onChange={(e) => setEditClientCompany(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23]"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-0.5">Contact Person <code className="text-[9px] text-neutral-400">[Client Name]</code></label>
                          <input
                            type="text"
                            value={editClientName}
                            onChange={(e) => setEditClientName(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-0.5">Client Email <code className="text-[9px] text-neutral-400">[email]</code></label>
                          <input
                            type="email"
                            value={editClientEmail}
                            onChange={(e) => setEditClientEmail(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23]"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-0.5">Phone Number <code className="text-[9px] text-neutral-400">[phone]</code></label>
                          <input
                            type="text"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-0.5">Billing Address <code className="text-[9px] text-neutral-400">[Address]</code></label>
                          <input
                            type="text"
                            value={editAddress}
                            onChange={(e) => setEditAddress(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23]"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-0.5">GSTIN / Tax ID <code className="text-[9px] text-neutral-400">[GSTIN]</code></label>
                          <input
                            type="text"
                            value={editGstin}
                            onChange={(e) => setEditGstin(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Category 3: Financials & Signatories */}
                    <div className="space-y-2 pb-2 border-b border-neutral-200/60">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ef4d23]">
                        💰 Financials & Signatories
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-0.5">Retainer Rate <code className="text-[9px] text-neutral-400">[setup / month]</code></label>
                          <input
                            type="text"
                            value={editRetainerFee}
                            onChange={(e) => setEditRetainerFee(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23]"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-0.5">Total Amount <code className="text-[9px] text-neutral-400">[TOTAL AMOUNT]</code></label>
                          <input
                            type="text"
                            value={editTotalAmount}
                            onChange={(e) => setEditTotalAmount(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23]"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-0.5">Client Signatory <code className="text-[9px] text-neutral-400">[Client Signatory]</code></label>
                          <input
                            type="text"
                            value={editSignatoryName}
                            onChange={(e) => setEditSignatoryName(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23]"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-0.5">Signatory Title <code className="text-[9px] text-neutral-400">[Name, Title]</code></label>
                          <input
                            type="text"
                            value={editSignatoryTitle}
                            onChange={(e) => setEditSignatoryTitle(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Category 4: Proposal Audit & Current State Baseline */}
                    <div className="space-y-2 pb-2 border-b border-neutral-200/60">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ef4d23]">
                        🔍 Audit Summary & Client Pain Points
                      </span>
                      <div>
                        <label className="font-semibold text-neutral-700 block mb-0.5">Audit Summary & Baseline <code className="text-[9px] text-neutral-400">[2–3 lines on client...]</code></label>
                        <textarea
                          rows={2}
                          value={editAuditSummary}
                          onChange={(e) => setEditAuditSummary(e.target.value)}
                          placeholder="Current follower count, posting frequency, ad status..."
                          className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23] resize-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-neutral-700 block">Identified Client Bottlenecks & Pain Points</label>
                        <input
                          type="text"
                          value={editPainPoint1}
                          onChange={(e) => setEditPainPoint1(e.target.value)}
                          placeholder="Pain Point #1: e.g. Organic reach under 10%"
                          className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-[11px] text-neutral-900 outline-none focus:border-[#ef4d23]"
                        />
                        <input
                          type="text"
                          value={editPainPoint2}
                          onChange={(e) => setEditPainPoint2(e.target.value)}
                          placeholder="Pain Point #2: e.g. No automated ad funnel"
                          className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-[11px] text-neutral-900 outline-none focus:border-[#ef4d23]"
                        />
                        <input
                          type="text"
                          value={editPainPoint3}
                          onChange={(e) => setEditPainPoint3(e.target.value)}
                          placeholder="Pain Point #3: e.g. Brand design inconsistency"
                          className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-[11px] text-neutral-900 outline-none focus:border-[#ef4d23]"
                        />
                      </div>
                    </div>

                    {/* Category 5: Performance Targets & Key Action Points */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ef4d23]">
                        🎯 Strategy, Targets & Action Points
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-0.5">Lead Target <code className="text-[9px] text-neutral-400">[150 leads]</code></label>
                          <input
                            type="text"
                            value={editCampaignTargets}
                            onChange={(e) => setEditCampaignTargets(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-2.5 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23]"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-0.5">Target CPL <code className="text-[9px] text-neutral-400">[₹38]</code></label>
                          <input
                            type="text"
                            value={editCostPerLead}
                            onChange={(e) => setEditCostPerLead(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-2.5 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23]"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-0.5">Reach Target <code className="text-[9px] text-neutral-400">[Reach]</code></label>
                          <input
                            type="text"
                            value={editReachTarget}
                            onChange={(e) => setEditReachTarget(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-2.5 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-neutral-700 block">Monthly Action Items & Wins <code className="text-[9px] text-neutral-400">[Point 1..3]</code></label>
                        <input
                          type="text"
                          value={editPoint1}
                          onChange={(e) => setEditPoint1(e.target.value)}
                          placeholder="Point 1: e.g. Scale best ad set"
                          className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-[11px] text-neutral-900 outline-none focus:border-[#ef4d23]"
                        />
                        <input
                          type="text"
                          value={editPoint2}
                          onChange={(e) => setEditPoint2(e.target.value)}
                          placeholder="Point 2: e.g. Launch 2 new UGC ad hooks"
                          className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-[11px] text-neutral-900 outline-none focus:border-[#ef4d23]"
                        />
                        <input
                          type="text"
                          value={editPoint3}
                          onChange={(e) => setEditPoint3(e.target.value)}
                          placeholder="Point 3: e.g. CRO checkout sync"
                          className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-[11px] text-neutral-900 outline-none focus:border-[#ef4d23]"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-neutral-700 block mb-0.5">Growth Insight / Takeaway <code className="text-[9px] text-neutral-400">[Why it worked]</code></label>
                        <input
                          type="text"
                          value={editGrowthInsight}
                          onChange={(e) => setEditGrowthInsight(e.target.value)}
                          placeholder="Why campaign worked..."
                          className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23]"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-neutral-700 block mb-0.5">Scope & Retainer Summary <code className="text-[9px] text-neutral-400">[Scope Summary]</code></label>
                        <textarea
                          rows={2}
                          value={editScope}
                          onChange={(e) => setEditScope(e.target.value)}
                          className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 font-medium text-neutral-900 outline-none focus:border-[#ef4d23] resize-none"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col">
                    <label className="font-semibold text-neutral-700 block mb-1">
                      HTML Document Template Source Code:
                    </label>
                    <textarea
                      value={editRawHtml}
                      onChange={(e) => setEditRawHtml(e.target.value)}
                      className="flex-1 w-full bg-[#1e1e24] text-[#818cf8] font-mono text-[11px] leading-relaxed p-3 rounded-xl border border-neutral-700 outline-none focus:border-[#ef4d23] resize-none min-h-[380px]"
                    />
                  </div>
                )}
              </div>

              {/* Right Column (7 Cols): Real-time Live Document Preview */}
              <div className="lg:col-span-7 flex flex-col rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-xs">
                <div className="bg-neutral-100 border-b border-neutral-200 px-3.5 py-2 flex items-center justify-between text-[11px] text-neutral-600 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#ef4d23]" /> Real-time Live Document Output
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewDoc(editDoc);
                      setPreviewHtmlText(computeLiveEditHtml());
                    }}
                    className="px-2.5 py-0.5 rounded-full bg-white border border-neutral-300 text-neutral-800 text-[10px] font-bold hover:bg-neutral-50 flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-[#ef4d23]" /> Expand Full Preview
                  </button>
                </div>

                <div className="flex-1 overflow-hidden bg-neutral-200/50 p-2">
                  <iframe
                    title="Live Template Edit Preview"
                    srcDoc={computeLiveEditHtml()}
                    className="w-full h-full border-0 bg-white rounded-xl shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="pt-2 flex items-center justify-between border-t border-neutral-100 text-xs">
              <span className="text-neutral-500 font-medium">
                Changes will be saved into the vault and updated live for the client.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewDoc(editDoc);
                    setPreviewHtmlText(computeLiveEditHtml());
                  }}
                  className="px-4 py-2 rounded-full border border-neutral-300 font-bold text-neutral-800 hover:bg-neutral-100 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Eye className="w-4 h-4 text-[#ef4d23]" />
                  <span>Preview Document</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditDoc(null)}
                  className="px-4 py-2 rounded-full border border-neutral-200 font-semibold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    handleSaveEditDoc(e);
                  }}
                  className="px-5 py-2 rounded-full bg-[#ef4d23] hover:bg-[#d83f17] text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>Save & Apply Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Document to Client Account Selector Modal (CRM Mode) */}
      {sendDoc && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#ef4d23]" />
                  Send Document to Client Account
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Select which client account dashboard should receive "{sendDoc.title}"
                </p>
              </div>
              <button onClick={() => setSendDoc(null)} className="p-1 text-neutral-500 hover:text-black rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {CLIENT_ACCOUNTS.map((acc) => {
                const isSelected = selectedClientAcc.company === acc.company;
                return (
                  <button
                    key={acc.company}
                    type="button"
                    onClick={() => setSelectedClientAcc(acc)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "bg-orange-50/80 border-[#ef4d23] ring-1 ring-[#ef4d23] shadow-xs"
                        : "bg-neutral-50 hover:bg-neutral-100/80 border-neutral-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-neutral-900">{acc.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700">
                          {acc.plan}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-neutral-600 mt-0.5">{acc.company}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">{acc.email}</p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center font-bold text-xs ${
                        isSelected ? "bg-[#ef4d23] text-white border-[#ef4d23]" : "border-neutral-300 bg-white"
                      }`}
                    >
                      {isSelected && "✓"}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setSendDoc(null)}
                className="px-4 py-2 rounded-full border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSendToClient}
                className="px-5 py-2 rounded-full bg-[#ef4d23] hover:bg-[#d83f17] text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Confirm Send to {selectedClientAcc.company}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast Banner */}
      {sendSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111118] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 text-xs font-semibold animate-scale-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{sendSuccessToast}</span>
        </div>
      )}
    </div>
  );
}
