import { ReactNode, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none select-none backdrop-blur-md border cursor-pointer";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[#ef4d23] hover:bg-[#d93c14] text-white border-white/30 shadow-md shadow-[#ef4d23]/25 hover:shadow-xl hover:scale-[1.02]",
    secondary:
      "bg-neutral-900/85 hover:bg-neutral-950 text-white border-white/20 shadow-md shadow-black/20 hover:shadow-xl hover:scale-[1.02]",
    ghost:
      "bg-white/40 hover:bg-white/70 text-neutral-900 border-white/60 hover:shadow-sm",
    danger:
      "bg-red-600/90 hover:bg-red-700 text-white border-white/30 shadow-md hover:shadow-xl hover:scale-[1.02]",
    outline:
      "bg-white/80 hover:bg-white text-neutral-900 border-white/80 shadow-md shadow-black/5 hover:shadow-xl hover:scale-[1.02]",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-4.5 py-2 text-xs gap-2",
    lg: "px-6 py-2.5 text-sm gap-2.5",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />}
      {children}
    </button>
  );
}
