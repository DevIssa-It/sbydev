// ─── TypeScript Types untuk Ticket ────────────────────────────────────────

export type TicketStatus = "PENDING" | "CHECKED_IN" | "CANCELLED";

export interface TicketType {
  id: string;
  code: string;
  userId: string;
  eventId: string;
  status: TicketStatus;
  checkedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TicketWithRelations extends TicketType {
  event: {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    date: Date | string;
    quota: number;
    registered: number;
    imageUrl: string | null;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  PENDING: "Aktif",
  CHECKED_IN: "Sudah Hadir",
  CANCELLED: "Dibatalkan",
};

export const TICKET_STATUS_COLOR: Record<
  TicketStatus,
  { bg: string; text: string }
> = {
  PENDING: { bg: "#e3eeff", text: "#0056d2" },
  CHECKED_IN: { bg: "#dcfce7", text: "#166534" },
  CANCELLED: { bg: "#fee2e2", text: "#991b1b" },
};
