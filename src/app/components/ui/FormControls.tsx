import { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-1 text-xs">
      {label && <label className="block font-bold text-neutral-700">{label}</label>}
      <input
        className={`w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all disabled:opacity-50 ${
          error ? "border-red-500 focus:ring-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-[11px] text-red-600 font-semibold">{error}</p>}
    </div>
  );
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function Select({ label, error, children, className = "", ...props }: SelectProps) {
  return (
    <div className="space-y-1 text-xs">
      {label && <label className="block font-bold text-neutral-700">{label}</label>}
      <select
        className={`w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all disabled:opacity-50 cursor-pointer ${
          error ? "border-red-500 focus:ring-red-500" : ""
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-[11px] text-red-600 font-semibold">{error}</p>}
    </div>
  );
}
