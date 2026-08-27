# SurabayaDev Mini Event Platform — Walkthrough & Verification

Platform Event **SurabayaDev** telah berhasil dibangun secara menyeluruh dengan arsitektur **Full-Stack Next.js 15**, **Prisma ORM**, **NextAuth v5**, **Tailwind CSS v4**, dan **Coursera Design System Tokens** dengan kepatuhan 100% terhadap aturan di [`AGENTS.md`](file:///c:/Users/ahmad/Documents/Project/sbydev/AGENTS.md).

---

## 🏛️ Kepatuhan Arsitektur & Aturan AGENTS.md

| Kriteria | Implementasi di Codebase | Status |
|---|---|:---:|
| **Feature-Based Modular** | `features/events/`, `features/tickets/`, `features/auth/`, `features/admin/` | ✅ Sesuai |
| **Layer Separation** | UI (`components/`) ➔ Logic (`hooks/`) ➔ Data (`api.ts`, `lib/db/`) ➔ Type (`types.ts`, `@prisma/client`) | ✅ Sesuai |
| **Single Source of Truth (SSOT)** | Tipe `EventType` diturunkan langsung dari Prisma Client (`@prisma/client`); Zod Schema dipakai FE & BE; Error constants terpusat di `lib/errors.ts` | ✅ Sesuai |
| **Don't Repeat Yourself (DRY)** | API routes menggunakan `requireAuth()`, `requireAdmin()`, `withErrorHandler()`, dan `zodErrorResponse()` dari `lib/middleware.ts` | ✅ Sesuai |
| **Atomic Quota Management** | Registrasi tiket dibungkus dalam `prisma.$transaction` dengan validasi kuota & lock row sebelum increment | ✅ Sesuai |
| **Duplicate Check-in Prevention** | Validasi status transaksional (`PENDING` ➔ `CHECKED_IN`) dengan timestamp pencatatan `checkedAt` | ✅ Sesuai |
| **Coursera Design Tokens** | Primary Blue (`#0056d2`), Navy Callout (`#002761`), 8px button radius, 50px category pill, Source Sans Pro | ✅ Sesuai |
| **Icon Standard** | `@phosphor-icons/react` digunakan sebagai satu-satunya icon library | ✅ Sesuai |

---

## 📦 Fitur & Rute yang Tersedia

### 1. Halaman Publik & Pengguna (`app/(main)`)
- `/` — Katalog Event dengan pencarian real-time, filter kategori kapsul, dan Hero Card Coursera.
- `/events/[id]` — Detail Event lengkap dengan indikator progress kuota dan tombol pendaftaran instan.
- `/tickets` — Daftar tiket digital milik pengguna yang terautentikasi.
- `/tickets/[code]` — E-Ticket Pass resmi dengan QR Code dinamis dan detail jadwal/lokasi.

### 2. Autentikasi (`app/(auth)`)
- `/login` — Halaman Masuk dengan petunjuk akun demo instan.
- `/register` — Pendaftaran akun peserta baru dengan validasi password min. 6 karakter.

### 3. Panel Admin & Panitia (`app/admin`)
- `/admin` — Dashboard manajemen CRUD Event dan ringkasan kuota.
- `/admin/events/new` — Form pembuatan event baru dengan validasi Zod.
- `/admin/events/[id]` — Form edit event yang sudah ada.
- `/admin/events/[id]/attendees` — Tabel data peserta per event lengkap dengan kalkulasi tingkat kehadiran (*attendance rate*).
- `/admin/scanner` — Antarmuka live scanner / validasi kode tiket panitia di lokasi acara.

---

## 🔑 Akun Uji Coba (Seed Data)

| Role | Email | Password | Akses & Hak |
|---|---|---|---|
| 👑 **Admin** | `admin@sbydev.id` | `admin123` | Dashboard Admin (`/admin`), Scanner Panitia (`/admin/scanner`), CRUD Event, Data Peserta |
| 👤 **User** | `user@sbydev.id` | `user123` | Jelajahi Event, Registrasi Event, Akses Tiket (`/tickets`) |

---

## 🧪 Hasil Verifikasi Teknis

1. **TypeScript Typecheck (`npx tsc --noEmit`)**:
   - `Exit code: 0` (0 error).
2. **Database Sync & Seed**:
   - Schema Prisma SQLite berhasil di-push dan di-seed dengan 6 event realistis dan 2 akun default.
3. **API Endpoint Test (`GET /api/events`)**:
   - `Status: 200 OK`, `success: true`, total 6 event berhasil di-load via repository layer.

---

## 📄 Dokumen Laporan Lengkap

- [README.md](file:///c:/Users/ahmad/Documents/Project/sbydev/README.md) — Dokumentasi instalasi, arsitektur, dan ringkasan API.
- [TECHNICAL_CASE_STUDY.md](file:///c:/Users/ahmad/Documents/Project/sbydev/TECHNICAL_CASE_STUDY.md) — Jawaban lengkap Part 1 (System Analysis, FE/BE perspective, technical decisions).
- [COMMUNITY_COMMITMENT.md](file:///c:/Users/ahmad/Documents/Project/sbydev/COMMUNITY_COMMITMENT.md) — Jawaban lengkap Part 3 (Community commitment).
- [AGENTS.md](file:///c:/Users/ahmad/Documents/Project/sbydev/AGENTS.md) — Kontrak teknis arsitektur, coding standard, dan design tokens.
