import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "tag" | "neutral";
  size?: "sm" | "md";
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, { bg: string; color: string; border?: string }> = {
  primary: { bg: "var(--color-surface)", color: "var(--color-primary)" },
  secondary: { bg: "#f1f5f9", color: "var(--color-ink)" },
  neutral: { bg: "var(--color-surface)", color: "var(--color-ink)", border: "1px solid var(--color-hairline)" },
  success: { bg: "#dcfce7", color: "#166534" },
  warning: { bg: "#fef3c7", color: "#92400e" },
  danger: { bg: "#fee2e2", color: "#991b1b" },
  tag: { bg: "var(--color-surface)", color: "var(--color-navy)" },
};

export function Badge({
  children,
  variant = "primary",
  size = "md",
  className,
  style,
  ...props
}: BadgeProps): React.JSX.Element {
  const styles = variantStyles[variant] || variantStyles.primary;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold",
        size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1",
        variant === "tag" ? "rounded-[2px]" : "rounded-full",
        className
      )}
      style={{
        backgroundColor: styles.bg,
        color: styles.color,
        border: styles.border,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
