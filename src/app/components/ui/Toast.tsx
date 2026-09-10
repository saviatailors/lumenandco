import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export type ToastMessage = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
};

type ToastContextType = {
  toast: (title: string, message?: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = (title: string, message?: string, type: ToastType = "success") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Floating Bottom-Right Toast Stack with smooth reflow */}
      <div className="fixed bottom-5 right-5 z-60 space-y-2.5 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3200); // 3.2s auto-dismiss timer

  const triggerDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300); // Match 300ms transition duration
  };

  useEffect(() => {
    if (isExiting || isHovered) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          clearInterval(timer);
          triggerDismiss();
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isExiting, isHovered]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start justify-between gap-3 text-xs transition-all duration-300 ease-in-out transform ${
        isExiting
          ? "translate-x-full opacity-0 max-h-0 py-0 my-0 border-transparent overflow-hidden"
          : "translate-x-0 opacity-100 max-h-32"
      } ${
        toast.type === "success"
          ? "bg-neutral-900 text-white border-neutral-800"
          : toast.type === "error"
          ? "bg-red-900 text-white border-red-800"
          : "bg-blue-900 text-white border-blue-800"
      }`}
    >
      <div className="flex items-start gap-2.5">
        {toast.type === "success" ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
        ) : toast.type === "error" ? (
          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
        ) : (
          <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
        )}

        <div>
          <p className="font-bold text-neutral-100">{toast.title}</p>
          {toast.message && <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">{toast.message}</p>}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          triggerDismiss();
        }}
        className="text-neutral-400 hover:text-white p-0.5 shrink-0 transition-colors cursor-pointer"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export interface ToastApi {
  (title: string, message?: string, type?: ToastType): void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);

  const showToast = (title: string, message?: string, type: ToastType = "success") => {
    if (context) {
      context.toast(title, message, type);
    } else {
      console.log(`[Toast ${type}] ${title} ${message || ""}`);
    }
  };

  const api = showToast as ToastApi;
  api.success = (title: string, message?: string) => showToast(title, message, "success");
  api.error = (title: string, message?: string) => showToast(title, message, "error");
  api.info = (title: string, message?: string) => showToast(title, message, "info");

  return api;
}
