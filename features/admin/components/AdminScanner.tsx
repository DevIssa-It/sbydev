"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QrCode, CheckCircle, ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useTicketCheckin } from "@/features/tickets/hooks/useTicketDetail";
import { Alert } from "@/components/ui/Alert";
import { formatDate } from "@/lib/utils";

export function AdminScanner(): React.JSX.Element {
  const [ticketInput, setTicketInput] = useState("");
  const { performCheckin, isLoading, error, lastCheckedTicket, clearError } = useTicketCheckin();

  const handleCheckinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;

    clearError();
    const cleanCode = ticketInput.trim().toUpperCase();
    await performCheckin(cleanCode);
    setTicketInput("");
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", paddingBottom: 64 }}>
      <Link href="/admin" className="btn-ghost mb-6" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <ArrowLeft size={16} />
        <span>Kembali ke Dashboard Admin</span>
      </Link>

      <div className="card p-8 sm:p-9">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-full bg-[var(--color-surface)] text-[var(--color-primary)] flex items-center justify-center">
            <QrCode size={20} />
          </div>
          <h1 className="text-heading text-[var(--color-ink)] m-0">
            Validasi & Check-In Tiket Panitia
          </h1>
        </div>

        <p className="text-body-sm text-[var(--color-muted)] mb-7">
          Masukkan kode tiket peserta atau hasil scan QR code (contoh: <code>SBYDEV-XXXXXX-YYYYYYYY</code>) untuk mencatat kehadiran di lokasi acara.
        </p>

        {/* Input Form */}
        <form onSubmit={handleCheckinSubmit} className="flex gap-3 mb-7 flex-wrap">
          <input
            type="text"
            required
            className="input flex-1 min-w-[240px] font-mono uppercase"
            placeholder="Masukkan Kode Tiket (e.g. SBYDEV-...)"
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
          />
          <button type="submit" disabled={isLoading} className="btn-primary h-12 px-6">
            <span>{isLoading ? "Memvalidasi..." : "Check-In"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Error Alert */}
        {error && (
          <Alert variant="error" title="Validasi Gagal" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Success Card */}
        {lastCheckedTicket && (
          <div className="p-6 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl text-[#166534]">
            <div className="flex items-center gap-2.5 mb-4">
              <CheckCircle size={26} weight="fill" color="#16a34a" />
              <div>
                <h3 className="text-base font-bold m-0 text-[#166534]">Check-In Berhasil!</h3>
                <span className="text-xs text-[#15803d]">Tiket tervalidasi dan kehadiran telah tercatat.</span>
              </div>
            </div>

            <div className="bg-white/80 p-4 rounded-lg flex flex-col gap-2.5 text-xs text-[var(--color-ink)]">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Kode Tiket:</span>
                <strong className="font-mono">{lastCheckedTicket.code}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Nama Peserta:</span>
                <strong>{lastCheckedTicket.user?.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Email:</span>
                <span>{lastCheckedTicket.user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Event:</span>
                <span>{lastCheckedTicket.event?.title}</span>
              </div>
              {lastCheckedTicket.checkedAt && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Waktu Check-In:</span>
                  <span className="text-[#166534] font-semibold">{formatDate(lastCheckedTicket.checkedAt)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
