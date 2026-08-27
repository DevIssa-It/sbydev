import React from "react";
import { CheckCircle, WarningCircle, Info } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "error" | "success" | "info" | "warning";
  title?: string;
}

const alertConfig = {
  error: {
    bg: "#fef2f2",
    border: "#fecaca",
    color: "#991b1b",
    Icon: WarningCircle,
  },
  success: {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    color: "#166534",
    Icon: CheckCircle,
  },
  warning: {
    bg: "#fffbeb",
    border: "#fde68a",
    color: "#92400e",
    Icon: WarningCircle,
  },
  info: {
    bg: "var(--color-surface)",
    border: "var(--color-hairline)",
    color: "var(--color-primary)",
    Icon: Info,
  },
};

export function Alert({
  variant = "error",
  title,
  children,
  className,
  style,
  ...props
}: AlertProps): React.JSX.Element {
  const config = alertConfig[variant];
  const Icon = config.Icon;

  return (
    <div
      role="alert"
      className={cn("p-3.5 rounded-[8px] border text-sm flex items-start gap-2.5", className)}
      style={{
        backgroundColor: config.bg,
        borderColor: config.border,
        color: config.color,
        ...style,
      }}
      {...props}
    >
      <Icon size={20} weight="fill" className="flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <div className="font-bold mb-0.5">{title}</div>}
        <div className="text-xs leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
