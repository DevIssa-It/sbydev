// ─── TypeScript Types untuk Ticket (SSOT: Prisma Generated Types) ──────────
// DILARANG mendefinisikan ulang TicketType secara manual — bisa drift dari schema.
// WAJIB gunakan Prisma generated types sebagai sumber kebenaran tunggal.

import type { Ticket, Event, TicketStatus as PrismaTicketStatus } from "@prisma/client";

// Re-export Prisma enum sebagai TicketStatus — auto-sync dengan schema.prisma
export type TicketStatus = PrismaTicketStatus;

/** Type tiket dari Prisma — single source of truth */
export type TicketType = Ticket;

/** Type tiket dengan relasi user & event (dari query include) */
export type TicketWithRelations = Ticket & {
  event: Event;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  PENDING: "Aktif",
  CHECKED_IN: "Sudah Hadir",
  CANCELLED: "Dibatalkan",
};

export const TICKET_STATUS_COLOR: Record<
  TicketStatus,
  { bg: string; text: string }
> = {
  PENDING: { bg: "#dcfce7", text: "#15803d" },
  CHECKED_IN: { bg: "#bbf7d0", text: "#166534" },
  CANCELLED: { bg: "#fee2e2", text: "#991b1b" },
};
