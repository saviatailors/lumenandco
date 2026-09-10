import { ReactNode } from "react";

export function Table({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className="w-full overflow-x-auto border border-white/80 rounded-3xl bg-white/70 backdrop-blur-md shadow-md shadow-black/5">
      <table className={`w-full text-left text-xs ${className}`}>{children}</table>
    </div>
  );
}

export function TableHeader({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-white/80 border-b border-neutral-200/60 text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md">
      {children}
    </thead>
  );
}

export function TableHead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <th className={`px-4 py-3.5 font-extrabold align-middle ${className}`}>{children}</th>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-neutral-200/40 font-medium text-neutral-900">{children}</tbody>;
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
      className={`h-12 min-h-[48px] hover:bg-white/90 transition-all ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}
