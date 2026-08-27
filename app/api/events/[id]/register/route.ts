import { registerUserToEvent } from "@/lib/db/tickets";
import { successResponse } from "@/lib/api";
import { requireAuth, withErrorHandler } from "@/lib/middleware";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/events/[id]/register
export const POST = withErrorHandler(
  "POST /api/events/[id]/register",
  async (request, context) => {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { id: eventId } = await (context as RouteContext).params;
    const ticket = await registerUserToEvent(session!.user!.id!, eventId);
    return successResponse(ticket, 201);
  }
);
