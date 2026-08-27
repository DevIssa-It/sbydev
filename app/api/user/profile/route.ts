import { z } from "zod";
import { requireAuth, withErrorHandler, zodErrorResponse } from "@/lib/middleware";
import { getUserById, updateUserProfile } from "@/lib/db/users";
import { successResponse } from "@/lib/api";

const ProfileUpdateSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(60, "Nama maksimal 60 karakter"),
});

export const GET = withErrorHandler("GET /api/user/profile", async () => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const user = await getUserById(session.user.id);
  return successResponse(user);
});

export const PUT = withErrorHandler("PUT /api/user/profile", async (request: Request) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const parsed = ProfileUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return zodErrorResponse(parsed.error);
  }

  const updatedUser = await updateUserProfile(session.user.id, {
    name: parsed.data.name,
  });

  return successResponse(updatedUser);
});
