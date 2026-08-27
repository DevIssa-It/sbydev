import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // percentage 0-100
  height?: number;
  variant?: "primary" | "warning" | "danger" | "auto";
}

export function ProgressBar({
  value,
  height = 4,
  variant = "auto",
  className,
  style,
  ...props
}: ProgressBarProps): React.JSX.Element {
  const clamped = Math.min(100, Math.max(0, value));

  const getBarColor = (): string => {
    if (variant === "danger") return "#d30a28";
    if (variant === "warning") return "#f59e0b";
    if (variant === "primary") return "var(--color-primary)";
    // Auto variant
    if (clamped >= 100) return "#d30a28";
    if (clamped >= 80) return "#f59e0b";
    return "var(--color-primary)";
  };

  return (
    <div
      className={cn("w-full bg-[var(--color-surface)] rounded-full overflow-hidden", className)}
      style={{ height, ...style }}
      {...props}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: "100%",
          backgroundColor: getBarColor(),
          transition: "width 300ms ease",
        }}
      />
    </div>
  );
}
