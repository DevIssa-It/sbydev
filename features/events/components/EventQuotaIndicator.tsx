import React from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getQuotaPercentage, getRemainingQuota } from "@/lib/utils";

interface EventQuotaIndicatorProps {
  registered: number;
  quota: number;
  showLabels?: boolean;
}

export function EventQuotaIndicator({
  registered,
  quota,
  showLabels = true,
}: EventQuotaIndicatorProps): React.JSX.Element {
  const percentage = getQuotaPercentage(registered, quota);
  const remaining = getRemainingQuota(registered, quota);
  const isFull = remaining <= 0;

  const statusColor = isFull ? "#d30a28" : remaining <= 10 ? "#b45309" : "#166534";

  return (
    <div className="w-full flex flex-col gap-1.5">
      {showLabels && (
        <div className="flex justify-between items-center text-xs">
          <span className="text-[var(--color-ink)] font-medium">
            <strong>{registered}</strong> / {quota} Peserta
          </span>
          <span className="font-semibold" style={{ color: statusColor }}>
            {isFull ? "Kuota Penuh" : `Sisa ${remaining} Kursi`}
          </span>
        </div>
      )}
      <ProgressBar value={percentage} height={5} />
    </div>
  );
}
