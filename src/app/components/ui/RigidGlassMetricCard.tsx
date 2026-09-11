import { ReactNode } from "react";

export type CardVariant = "speed" | "context" | "connections" | "ruby" | "emerald" | "amber";

interface RigidGlassMetricCardProps {
  title: ReactNode;
  value: string | number;
  unit?: string;
  caption?: ReactNode;
  buttonText?: string;
  variant?: CardVariant;
  mediaVideoSrc?: string;
  mediaPosterSrc?: string;
  badge?: ReactNode;
  customGraphic?: ReactNode;
  change?: string;
  changeType?: string;
  icon?: any;
  onClick?: () => void;
  className?: string;
}

export default function RigidGlassMetricCard({
  title,
  value,
  unit,
  caption,
  buttonText = "Learn More",
  variant = "speed",
  mediaVideoSrc,
  mediaPosterSrc,
  badge,
  customGraphic,
  onClick,
  className = "",
}: RigidGlassMetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "context":
        return {
          bg: `radial-gradient(ellipse 110% 70% at 50% -10%, rgba(255, 255, 255, 0.75), rgba(240, 245, 255, 0.45) 75%),
               linear-gradient(160deg, rgba(255, 255, 255, 0.60) 0%, rgba(230, 235, 245, 0.40) 100%)`,
          border: "1px solid rgba(255, 255, 255, 0.75)",
          valColor: "text-slate-900",
          accentLine: "bg-slate-400/30",
        };
      case "connections":
        return {
          bg: `radial-gradient(ellipse 110% 70% at 50% -10%, rgba(255, 255, 255, 0.75), rgba(245, 240, 255, 0.45) 75%),
               linear-gradient(160deg, rgba(255, 255, 255, 0.60) 0%, rgba(235, 230, 245, 0.40) 100%)`,
          border: "1px solid rgba(255, 255, 255, 0.75)",
          valColor: "text-slate-900",
          accentLine: "bg-indigo-400/30",
        };
      case "ruby":
        return {
          bg: `radial-gradient(ellipse 120% 80% at 50% -10%, rgba(254, 237, 213, 0.85), rgba(255, 247, 237, 0.55) 75%),
               linear-gradient(160deg, rgba(255, 247, 237, 0.70) 0%, rgba(254, 215, 170, 0.45) 100%)`,
          border: "1.5px solid rgba(239, 77, 35, 0.50)",
          valColor: "text-[#ef4d23]",
          accentLine: "bg-[#ef4d23]/40",
        };
      case "speed":
        return {
          bg: `radial-gradient(ellipse 120% 80% at 50% -10%, rgba(254, 237, 213, 0.85), rgba(255, 247, 237, 0.55) 75%),
               linear-gradient(160deg, rgba(255, 247, 237, 0.70) 0%, rgba(254, 215, 170, 0.45) 100%)`,
          border: "1.5px solid rgba(239, 77, 35, 0.50)",
          valColor: "text-[#d93c14]",
          accentLine: "bg-[#ef4d23]/40",
        };
      case "emerald":
        return {
          bg: `radial-gradient(ellipse 110% 70% at 50% -10%, rgba(235, 255, 245, 0.75), rgba(225, 245, 235, 0.45) 75%),
               linear-gradient(160deg, rgba(255, 255, 255, 0.60) 0%, rgba(225, 245, 235, 0.40) 100%)`,
          border: "1px solid rgba(16, 185, 129, 0.45)",
          valColor: "text-emerald-700",
          accentLine: "bg-emerald-500/30",
        };
      case "amber":
        return {
          bg: `radial-gradient(ellipse 110% 70% at 50% -10%, rgba(255, 250, 235, 0.75), rgba(245, 240, 225, 0.45) 75%),
               linear-gradient(160deg, rgba(255, 255, 255, 0.60) 0%, rgba(245, 240, 225, 0.40) 100%)`,
          border: "1px solid rgba(245, 158, 11, 0.45)",
          valColor: "text-amber-700",
          accentLine: "bg-amber-500/30",
        };
      default:
        return {
          bg: `radial-gradient(ellipse 110% 70% at 50% -10%, rgba(255, 255, 255, 0.75), rgba(240, 240, 245, 0.45) 75%),
               linear-gradient(160deg, rgba(255, 255, 255, 0.60) 0%, rgba(240, 240, 245, 0.40) 100%)`,
          border: "1px solid rgba(255, 255, 255, 0.75)",
          valColor: "text-slate-900",
          accentLine: "bg-slate-300/40",
        };
    }
  };

  const vStyle = getVariantStyles();

  return (
    <article
      onClick={onClick}
      className={`relative group flex flex-col justify-between p-5 sm:p-6 rounded-3xl backdrop-blur-2xl transition-all duration-250 ease-out shadow-lg hover:shadow-2xl hover:-translate-y-1 cursor-pointer overflow-hidden ${className}`}
      style={{
        background: vStyle.bg,
        border: vStyle.border,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08), inset 0 1.5px 0 rgba(255, 255, 255, 0.85)",
      }}
    >
      {/* Background Sheen Layer */}
      <div
        className="absolute inset-0 z-0 pointer-events-none mix-blend-overlay opacity-60 group-hover:opacity-90 transition-opacity"
        style={{
          background: `
            linear-gradient(102deg, rgba(255,255,255,.50), transparent 30%, rgba(255,255,255,.25) 65%, transparent 90%),
            radial-gradient(ellipse 85% 34% at 54% 7%, rgba(255,255,255,.70), transparent 72%)
          `,
        }}
      />

      {mediaVideoSrc && (
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          poster={mediaPosterSrc}
          src={mediaVideoSrc}
        />
      )}

      {/* Header Row: Title & Badge */}
      <div className="relative z-10 flex items-start justify-between gap-2 mb-4">
        <h3 className="font-serif-italic text-lg sm:text-xl font-medium text-slate-900 leading-tight tracking-tight">
          {title}
        </h3>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>

      {/* Metric Display Row */}
      <div className="relative z-10 my-2 flex items-baseline gap-1.5">
        <span className={`text-3xl sm:text-4xl font-semibold tracking-tight ${vStyle.valColor} drop-shadow-xs`}>
          {value}
        </span>
        {unit && <span className="text-lg font-medium text-slate-700">{unit}</span>}
      </div>

      {/* Caption & Accent Bar */}
      <div className="relative z-10 mt-3 pt-3 border-t border-black/5 flex flex-col gap-2">
        <p className="text-xs font-normal text-slate-600 leading-snug line-clamp-2">
          {caption}
        </p>

        {/* Action Pill Button */}
        {buttonText && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 group-hover:text-slate-700 transition-colors">
              Action Required
            </span>
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-800 bg-white/80 border border-white/90 shadow-xs backdrop-blur-md group-hover:bg-white group-hover:shadow-md transition-all flex items-center gap-1"
            >
              {buttonText} →
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
