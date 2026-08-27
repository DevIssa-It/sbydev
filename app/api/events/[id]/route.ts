import { getEventById, updateEvent, deleteEvent } from "@/lib/db/events";
import { EventSchema } from "@/features/events/validations";
import { successResponse, errorResponse } from "@/lib/api";
import { requireAdmin, withErrorHandler, zodErrorResponse } from "@/lib/middleware";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/events/[id] — public
export const GET = withErrorHandler(
  "GET /api/events/[id]",
  async (request, context) => {
    const { id } = await (context as RouteContext).params;
    const event = await getEventById(id);
    if (!event) return errorResponse("Event tidak ditemukan", 404, "NOT_FOUND");
    return successResponse(event);
  }
);

// PUT /api/events/[id] — ADMIN only
export const PUT = withErrorHandler(
  "PUT /api/events/[id]",
  async (request, context) => {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await (context as RouteContext).params;
    const body = await request.json();
    const parsed = EventSchema.partial().safeParse(body);
    if (!parsed.success) return zodErrorResponse(parsed.error);

    const event = await updateEvent(id, {
      ...parsed.data,
      date: parsed.data.date ? new Date(parsed.data.date) : undefined,
    });

    return successResponse(event);
  }
);

// DELETE /api/events/[id] — ADMIN only
export const DELETE = withErrorHandler(
  "DELETE /api/events/[id]",
  async (request, context) => {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await (context as RouteContext).params;
    await deleteEvent(id);
    return successResponse({ message: "Event berhasil dihapus" });
  }
);
