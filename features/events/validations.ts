import { z } from "zod";
import type { Event } from "@prisma/client";

// ─── Zod Schemas (single source of truth untuk FE & BE) ───────────────────

export const EventSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter").max(100),
  description: z.string().min(20, "Deskripsi minimal 20 karakter"),
  category: z.string().min(1, "Kategori wajib diisi"),
  location: z.string().min(3, "Lokasi minimal 3 karakter"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Format tanggal tidak valid",
  }),
  quota: z.coerce
    .number()
    .int()
    .min(1, "Kuota minimal 1")
    .max(10000, "Kuota maksimal 10.000"),
  imageUrl: z.string().url("URL gambar tidak valid").optional().or(z.literal("")),
});

export type EventFormData = z.infer<typeof EventSchema>;

// ─── TypeScript Types ──────────────────────────────────────────────────────
// SSOT: pakai Prisma generated type langsung — jika schema berubah, type ikut otomatis.
// DILARANG mendefinisikan ulang EventType secara manual (bisa drift dari schema).

/** Type event sesuai Prisma schema — single source of truth */
export type EventType = Event;

/** Event dengan count tiket (dari query include) */
export type EventWithCount = Event & {
  _count: { tickets: number };
};

export interface EventListResponse {
  events: EventType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type EventCategory =
  | "Semua"
  | "Conference"
  | "Workshop"
  | "Meetup"
  | "Bootcamp"
  | "Hackathon"
  | "Talk Show";

export const EVENT_CATEGORIES: EventCategory[] = [
  "Semua",
  "Conference",
  "Workshop",
  "Meetup",
  "Bootcamp",
  "Hackathon",
  "Talk Show",
];
