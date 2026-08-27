import { prisma } from "@/lib/prisma";
import { generateTicketCode, AppError } from "@/lib/api";

/**
 * Register user ke event — menggunakan Prisma transaction untuk atomic quota check.
 * Mencegah race condition jika banyak user register bersamaan.
 */
export async function registerUserToEvent(userId: string, eventId: string) {
  return prisma.$transaction(async (tx) => {
    // 1. Cek event & kuota masih tersedia
    const event = await tx.event.findFirst({
      where: {
        id: eventId,
        registered: { lt: tx.event.fields.quota as unknown as number },
      },
    });

    if (!event) {
      throw new AppError(
        "Kuota event penuh atau event tidak ditemukan",
        400,
        "QUOTA_EXCEEDED"
      );
    }

    // Validasi tambahan karena SQLite tidak support row-level lock
    if (event.registered >= event.quota) {
      throw new AppError("Kuota event sudah penuh", 400, "QUOTA_EXCEEDED");
    }

    // 2. Cek duplikasi registrasi
    const existing = await tx.ticket.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (existing) {
      throw new AppError(
        "Kamu sudah terdaftar di event ini",
        409,
        "DUPLICATE_REGISTRATION"
      );
    }

    // 3. Buat tiket & increment kuota secara atomic
    const ticketCode = generateTicketCode(eventId);

    const [ticket] = await Promise.all([
      tx.ticket.create({
        data: { userId, eventId, code: ticketCode },
        include: { event: true, user: { select: { id: true, name: true, email: true } } },
      }),
      tx.event.update({
        where: { id: eventId },
        data: { registered: { increment: 1 } },
      }),
    ]);

    return ticket;
  });
}

/** Ambil tiket milik user */
export async function getUserTickets(userId: string) {
  return prisma.ticket.findMany({
    where: { userId },
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });
}

/** Ambil detail tiket by code */
export async function getTicketByCode(code: string) {
  return prisma.ticket.findUnique({
    where: { code },
    include: {
      event: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

/** Check-in tiket — atomic status update untuk mencegah duplicate check-in & event mismatch */
export async function checkinTicket(code: string, expectedEventId?: string) {
  return prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.findUnique({
      where: { code },
      include: { event: true },
    });

    if (!ticket) {
      throw new AppError("Tiket tidak ditemukan", 404, "TICKET_NOT_FOUND");
    }

    // Validasi kesesuaian event jika scanner terkunci pada event tertentu
    if (expectedEventId && ticket.eventId !== expectedEventId) {
      throw new AppError(
        `Tiket ini milik event "${ticket.event.title}", bukan event yang sedang dibuka di meja scanner saat ini.`,
        400,
        "EVENT_MISMATCH"
      );
    }

    if (ticket.status === "CHECKED_IN") {
      throw new AppError(
        "Tiket sudah di-check-in sebelumnya",
        409,
        "ALREADY_CHECKED_IN"
      );
    }

    if (ticket.status === "CANCELLED") {
      throw new AppError("Tiket sudah dibatalkan", 400, "TICKET_CANCELLED");
    }

    return tx.ticket.update({
      where: { code },
      data: { status: "CHECKED_IN", checkedAt: new Date() },
      include: {
        event: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  });
}

/** Ambil semua tiket per event (untuk admin) */
export async function getTicketsByEvent(eventId: string) {
  return prisma.ticket.findMany({
    where: { eventId },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}
