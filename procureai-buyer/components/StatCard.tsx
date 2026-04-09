import clsx from "clsx";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  iconBg?: string;
  className?: string;
  delay?: number;
}

export default function StatCard({
  icon,
  label,
  value,
  delta,
  deltaPositive = true,
  iconBg = "var(--primary-light)",
  className,
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className={clsx("card-base card-hover p-5 animate-fade-in", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
        {delta && (
          <span
            className="text-xs font-600 px-2 py-0.5 rounded-full"
            style={{
              background: deltaPositive ? "var(--success-light)" : "var(--danger-light)",
              color: deltaPositive ? "var(--success)" : "var(--danger)",
              fontWeight: 600,
            }}
          >
            {deltaPositive ? "+" : ""}{delta}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-700" style={{ fontWeight: 700, color: "var(--fg)" }}>
          {value}
        </p>
        <p className="text-sm mt-0.5" style={{ color: "var(--fg-muted)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}
