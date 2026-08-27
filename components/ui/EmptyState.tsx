import React from "react";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  style,
  ...props
}: EmptyStateProps): React.JSX.Element {
  return (
    <div
      className={cn("card p-8 sm:p-10 text-left flex flex-col items-start justify-start border border-[var(--color-hairline)] bg-[var(--color-canvas)]", className)}
      style={style}
      {...props}
    >
      <div className="w-12 h-12 rounded-xl bg-[var(--color-surface)] text-[var(--color-primary)] flex items-center justify-center mb-4">
        {icon || <WarningCircle size={24} />}
      </div>
      <h3 className="text-heading-sm text-lg text-[var(--color-ink)] mb-2 font-bold">{title}</h3>
      <p className="text-body-sm text-[var(--color-muted)] w-full mb-6 leading-relaxed text-left">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
