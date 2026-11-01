import { ReactNode } from "react";

export type BadgeVariant = "green" | "red" | "amber" | "blue" | "purple" | "neutral" | "brand" | "success" | "warning" | "destructive" | "secondary";

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  className = "",
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
}) {
  const base = "inline-flex items-center font-medium rounded-full uppercase tracking-wider border";

  const variants: Record<BadgeVariant, string> = {
    green: "bg-emerald-100/80 text-emerald-800 border-emerald-300/60 shadow-2xs",
    red: "bg-red-100/80 text-red-800 border-red-300/60 shadow-2xs",
    amber: "bg-amber-100/80 text-amber-900 border-amber-300/60 shadow-2xs",
    blue: "bg-blue-100/80 text-blue-800 border-blue-300/60 shadow-2xs",
    purple: "bg-orange-100/80 text-orange-800 border-orange-300/60 shadow-2xs",
    neutral: "bg-neutral-200/70 text-neutral-800 border-neutral-300/60 shadow-2xs",
    brand: "bg-[#ef4d23]/10 text-[#ef4d23] border-[#ef4d23]/30 shadow-2xs",
    success: "bg-emerald-100/80 text-emerald-800 border-emerald-300/60 shadow-2xs",
    warning: "bg-amber-100/80 text-amber-900 border-amber-300/60 shadow-2xs",
    destructive: "bg-red-100/80 text-red-800 border-red-300/60 shadow-2xs",
    secondary: "bg-slate-100/80 text-slate-800 border-slate-300/60 shadow-2xs",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[9px]",
    md: "px-2.5 py-0.5 text-[10px]",
  };

  return <span className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>{children}</span>;
}
