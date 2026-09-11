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
      className={`w-full overflow-x-auto border border-white/20 rounded-3xl bg-[#141520]/90 backdrop-blur-xl shadow-xl ${containerClassName}`}
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
      className={`bg-white/10 border-b border-white/15 text-[11px] font-extrabold text-white/80 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md ${className}`}
    >
      {children}
    </thead>
  );
}

export function TableHead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <th className={`px-4 py-3.5 font-extrabold align-middle text-white ${className}`}>{children}</th>;
}

export function TableBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <tbody className={`divide-y divide-white/10 font-medium text-white ${className}`}>{children}</tbody>;
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
      className={`h-12 min-h-[48px] hover:bg-white/10 transition-colors ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3.5 align-middle ${className}`}>{children}</td>;
}
