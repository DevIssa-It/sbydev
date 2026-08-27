"use client";

import React, { useState } from "react";
import { QrCode, CheckCircle, ArrowRight } from "@phosphor-icons/react";
import { useTicketCheckin } from "@/features/tickets/hooks/useTicketDetail";
import { Alert } from "@/components/ui/Alert";
import { formatDate } from "@/lib/utils";
import { ScannerSessionLog } from "./ScannerSessionLog";

interface SessionEntry {
  code: string;
  name: string;
  time: string;
}

interface ScannerCheckinFormProps {
  eventId: string;
  sessionCheckins: SessionEntry[];
  onCheckinSuccess: (entry: SessionEntry) => void;
}

export function ScannerCheckinForm({
  eventId,
  sessionCheckins,
  onCheckinSuccess,
}: ScannerCheckinFormProps): React.JSX.Element {
  const [ticketInput, setTicketInput] = useState("");
  const { performCheckin, isLoading, error, lastCheckedTicket, clearError } =
    useTicketCheckin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;

    clearError();
    const cleanCode = ticketInput.trim().toUpperCase();
    const result = await performCheckin(cleanCode, eventId);

    if (result.success && result.ticket) {
      onCheckinSuccess({
        code: result.ticket.code,
        name: result.ticket.user?.name || "Peserta",
        time: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }
    setTicketInput("");
  };

  return (
    <div className="card p-7 sm:p-9 text-left">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
          <QrCode size={24} weight="bold" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[var(--color-ink)] m-0">
            Input / Scan Tiket Peserta
          </h3>
          <p className="text-xs text-[var(--color-muted)] m-0 mt-0.5">
            Gunakan barcode scanner USB/Bluetooth atau ketik kode tiket peserta
            secara manual.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 my-6 flex-wrap text-left">
        <input
          type="text"
          required
          autoFocus
          className="input font-mono uppercase text-base tracking-wider h-13 flex-1 min-w-[260px]"
          placeholder="Scan / Ketik Kode Tiket (e.g. SBYDEV-...)"
          value={ticketInput}
          onChange={(e) => setTicketInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary h-13 px-8 rounded-[10px] text-base font-semibold inline-flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span>{isLoading ? "Memvalidasi..." : "Check-In"}</span>
          <ArrowRight size={18} weight="bold" />
        </button>
      </form>

      {/* Error State */}
      {error && (
        <Alert variant="error" title="Validasi Gagal" className="mb-6">
          <div className="text-left text-sm leading-relaxed">{error}</div>
        </Alert>
      )}

      {/* Success State */}
      {lastCheckedTicket && (
        <div className="p-6 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl text-[#166534] text-left mb-6">
          <div className="flex items-center gap-3 mb-4 text-left">
            <CheckCircle
              size={32}
              weight="fill"
              color="var(--color-primary)"
              className="flex-shrink-0"
            />
            <div>
              <h4 className="text-base sm:text-lg font-bold m-0 text-[#166534] text-left">
                Check-In Berhasil! Kehadiran Terverifikasi
              </h4>
              <span className="text-xs text-[#15803d] text-left">
                Peserta terdaftar secara sah dan berhak mengikuti acara.
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[var(--color-hairline)] flex flex-col gap-3 text-xs text-[var(--color-ink)] text-left shadow-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--color-hairline)]">
              <span className="text-[var(--color-muted)] font-medium">Acara:</span>
              <strong className="text-sm text-[var(--color-primary)]">
                {lastCheckedTicket.event?.title}
              </strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-muted)] font-medium">Kode Tiket:</span>
              <strong className="font-mono text-sm">{lastCheckedTicket.code}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-muted)] font-medium">Nama Peserta:</span>
              <strong className="text-sm">{lastCheckedTicket.user?.name}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-muted)] font-medium">Email Peserta:</span>
              <span>{lastCheckedTicket.user?.email}</span>
            </div>
            {lastCheckedTicket.checkedAt && (
              <div className="flex justify-between items-center pt-2 border-t border-[var(--color-hairline)]">
                <span className="text-[var(--color-muted)] font-medium">Waktu Check-In:</span>
                <span className="text-[#166534] font-bold">
                  {formatDate(lastCheckedTicket.checkedAt)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      <ScannerSessionLog checkins={sessionCheckins} />
    </div>
  );
}
