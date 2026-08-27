/**
 * ERR — Single Source of Truth untuk semua error messages & codes.
 *
 * WAJIB: gunakan konstanta ini di repository layer (lib/db/) dan API routes.
 * DILARANG: menulis string error literal tersebar di berbagai file.
 *
 * @example
 * throw new AppError(ERR.QUOTA_EXCEEDED.message, ERR.QUOTA_EXCEEDED.status, ERR.QUOTA_EXCEEDED.code);
 */
export const ERR = {
  // ─── Auth ─────────────────────────────────────────────────────────────────
  UNAUTHORIZED: {
    message: "Kamu harus login terlebih dahulu",
    status: 401,
    code: "UNAUTHORIZED",
  },
  FORBIDDEN: {
    message: "Akses ditolak — kamu tidak memiliki izin",
    status: 403,
    code: "FORBIDDEN",
  },
  FORBIDDEN_ADMIN: {
    message: "Hanya admin yang bisa mengakses ini",
    status: 403,
    code: "FORBIDDEN",
  },

  // ─── Auth: Register / Login ────────────────────────────────────────────────
  EMAIL_EXISTS: {
    message: "Email sudah terdaftar, gunakan email lain",
    status: 409,
    code: "EMAIL_EXISTS",
  },
  INVALID_CREDENTIALS: {
    message: "Email atau password salah",
    status: 401,
    code: "INVALID_CREDENTIALS",
  },

  // ─── Event ────────────────────────────────────────────────────────────────
  EVENT_NOT_FOUND: {
    message: "Event tidak ditemukan",
    status: 404,
    code: "NOT_FOUND",
  },
  QUOTA_EXCEEDED: {
    message: "Kuota event sudah penuh",
    status: 400,
    code: "QUOTA_EXCEEDED",
  },

  // ─── Ticket ───────────────────────────────────────────────────────────────
  TICKET_NOT_FOUND: {
    message: "Tiket tidak ditemukan",
    status: 404,
    code: "TICKET_NOT_FOUND",
  },
  DUPLICATE_REGISTRATION: {
    message: "Kamu sudah terdaftar di event ini",
    status: 409,
    code: "DUPLICATE_REGISTRATION",
  },
  ALREADY_CHECKED_IN: {
    message: "Tiket sudah pernah di-check-in sebelumnya",
    status: 409,
    code: "ALREADY_CHECKED_IN",
  },
  TICKET_CANCELLED: {
    message: "Tiket ini sudah dibatalkan",
    status: 400,
    code: "TICKET_CANCELLED",
  },

  // ─── Generic ──────────────────────────────────────────────────────────────
  INTERNAL: {
    message: "Terjadi kesalahan server, coba lagi nanti",
    status: 500,
    code: "INTERNAL_ERROR",
  },
  VALIDATION: {
    message: "Validasi gagal, periksa input kamu",
    status: 400,
    code: "VALIDATION_ERROR",
  },

  // ─── Dynamic (fungsi untuk pesan dengan konteks) ──────────────────────────
  NOT_FOUND: (entity: string) => ({
    message: `${entity} tidak ditemukan`,
    status: 404,
    code: "NOT_FOUND",
  }),
} as const;

export type ErrorCode = keyof typeof ERR;
