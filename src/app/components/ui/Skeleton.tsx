export function Skeleton({
  className = "",
  height = "h-4",
  width = "w-full",
}: {
  className?: string;
  height?: string;
  width?: string;
}) {
  return (
    <div
      className={`bg-neutral-200/70 animate-pulse rounded-xl ${height} ${width} ${className}`}
    />
  );
}
