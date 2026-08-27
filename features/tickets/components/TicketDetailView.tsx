"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, QrCode, ShieldCheck, Printer } from "@phosphor-icons/react";
import { useTicketDetail } from "../hooks/useTicketDetail";
import { TicketQR } from "./TicketQR";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { TicketInfoGrid } from "./TicketInfoGrid";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";

interface TicketDetailViewProps {
  ticketCode: string;
}

export function TicketDetailView({ ticketCode }: TicketDetailViewProps): React.JSX.Element {
  const searchParams = useSearchParams();
  const isJustRegistered = searchParams.get("registered") === "true";
  const { ticket, isLoading, error } = useTicketDetail(ticketCode);

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-8 text-left">
        <div className="skeleton h-6 w-32 mb-6" />
        <div className="skeleton h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="w-full max-w-2xl mx-auto my-12 text-left">
        <Alert variant="error" title={error || "Tiket Tidak Ditemukan"} className="mb-6">
          Pastikan kode tiket yang dimasukkan sudah sesuai dan Anda memiliki akses ke tiket ini.
        </Alert>
        <Link href="/tickets" className="btn-primary inline-flex">
          Kembali ke Daftar Tiket Saya
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-6 pb-16 text-left">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <Link
          href="/tickets"
          className="btn-ghost inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)] hover:text-[var(--color-primary)]"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Tiket Saya</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="btn-secondary h-9 px-3.5 text-xs font-semibold inline-flex items-center gap-1.5 rounded-lg"
        >
          <Printer size={15} />
          <span>Cetak E-Tiket</span>
        </button>
      </div>

      {/* Registration success alert */}
      {isJustRegistered && (
        <Alert variant="success" title="Pendaftaran Event Berhasil!" className="mb-6">
          Tiket digital Anda telah aktif. Tunjukkan kode QR di bawah ini kepada panitia saat registrasi ulang di lokasi acara.
        </Alert>
      )}

      {/* Main Ticket Pass Card (2-Column Boarding Pass Style) */}
      <div className="card rounded-2xl overflow-hidden shadow-md border border-[var(--color-hairline)] bg-[var(--color-canvas)] text-left">
        {/* Navy Header */}
        <div className="bg-[var(--color-navy)] text-[var(--color-canvas)] p-6 sm:p-8 flex justify-between items-start flex-wrap gap-4 text-left">
          <div className="flex flex-col gap-1.5 text-left max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="tag">E-TICKET RESMI</Badge>
              <span className="text-xs text-[#b0e5fb] font-semibold">SurabayaDev Event Platform</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1 text-left">
              {ticket.event?.title}
            </h1>
          </div>
          <div className="flex-shrink-0">
            <TicketStatusBadge status={ticket.status} />
          </div>
        </div>

        {/* Ticket Body: 2 Columns */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start">
          {/* Left Column: Event & Attendee Info (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div>
              <h2 className="text-sm font-bold text-[var(--color-muted)] uppercase tracking-wider mb-4 text-left">
                Informasi Acara & Peserta
              </h2>
              <TicketInfoGrid ticket={ticket} />
            </div>

            <div className="pt-4 border-t border-[var(--color-hairline)] flex flex-col gap-2 text-left">
              <span className="text-xs font-bold text-[var(--color-ink)] flex items-center gap-1.5">
                <ShieldCheck size={16} color="var(--color-primary)" weight="bold" />
                <span>Petunjuk Validasi di Lokasi:</span>
              </span>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed text-left">
                Tunjukkan QR code beresolusi tinggi di samping ini langsung dari layar smartphone Anda kepada panitia. Tidak perlu dicetak fisik.
              </p>
            </div>
          </div>

          {/* Right Column: Left-Aligned QR Code Container (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start p-6 sm:p-7 bg-[var(--color-surface)]/80 rounded-2xl border border-[var(--color-hairline)] text-left w-full">
            <div className="flex items-center gap-1.5 mb-4 text-xs font-bold text-[var(--color-primary)] text-left">
              <QrCode size={18} weight="bold" />
              <span className="tracking-wider uppercase">Pindai QR Validasi Kehadiran</span>
            </div>

            {/* QR Code Box */}
            <div className="p-4 bg-white rounded-2xl border border-[var(--color-hairline)] shadow-sm mb-4">
              <TicketQR value={ticket.code} size={240} />
            </div>

            {/* Ticket Code Monospace Badge */}
            <div className="font-mono text-base font-bold text-[var(--color-ink)] bg-white px-4 py-2 rounded-xl border border-[var(--color-hairline)] tracking-wider shadow-2xs mb-2 text-left">
              {ticket.code}
            </div>

            {/* Explanatory text — Full width & left aligned without narrow constraints */}
            <p className="text-xs text-[var(--color-muted)] leading-relaxed text-left w-full">
              Kode tiket unik ini diverifikasi secara otomatis oleh sistem panitia saat proses check-in di lokasi acara.
            </p>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-6 sm:px-8 py-3.5 bg-[var(--color-surface)] border-t border-[var(--color-hairline)] flex justify-between items-center text-xs text-[var(--color-muted)] text-left">
          <span>SurabayaDev Event Ticket Verification System</span>
          <span className="font-mono font-semibold text-[var(--color-ink)]">{ticket.code}</span>
        </div>
      </div>
    </div>
  );
}
