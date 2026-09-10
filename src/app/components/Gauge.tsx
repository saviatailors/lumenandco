interface GaugeProps {
  value: number;
  color?: string;
  showLabels?: boolean;
  min?: string;
  max?: string;
}

export default function Gauge({
  value,
  color = "#ef4d23",
  showLabels = false,
  min,
  max,
}: GaugeProps) {
  const total = 40;
  const active = Math.round((value / 100) * total);
  const cx = 100;
  const cy = 100;
  const r = 80;

  const ticks = Array.from({ length: total }, (_, i) => {
    const angle = Math.PI + (Math.PI * i) / (total - 1);
    const x1 = cx + (r - 10) * Math.cos(angle);
    const y1 = cy + (r - 10) * Math.sin(angle);
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    return (
      <line
        key={i}
        x1={x1.toFixed(3)}
        y1={y1.toFixed(3)}
        x2={x2.toFixed(3)}
        y2={y2.toFixed(3)}
        stroke={i < active ? color : "#d4d4d8"}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    );
  });

  return (
    <div className="mx-auto w-full" style={{ maxWidth: 260 }}>
      <svg viewBox="0 0 200 120" className="w-full">
        {ticks}
        <text
          x={100}
          y={105}
          textAnchor="middle"
          fontSize={22}
          fontWeight={600}
          fill="currentColor"
        >
          {value}%
        </text>
      </svg>
      {showLabels && (
        <div
          className="flex justify-between text-neutral-500"
          style={{ fontSize: 11 }}
        >
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}
