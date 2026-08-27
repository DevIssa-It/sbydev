import { auth } from "@/lib/auth";
import { AppError, errorResponse } from "@/lib/api";
import type { Session } from "next-auth";
import type { ZodError } from "zod";

// ─── Auth Guards (SSOT — satu tempat untuk semua route) ───────────────────

export interface AuthSuccess {
  session: Session;
  error: null;
}

export interface AuthFailure {
  session: null;
  error: Response;
}

export type AuthResult = AuthSuccess | AuthFailure;

/**
 * Pastikan request dari user yang sudah login.
 * @returns session jika valid, Response 401 jika tidak
 */
export async function requireAuth(): Promise<AuthResult> {
  const session = await auth();
  if (!session || !session.user) {
    return {
      session: null,
      error: errorResponse("Unauthorized — kamu harus login", 401, "UNAUTHORIZED"),
    };
  }
  return { session, error: null };
}

/**
 * Pastikan request dari user dengan role ADMIN.
 * @returns session jika admin, Response 401/403 jika tidak
 */
export async function requireAdmin(): Promise<AuthResult> {
  const session = await auth();
  if (!session || !session.user) {
    return {
      session: null,
      error: errorResponse("Unauthorized", 401, "UNAUTHORIZED"),
    };
  }
  if (session.user.role !== "ADMIN") {
    return {
      session: null,
      error: errorResponse("Forbidden — hanya admin yang bisa mengakses ini", 403, "FORBIDDEN"),
    };
  }
  return { session, error: null };
}

// ─── Error Handler Wrapper (SSOT — satu tempat untuk catch logic) ──────────

type RouteHandler<T = unknown> = (request: Request, context: T) => Promise<Response>;

/**
 * HOF — bungkus route handler dengan error handling standar.
 * Menggantikan copy-paste try/catch di setiap route.
 */
export function withErrorHandler<T = unknown>(
  label: string,
  handler: RouteHandler<T>
): (request: Request, context: T) => Promise<Response> {
  return async (request: Request, context: T): Promise<Response> => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof AppError) {
        return errorResponse(error.message, error.statusCode, error.code);
      }
      console.error(`[${label}]`, error);
      return errorResponse("Terjadi kesalahan server", 500, "INTERNAL_ERROR");
    }
  };
}

// ─── Zod Validation Helper (SSOT — format error yang konsisten) ────────────

/**
 * Ubah ZodError menjadi response 400 yang konsisten.
 */
export function zodErrorResponse(error: ZodError): Response {
  return Response.json(
    {
      success: false,
      error: "Validasi gagal",
      details: error.flatten().fieldErrors,
    },
    { status: 400 }
  );
}
