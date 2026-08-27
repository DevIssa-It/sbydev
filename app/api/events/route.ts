import { getEvents, getEventCategories, createEvent } from "@/lib/db/events";
import { EventSchema } from "@/features/events/validations";
import { successResponse } from "@/lib/api";
import { requireAdmin, withErrorHandler, zodErrorResponse } from "@/lib/middleware";

// GET /api/events?search=&category=&page=
export const GET = withErrorHandler("GET /api/events", async (request) => {
  const { searchParams } = new URL(request.url);

  const result = await getEvents({
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || undefined,
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 9,
  });

  const categories = await getEventCategories();
  return successResponse({ ...result, categories });
});

// POST /api/events — ADMIN only
export const POST = withErrorHandler("POST /api/events", async (request) => {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const parsed = EventSchema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const event = await createEvent({
    ...parsed.data,
    date: new Date(parsed.data.date),
    imageUrl: parsed.data.imageUrl || undefined,
  });

  return successResponse(event, 201);
});
