import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-3xl w-full ${maxWidth} shadow-2xl overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]`}
      >
        {title && (
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between shrink-0">
            <h3 className="text-base font-bold text-neutral-900">{title}</h3>
            <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
