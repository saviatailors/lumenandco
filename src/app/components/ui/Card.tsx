import { ReactNode } from "react";

export function Card({
  children,
  className = "",
  hoverEffect = false,
}: {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-3xl border border-neutral-200 shadow-sm ${
        hoverEffect ? "hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`p-5 border-b border-neutral-100 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
