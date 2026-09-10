export function Avatar({
  name,
  color = "#ef4d23",
  size = "md",
  className = "",
}: {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizes = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center font-extrabold text-white shrink-0 shadow-2xs ${sizes[size]} ${className}`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
