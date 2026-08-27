# SurabayaDev Technical Assessment — Case Study & Engineering Report

Dokumen ini berisi analisis sistem menyeluruh, keputusan teknis, arsitektur, dan implementasi dari **Mini Event Platform SurabayaDev**.

---

## PART 1: TECHNICAL CASE STUDY

### 1. System Analysis

#### 1.1 Fitur yang Dibutuhkan
1. **Event Discovery & Catalog**: Pencarian real-time, filter kategori (Conference, Workshop, Meetup, Bootcamp, Hackathon, Talk Show), visualisasi kuota & status keterisian.
2. **Atomic Registration System**: Pendaftaran peserta dengan proteksi race condition pada kuota tiket, pencegahan registrasi ganda per event (`userId_eventId` unique constraint).
3. **Digital Ticket with QR Code**: Tiket digital dinamis dengan QR Code instan, status verifikasi (`PENDING`, `CHECKED_IN`, `CANCELLED`), serta metadata lengkap acara.
4. **Organizer Ticket Check-In (Panitia)**: Scanner / validator kode tiket real-time di lokasi acara dengan mekanisme transaksional untuk mencegah duplicate check-in.
5. **Admin Organizer Dashboard**: CRUD Event, monitoring statistik pendaftar & rasio kehadiran (*attendance rate*), serta manajemen data peserta.

#### 1.2 User Flow

```
[ Visitor / User ]
       │
       ▼
1. Browse Event List & Search ──► 2. Lihat Detail Event & Kuota Tersisa
                                              │
                                              ▼
                                 3. Klik "Daftar Event"
                                        │
                         ┌──────────────┴──────────────┐
                         ▼                             ▼
                  [ Belum Login ]                [ Sudah Login ]
                         │                             │
                         ▼                             ▼
                  Redirect ke Login/Regis   ──► 4. Atomic Transaction:
                                                   - Validasi kuota < limit
                                                   - Cegah duplikasi akun
                                                   - Generate kode unik (SBYDEV-xxx)
                                                   - Increment registered + 1
                                                       │
                                                       ▼
                                            5. Tiket Digital + QR Code
                                                       │
                                                       ▼
                                            6. Hadir di Lokasi Acara
                                                       │
                                                       ▼
                                            7. Panitia Scan / Validasi
                                                       │
                                                       ▼
                                            8. Status -> CHECKED_IN (Atomic)
```

#### 1.3 Pembagian Tanggung Jawab (Separation of Concerns)

| Area | Frontend (Client / UI Layer) | Backend (Server / Data Layer) |
|---|---|---|
| **Katalog Event** | Render kartu event, debounce search, category pill filter, skeleton loader | Paginated query, indexing filter, full-text search database |
| **Registrasi** | Form input state, client-side Zod validation, optimistic feedback | Prisma transaction `$transaction`, row lock check, atomic increment |
| **Tiket & QR** | Render SVG QR code (`react-qr-code`), responsive mobile pass | Cryptographic ticket code generator, ownership & role authorization |
| **Validasi / Check-in** | Antarmuka input kode tiket & scanner panitia, visual feedback | Atomic status transition (`PENDING` → `CHECKED_IN`), lock pencegahan double entry |
| **Autentikasi** | Session state hook, role-based conditional rendering | NextAuth JWT token encryption, bcrypt cost factor 12, role-based guard |

---

### 2. Frontend Perspective

#### 2.1 Teknologi yang Digunakan
- **Next.js 15 (App Router)**: Kombinasi React Server Components (RSC) untuk SEO & fast initial load, dan Client Components untuk interaktivitas dinamis.
- **Tailwind CSS v4 + SurabayaDev Design System Tokens**: Menggunakan semantic color tokens (`--color-primary: #16a34a` Emerald Green, `--color-navy: #0f172a` Slate, font Source Sans Pro, radius scale 8px button & 50px pill) — semua terpusat di `globals.css` sebagai SSOT.
- **Motion (`motion/react`)**: Micro-animations halus pada navigation drawer, status feedback, dan interactive buttons.
- **`@phosphor-icons/react`**: Satu icon family konsisten di seluruh aplikasi tanpa percampuran library icon lain.

#### 2.2 Arsitektur & Struktur Komponen (Feature-Based Modular)
Setiap fitur diisolasi dalam modul mandiri di bawah `features/`:
```
features/
  ├── events/      # (components, hooks, validations, api)
  ├── tickets/     # (components, hooks, types, api)
  ├── auth/        # (components, hooks, validations)
  └── admin/       # (components, hooks)
```
- **Prinsip Bebas Logic di JSX**: Semua logika state lebih dari 3 baris dipisahkan ke dalam custom hooks (`useEvents`, `useEventRegistration`, `useTicketCheckin`, dll).

#### 2.3 State Management
- **Server State**: React Server Components & Native Fetch dengan caching granularity per route.
- **Client State**: Lightweight React custom hooks + Zustand untuk session & transient modal feedback.
- **Form State**: Zod schema single source of truth untuk validasi FE & BE secara identik.

#### 2.4 Strategi Menjaga Performa (Kondisi 3.000 User Akses)
1. **Server Components Default**: Merender HTML statis di server untuk daftar event utama sehingga mengurangi bundle size JavaScript di browser.
2. **Skeleton Matching**: Tidak menggunakan generic full-page spinner; menggunakan skeleton yang menyerupai bentuk kartu event untuk meminimalkan *Cumulative Layout Shift (CLS < 0.1)*.
3. **Next/Image Optimization**: Kompresi otomatis format WebP/AVIF dengan *responsive srcSet* dan *lazy loading*.
4. **Debounced Search Input**: Mengurangi re-fetching berlebihan saat user mengetik di search bar.

