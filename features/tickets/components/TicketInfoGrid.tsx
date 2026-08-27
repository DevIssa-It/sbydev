import React from "react";
import { CalendarBlank, MapPin, Clock, User, Envelope, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import type { TicketWithRelations } from "../types";
import { formatDate, formatTime } from "@/lib/utils";

interface TicketInfoGridProps {
  ticket: TicketWithRelations;
}

export function TicketInfoGrid({ ticket }: TicketInfoGridProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
      {/* Date & Time */}
      <div className="flex flex-col gap-1">
        <div className="text-xs text-[var(--color-muted)] uppercase tracking-wider font-medium">
          Waktu & Tanggal
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
          <CalendarBlank size={16} color="var(--color-primary)" className="flex-shrink-0" />
          <span className="truncate">{ticket.event ? formatDate(ticket.event.date) : "-"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
          <Clock size={15} color="var(--color-primary)" className="flex-shrink-0" />
          <span>{ticket.event ? formatTime(ticket.event.date) : "-"}</span>
        </div>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-1">
        <div className="text-xs text-[var(--color-muted)] uppercase tracking-wider font-medium">
          Lokasi Acara
        </div>
        <div className="flex items-start gap-2 text-sm font-semibold text-[var(--color-ink)]">
          <MapPin size={16} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
          <span className="leading-snug">{ticket.event?.location}</span>
        </div>
      </div>

      {/* Attendee */}
      <div className="flex flex-col gap-1">
        <div className="text-xs text-[var(--color-muted)] uppercase tracking-wider font-medium">
          Nama Peserta
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
          <User size={16} color="var(--color-primary)" className="flex-shrink-0" />
          <span className="truncate">{ticket.user?.name || "Peserta"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
          <Envelope size={15} color="var(--color-primary)" className="flex-shrink-0" />
          <span className="truncate">{ticket.user?.email || "-"}</span>
        </div>
      </div>

      {/* Verification */}
      <div className="flex flex-col gap-1">
        <div className="text-xs text-[var(--color-muted)] uppercase tracking-wider font-medium">
          Status Verifikasi
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: ticket.checkedAt ? "#166534" : "var(--color-ink)" }}>
          <ShieldCheck size={18} color={ticket.checkedAt ? "#166534" : "var(--color-primary)"} className="flex-shrink-0" />
          <span className="truncate">{ticket.checkedAt ? `Tervalidasi (${formatDate(ticket.checkedAt)})` : "Belum Check-In"}</span>
        </div>
      </div>
    </div>
  );
}
