import { ReactNode, useState } from "react";
import { Link } from "@tanstack/react-router";
import LiveBackgroundVideo from "./LiveBackgroundVideo";
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
  FolderDown,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";
import CommandPalette from "./CommandPalette";
import NotificationCenter from "./NotificationCenter";
import EmailSenderModal from "./EmailSenderModal";
import BuiltInMessengerModal from "./BuiltInMessengerModal";
import { useAdminAuth } from "./useAdminAuth";

import { UserRole, SchoolClient, ClientBusinessLead, INITIAL_SCHOOL_CLIENTS, INITIAL_CLIENT_BUSINESS_LEADS } from "@/lib/lumenandco.types";
import { Deliverable, INITIAL_DELIVERABLES } from "@/lib/delivery.functions";
import { AdvancedLead } from "@/lib/crm.functions";

export type CrmTab =
  | "codes"
  | "dashboard"
  | "documents"
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
  leads?: AdvancedLead[];
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
  leads = [],
  deliverables = [],
}: CrmLayoutShellProps) {
  const admin = useAdminAuth();

  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lumen_crm_sidebar_collapsed") === "true";
    }
    return false;
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("lumen_crm_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  const totalLeadsCount = (leads?.length || 0) + (clientLeads?.length || 0);

  const sidebarNavItems: { id: CrmTab; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
    { id: "codes", label: "Code Library", icon: KeyRound, badge: "Codes" },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "documents", label: "Documents", icon: FolderDown, badge: "Vault" },
    { id: "planner", label: "My Workday Planner", icon: CheckSquare, badge: "My Tasks" },
    { id: "onboarding", label: "Client Onboarding", icon: Rocket, badge: "New" },
    { id: "stage", label: "Performance", icon: Sparkles, badge: "AI" },
    { id: "leads", label: "Leads", icon: Users, badge: totalLeadsCount > 0 ? String(totalLeadsCount) : undefined },
    { id: "clients", label: "Clients", icon: Building2, badge: clients?.length > 0 ? String(clients.length) : undefined },
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
      <LiveBackgroundVideo
        containerClassName="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-gradient-to-br from-[#121318] via-[#181924] to-[#0c0d12]"
        className="opacity-80"
        overlayClassName=""
      />

      {/* ========================================================================= */}
      {/* 1. TOP BAR (64px Glass Header) */}
      {/* ========================================================================= */}
      <header className="h-[64px] bg-black/30 backdrop-blur-3xl text-white border-b border-white/20 px-3 sm:px-5 flex items-center justify-between shrink-0 z-30 shadow-xl">
        {/* Left Branding & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-full border border-white/20 transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity bg-white/95 rounded-xl px-3 py-1.5 border border-white/40 shadow-md">
            <img src="/lumen-and-co-logo.png" alt="Lumen & Co" className="h-8 sm:h-10 w-auto object-contain transition-all" />
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
            <Link to="/sahit/" className="px-3 py-1 bg-[#ef4d23] text-white rounded-full shadow-lg shadow-[#ef4d23]/30 font-extrabold">
              CRM
            </Link>
            <Link to="/delivery/" className="px-3 py-1 text-white/80 hover:text-white rounded-full transition-colors hover:bg-white/10 flex items-center gap-1">
              <Rocket className="h-3 w-3 text-[#ef4d23]" />
              <span>Delivery Hub</span>
            </Link>
            <Link to="/client/" className="px-3 py-1 text-white/80 hover:text-white rounded-full transition-colors hover:bg-white/10">
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

          {/* User Profile 👤 */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/25 transition-all text-xs font-semibold text-white cursor-pointer"
            >
              {admin.user?.picture ? (
                <img
                  src={admin.user.picture}
                  alt={admin.name}
                  className="w-6 h-6 rounded-full object-cover border border-white/40 shadow-xs"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#ef4d23] text-white flex items-center justify-center text-[10px] font-bold border border-white/30 shadow-xs">
                  {(admin.name || "Sahit")[0].toUpperCase()}
                </div>
              )}
              <span className="hidden sm:inline">
                {admin.user?.given_name || admin.name.split(" ")[0] || "Sahit"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-white/70" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#18181f]/95 backdrop-blur-2xl text-white rounded-3xl shadow-2xl border border-white/20 p-3 z-50 text-xs">
                <div className="px-3 py-2.5 border-b border-white/10 mb-1.5">
                  <div className="flex items-center gap-2.5 mb-2">
                    {admin.user?.picture ? (
                      <img
                        src={admin.user.picture}
                        alt={admin.name}
                        className="w-9 h-9 rounded-full object-cover border border-[#ef4d23] shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#ef4d23] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {(admin.name || "Sahit")[0].toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white truncate">{admin.name}</p>
                      <p className="text-[10px] text-white/60 truncate">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block bg-[#ef4d23]/30 text-[#fed7aa] border border-[#ef4d23]/40 text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase">
                      {admin.roleLabel || "Super Admin (Owner)"}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-medium px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Google Verified
                    </span>
                  </div>
                </div>
                <Link
                  to="/delivery/"
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
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)] p-2.5 sm:p-4 lg:p-6 gap-2.5 sm:gap-4 lg:gap-6 relative">
        {/* Mobile Navigation Drawer Backdrop & Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sliding Glassy Sidebar */}
            <aside className="relative w-[280px] max-w-[85vw] bg-[#14151f]/95 backdrop-blur-3xl text-white flex flex-col h-full z-50 border-r border-white/20 shadow-2xl overflow-y-auto p-4 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <span className="bg-white/95 rounded-xl px-2 py-0.5 border border-white/40 shadow-sm inline-block">
                    <img src="/lumen-and-co-logo.png" alt="Lumen & Co" className="h-6 w-auto object-contain" />
                  </span>
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
                <Link to="/sahit/" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-1.5 bg-[#ef4d23] text-white rounded-full font-bold">
                  CRM
                </Link>
                <Link to="/delivery/" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-1.5 text-white/80 hover:text-white rounded-full">
                  Delivery
                </Link>
                <Link to="/client/" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-1.5 text-white/80 hover:text-white rounded-full">
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

        {/* Desktop & Tablet Adjustable Sidebar */}
        <aside
          className={`hidden md:flex flex-col justify-between shrink-0 z-20 h-full text-neutral-900 transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? "w-[72px]" : "w-[240px]"
          }`}
        >
          {/* Menu Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-2.5 sm:p-3 border border-white/60 shadow-md flex-1 flex flex-col overflow-hidden">
            {/* Collapse / Expand Header */}
            <div className={`flex items-center pb-2 mb-1.5 border-b border-neutral-200/60 ${isSidebarCollapsed ? "justify-center" : "justify-between px-2"}`}>
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                  Navigation
                </span>
              )}
              <button
                type="button"
                onClick={toggleSidebar}
                className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all cursor-pointer"
                title={isSidebarCollapsed ? "Expand sidebar (full labels)" : "Collapse sidebar (compact view)"}
                aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isSidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </button>
            </div>

            {/* Nav Items List */}
            <div className="space-y-1 overflow-y-auto flex-1 pr-0.5">
              {sidebarNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    title={isSidebarCollapsed ? `${item.label}${item.badge ? ` (${item.badge})` : ""}` : undefined}
                    className={`w-full flex items-center rounded-2xl text-xs font-semibold transition-all cursor-pointer relative group ${
                      isSidebarCollapsed
                        ? "justify-center p-3"
                        : "justify-between px-3.5 py-2.5"
                    } ${
                      isActive
                        ? "bg-[#ef4d23] text-white shadow-xs"
                        : "text-neutral-700 hover:bg-neutral-100/90"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 shrink-0" />
                      {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isSidebarCollapsed && item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Collapsed dot badge */}
                    {isSidebarCollapsed && item.badge && (
                      <span
                        className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                          isActive ? "bg-white" : "bg-[#ef4d23]"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Card / Mini Action */}
          {!isSidebarCollapsed ? (
            <div className="bg-[#ef4d23] text-white rounded-3xl p-4 sm:p-5 shadow-sm relative overflow-hidden mt-3 transition-all shrink-0">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white mb-2">
                <Rocket className="w-4 h-4" />
              </div>

              <h4 className="text-sm font-medium leading-snug tracking-tight">
                <span
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  Need custom scope?
                </span>
              </h4>

              <p className="mt-1 text-[11px] text-white/80 leading-relaxed font-normal">
                Create a new client lead, contract or task.
              </p>

              {onQuickAction && (
                <button
                  onClick={onQuickAction}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline cursor-pointer group"
                >
                  <span>+ New Record</span>
                  <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                </button>
              )}
            </div>
          ) : (
            onQuickAction && (
              <button
                type="button"
                onClick={onQuickAction}
                className="mt-3 w-full bg-[#ef4d23] hover:bg-[#d83f17] text-white p-3 rounded-2xl flex items-center justify-center shadow-md transition-all cursor-pointer group shrink-0"
                title="Create New Record"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>
            )
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 relative overflow-y-auto overflow-x-hidden isolate h-full px-1 sm:px-2 pb-6">
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
