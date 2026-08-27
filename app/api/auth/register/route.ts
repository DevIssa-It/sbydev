import { RegisterSchema } from "@/features/auth/validations";
import { createUser } from "@/lib/db/users";
import { successResponse } from "@/lib/api";
import { withErrorHandler, zodErrorResponse } from "@/lib/middleware";

// POST /api/auth/register
export const POST = withErrorHandler("POST /api/auth/register", async (request) => {
  const body = await request.json();
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const { confirmPassword: _, ...userData } = parsed.data;
  const user = await createUser(userData);
  return successResponse(user, 201);
});
