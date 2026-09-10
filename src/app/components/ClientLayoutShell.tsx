import { ReactNode, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CheckCircle2,
  Receipt,
  FileText,
  MessageSquare,
  Search,
  Bell,
  Mail,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Sparkles,
  PhoneCall,
  UserCheck,
  KeyRound,
  Rocket,
  Download,
  Users,
  Video,
  BarChart3,
  Lock,
  Menu,
  X,
} from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import EmailSenderModal from "./EmailSenderModal";
import BuiltInMessengerModal from "./BuiltInMessengerModal";

export type ClientTab =
  | "overview"
  | "approvals"
  | "leads"
  | "reports"
  | "creatives"
  | "notifications"
  | "profile"
  | "invoices"
  | "scope"
  | "support";

interface ClientLayoutShellProps {
  currentTab: ClientTab;
  onTabChange: (tab: ClientTab) => void;
  children: ReactNode;
  clientName?: string;
  clientCompany?: string;
  onSignOut?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTermsOfService?: () => void;
}

export default function ClientLayoutShell({
  currentTab,
  onTabChange,
  children,
  clientName = "Mark Davis",
  clientCompany = "Northbeam E-Commerce",
  onSignOut = () => {},
  onOpenPrivacyPolicy,
  onOpenTermsOfService,
}: ClientLayoutShellProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarNavItems: { id: ClientTab; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "approvals", label: "Creative Approvals", icon: CheckCircle2, badge: "2 Pending" },
    { id: "leads", label: "Business Leads", icon: Users, badge: "12 New" },
    { id: "reports", label: "Campaign Analytics", icon: BarChart3 },
    { id: "creatives", label: "Creative Vault & UGC", icon: Sparkles, badge: "Reels" },
    { id: "notifications", label: "Notifications Feed", icon: Bell, badge: "3 Alerts" },
    { id: "profile", label: "Profile & Account", icon: UserCheck },
    { id: "invoices", label: "Invoices & Billing", icon: Receipt },
    { id: "scope", label: "Retainer Scope & SLA", icon: FileText },
    { id: "support", label: "Support & Grievance", icon: ShieldCheck, badge: "DPDP 2023" },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0c0d12] text-white flex flex-col font-sans isolate z-10">
      {/* Background Video Stage (Vivid Ambient Motion Stage) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-gradient-to-br from-[#0c0d12] via-[#12131c] to-[#08090d]">
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-70 transition-opacity duration-700"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4"
        />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP BAR (64px Translucent Frosted Glass Header) */}
      {/* ========================================================================= */}
      <header className="h-[64px] bg-[#121318]/70 backdrop-blur-2xl text-white border-b border-white/15 px-3 sm:px-5 flex items-center justify-between shrink-0 z-30 shadow-2xl">
        {/* Left Branding & Client Company */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-full border border-white/20 transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img src="/lumen-and-co-logo.png" alt="Lumen & Co" className="h-8 sm:h-11 w-auto object-contain transition-all" />
          </Link>

          <span className="hidden sm:inline text-white/20 text-sm">|</span>

          <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
            <UserCheck className="h-3.5 w-3.5 text-[#ef4d23]" />
            <span className="text-xs font-bold text-white truncate max-w-[140px] md:max-w-none">{clientCompany}</span>
            <span className="hidden md:inline-block text-[9px] font-extrabold uppercase bg-[#ef4d23] text-white px-2.5 py-0.5 rounded-full border border-white/30 tracking-wider shadow-md shadow-[#ef4d23]/30">
              Client Portal
            </span>
          </div>
        </div>

        {/* Center Account Manager Info Chip */}
        <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs text-white/90 shadow-inner">
          <span className="text-white/60 text-[10px] uppercase font-bold">Account Manager:</span>
          <span className="font-extrabold text-emerald-400">Sarah Chen</span>
          <a
            href="tel:+919849000000"
            className="flex items-center gap-1 text-[11px] text-white hover:text-white bg-white/15 hover:bg-white/25 px-2.5 py-0.5 rounded-full transition-colors font-semibold ml-1 border border-white/20 shadow-xs"
          >
            <PhoneCall className="h-3 w-3 text-emerald-400" />
            <span>Direct Call</span>
          </a>
        </div>

        {/* Right Action Icons & User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick App Switcher Links */}
          <div className="hidden xl:flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/20 text-[11px] font-semibold">
            <Link to="/sahit" className="px-3 py-1 text-white/70 hover:text-white rounded-full transition-colors hover:bg-white/15">
              CRM
            </Link>
            <Link to="/delivery" className="px-3 py-1 text-white/70 hover:text-white rounded-full transition-colors hover:bg-white/15">
              Delivery Hub
            </Link>
            <Link to="/client" className="px-3 py-1 bg-[#ef4d23] text-white rounded-full shadow-lg shadow-[#ef4d23]/30 font-bold">
              Client Portal
            </Link>
          </div>

          {/* Notifications Center */}
          <NotificationCenter
            isOpen={isNotificationsOpen}
            onOpenChange={setIsNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 transition-all text-xs font-semibold text-white cursor-pointer shadow-xs"
            >
              <div className="w-6 h-6 rounded-full bg-[#ef4d23] text-white flex items-center justify-center text-[10px] font-bold shadow-md shadow-[#ef4d23]/30">
                {clientName.charAt(0)}
              </div>
              <span className="hidden sm:inline font-bold">{clientName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-white/60" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-[#161722]/95 backdrop-blur-3xl text-white rounded-3xl shadow-2xl border border-white/20 p-3 z-50 text-xs">
                <div className="px-3 py-2 border-b border-white/15 mb-1">
                  <p className="font-bold text-white">{clientName}</p>
                  <p className="text-[10px] text-white/60 truncate">{clientCompany}</p>
                  <span className="inline-block mt-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    Verified Client Account
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onTabChange("profile");
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-2xl font-semibold flex items-center gap-2 transition-colors text-white/80 hover:text-white"
                >
                  <UserCheck className="h-3.5 w-3.5 text-[#ef4d23]" /> Account Settings
                </button>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onTabChange("scope");
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-2xl font-semibold flex items-center gap-2 transition-colors text-white/80 hover:text-white"
                >
                  <FileText className="h-3.5 w-3.5 text-[#ef4d23]" /> Retainer SLA & Scope
                </button>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onSignOut();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-red-500/20 text-red-400 rounded-2xl font-bold flex items-center gap-2 mt-1 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BODY LAYOUT: DESKTOP GLASS SIDEBAR + MOBILE DRAWER + MAIN CONTENT */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)] relative">
        {/* Mobile Navigation Drawer Backdrop & Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <aside className="relative w-[280px] max-w-[85vw] bg-[#14151f]/95 backdrop-blur-3xl text-white flex flex-col h-full z-50 border-r border-white/20 shadow-2xl overflow-y-auto p-4 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <img src="/lumen-and-co-logo.png" alt="Lumen & Co" className="h-8 w-auto object-contain" />
                  <span className="text-xs font-extrabold text-white">Client Portal</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-white/70 hover:text-white bg-white/10 rounded-full border border-white/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile App Switcher */}
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/20 text-xs font-semibold">
                <Link to="/sahit" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-1.5 text-white/80 hover:text-white rounded-full">
                  CRM
                </Link>
                <Link to="/delivery" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-1.5 text-white/80 hover:text-white rounded-full">
                  Delivery
                </Link>
                <Link to="/client" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-1.5 bg-[#ef4d23] text-white rounded-full font-bold">
                  Client
                </Link>
              </div>

              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest px-3 block mb-2">
                  Client Portal Menu
                </span>
                {sidebarNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-[#ef4d23] text-white border border-white/40 shadow-lg"
                          : "bg-white/10 hover:bg-white/20 text-white/90 border border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-white" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="p-3 border-t border-white/15 text-[11px] space-y-2">
                <p className="font-bold text-white/70">{clientCompany}</p>
                <p className="text-[10px] text-emerald-400 font-semibold">AM: Sarah Chen (+91 98490 00000)</p>
              </div>
            </aside>
          </div>
        )}

        {/* Left Fixed Sidebar */}
        <aside className="hidden lg:flex w-[240px] text-white flex-col justify-between shrink-0 z-20 h-full bg-transparent">
          <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            <span className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest px-3 block mb-2">
              Client Portal Menu
            </span>

            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-extrabold transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? "bg-[#ef4d23] text-white font-extrabold border border-white/40 backdrop-blur-xl"
                      : "bg-white/20 hover:bg-white/35 backdrop-blur-xl text-white/90 hover:text-white border border-white/40 hover:border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-white drop-shadow-sm" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/30 text-white border border-white/40 shadow-xs"
                          : "bg-white/25 text-white/90 border border-white/35"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Persistent Footer Links (Privacy Policy & ToS) */}
          <div className="p-4 border-t border-white/10 bg-transparent text-[11px] space-y-2 shrink-0">
            <div className="flex items-center justify-between text-white/60">
              <span className="font-bold">Lumen & Co Portal</span>
              <span className="text-[9px] bg-white/15 px-2 py-0.5 rounded-full font-mono text-white/80 font-bold border border-white/20">
                Policy v1.0
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenPrivacyPolicy}
                className="text-white/80 hover:text-[#ef4d23] transition-colors underline font-semibold cursor-pointer"
              >
                Privacy Policy
              </button>
              <span className="text-white/30">•</span>
              <button
                onClick={onOpenTermsOfService}
                className="text-white/80 hover:text-[#ef4d23] transition-colors underline font-semibold cursor-pointer"
              >
                Terms of Service
              </button>
            </div>

            <button
              onClick={() => onTabChange("support")}
              className="w-full text-left flex items-center justify-between text-[10px] text-white/50 hover:text-white pt-1 transition-colors font-medium cursor-pointer"
            >
              <span>DPDP Act 2023 Grievance</span>
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 relative overflow-y-auto p-4 sm:p-6 isolate h-full">
          {children}
        </main>
      </div>

      {/* Auxiliary Modals */}
      <EmailSenderModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        defaultRecipient="sahitsai7@gmail.com"
      />

      <BuiltInMessengerModal
        isOpen={isMessengerOpen}
        onClose={() => setIsMessengerOpen(false)}
        currentUserRole="client"
        currentUserId="client-101"
        currentUserName={`${clientName} (${clientCompany})`}
        clientBrandId="client-101"
        clientBrandName={clientCompany}
      />
    </div>
  );
}

