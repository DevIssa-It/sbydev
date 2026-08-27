/**
 * Generate unique ticket code
 * Format: SBYDEV-{eventId 6 chars}-{random 8 chars uppercase}
 * @example "SBYDEV-ABC123-XY789ZWQ"
 */
export function generateTicketCode(eventId: string): string {
  const eventPrefix = eventId.slice(-6).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `SBYDEV-${eventPrefix}-${randomPart}`;
}

/** Custom error class untuk error yang ter-handle di API */
export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

/** Helper response sukses */
export function successResponse<T>(data: T, status = 200): Response {
  return Response.json({ success: true, data }, { status });
}

/** Helper response error */
export function errorResponse(
  message: string,
  status = 400,
  code?: string
): Response {
  return Response.json({ success: false, error: message, code }, { status });
}
