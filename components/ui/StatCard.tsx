import React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  subtext?: React.ReactNode;
  valueColor?: string;
}

export function StatCard({
  label,
  value,
  subtext,
  valueColor = "var(--color-ink)",
  className,
  style,
  ...props
}: StatCardProps): React.JSX.Element {
  return (
    <div className={cn("card p-5", className)} style={style} {...props}>
      <div className="text-xs text-[var(--color-muted)] font-medium mb-1 uppercase tracking-wider">
        {label}
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color: valueColor }}>
        {value}
      </div>
      {subtext && <div className="text-xs text-[var(--color-muted)]">{subtext}</div>}
    </div>
  );
}
