import { ReactNode } from "react";

export function Table({
  children,
  className = "",
  containerClassName = "",
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <div
      className={`w-full overflow-x-auto border border-white/80 rounded-3xl bg-white/80 backdrop-blur-2xl shadow-xl shadow-black/5 ${containerClassName}`}
    >
      <table className={`w-full text-left text-xs ${className}`}>{children}</table>
    </div>
  );
}

export function TableHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <thead
      className={`bg-slate-100/90 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-700 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md ${className}`}
    >
      {children}
    </thead>
  );
}

export function TableHead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <th className={`px-4 py-3.5 font-extrabold align-middle text-slate-900 ${className}`}>{children}</th>;
}

export function TableBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <tbody className={`divide-y divide-slate-200/60 font-semibold text-slate-900 ${className}`}>{children}</tbody>;
}

export function TableRow({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <tr
      onClick={onClick}
      className={`h-12 min-h-[48px] hover:bg-slate-50/80 transition-colors ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  className = "",
  colSpan,
}: {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td colSpan={colSpan} className={`px-4 py-3.5 align-middle text-slate-900 ${className}`}>
      {children}
    </td>
  );
}
