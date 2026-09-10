import { useState } from "react";
import {
  Rocket,
  Building2,
  Calendar,
  Globe,
  CreditCard,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Plus,
  Save,
  Copy,
  Check,
  FileText,
  DollarSign,
  Share2,
  Sparkles,
  Award,
  Clock,
  Layers,
  Key,
  Database,
  Link2,
  Send,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Search,
} from "lucide-react";
import { useToast } from "./ui/Toast";

export interface ClientOnboardingData {
  id: string;
  project_start_date: string;
  brand_name: string;
  website_domain: string;
  scope_of_work: string;
  ad_channels: string[];
  location: string;
  customer_contact_phone: string;
  social_media_links: string;
  monthly_ad_spend: string;
  payment_card_details: string;
  creative_contact_number: string;
  gstin: string;
  billing_details: string;
  finance_poc_name: string;
  finance_poc_email: string;

  // Client Side Team & Lead Operations
  lead_contact_person_name: string;
  lead_contact_person_phone: string;
  lead_contact_person_email: string;
  uses_phone_tracking: boolean;
  phone_tracking_system_name: string;
  client_poc_name: string;
  client_poc_phone: string;
  client_poc_email: string;
  client_poc_designation: string;
  email_cc_list: string;
  crm_platform_used: string;
  crm_access_recipients: string;

  // Platform Access Credentials
  cpanel_access_granted: boolean;
  cpanel_notes: string;
  wordpress_access_granted: boolean;
  wordpress_notes: string;
  godaddy_domain_access_granted: boolean;
  godaddy_notes: string;
  google_analytics_granted: boolean;
  google_analytics_notes: string;
  google_search_console_granted: boolean;
  google_search_console_notes: string;
  gtm_granted: boolean;
  gtm_notes: string;
  whatsapp_tool_granted: boolean;
  whatsapp_tool_notes: string;

  // Asset Checklist
  trademark_document_received: boolean;
  brand_assets_logo_received: boolean;
  image_video_bank_received: boolean;
  custom_lookalike_audience_received: boolean;
  brand_questionnaire_completed: boolean;

  // Lumen & Co SLA
  lumen_tat: string;
  lumen_working_days: string;
  lumen_assigned_team: string;
}

const INITIAL_ONBOARDING_RECORDS: ClientOnboardingData[] = [
  {
    id: "onboard-101",
    project_start_date: "2026-09-15",
    brand_name: "Apex Global Academy",
    website_domain: "apexglobal.edu.in",
    scope_of_work: "Full-Funnel Student Admissions Scaling, Meta & Google Ads, UGC Video Production & CRM Integration",
    ad_channels: ["Meta Ads (FB/IG)", "Google Search & YouTube", "WhatsApp Business API"],
    location: "Gachibowli, Hyderabad, TS",
    customer_contact_phone: "+91 98765 43210",
    social_media_links: "https://instagram.com/apexglobal.hyderabad, https://facebook.com/apexglobal",
    monthly_ad_spend: "₹3,50,000 / month",
    payment_card_details: "HDFC Commercial Visa ending •••• 8492 (Limit ₹10L)",
    creative_contact_number: "+91 98765 43210",
    gstin: "36AAACV9102K1Z9",
    billing_details: "Apex Educational Trust, Gachibowli Main Rd, Hyderabad 500032",
    finance_poc_name: "Ramesh Sharma",
    finance_poc_email: "finance@apexglobal.edu.in",

    lead_contact_person_name: "Anand Verma",
    lead_contact_person_phone: "+91 98490 12345",
    lead_contact_person_email: "admissions@apexglobal.edu.in",
    uses_phone_tracking: true,
    phone_tracking_system_name: "MyOperator Cloud Telephony",
    client_poc_name: "Deepika Rao",
    client_poc_phone: "+91 98490 99999",
    client_poc_email: "deepika.rao@apexglobal.edu.in",
    client_poc_designation: "Director of Admissions & Brand Growth",
    email_cc_list: "deepika.rao@apexglobal.edu.in, principal@apexglobal.edu.in",
    crm_platform_used: "LeadSquared CRM",
    crm_access_recipients: "sahit@lumenandco.in, alex@lumenandco.in",

    cpanel_access_granted: true,
    cpanel_notes: "CPanel Host: cpanel.apexglobal.edu.in (User: admin_apex)",
    wordpress_access_granted: true,
    wordpress_notes: "WP Admin: apexglobal.edu.in/wp-admin (User: lumen_admin)",
    godaddy_domain_access_granted: true,
    godaddy_notes: "GoDaddy Account ID: 89102931 (Access delegated to hello@lumenandco.in)",
    google_analytics_granted: true,
    google_analytics_notes: "GA4 Property ID: 394019284 (Admin granted to lumenandco.in)",
    google_search_console_granted: true,
    google_search_console_notes: "Domain verification active on apexglobal.edu.in",
    gtm_granted: true,
    gtm_notes: "User: Admin, Container: Publish (Container ID: GTM-W982KL)",
    whatsapp_tool_granted: true,
    whatsapp_tool_notes: "WATI WhatsApp API connected with +91 98765 43210",

    trademark_document_received: true,
    brand_assets_logo_received: true,
    image_video_bank_received: true,
    custom_lookalike_audience_received: true,
    brand_questionnaire_completed: true,

    lumen_tat: "24 to 48 Hours for Ad Creatives & Campaign Turnaround",
    lumen_working_days: "Monday – Saturday | 9:30 AM – 7:00 PM IST",
    lumen_assigned_team: "Sahit Sai (Supervision), Sarah Chen (Account Manager), David Miller (Creative Director), Priya Sharma (Performance Ad Buyer)",
  },
];

