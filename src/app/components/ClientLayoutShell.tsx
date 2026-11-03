import { ReactNode, useState } from "react";
import { Link } from "@tanstack/react-router";
import LiveBackgroundVideo from "./LiveBackgroundVideo";
import {
  LayoutDashboard,
  Eye,
  Receipt,
  Wallet,
  FileText,
  Users,
  User,
  Bell,
  PhoneCall,
  Menu,
  X,
  Plus,
  ChevronRight,
  LogOut,
  Calendar as CalendarIcon,
  ShieldCheck,
  FolderDown,
  MessageSquare,
} from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import EmailSenderModal from "./EmailSenderModal";
import BuiltInMessengerModal from "./BuiltInMessengerModal";
import { openLeadForm } from "./LeadForm";

export type ClientTab =
  | "overview"
  | "approvals"
  | "documents"
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
  clientName = "Prudhivi",
  clientCompany = "Lumen & Co Client",
  onSignOut = () => {},
  onOpenPrivacyPolicy,
  onOpenTermsOfService,
}: ClientLayoutShellProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Motion Labs style sidebar items matching reference screenshot
  const sidebarNavItems: {
    id: ClientTab;
    label: string;
    icon: typeof LayoutDashboard;
    badge?: string;
  }[] = [
    { id: "overview", label: "Orders", icon: LayoutDashboard },
    { id: "approvals", label: "Review", icon: Eye, badge: "2" },
    { id: "documents", label: "Documents", icon: FolderDown, badge: "Vault" },
    { id: "invoices", label: "Invoices", icon: Receipt },
    { id: "scope", label: "Wallet", icon: Wallet },
    { id: "reports", label: "Plans", icon: FileText },
    { id: "leads", label: "Affiliate", icon: Users },
    { id: "profile", label: "Profile", icon: User, badge: "!" },
  ];

  const firstName = clientName.split(" ")[0] || "Client";

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0c0d12] text-neutral-900 flex flex-col font-sans isolate z-10">
      {/* Live Video Background Stage */}
      <LiveBackgroundVideo
        containerClassName="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
        className="opacity-85"
        overlayClassName="absolute inset-0 bg-white/20 backdrop-blur-xs"
      />

      {/* ========================================================================= */}
      {/* 1. TOP HEADER (Motion Labs Aesthetic) */}
      {/* ========================================================================= */}
      <header className="h-[72px] bg-transparent px-4 sm:px-8 flex items-center justify-between shrink-0 z-30 pt-3">
        {/* Left: Agency Logo & Welcome Greeting */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:text-black bg-white rounded-xl border border-neutral-200 shadow-2xs transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img
              src="/lumen-and-co-logo.png"
              alt="Lumen & Co"
              className="h-9 sm:h-11 w-auto object-contain"
            />
          </Link>

          {/* Welcome greeting matching screenshot */}
          <div className="hidden sm:block">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 leading-tight">
              Welcome back,{" "}
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                {firstName}
              </span>
            </h1>
            <p className="text-xs text-neutral-500 font-medium -mt-0.5">
              {clientCompany || "No projects yet"}
            </p>
          </div>
        </div>

        {/* Right Utilities: Wallet Balance, Notifications Bell, Avatar */}
        <div className="flex items-center gap-3">
          {/* Quick links to CRM / Delivery */}
          <div className="hidden md:flex items-center gap-1.5 bg-white p-1 rounded-full border border-neutral-200/80 text-xs font-semibold shadow-2xs">
            <Link
              to="/sahit/"
              className="px-3 py-1 text-neutral-600 hover:text-black rounded-full transition-colors"
            >
              CRM
            </Link>
            <Link
              to="/delivery/"
              className="px-3 py-1 text-neutral-600 hover:text-black rounded-full transition-colors"
            >
              Delivery
            </Link>
            <span className="px-3 py-1 bg-[#ef4d23] text-white rounded-full font-semibold">
              Client Portal
            </span>
          </div>

          {/* Wallet Balance Pill */}
          <div className="flex items-center gap-1.5 bg-white border border-neutral-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-neutral-800 shadow-2xs">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-bold">
              $
            </span>
            <span>0</span>
          </div>

          {/* Messenger Button */}
          <button
            type="button"
            onClick={() => setIsMessengerOpen(true)}
            className="flex items-center gap-1.5 bg-white border border-neutral-200/80 px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-800 hover:text-black transition-all shadow-2xs cursor-pointer relative"
            title="Chat with Lumen & Co Team"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#ef4d23]" />
            <span className="hidden sm:inline">Messenger</span>
            <span className="w-2 h-2 rounded-full bg-[#ef4d23] animate-pulse" />
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="w-9 h-9 rounded-full bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-700 hover:text-black transition-all shadow-2xs cursor-pointer relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ef4d23]" />
          </button>

          <NotificationCenter
            isOpen={isNotificationsOpen}
            onOpenChange={setIsNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-9 h-9 rounded-full bg-purple-600 text-white font-semibold flex items-center justify-center text-sm shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
            >
              {firstName.charAt(0)}
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-neutral-900 rounded-2xl shadow-xl border border-neutral-200 p-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                  <p className="font-bold text-neutral-900">{clientName}</p>
                  <p className="text-[11px] text-neutral-500 truncate">{clientCompany}</p>
                </div>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onTabChange("profile");
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-xl font-medium flex items-center gap-2"
                >
                  <User className="h-3.5 w-3.5 text-[#ef4d23]" /> Profile & Account
                </button>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onTabChange("scope");
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-xl font-medium flex items-center gap-2"
                >
                  <FileText className="h-3.5 w-3.5 text-[#ef4d23]" /> SLA & Retainer
                </button>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onSignOut();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 rounded-xl font-bold flex items-center gap-2 mt-1"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BODY LAYOUT: DESKTOP MOTION LABS SIDEBAR + MAIN WORKSPACE */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-72px)] p-4 sm:p-6 gap-6 relative">
        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <aside className="relative w-[280px] max-w-[85vw] bg-white text-neutral-900 flex flex-col h-full z-50 border-r border-neutral-200 shadow-2xl p-4 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <span className="font-semibold text-sm">Client Navigation</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-neutral-500 hover:text-black rounded-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1 flex-1">
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
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#ef4d23] text-white shadow-xs"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="w-5 h-5 rounded-full bg-[#ef4d23] text-white flex items-center justify-center text-[10px] font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-neutral-100">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openLeadForm();
                  }}
                  className="w-full bg-[#ef4d23] text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Book a call
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Left Desktop Sidebar (Motion Labs Card Layout) */}
        <aside className="hidden lg:flex w-[240px] flex-col justify-between shrink-0 z-20 h-full">
          {/* Menu Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-3 border border-white/60 shadow-md space-y-1 overflow-y-auto">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#ef4d23] text-white shadow-xs"
                      : "text-neutral-700 hover:bg-neutral-100/90"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.badge === "!"
                          ? "bg-[#ef4d23] text-white rounded-full w-5 h-5 flex items-center justify-center"
                          : isActive
                          ? "bg-white/20 text-white"
                          : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Card Banner matching Screenshot ("Something bigger in mind?") */}
          <div className="bg-[#ef4d23] text-white rounded-3xl p-5 shadow-sm relative overflow-hidden mt-4">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white mb-3">
              <PhoneCall className="w-4 h-4" />
            </div>

            <h4 className="text-base font-medium leading-snug tracking-tight">
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                Something bigger
              </span>{" "}
              in mind?
            </h4>

            <p className="mt-1.5 text-xs text-white/80 leading-relaxed font-normal">
              Book a call and we will scope it with you properly.
            </p>

            <button
              onClick={openLeadForm}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline cursor-pointer group"
            >
              <span>Book a call</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 relative overflow-y-auto isolate h-full px-1 sm:px-2 pb-6">
          {children}
        </main>
      </div>

      {/* Auxiliary Modals */}
      <EmailSenderModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        defaultRecipient="hello@lumenandco.in"
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
