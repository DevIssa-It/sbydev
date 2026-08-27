import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/api";
import { generateTicketCode } from "@/lib/api";
import { ERR } from "@/lib/errors";

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
      const err = ERR.QUOTA_EXCEEDED;
      throw new AppError(err.message, err.status, err.code);
    }

    // Validasi tambahan karena SQLite tidak support row-level lock
    if (event.registered >= event.quota) {
      const err = ERR.QUOTA_EXCEEDED;
      throw new AppError(err.message, err.status, err.code);
    }

    // 2. Cek duplikasi registrasi
    const existing = await tx.ticket.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (existing) {
      const err = ERR.DUPLICATE_REGISTRATION;
      throw new AppError(err.message, err.status, err.code);
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
      const err = ERR.TICKET_NOT_FOUND;
      throw new AppError(err.message, err.status, err.code);
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
      const err = ERR.ALREADY_CHECKED_IN;
      throw new AppError(err.message, err.status, err.code);
    }

    if (ticket.status === "CANCELLED") {
      const err = ERR.TICKET_CANCELLED;
      throw new AppError(err.message, err.status, err.code);
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
