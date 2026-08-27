import { getTicketByCode } from "@/lib/db/tickets";
import { successResponse, errorResponse } from "@/lib/api";
import { requireAuth, withErrorHandler } from "@/lib/middleware";

interface RouteContext {
  params: Promise<{ code: string }>;
}

// GET /api/tickets/[code]
export const GET = withErrorHandler(
  "GET /api/tickets/[code]",
  async (request, context) => {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { code } = await (context as RouteContext).params;
    const ticket = await getTicketByCode(code);

    if (!ticket) return errorResponse("Tiket tidak ditemukan", 404, "NOT_FOUND");

    // User hanya bisa lihat tiket miliknya; admin bisa lihat semua
    const isOwner = ticket.userId === session!.user!.id;
    const isAdmin = session!.user?.role === "ADMIN";
    if (!isOwner && !isAdmin) return errorResponse("Forbidden", 403, "FORBIDDEN");

    return successResponse(ticket);
  }
);
