# SurabayaDev Events Platform

> Platform registrasi acara teknologi dan konsol manajemen organizer untuk ekosistem komunitas developer Surabaya & Jawa Timur.
> Dikembangkan sebagai solusi menyeluruh untuk **Technical Assessment SurabayaDev**.

---

### 🌐 Tautan Live Demo & Repository
- **Live Demo Production**: [https://sbydev.vercel.app/](https://sbydev.vercel.app/)
- **GitHub Repository**: [https://github.com/DevIssa-It/sbydev](https://github.com/DevIssa-It/sbydev)

### 🔑 Akun Demo Pengujian (Seed Data):
| Role | Email | Password | Akses Fitur |
|---|---|---|---|
| **Admin Panitia** | `admin@sbydev.id` | `adminpassword123` | Konsol Admin, CRUD Event, Scanner Check-In, Rekap Kehadiran |
| **Peserta User** | `user@sbydev.id` | `userpassword123` | Registrasi Event, E-Tiket Digital, QR Code Dinamis, Edit Profil |

---

## 1. Ringkasan & Solusi Studi Kasus

Aplikasi ini dirancang untuk menjawab seluruh tantangan teknis dalam studi kasus platform event komunitas, mencakup manajemen kuota saat *high concurrency traffic*, penerbitan tiket digital dengan kode unik QR, sistem validasi check-in panitia di lokasi acara, dan pemisahan hak akses antara admin organizer dan peserta.

### Fitur Utama (Sesuai Spesifikasi Studi Kasus):

1. **Event Discovery & Catalog**:
   - Pencarian acara *real-time* berbasis judul, topik, dan lokasi.
   - Filter kategori interaktif (Conference, Workshop, Meetup, Hackathon).
   - Visualisasi kuota kursi real-time dengan status keterisian dan badge ketersediaan.

2. **Atomic Registration System (Anti-Race Condition)**:
   - Mekanisme transaksi database terisolasi (`prisma.$transaction`) untuk mengunci validasi kuota tersisa dan melakukan penambahan pendaftar secara atomik.
   - *Compound unique constraint* (`userId_eventId`) mencegah terjadinya pendaftaran ganda dari akun yang sama pada satu event.

3. **Digital Ticket with Dynamic QR Code**:
   - Penerbitan tiket digital otomatis dengan format kode resmi: **`SBYDEV-[EVENT_HASH]-[RANDOM_UNIQUE]`**.
   - Rendering kode QR dinamis berbasis vektor SVG (`react-qr-code`).
   - Modal pratinjau cepat kode QR dan tampilan *boarding pass* lengkap.

4. **Organizer Ticket Check-In Scanner (Panitia)**:
   - Antarmuka validator tiket di lokasi acara untuk memindai atau memasukkan kode tiket secara *real-time*.
   - Validasi status transaksional: mencatat waktu kehadiran (`checkedAt`) dan mencegah *duplicate entry* (tiket yang sudah dipakai tidak dapat digunakan kembali).

5. **Admin Organizer Dashboard**:
   - Panel manajemen acara eksklusif bagi penyelenggara.
   - Operasi CRUD Event dengan fitur unggah foto banner sampul (*drag & drop* + URL preview).
   - Manajemen dan pemantauan daftar peserta terdaftar per event.
   - Metrik KPI kehadiran dan tingkat konversi check-in.

---

## 2. Analisis & Keputusan Rekayasa Teknis

### 2.1 Penanganan High Concurrency & Kuota Race Condition
Ketika ribuan pengguna mendaftar pada milidetik yang sama pada event berkuota terbatas, sistem mencegah *overselling* melalui transaksi interaktif database:

```typescript
// Eksekusi atomik dalam boundary transaksi Prisma
return prisma.$transaction(async (tx) => {
  // 1. Validasi kuota dengan row locking
  const event = await tx.event.findFirst({
    where: { id: eventId, registered: { lt: prisma.event.fields.quota } },
  });

  if (!event || event.registered >= event.quota) {
    throw new AppError("Kuota event sudah penuh", 400, "QUOTA_EXCEEDED");
  }

  // 2. Pencegahan duplikasi pendaftaran di level transaksi
  const existing = await tx.ticket.findUnique({
    where: { userId_eventId: { userId, eventId } },
  });

  if (existing) {
    throw new AppError("Anda sudah terdaftar pada event ini", 409, "DUPLICATE_REGISTRATION");
  }

  // 3. Terbitkan tiket unik dan lakukan atomic increment kuota
  const ticketCode = generateTicketCode(eventId);
  const [ticket] = await Promise.all([
    tx.ticket.create({ data: { userId, eventId, code: ticketCode } }),
    tx.event.update({ where: { id: eventId }, data: { registered: { increment: 1 } } }),
  ]);

  return ticket;
});
```

### 2.2 Arsitektur Kode (DRY & Single Source of Truth)
- **Database Layer**: Menggunakan *Repository Pattern* di `lib/db/` untuk memisahkan logika query dari API handler.
- **Type Safety**: Menggunakan tipe bawaan Prisma (`export type EventType = Event`) sebagai sumber kebenaran tipe TypeScript tunggal tanpa penulisan ulang manual.
- **Centralized Middleware**: Penanganan otorisasi (`requireAuth`, `requireAdmin`) dan format error seragam (`withErrorHandler`) terpusat di `lib/middleware.ts`.
- **Validation**: Schema Zod tunggal digunakan bersama untuk validasi form sisi klien dan request body sisi server.

---

## 3. Tech Stack

| Layer | Teknologi |
|---|---|
| **Framework Utama** | Next.js 15 (App Router, React 19) |
| **Bahasa Pemrograman** | TypeScript (Strict Mode) |
| **Database & ORM** | Prisma ORM + SQLite (Development) / PostgreSQL (Production) |
| **Autentikasi & Sesi** | NextAuth.js v5 (JWT Strategy, Role-Based Access Control) |
| **Keamanan Password** | bcryptjs (Cost Factor 12) |
| **Validasi Skema** | Zod |
| **Styling & Token** | Tailwind CSS v4 + Semantic CSS Variables |
| **Animasi & Transisi** | Motion (`motion/react`) |
| **Ikonografi** | `@phosphor-icons/react` |
| **QR Code Engine** | `react-qr-code` |

---

## 4. Akun Default untuk Pengujian (Testing Credentials)

Database seed telah dikonfigurasi dengan akun pengujian siap pakai:

| Peran (Role) | Email | Password | Hak Akses & Kemampuan |
|---|---|---|---|
| **Admin Organizer** | `admin@sbydev.id` | `password123` | Akses penuh dashboard `/admin`, CRUD Event, daftar peserta, dan Scanner `/admin/scanner` |
| **Member Peserta** | `user@sbydev.id` | `password123` | Akses katalog event publik, alur pendaftaran tiket, dan menu tiket `/tickets` |

---

## 5. Daftar RESTful API Endpoints

Semua endpoint menghasilkan respon terstruktur JSON `{ success: boolean, data?: any, error?: string }`:

| Method | Endpoint | Hak Akses | Keterangan |
|---|---|---|---|
| `POST` | `/api/auth/register` | Publik | Registrasi akun baru (password di-hash bcrypt 12) |
| `GET` | `/api/events` | Publik | Mengambil daftar event dengan filter pencarian & kategori |
| `POST` | `/api/events` | Admin Only | Membuat publikasi event baru |
| `GET` | `/api/events/[id]` | Publik | Mengambil rincian detail event |
| `PUT` | `/api/events/[id]` | Admin Only | Memperbarui data event |
| `DELETE`| `/api/events/[id]` | Admin Only | Menghapus event dan tiket terkait secara kaskade |
| `POST` | `/api/events/[id]/register` | Member / Admin | Registrasi event dengan transaksi kuota atomik |
| `GET` | `/api/events/[id]/attendees`| Admin Only | Mengambil daftar seluruh peserta per event |
| `GET` | `/api/tickets` | Member / Admin | Mengambil daftar tiket milik pengguna yang sedang login |
| `GET` | `/api/tickets/[code]` | Pemilik / Admin| Mengambil data detail tiket dan status QR |
| `POST` | `/api/tickets/[code]/checkin`| Admin Only | Memvalidasi check-in kehadiran di venue acara |

---

## 6. Panduan Menjalankan Proyek Secara Lokal

### Prasyarat:
- **Node.js**: Versi 18.18.0 atau lebih baru
- **npm** atau **pnpm**

### Langkah Setup:

1. **Clone Repository**:
   ```bash
   git clone https://github.com/DevIssa-It/sbydev.git
   cd sbydev
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**:
   Buat file `.env` di root direktori proyek:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="surabayadev-assessment-secret-key-32charsmin"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Migrasi Database & Seed Data Demo**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:3000`.

---

## 7. Panduan Deployment Production

### Rekomendasi Konfigurasi:
- **Hosting Aplikasi**: [Vercel](https://vercel.com) (Native support untuk Next.js App Router)
- **Database Production**: PostgreSQL via [Neon Serverless Postgres](https://neon.tech) atau [Supabase](https://supabase.com)

### Langkah Deploy:
1. Hubungkan repository GitHub ke project baru di **Vercel**.
2. Masukkan Environment Variables di dashboard Vercel:
   - `DATABASE_URL`: URL koneksi PostgreSQL production
   - `NEXTAUTH_SECRET`: String acak aman minimal 32 karakter
   - `NEXTAUTH_URL`: Domain website live Vercel Anda
3. Jalankan build deployment default (`npm run build`).
