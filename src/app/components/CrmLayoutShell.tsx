import { ReactNode, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  CreditCard,
  BarChart3,
  MessageSquare,
  UserCheck,
  Settings,
  Search,
  Bell,
  Mail,
  ShieldCheck,
  ChevronDown,
  Plus,
  LogOut,
  Sparkles,
  CheckSquare,
  KeyRound,
  Tag,
  Rocket,
  Menu,
  X,
} from "lucide-react";
import CommandPalette from "./CommandPalette";
import NotificationCenter from "./NotificationCenter";
import EmailSenderModal from "./EmailSenderModal";
import BuiltInMessengerModal from "./BuiltInMessengerModal";
import { useAdminAuth } from "./useAdminAuth";

import { UserRole, SchoolClient, ClientBusinessLead, INITIAL_SCHOOL_CLIENTS, INITIAL_CLIENT_BUSINESS_LEADS } from "@/lib/lumenandco.types";
import { Deliverable, INITIAL_DELIVERABLES } from "@/lib/delivery.functions";

export type CrmTab =
  | "codes"
  | "dashboard"
  | "planner"
  | "onboarding"
  | "stage"
  | "leads"
  | "clients"
  | "chat"
  | "contracts"
  | "billing"
  | "analytics"
  | "comms"
  | "team"
  | "settings";

interface CrmLayoutShellProps {
  currentTab: CrmTab;
  onTabChange: (tab: CrmTab) => void;
  children: ReactNode;
  onQuickAction?: () => void;
  currentUserRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  clients?: SchoolClient[];
  clientLeads?: ClientBusinessLead[];
  deliverables?: Deliverable[];
}

