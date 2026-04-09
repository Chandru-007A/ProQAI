import clsx from "clsx";

type Variant = "default" | "accent" | "success" | "danger" | "warning";

interface GlassmorphicCardProps {
  children: React.ReactNode;
  variant?: Variant;
  hover?: boolean;
  highlight?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  default:  { borderColor: "var(--border)" },
  accent:   { borderColor: "var(--primary)",  background: "var(--primary-light)" },
  success:  { borderColor: "var(--success)",  background: "var(--success-light)" },
  danger:   { borderColor: "var(--danger)",   background: "var(--danger-light)" },
  warning:  { borderColor: "var(--warning)",  background: "var(--warning-light)" },
};

export default function GlassmorphicCard({
  children,
  variant = "default",
  hover = false,
  highlight = false,
  className,
  style,
}: GlassmorphicCardProps) {
  return (
    <div
      className={clsx(
        "card-base",
        hover && "card-hover",
        highlight && "ai-glow",
        className,
      )}
      style={{
        ...variantStyles[variant],
        borderWidth: highlight ? "2px" : "1px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
