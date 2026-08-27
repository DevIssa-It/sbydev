import { getTicketsByEvent } from "@/lib/db/tickets";
import { getEventById } from "@/lib/db/events";
import { successResponse, errorResponse } from "@/lib/api";
import { requireAdmin, withErrorHandler } from "@/lib/middleware";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/events/[id]/attendees — ADMIN only
export const GET = withErrorHandler(
  "GET /api/events/[id]/attendees",
  async (request, context) => {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await (context as RouteContext).params;
    const event = await getEventById(id);

    if (!event) return errorResponse("Event tidak ditemukan", 404, "NOT_FOUND");

    const tickets = await getTicketsByEvent(id);
    return successResponse({ event, tickets });
  }
);