---

### 3. Backend Perspective

#### 3.1 Desain Database (Schema Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(USER)
  tickets   Ticket[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Event {
  id          String   @id @default(cuid())
  title       String
  description String
  category    String
  location    String
  date        DateTime
  quota       Int
  registered  Int      @default(0)
  imageUrl    String?
  tickets     Ticket[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Ticket {
  id        String       @id @default(cuid())
  code      String       @unique
  userId    String
  eventId   String
  status    TicketStatus @default(PENDING)
  checkedAt DateTime?
  user      User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  event     Event        @relation(fields: [eventId], references: [id], onDelete: Cascade)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  @@unique([userId, eventId]) // Prevent duplicate registration
}

enum Role { USER ADMIN }
enum TicketStatus { PENDING CHECKED_IN CANCELLED }
```

#### 3.2 Daftar RESTful API Endpoints

| Method | Endpoint | Auth / Role | Deskripsi |
|---|---|---|---|
| `GET` | `/api/events` | Public | List event (search, category filter, pagination) |
| `GET` | `/api/events/[id]` | Public | Detail event lengkap |
| `POST` | `/api/events` | Admin Only | Buat event baru |
| `PUT` | `/api/events/[id]` | Admin Only | Update data event |
| `DELETE` | `/api/events/[id]` | Admin Only | Hapus event & tiket terkait |
| `POST` | `/api/events/[id]/register` | User / Admin | Registrasi event (Atomic Quota Lock) |
| `GET` | `/api/events/[id]/attendees` | Admin Only | List seluruh peserta per event |
| `GET` | `/api/tickets` | User (Own) | List tiket milik user yang login |
| `GET` | `/api/tickets/[code]` | Owner / Admin | Detail tiket & QR |
| `POST` | `/api/tickets/[code]/checkin` | Admin Only | Validasi check-in kehadiran peserta |
| `POST` | `/api/auth/register` | Public | Registrasi akun baru |

#### 3.3 Pengelolaan Kuota Tiket & Pencegahan Race Condition
Ketika 1.000 user melakukan registrasi bersamaan pada event dengan kuota terbatas, terjadi potensi *race condition (overselling)*.

**Solusi Teknis:**
Semua mutasi registrasi dibungkus dalam **Prisma Interactive Transaction (`prisma.$transaction`)**:
```typescript
return prisma.$transaction(async (tx) => {
  // 1. Validasi kuota dalam transaction boundary
  const event = await tx.event.findFirst({
    where: { id: eventId, registered: { lt: prisma.event.fields.quota } },
  });
  if (!event || event.registered >= event.quota) {
    throw new AppError("Kuota event sudah penuh", 400, "QUOTA_EXCEEDED");
  }

  // 2. Cegah duplikasi di level transaction
  const existing = await tx.ticket.findUnique({
    where: { userId_eventId: { userId, eventId } },
  });
  if (existing) {
    throw new AppError("Kamu sudah terdaftar di event ini", 409, "DUPLICATE_REGISTRATION");
  }

  // 3. Eksekusi atomik: generate tiket + increment registered count
  const ticketCode = generateTicketCode(eventId);
  const [ticket] = await Promise.all([
    tx.ticket.create({ data: { userId, eventId, code: ticketCode } }),
    tx.event.update({ where: { id: eventId }, data: { registered: { increment: 1 } } }),
  ]);
  return ticket;
});
```

#### 3.4 Validasi Tiket & Pencegahan Duplicate Check-In
1. Kode tiket dibuat dengan format `SBYDEV-[EVENT_HASH]-[RANDOM_UNIQUE]`.
2. Saat panitia melakukan check-in via scanner, API memvalidasi status tiket:
   - Jika status `CHECKED_IN` ➔ Ditolak dengan kode error `ALREADY_CHECKED_IN` (HTTP 409) beserta waktu check-in pertama.
   - Jika status `PENDING` ➔ Status diubah menjadi `CHECKED_IN` dan timestamp `checkedAt = new Date()` dicatat secara atomik.

---

### 4. Technical Decision: Bagian Tersulit & Solusi

#### Bagian Tersulit
1. **High Concurrency Quota Race Condition**: Memastikan tidak ada tiket yang terbit melebihi kuota meskipun ratusan request masuk dalam milidetik yang sama.
2. **Arsitektur DRY & SSOT Tanpa Redundansi**: Membangun ratusan baris kode backend tanpa menduplikasi penanganan error, auth guard, validasi Zod, dan tipe TypeScript.

#### Solusi Teknis yang Dipilih
1. **Database-Level Atomic Locks & Unique Constraints**: Memanfaatkan database ACID properties + Prisma Transactions + Compound Unique Index (`@@unique([userId, eventId])`).
2. **Unified Middleware & Higher-Order Functions (HOF)**:
   - `withErrorHandler()`: Membungkus seluruh route handler untuk memastikan format `{ success, data/error }` seragam 100%.
   - `requireAuth()` & `requireAdmin()`: Satu baris deklarasi proteksi endpoint.
   - `zodErrorResponse()`: Format error validasi terstandarisasi.
   - Prisma Type SSOT: `export type EventType = Event` otomatis sinkron dengan database schema.