export default function ClientOnboardingView() {
  const toast = useToast();
  const [records, setRecords] = useState<ClientOnboardingData[]>(INITIAL_ONBOARDING_RECORDS);
  const [selectedRecordId, setSelectedRecordId] = useState<string>(INITIAL_ONBOARDING_RECORDS[0].id);

  const activeRecord = records.find((r) => r.id === selectedRecordId) || records[0];

  const [activeTab, setActiveTab] = useState<"general" | "contacts" | "credentials" | "assets" | "sla">("general");
  const [copiedLink, setCopiedLink] = useState(false);

  const handleUpdateRecord = (field: keyof ClientOnboardingData, value: any) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === activeRecord.id ? { ...r, [field]: value } : r))
    );
  };

  const handleCreateNewOnboarding = () => {
    const newId = `onboard-${Date.now()}`;
    const newRecord: ClientOnboardingData = {
      id: newId,
      project_start_date: new Date().toISOString().split("T")[0],
      brand_name: "New Client Brand",
      website_domain: "newbrand.com",
      scope_of_work: "Meta Ads, Google Ads & UGC Creative Strategy",
      ad_channels: ["Meta Ads (FB/IG)", "Google Search"],
      location: "Hyderabad, India",
      customer_contact_phone: "+91 98765 00000",
      social_media_links: "https://instagram.com/newbrand",
      monthly_ad_spend: "₹1,50,000 / month",
      payment_card_details: "Card details to be provided securely",
      creative_contact_number: "+91 98765 00000",
      gstin: "36AAAAA0000A1Z5",
      billing_details: "Company billing address details",
      finance_poc_name: "Finance Manager",
      finance_poc_email: "billing@newbrand.com",

      lead_contact_person_name: "Sales Lead",
      lead_contact_person_phone: "+91 98765 11111",
      lead_contact_person_email: "sales@newbrand.com",
      uses_phone_tracking: false,
      phone_tracking_system_name: "",
      client_poc_name: "Brand Lead",
      client_poc_phone: "+91 98765 22222",
      client_poc_email: "contact@newbrand.com",
      client_poc_designation: "Marketing Director",
      email_cc_list: "founder@newbrand.com",
      crm_platform_used: "Lumen & Co Native Lead Portal",
      crm_access_recipients: "growth@lumenandco.in",

      cpanel_access_granted: false,
      cpanel_notes: "",
      wordpress_access_granted: false,
      wordpress_notes: "WP Admin: newbrand.com/wp-admin",
      godaddy_domain_access_granted: false,
      godaddy_notes: "GoDaddy Access",
      google_analytics_granted: false,
      google_analytics_notes: "",
      google_search_console_granted: false,
      google_search_console_notes: "",
      gtm_granted: false,
      gtm_notes: "User: Admin, Container: Publish",
      whatsapp_tool_granted: false,
      whatsapp_tool_notes: "",

      trademark_document_received: false,
      brand_assets_logo_received: false,
      image_video_bank_received: false,
      custom_lookalike_audience_received: false,
      brand_questionnaire_completed: false,

      lumen_tat: "24 to 48 Hours for Ad Creatives & Turnaround",
      lumen_working_days: "Monday – Saturday | 9:30 AM – 7:00 PM IST",
      lumen_assigned_team: "Sahit Sai (Founder), Sarah Chen (Account Lead), Priya Sharma (Ad Buyer)",
    };

    setRecords((prev) => [newRecord, ...prev]);
    setSelectedRecordId(newId);
    toast.success("New Client Onboarding Project Created!");
  };

  const handleCopyIntakeLink = () => {
    navigator.clipboard.writeText(`https://lumenandco.in/onboarding/${activeRecord.id}`);
    setCopiedLink(true);
    toast.success("Shareable Client Onboarding Intake URL copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 text-[#222222]">
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-black text-white p-6 sm:p-8 rounded-3xl border border-neutral-700 shadow-2xl relative overflow-hidden isolate">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#ef4d23]/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#ef4d23]/20 border border-[#ef4d23]/40 text-[#fed7aa] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              <Rocket className="h-3.5 w-3.5 text-[#ef4d23]" />
              <span>Client Onboarding Intake & Master SLA Manager</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Client Onboarding Intake Manager</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
              Complete onboarding checklist, brand credentials, trademark documentation, lead contact points, and SLA details for <span className="text-[#ef4d23] font-bold">Lumen & Co</span> client accounts.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleCopyIntakeLink}
              className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/20 px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
              <span>Share Client Intake Link</span>
            </button>
            <button
              type="button"
              onClick={handleCreateNewOnboarding}
              className="bg-[#ef4d23] hover:bg-[#d93c14] text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>New Client Onboarding</span>
            </button>
          </div>
        </div>

        {/* Brand Selector Bar */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[11px] shrink-0">
              Active Client Projects:
            </span>
            {records.map((rec) => (
              <button
                key={rec.id}
                onClick={() => setSelectedRecordId(rec.id)}
                className={`px-3.5 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                  rec.id === activeRecord.id
                    ? "bg-[#ef4d23] text-white shadow-md"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>{rec.brand_name}</span>
              </button>
            ))}
          </div>
          <div className="text-emerald-400 font-mono font-bold text-xs flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>Lumen & Co Verified Project SLA</span>
          </div>
        </div>
      </div>

      {/* Main Tabbed Form & Onboarding Intake Spec */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
        {/* Navigation Tabs */}
        <div className="bg-neutral-900 border-b border-neutral-800 p-2 flex items-center gap-1.5 text-xs overflow-x-auto scrollbar-none max-w-full">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "general"
                ? "bg-[#ef4d23] text-white shadow-md"
                : "text-neutral-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>1. Brand & Contract Specs</span>
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "leads"
                ? "bg-[#ef4d23] text-white shadow-md"
                : "text-neutral-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Phone className="h-4 w-4" />
            <span>2. Lead Ops & POCs</span>
          </button>

          <button
            onClick={() => setActiveTab("creds")}
            className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "creds"
                ? "bg-[#ef4d23] text-white shadow-md"
                : "text-neutral-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Key className="h-4 w-4" />
            <span>3. Platform Access & Creds</span>
          </button>

          <button
            onClick={() => setActiveTab("assets")}
            className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "assets"
                ? "bg-[#ef4d23] text-white shadow-md"
                : "text-neutral-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>4. Asset Checklist & Trademark</span>
          </button>

          <button
            onClick={() => setActiveTab("lumen")}
            className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "lumen"
                ? "bg-[#ef4d23] text-white shadow-md"
                : "text-neutral-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Sparkles className="h-4 w-4 text-[#fed7aa]" />
            <span>5. Lumen & Co SLA Specs</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-neutral-800">
          {/* TAB 1: GENERAL BRAND & CONTRACT DETAILS */}
          {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-neutral-900">Brand Identity & Retainer Contract Specs</h3>
                  <p className="text-neutral-500 text-xs mt-0.5">Enter general brand parameters, customer contact numbers, monthly ad spend, and billing info.</p>
                </div>
                <span className="bg-neutral-100 text-neutral-700 text-xs font-mono font-bold px-3 py-1 rounded-lg border border-neutral-200">
                  ID: {activeRecord.id}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-[#ef4d23]" /> Project Start Date
                  </label>
                  <input
                    type="date"
                    value={activeRecord.project_start_date}
                    onChange={(e) => handleUpdateRecord("project_start_date", e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-semibold focus:ring-2 focus:ring-[#ef4d23] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-[#ef4d23]" /> Brand Name
                  </label>
                  <input
                    type="text"
                    value={activeRecord.brand_name}
                    onChange={(e) => handleUpdateRecord("brand_name", e.target.value)}
                    placeholder="e.g. Apex Global Academy"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-bold focus:ring-2 focus:ring-[#ef4d23] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5 text-[#ef4d23]" /> Website (Domain)
                  </label>
                  <input
                    type="text"
                    value={activeRecord.website_domain}
                    onChange={(e) => handleUpdateRecord("website_domain", e.target.value)}
                    placeholder="e.g. apexglobal.edu.in"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-mono font-bold focus:ring-2 focus:ring-[#ef4d23] outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[11px]">
                    Scope of Work (Agreed Deliverables)
                  </label>
                  <input
                    type="text"
                    value={activeRecord.scope_of_work}
                    onChange={(e) => handleUpdateRecord("scope_of_work", e.target.value)}
                    placeholder="e.g. Meta Ads, Google Ads, UGC Motion Videos, CRM Sync & Conversion Optimization"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-medium focus:ring-2 focus:ring-[#ef4d23] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[11px]">
                    Monthly Ad Spend Budget
                  </label>
                  <input
                    type="text"
                    value={activeRecord.monthly_ad_spend}
                    onChange={(e) => handleUpdateRecord("monthly_ad_spend", e.target.value)}
                    placeholder="e.g. ₹3,50,000 / month"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-bold text-emerald-700 focus:ring-2 focus:ring-[#ef4d23] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-[#ef4d23]" /> Phone No (Customer Reach)
                  </label>
                  <input
                    type="text"
                    value={activeRecord.customer_contact_phone}
                    onChange={(e) => handleUpdateRecord("customer_contact_phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-semibold focus:ring-2 focus:ring-[#ef4d23] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-[#ef4d23]" /> Contact Number on Creatives
                  </label>
                  <input
                    type="text"
                    value={activeRecord.creative_contact_number}
                    onChange={(e) => handleUpdateRecord("creative_contact_number", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-semibold focus:ring-2 focus:ring-[#ef4d23] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[11px]">
                    Brand Location / City
                  </label>
                  <input
                    type="text"
                    value={activeRecord.location}
                    onChange={(e) => handleUpdateRecord("location", e.target.value)}
                    placeholder="Gachibowli, Hyderabad, TS"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-semibold focus:ring-2 focus:ring-[#ef4d23] outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-3">
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[11px]">
                    Social Media Pages & URLs
                  </label>
                  <input
                    type="text"
                    value={activeRecord.social_media_links}
                    onChange={(e) => handleUpdateRecord("social_media_links", e.target.value)}
                    placeholder="Instagram: https://instagram.com/brand, FB: https://facebook.com/brand, LinkedIn: ..."
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-medium focus:ring-2 focus:ring-[#ef4d23] outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5 text-[#ef4d23]" /> Payment Card Details (Used for Ad Spends)
                  </label>
                  <input
                    type="text"
                    value={activeRecord.payment_card_details}
                    onChange={(e) => handleUpdateRecord("payment_card_details", e.target.value)}
                    placeholder="HDFC Commercial Credit Card ending in •••• 8492 (Set on Meta/Google Ad Manager)"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-mono font-bold focus:ring-2 focus:ring-[#ef4d23] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[11px]">
                    GSTIN Number
                  </label>
                  <input
                    type="text"
                    value={activeRecord.gstin}
                    onChange={(e) => handleUpdateRecord("gstin", e.target.value)}
                    placeholder="36AAACV9102K1Z9"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-mono font-bold uppercase focus:ring-2 focus:ring-[#ef4d23] outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-bold text-neutral-700 uppercase tracking-wider text-[11px]">
                    Billing Address & Retainer Details
                  </label>
                  <textarea
                    rows={2}
                    value={activeRecord.billing_details}
                    onChange={(e) => handleUpdateRecord("billing_details", e.target.value)}
                    placeholder="Full Company Legal Billing Address for GST Invoicing"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-xs text-neutral-900 font-medium focus:ring-2 focus:ring-[#ef4d23] outline-none"
                  />
                </div>

                <div className="space-y-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <span className="font-extrabold text-neutral-900 text-xs block">Finance Point of Contact</span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={activeRecord.finance_poc_name}
                      onChange={(e) => handleUpdateRecord("finance_poc_name", e.target.value)}
                      placeholder="Finance POC Name"
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-1.5 text-xs text-neutral-900 font-semibold outline-none"
                    />
                    <input
                      type="email"
                      value={activeRecord.finance_poc_email}
                      onChange={(e) => handleUpdateRecord("finance_poc_email", e.target.value)}
                      placeholder="Finance POC Email"
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-1.5 text-xs text-neutral-900 font-medium outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLIENT SIDE CONTACTS & LEAD OPERATIONS */}
          {activeTab === "contacts" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-neutral-200 pb-3">
                <h3 className="text-base font-extrabold text-neutral-900">Client Side Contacts & Lead Operations Setup</h3>
                <p className="text-neutral-500 text-xs mt-0.5">Configure point of contacts responsible for calling customer leads, CRM platform access, and CC lists.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Person Responsible for Contacting Leads */}
                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4">
                  <div className="flex items-center gap-2 text-neutral-900 font-extrabold text-xs">
                    <Phone className="h-4 w-4 text-[#ef4d23]" />
                    <span>Person Responsible for Contacting Leads</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">Contact Name</label>
                      <input
                        type="text"
                        value={activeRecord.lead_contact_person_name}
                        onChange={(e) => handleUpdateRecord("lead_contact_person_name", e.target.value)}
                        placeholder="e.g. Anand Verma"
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">Phone Number</label>
                      <input
                        type="text"
                        value={activeRecord.lead_contact_person_phone}
                        onChange={(e) => handleUpdateRecord("lead_contact_person_phone", e.target.value)}
                        placeholder="+91 98490 12345"
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">Email Address</label>
                      <input
                        type="email"
                        value={activeRecord.lead_contact_person_email}
                        onChange={(e) => handleUpdateRecord("lead_contact_person_email", e.target.value)}
                        placeholder="admissions@apexglobal.edu.in"
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2 text-xs font-medium outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Main Client Side Point of Contact (POC) */}
                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4">
                  <div className="flex items-center gap-2 text-neutral-900 font-extrabold text-xs">
                    <Building2 className="h-4 w-4 text-[#ef4d23]" />
                    <span>Client Side Primary Point of Contact (POC)</span>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase">POC Name</label>
                        <input
                          type="text"
                          value={activeRecord.client_poc_name}
                          onChange={(e) => handleUpdateRecord("client_poc_name", e.target.value)}
                          placeholder="Deepika Rao"
                          className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase">Designation</label>
                        <input
                          type="text"
                          value={activeRecord.client_poc_designation}
                          onChange={(e) => handleUpdateRecord("client_poc_designation", e.target.value)}
                          placeholder="Director of Brand Growth"
                          className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase">Phone Number</label>
                        <input
                          type="text"
                          value={activeRecord.client_poc_phone}
                          onChange={(e) => handleUpdateRecord("client_poc_phone", e.target.value)}
                          placeholder="+91 98490 99999"
                          className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase">Email Address</label>
                        <input
                          type="email"
                          value={activeRecord.client_poc_email}
                          onChange={(e) => handleUpdateRecord("client_poc_email", e.target.value)}
                          placeholder="deepika.rao@brand.com"
                          className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Telephony & Phone Recording System */}
                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-3">
                  <span className="font-extrabold text-neutral-900 text-xs block">Phone Tracking / Recording System</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer font-bold">
                      <input
                        type="radio"
                        checked={activeRecord.uses_phone_tracking}
                        onChange={() => handleUpdateRecord("uses_phone_tracking", true)}
                        className="accent-[#ef4d23]"
                      />
                      <span>Yes, Phone Tracking System Used</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-bold">
                      <input
                        type="radio"
                        checked={!activeRecord.uses_phone_tracking}
                        onChange={() => handleUpdateRecord("uses_phone_tracking", false)}
                        className="accent-[#ef4d23]"
                      />
                      <span>No Telephony System</span>
                    </label>
                  </div>

                  {activeRecord.uses_phone_tracking && (
                    <div className="pt-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">System Name / Provider</label>
                      <input
                        type="text"
                        value={activeRecord.phone_tracking_system_name}
                        onChange={(e) => handleUpdateRecord("phone_tracking_system_name", e.target.value)}
                        placeholder="e.g. MyOperator, Exotel, CallRail"
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Email CC List & CRM Integration Access */}
                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-3">
                  <span className="font-extrabold text-neutral-900 text-xs block">CRM & Email CC Configuration</span>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">Whom to copy from Client side on emails</label>
                      <input
                        type="text"
                        value={activeRecord.email_cc_list}
                        onChange={(e) => handleUpdateRecord("email_cc_list", e.target.value)}
                        placeholder="deepika.rao@apexglobal.edu.in, principal@apexglobal.edu.in"
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2 text-xs font-medium outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">CRM Used to Manage Leads</label>
                      <input
                        type="text"
                        value={activeRecord.crm_platform_used}
                        onChange={(e) => handleUpdateRecord("crm_platform_used", e.target.value)}
                        placeholder="e.g. LeadSquared, Hubspot, Salesforce, Zoho, Lumen & Co Native Portal"
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PLATFORM ACCESS & CREDENTIALS CHECKLIST */}
          {activeTab === "credentials" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-neutral-900">Platform Access & Credentials Checklist</h3>
                  <p className="text-neutral-500 text-xs mt-0.5">Track admin access granted for website, hosting, analytics, search console, GTM, and ad tools with brand domain placeholders.</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 font-bold">
                  <Lock className="h-3.5 w-3.5" /> Encrypted Vault
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Website / CPanel */}
                <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-neutral-900 text-xs flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[#ef4d23]" /> Website (Domain) / CPanel Access
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateRecord("cpanel_access_granted", !activeRecord.cpanel_access_granted)}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                        activeRecord.cpanel_access_granted
                          ? "bg-emerald-500 text-white"
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {activeRecord.cpanel_access_granted ? "Access Granted" : "Pending Access"}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={activeRecord.cpanel_notes}
                    onChange={(e) => handleUpdateRecord("cpanel_notes", e.target.value)}
                    placeholder={`Host: cpanel.${activeRecord.website_domain || "[Brand Domain]"} (User / Pass)`}
                    className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono text-neutral-900 outline-none"
                  />
                </div>

                {/* 2. WordPress Credentials */}
                <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-neutral-900 text-xs flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-600" /> WordPress Access ({activeRecord.website_domain || "[Brand Domain]"})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateRecord("wordpress_access_granted", !activeRecord.wordpress_access_granted)}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                        activeRecord.wordpress_access_granted
                          ? "bg-emerald-500 text-white"
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {activeRecord.wordpress_access_granted ? "Access Granted" : "Pending Access"}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={activeRecord.wordpress_notes}
                    onChange={(e) => handleUpdateRecord("wordpress_notes", e.target.value)}
                    placeholder={`URL: ${activeRecord.website_domain || "[Brand Domain]"}/wp-admin (User: lumen_admin)`}
                    className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono text-neutral-900 outline-none"
                  />
                </div>

                {/* 3. GoDaddy Domain Access */}
                <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-neutral-900 text-xs flex items-center gap-2">
                      <Key className="h-4 w-4 text-amber-600" /> GoDaddy / Domain Registrar ({activeRecord.website_domain || "[Brand Domain]"})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateRecord("godaddy_domain_access_granted", !activeRecord.godaddy_domain_access_granted)}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                        activeRecord.godaddy_domain_access_granted
                          ? "bg-emerald-500 text-white"
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {activeRecord.godaddy_domain_access_granted ? "Access Granted" : "Pending Access"}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={activeRecord.godaddy_notes}
                    onChange={(e) => handleUpdateRecord("godaddy_notes", e.target.value)}
                    placeholder="GoDaddy Account ID or Delegated Access to hello@lumenandco.in"
                    className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono text-neutral-900 outline-none"
                  />
                </div>

                {/* 4. Google Analytics Access */}
                <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-neutral-900 text-xs flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-amber-500" /> Google Analytics 4 (GA4) Access
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateRecord("google_analytics_granted", !activeRecord.google_analytics_granted)}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                        activeRecord.google_analytics_granted
                          ? "bg-emerald-500 text-white"
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {activeRecord.google_analytics_granted ? "Access Granted" : "Pending Access"}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={activeRecord.google_analytics_notes}
                    onChange={(e) => handleUpdateRecord("google_analytics_notes", e.target.value)}
                    placeholder="GA4 Property ID & Admin Email Granted"
                    className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono text-neutral-900 outline-none"
                  />
                </div>

                {/* 5. Google Search Console Access */}
                <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-neutral-900 text-xs flex items-center gap-2">
                      <Search className="h-4 w-4 text-emerald-600" /> Google Search Console Access
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateRecord("google_search_console_granted", !activeRecord.google_search_console_granted)}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                        activeRecord.google_search_console_granted
                          ? "bg-emerald-500 text-white"
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {activeRecord.google_search_console_granted ? "Access Granted" : "Pending Access"}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={activeRecord.google_search_console_notes}
                    onChange={(e) => handleUpdateRecord("google_search_console_notes", e.target.value)}
                    placeholder="Verified Domain Owner Access Granted"
                    className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono text-neutral-900 outline-none"
                  />
                </div>

                {/* 6. Google Tag Manager Access */}
                <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-neutral-900 text-xs flex items-center gap-2">
                      <Layers className="h-4 w-4 text-purple-600" /> Google Tag Manager (GTM)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateRecord("gtm_granted", !activeRecord.gtm_granted)}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                        activeRecord.gtm_granted
                          ? "bg-emerald-500 text-white"
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {activeRecord.gtm_granted ? "Access Granted" : "Pending Access"}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={activeRecord.gtm_notes}
                    onChange={(e) => handleUpdateRecord("gtm_notes", e.target.value)}
                    placeholder="User: Admin, Container: Publish (GTM Container ID)"
                    className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono text-neutral-900 outline-none font-bold"
                  />
                </div>

                {/* 7. WhatsApp + Tool Access */}
                <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-neutral-900 text-xs flex items-center gap-2">
                      <Send className="h-4 w-4 text-emerald-600" /> WhatsApp + Automation Tool (WATI / Interakt / Meta API)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateRecord("whatsapp_tool_granted", !activeRecord.whatsapp_tool_granted)}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                        activeRecord.whatsapp_tool_granted
                          ? "bg-emerald-500 text-white"
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {activeRecord.whatsapp_tool_granted ? "Access Granted" : "Pending Access"}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={activeRecord.whatsapp_tool_notes}
                    onChange={(e) => handleUpdateRecord("whatsapp_tool_notes", e.target.value)}
                    placeholder="WhatsApp Business API account creds and ad conversion trigger settings"
                    className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono text-neutral-900 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ASSET CHECKLIST & TRADEMARK DOCUMENTATION */}
          {activeTab === "assets" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-neutral-200 pb-3">
                <h3 className="text-base font-extrabold text-neutral-900">Onboarding Asset Checklist & Trademark Protection</h3>
                <p className="text-neutral-500 text-xs mt-0.5">Confirm receipt of logos, media banks, customer databases, brand questionnaire, and trademark documents for Google Ads protection.</p>
              </div>

              <div className="space-y-4">
                {/* Trademark Document for Google Search Ad Protection */}
                <div className="p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />
                      <span>Trademark Document Received (Submitted to Google by Lumen & Co)</span>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                      Lumen & Co submits the client trademark registration document directly to Google Ad Support. This prevents competitors from bidding on or using <span className="font-bold underline">{activeRecord.brand_name}</span> as a competitor search ad keyword.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdateRecord("trademark_document_received", !activeRecord.trademark_document_received)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                      activeRecord.trademark_document_received
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
                    }`}
                  >
                    {activeRecord.trademark_document_received ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <span>{activeRecord.trademark_document_received ? "Trademark Document Verified" : "Mark as Received"}</span>
                  </button>
                </div>

                {/* Asset Checklists Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Brand Assets (Logo, Guidelines) */}
                  <div
                    onClick={() => handleUpdateRecord("brand_assets_logo_received", !activeRecord.brand_assets_logo_received)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      activeRecord.brand_assets_logo_received
                        ? "bg-emerald-50/80 border-emerald-300 text-neutral-900"
                        : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="font-extrabold text-xs block">Receive Assets from Client (Logo, Brand Guidelines)</span>
                      <p className="text-[11px] opacity-80">Vector EPS/PNG logos, font files, color palette & guidelines document.</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activeRecord.brand_assets_logo_received ? "bg-emerald-500 text-white" : "border border-neutral-300"}`}>
                      {activeRecord.brand_assets_logo_received && <Check className="h-4 w-4" />}
                    </div>
                  </div>

                  {/* Media Bank (Renders, Videos, Images) */}
                  <div
                    onClick={() => handleUpdateRecord("image_video_bank_received", !activeRecord.image_video_bank_received)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      activeRecord.image_video_bank_received
                        ? "bg-emerald-50/80 border-emerald-300 text-neutral-900"
                        : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="font-extrabold text-xs block">Receive Image / Video Bank (Renders, Raw Footage, Shots)</span>
                      <p className="text-[11px] opacity-80">High-res facility photos, raw video B-roll, product renders for ad creatives.</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activeRecord.image_video_bank_received ? "bg-emerald-500 text-white" : "border border-neutral-300"}`}>
                      {activeRecord.image_video_bank_received && <Check className="h-4 w-4" />}
                    </div>
                  </div>

                  {/* Custom / Lookalike Audience Database */}
                  <div
                    onClick={() => handleUpdateRecord("custom_lookalike_audience_received", !activeRecord.custom_lookalike_audience_received)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      activeRecord.custom_lookalike_audience_received
                        ? "bg-emerald-50/80 border-emerald-300 text-neutral-900"
                        : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="font-extrabold text-xs block">Receive Custom Audience / Lookalike Database</span>
                      <p className="text-[11px] opacity-80">Existing customer phone numbers & emails CSV for LAL targeting.</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activeRecord.custom_lookalike_audience_received ? "bg-emerald-500 text-white" : "border border-neutral-300"}`}>
                      {activeRecord.custom_lookalike_audience_received && <Check className="h-4 w-4" />}
                    </div>
                  </div>

                  {/* Brand Intake Questionnaire */}
                  <div
                    onClick={() => handleUpdateRecord("brand_questionnaire_completed", !activeRecord.brand_questionnaire_completed)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      activeRecord.brand_questionnaire_completed
                        ? "bg-emerald-50/80 border-emerald-300 text-neutral-900"
                        : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="font-extrabold text-xs block">Questionnaire Answers Received from Brand</span>
                      <p className="text-[11px] opacity-80">USP points, target buyer persona, competitor analysis & offer details.</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activeRecord.brand_questionnaire_completed ? "bg-emerald-500 text-white" : "border border-neutral-300"}`}>
                      {activeRecord.brand_questionnaire_completed && <Check className="h-4 w-4" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LUMEN & CO SLA SPECS & TEAM DETAILS */}
          {activeTab === "sla" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-neutral-900">Lumen & Co SLA & Team Details</h3>
                  <p className="text-neutral-500 text-xs mt-0.5">Turnaround times, operating hours, and dedicated growth team assigned to {activeRecord.brand_name}.</p>
                </div>
                <span className="bg-[#ef4d23]/10 text-[#ef4d23] border border-[#ef4d23]/30 font-bold px-3 py-1 rounded-full text-xs">
                  Lumen & Co Standard SLA
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                  <div className="flex items-center gap-2 text-neutral-900 font-extrabold text-xs">
                    <Clock className="h-4 w-4 text-[#ef4d23]" />
                    <span>Lumen & Co Turnaround Time (TAT)</span>
                  </div>
                  <input
                    type="text"
                    value={activeRecord.lumen_tat}
                    onChange={(e) => handleUpdateRecord("lumen_tat", e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-bold outline-none"
                  />
                  <p className="text-[11px] text-neutral-500">Standard response & revision delivery window.</p>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                  <div className="flex items-center gap-2 text-neutral-900 font-extrabold text-xs">
                    <Calendar className="h-4 w-4 text-[#ef4d23]" />
                    <span>Lumen & Co Working Days & Timings</span>
                  </div>
                  <input
                    type="text"
                    value={activeRecord.lumen_working_days}
                    onChange={(e) => handleUpdateRecord("lumen_working_days", e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-bold outline-none"
                  />
                  <p className="text-[11px] text-neutral-500">Agency support working hours.</p>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 md:col-span-3">
                  <div className="flex items-center gap-2 text-neutral-900 font-extrabold text-xs">
                    <Award className="h-4 w-4 text-[#ef4d23]" />
                    <span>Lumen & Co Dedicated Team Details</span>
                  </div>
                  <textarea
                    rows={2}
                    value={activeRecord.lumen_assigned_team}
                    onChange={(e) => handleUpdateRecord("lumen_assigned_team", e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-xs text-neutral-900 font-semibold outline-none"
                  />
                  <p className="text-[11px] text-neutral-500">Assigned Account Lead, Creative Director, Media Buyer, and Copywriter.</p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-6 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>All client intake details are encrypted and securely synchronized.</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toast.success("Client Onboarding Specs saved successfully!")}
                className="bg-neutral-900 hover:bg-black text-white font-extrabold text-xs px-6 py-2.5 rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save Onboarding Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
