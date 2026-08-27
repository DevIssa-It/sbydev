import { checkinTicket } from "@/lib/db/tickets";
import { successResponse } from "@/lib/api";
import { requireAdmin, withErrorHandler } from "@/lib/middleware";

interface RouteContext {
  params: Promise<{ code: string }>;
}

// POST /api/tickets/[code]/checkin — ADMIN only
export const POST = withErrorHandler(
  "POST /api/tickets/[code]/checkin",
  async (request, context) => {
    const { error } = await requireAdmin();
    if (error) return error;

    const { code } = await (context as RouteContext).params;
    
    let eventId: string | undefined;
    try {
      const body = await request.json();
      eventId = body?.eventId;
    } catch {
      // Body is optional
    }

    const ticket = await checkinTicket(code, eventId);
    return successResponse(ticket);
  }
);
