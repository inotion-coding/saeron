import type { ReactNode } from "react";

type Variant = "neutral" | "accent" | "primary";

const variants: Record<Variant, string> = {
  neutral: "bg-surface text-muted-foreground border border-border",
  accent: "bg-accent/10 text-accent border border-accent/20",
  primary: "bg-primary/8 text-primary border border-primary/15",
};

/**
 * 작은 라벨/태그 (DESIGN.md §4). 과목·대상·상태 표기용.
 */
export default function Badge({
  children,
  variant = "neutral",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-sm)] px-2.5 py-1 text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
