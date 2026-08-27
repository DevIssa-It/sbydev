"use client";

import React from "react";
import QRCode from "react-qr-code";

interface TicketQRProps {
  value: string;
  size?: number;
}

export function TicketQR({ value, size = 240 }: TicketQRProps): React.JSX.Element {
  return (
    <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[var(--color-hairline)] shadow-xs inline-flex items-center justify-center">
      <QRCode
        value={value}
        size={size}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        viewBox="0 0 256 256"
      />
    </div>
  );
}
