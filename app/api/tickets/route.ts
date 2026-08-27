import { getUserTickets } from "@/lib/db/tickets";
import { successResponse } from "@/lib/api";
import { requireAuth, withErrorHandler } from "@/lib/middleware";

// GET /api/tickets — tiket milik user yang sedang login
export const GET = withErrorHandler("GET /api/tickets", async () => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const tickets = await getUserTickets(session!.user!.id!);
  return successResponse(tickets);
});
