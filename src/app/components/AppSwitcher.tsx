import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, Rocket, UserCheck, Mail } from "lucide-react";
import EmailSenderModal from "./EmailSenderModal";
import { useAdminAuth } from "./useAdminAuth";

export default function AppSwitcher({ currentApp }: { currentApp: "crm" | "delivery" | "client" }) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const admin = useAdminAuth();

  const apps = [
    {
      id: "crm",
      name: "Super Admin CRM",
      href: "/sahit/",
      icon: ShieldCheck,
      badge: "Executive",
    },
    {
      id: "delivery",
      name: "Delivery Hub",
      href: "/delivery/",
      icon: Rocket,
      badge: "Operations",
    },
    {
      id: "client",
      name: "Client Portal",
      href: "/client/",
      icon: UserCheck,
      badge: "Portal View",
    },
  ] as const;

  return (
    <>
      <div className="bg-neutral-900 text-white border-b border-neutral-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-white/95 rounded-xl px-2.5 py-1 border border-white/40 shadow-xs">
            <img src="/lumen-and-co-logo.png" alt="Lumen & Co" className="h-7 sm:h-8 w-auto object-contain" />
          </Link>
          <span className="text-neutral-600 hidden sm:inline">|</span>
          <span className="text-neutral-400 font-medium hidden sm:inline">Backend Suite</span>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-800/90 p-1 rounded-xl border border-neutral-700/50">
          {apps.map((app) => {
            const Icon = app.icon;
            const isActive = currentApp === app.id;
            return (
              <Link
                key={app.id}
                to={app.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-300 hover:text-white hover:bg-neutral-700/50"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#ef4d23]" : "text-neutral-400"}`} />
                <span>{app.name}</span>
                {isActive && (
                  <span className="ml-1 text-[9px] font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded">
                    {app.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-neutral-400 text-[11px]">
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-[#ef4d23] hover:bg-[#d9421b] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Mail className="h-3.5 w-3.5" /> Send Real-Time Mail
          </button>
          <div className="hidden lg:flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{admin.email || "Lumen & Co Admin"}</span>
          </div>
        </div>
      </div>

      <EmailSenderModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        defaultRecipient="sahitsai7@gmail.com"
      />
    </>
  );
}