export default function CrmLayoutShell({
  currentTab,
  onTabChange,
  children,
  onQuickAction,
  currentUserRole = "owner",
  onRoleChange = () => {},
  clients = [],
  clientLeads = [],
  deliverables = [],
}: CrmLayoutShellProps) {
  const admin = useAdminAuth();

  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarNavItems: { id: CrmTab; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
    { id: "codes", label: "Code Library", icon: KeyRound, badge: "Codes" },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "planner", label: "My Workday Planner", icon: CheckSquare, badge: "My Tasks" },
    { id: "onboarding", label: "Client Onboarding", icon: Rocket, badge: "New" },
    { id: "stage", label: "Performance", icon: Sparkles, badge: "AI" },
    { id: "leads", label: "Leads", icon: Users, badge: "5" },
    { id: "clients", label: "Clients", icon: Building2, badge: "5" },
    { id: "chat", label: "Lumen & Co Messenger", icon: MessageSquare, badge: "Live" },
    { id: "contracts", label: "Billing & Dues", icon: CreditCard, badge: "₹" },
    { id: "billing", label: "Comm Log", icon: MessageSquare },
    { id: "analytics", label: "Internal Reports", icon: BarChart3 },
    { id: "comms", label: "Team Ops", icon: UserCheck },
    { id: "team", label: "Team", icon: UserCheck },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#121318] text-[#222222] flex flex-col font-sans isolate z-10">
      {/* Stage Background Video Overlay (Viewport-wide glass stage) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-gradient-to-br from-[#121318] via-[#181924] to-[#0c0d12]">
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-80 transition-opacity duration-700"
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
      {/* 1. TOP BAR (64px Glass Header) */}
      {/* ========================================================================= */}
      <header className="h-[64px] bg-black/30 backdrop-blur-3xl text-white border-b border-white/20 px-3 sm:px-5 flex items-center justify-between shrink-0 z-30 shadow-xl">
        {/* Left Branding & Mobile Toggle */}
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
            <ShieldCheck className="h-3.5 w-3.5 text-[#ef4d23]" />
            <span className="text-xs font-semibold text-white">Lumen & Co Internal CRM</span>
          </div>
        </div>

        {/* Center Search */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setIsCmdPaletteOpen(true)}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/90 hover:text-white px-4 py-2 rounded-full border border-white/20 text-xs transition-all w-64 justify-between cursor-pointer shadow-inner font-medium"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-white/70" />
              <span>Search clients (⌘K)...</span>
            </div>
            <kbd className="bg-white/20 text-white text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/30">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons & User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick App Switcher Links */}
          <div className="hidden xl:flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/20 text-[11px] font-semibold">
            <Link to="/sahit" className="px-3 py-1 bg-[#ef4d23] text-white rounded-full shadow-lg shadow-[#ef4d23]/30 font-extrabold">
              CRM
            </Link>
            <Link to="/delivery" className="px-3 py-1 text-white/80 hover:text-white rounded-full transition-colors hover:bg-white/10 flex items-center gap-1">
              <Rocket className="h-3 w-3 text-[#ef4d23]" />
              <span>Delivery Hub</span>
            </Link>
            <Link to="/client" className="px-3 py-1 text-white/80 hover:text-white rounded-full transition-colors hover:bg-white/10">
              Client Portal
            </Link>
          </div>

          {/* Real-time Email Button */}
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-semibold px-3 sm:px-3.5 py-2 rounded-full border border-white/30 transition-all cursor-pointer"
          >
            <Mail className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Send Email</span>
          </button>

          {/* Notifications Center */}
          <NotificationCenter
            isOpen={isNotificationsOpen}
            onOpenChange={setIsNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />

          {/* User Profile 👤 Sahit ▾ */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/25 transition-all text-xs font-semibold text-white cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#ef4d23] text-white flex items-center justify-center text-[10px] font-bold border border-white/30 shadow-xs">
                S
              </div>
              <span className="hidden sm:inline">Sahit</span>
              <ChevronDown className="h-3.5 w-3.5 text-white/70" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#18181f]/95 backdrop-blur-2xl text-white rounded-3xl shadow-2xl border border-white/20 p-3 z-50 text-xs">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="font-semibold text-white">Sahit Sai</p>
                  <p className="text-[10px] text-white/60 truncate">sahitsai6@gmail.com</p>
                  <span className="inline-block mt-1 bg-[#ef4d23]/30 text-[#fed7aa] border border-[#ef4d23]/40 text-[9px] font-semibold px-2.5 py-0.5 rounded-full uppercase">
                    Founder / Owner
                  </span>
                </div>
                <Link
                  to="/delivery"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-2xl font-semibold flex items-center gap-2 transition-colors text-[#ef4d23]"
                >
                  <Rocket className="h-3.5 w-3.5" /> Switch to Delivery Hub
                </Link>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onTabChange("settings");
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-2xl font-medium flex items-center gap-2 transition-colors"
                >
                  <Settings className="h-3.5 w-3.5 text-white/60" /> Settings & API
                </button>
                <button
                  onClick={() => admin.signOut()}
                  className="w-full text-left px-3 py-2 hover:bg-red-500/20 text-red-400 rounded-2xl font-medium flex items-center gap-2 mt-1 transition-colors"
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
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sliding Glassy Sidebar */}
            <aside className="relative w-[280px] max-w-[85vw] bg-[#14151f]/95 backdrop-blur-3xl text-white flex flex-col h-full z-50 border-r border-white/20 shadow-2xl overflow-y-auto p-4 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <img src="/lumen-and-co-logo.png" alt="Lumen & Co" className="h-8 w-auto object-contain" />
                  <span className="text-xs font-extrabold text-white">CRM Menu</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-white/70 hover:text-white bg-white/10 rounded-full border border-white/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* App Switcher for Mobile */}
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/20 text-xs font-semibold">
                <Link to="/sahit" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-1.5 bg-[#ef4d23] text-white rounded-full font-bold">
                  CRM
                </Link>
                <Link to="/delivery" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-1.5 text-white/80 hover:text-white rounded-full">
                  Delivery
                </Link>
                <Link to="/client" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-1.5 text-white/80 hover:text-white rounded-full">
                  Client
                </Link>
              </div>

              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] font-extrabold text-[#ef4d23] uppercase tracking-widest px-3 block mb-2">
                  CRM Operations Menu
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

              {onQuickAction && (
                <button
                  onClick={() => {
                    onQuickAction();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#ef4d23] text-white text-xs font-extrabold py-3 px-4 rounded-full shadow-lg border border-white/30"
                >
                  <Plus className="h-4 w-4" /> New Record
                </button>
              )}
            </aside>
          </div>
        )}

        {/* Desktop Fixed Sidebar (240px) */}
        <aside className="hidden lg:flex w-[240px] text-white flex-col shrink-0 z-20 h-full bg-transparent">
          <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            <span className="text-[10px] font-extrabold text-[#ef4d23] uppercase tracking-widest px-3 block mb-2 drop-shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4d23] animate-pulse"></span>
              CRM Operations Menu
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

          {/* Quick Action Footer */}
          <div className="p-4 border-t border-white/20 bg-transparent">
            {onQuickAction && (
              <button
                onClick={onQuickAction}
                className="w-full flex items-center justify-center gap-2 bg-white/25 hover:bg-white/40 backdrop-blur-xl text-white text-xs font-extrabold py-2.5 px-4 rounded-full border border-white/40 transition-all cursor-pointer hover:scale-[1.01] hover:border-white/70"
              >
                <Plus className="h-4 w-4 text-[#fed7aa]" /> New Record
              </button>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 relative overflow-y-auto p-4 sm:p-6 isolate h-full">
          {children}
        </main>
      </div>

      {/* Auxiliary Modals */}
      <CommandPalette
        isOpen={isCmdPaletteOpen}
        onClose={() => setIsCmdPaletteOpen(false)}
        clients={clients.length > 0 ? clients : INITIAL_SCHOOL_CLIENTS}
        clientLeads={clientLeads.length > 0 ? clientLeads : INITIAL_CLIENT_BUSINESS_LEADS}
        deliverables={deliverables.length > 0 ? deliverables : INITIAL_DELIVERABLES}
        onCreateNew={onQuickAction}
        onNavigateTab={(tab) => onTabChange(tab as CrmTab)}
      />

      <EmailSenderModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        defaultRecipient="sahitsai7@gmail.com"
      />

      <BuiltInMessengerModal
        isOpen={isMessengerOpen}
        onClose={() => setIsMessengerOpen(false)}
        currentUserRole={currentUserRole === "owner" ? "founder" : (currentUserRole as any)}
        currentUserName="Sahit Sai"
      />

    </div>
  );
}
