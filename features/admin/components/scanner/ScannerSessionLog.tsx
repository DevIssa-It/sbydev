"use client";

import React from "react";
import { CheckCircle } from "@phosphor-icons/react";

interface CheckinRecord {
  code: string;
  name: string;
  time: string;
}

interface ScannerSessionLogProps {
  checkins: CheckinRecord[];
}

export function ScannerSessionLog({ checkins }: ScannerSessionLogProps): React.JSX.Element | null {
  if (checkins.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-[var(--color-hairline)] text-left">
      <h4 className="text-sm font-bold text-[var(--color-ink)] uppercase tracking-wider mb-3 text-left">
        Riwayat Check-In Sesi Ini ({checkins.length} Peserta)
      </h4>
      <div className="divide-y divide-[var(--color-hairline)] rounded-xl border border-[var(--color-hairline)] overflow-hidden bg-white">
        {checkins.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 flex items-center justify-between text-xs hover:bg-[var(--color-surface)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={18} weight="fill" color="var(--color-primary)" />
              <div>
                <strong className="text-[var(--color-ink)]">{item.name}</strong>
                <span className="font-mono text-[var(--color-muted)] ml-2">({item.code})</span>
              </div>
            </div>
            <span className="text-[var(--color-muted)] font-mono">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
