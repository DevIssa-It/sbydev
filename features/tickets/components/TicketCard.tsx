"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CalendarBlank, MapPin, QrCode, CheckCircle, Clock, ArrowRight, ShieldCheck } from "@phosphor-icons/react";
import type { TicketWithRelations } from "../types";
import { formatDateShort } from "@/lib/utils";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { TicketQR } from "./TicketQR";
import { Modal } from "@/components/ui/Modal";

interface TicketCardProps {
  ticket: TicketWithRelations;
}

export function TicketCard({ ticket }: TicketCardProps): React.JSX.Element {
  const [showQRModal, setShowQRModal] = useState(false);

  return (
    <>
      <article className="card p-6 flex flex-col justify-between rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] shadow-xs hover:shadow-md hover:border-[var(--color-primary)] transition-all duration-200 text-left">
        <div className="text-left">
          {/* Top Badges Row */}
          <div className="flex justify-between items-center mb-3.5 flex-wrap gap-2 text-left">
            <TicketStatusBadge status={ticket.status} />
            <span className="font-mono text-xs font-bold text-[var(--color-ink)] bg-[var(--color-surface)] px-2.5 py-1 rounded-md border border-[var(--color-hairline)]">
              {ticket.code}
            </span>
          </div>

          {/* Event Title */}
          <h3 className="text-base font-bold text-[var(--color-ink)] mb-2.5 line-clamp-2 leading-snug text-left">
            {ticket.event?.title || "Event SurabayaDev"}
          </h3>

          {/* Schedule & Location Details */}
          <div className="flex flex-col gap-2 mb-5 text-xs text-[var(--color-muted)] text-left">
            <div className="flex items-center gap-2 text-[var(--color-ink)] font-medium text-left">
              <CalendarBlank size={15} color="var(--color-primary)" className="flex-shrink-0" />
              <span className="truncate">{ticket.event ? formatDateShort(ticket.event.date) : "-"}</span>
            </div>
            <div className="flex items-center gap-2 text-left">
              <MapPin size={15} color="var(--color-primary)" className="flex-shrink-0" />
              <span className="truncate" title={eventLocation(ticket)}>{eventLocation(ticket)}</span>
            </div>
          </div>
        </div>

        {/* Footer Info & Action */}
        <div className="pt-3.5 border-t border-[var(--color-hairline)] flex items-center justify-between gap-3 text-left">
          <div className="text-xs text-left">
            {ticket.checkedAt ? (
              <span className="text-[#166534] flex items-center gap-1.5 font-bold text-left">
                <CheckCircle size={15} weight="fill" />
                <span>Tervalidasi</span>
              </span>
            ) : (
              <span className="text-[var(--color-muted)] flex items-center gap-1.5 font-medium text-left">
                <Clock size={15} color="var(--color-primary)" />
                <span>Siap Dipakai</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowQRModal(true)}
              className="btn-secondary h-9 px-3 text-xs font-bold inline-flex items-center gap-1.5 rounded-lg"
              title="Pratinjau Cepat QR"
            >
              <QrCode size={15} />
              <span>QR</span>
            </button>

            <Link
              href={`/tickets/${ticket.code}`}
              className="btn-primary h-9 px-3 text-xs font-bold inline-flex items-center gap-1.5 no-underline rounded-lg shadow-2xs"
            >
              <span>Buka</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </article>

      {/* Quick QR Pop-up Modal */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="Tiket Digital QR Code"
        description={ticket.event?.title || "Event SurabayaDev"}
        maxWidth="sm"
        footer={
          <div className="flex justify-between items-center w-full">
            <span className="font-mono text-xs font-bold text-[var(--color-muted)]">{ticket.code}</span>
            <Link
              href={`/tickets/${ticket.code}`}
              className="btn-primary h-9 px-4 text-xs font-bold rounded-xl no-underline inline-flex items-center gap-1.5"
            >
              <span>Lihat E-Tiket Lengkap</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        }
      >
        <div className="flex flex-col items-start gap-4 text-left">
          <div className="p-4 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-hairline)] w-full flex items-center justify-center">
            <TicketQR value={ticket.code} size={200} />
          </div>

          <div className="w-full text-left">
            <div className="font-mono text-sm font-bold text-[var(--color-ink)] bg-[var(--color-surface)] px-3 py-1.5 rounded-lg border border-[var(--color-hairline)] inline-block mb-2">
              {ticket.code}
            </div>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed text-left">
              Tunjukkan QR Code ini kepada panitia di meja registrasi venue untuk proses check-in cepat.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}

function eventLocation(ticket: TicketWithRelations): string {
  return ticket.event?.location || "Surabaya";
}
