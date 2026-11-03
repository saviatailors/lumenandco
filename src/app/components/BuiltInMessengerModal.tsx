import { useEffect } from "react";
import WhatsAppMessengerView from "./WhatsAppMessengerView";
import { UserRoleType } from "@/lib/messenger.types";

export interface BuiltInMessengerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole?: UserRoleType;
  currentUserId?: string;
  currentUserName?: string;
  clientBrandId?: string;
  clientBrandName?: string;
}

export default function BuiltInMessengerModal({
  isOpen,
  onClose,
  currentUserRole = "founder",
  currentUserId = "staff-6",
  currentUserName = "Sahit Sai",
  clientBrandId,
  clientBrandName,
}: BuiltInMessengerProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling while modal is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-6xl h-[88vh] max-h-[820px] rounded-3xl shadow-2xl overflow-hidden border border-white/40 flex flex-col animate-in zoom-in-95 duration-150">
        <WhatsAppMessengerView
          currentUserRole={currentUserRole}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          clientBrandId={clientBrandId}
          clientBrandName={clientBrandName}
          onCloseModal={onClose}
          isEmbeddedModal={true}
        />
      </div>
    </div>
  );
}
