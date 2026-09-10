import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export function SlideOver({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = "max-w-2xl",
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  width?: string;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen ${width} bg-white shadow-2xl border-l border-neutral-200 flex flex-col transform transition-transform animate-in slide-in-from-right duration-200`}
        >
          {/* SlideOver Header */}
          <div className="p-6 border-b border-neutral-200 bg-neutral-50/80 flex items-center justify-between gap-4 shrink-0">
            <div>
              {title && <h2 className="text-lg font-bold text-neutral-900">{title}</h2>}
              {subtitle && <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>}
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200/60 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* SlideOver Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
