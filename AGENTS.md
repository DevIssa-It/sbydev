# AGENTS.md — SurabayaDev Event Platform

> Dokumen ini adalah **kontrak teknis** antara AI agent dan codebase ini.
> Semua rule di sini bersifat **wajib** kecuali ada instruksi eksplisit dari developer.

## 0. ATURAN MUTLAK: ZERO EMOJI & ZERO GRADIENTS POLICY (WAJIB)

### 0.1 Zero Emoji Policy
- **DILARANG KERAS** menggunakan emoji Unicode apapun (seperti roket, bintang, centang emoji, api, dll) di dalam antarmuka UI, JSX, tombol, label, pesan error, response chat, maupun dokumentasi.
- **WAJIB** menggunakan icon resmi dari library `@phosphor-icons/react` (atau `@phosphor-icons/react/dist/ssr` pada Server Components).

### 0.2 Zero Gradients Policy
- **DILARANG KERAS** menggunakan CSS linear-gradient, radial-gradient, mesh gradient, background gradient Tailwind (`bg-gradient-to-...`), maupun text gradient.
- **WAJIB** menggunakan warna **SOLID** sesuai Design System Coursera:
  - Solid Deep Navy: `#002761` (Hero Banner & Callout Cards)
  - Solid Voltage Blue: `#0056d2` (CTA Button & Links)
  - Solid Canvas: `#ffffff` (Card & Background)
  - Solid Surface: `#e8eef7` (Pills & Chips)
  - Solid Hairline: `#dae1ed` (Border & Divider)
  - Solid Ink: `#0f1114` (Body Text)

### 0.3 Pemisahan Antarmuka Admin & User
- Antarmuka Admin (`/admin`) dan User/Peserta (`/`) terpisah secara total.
- Admin berfokus pada manajemen event (CRUD), data peserta, dan scanner validasi tiket. Admin tidak diarahkan ke alur onboarding peserta (How It Works, FAQ peserta, atau Tiket Saya).

---

## 1. ARSITEKTUR & POLA

### 1.1 Arsitektur Utama: Feature-Based Modular

Gunakan **Feature-Based Modular Architecture** — setiap fitur memiliki folder sendiri yang berisi komponen, hooks, types, dan utils miliknya. Jangan semua diletakkan di folder global.

```
✅ BOLEH
features/
  events/
    components/    ← komponen khusus event
    hooks/         ← useEvents, useEventDetail
    types/         ← EventType, EventFormData
    utils/         ← formatEventDate, validateQuota

❌ DILARANG
components/
  EventCard.tsx
  EventList.tsx
  EventDetail.tsx
  EventForm.tsx    ← semua ditumpuk di satu folder global
```

### 1.2 Layer Separation (Separation of Concerns)

| Layer | Tanggung Jawab | Lokasi |
|---|---|---|
| **UI Layer** | Render & interaksi | `features/*/components/` |
| **Logic Layer** | Business logic, transformasi data | `features/*/hooks/`, `lib/` |
| **Data Layer** | Fetch, mutate, cache | `features/*/api.ts`, `app/api/` |
| **Type Layer** | Kontrak data | `features/*/types.ts`, `types/` |

### 1.3 Pola yang WAJIB Dipakai

- **Repository Pattern** untuk akses database — semua query Prisma ada di `lib/db/` bukan langsung di API route
- **Server Actions** untuk mutasi data ringan, API Route untuk operasi kompleks / webhook
- **Zod Schemas** sebagai single source of truth untuk validasi — dipakai di FE form dan BE API sekaligus
- **Custom Hooks** untuk semua state & logic yang melibatkan lebih dari 3 baris — tidak ada logic di dalam JSX

```ts
// ✅ BOLEH — logic di hook
function EventRegistration({ eventId }: Props) {
  const { register, isLoading, error } = useEventRegistration(eventId);
  return <Button onClick={register} loading={isLoading}>Daftar</Button>;
}

// ❌ DILARANG — logic di dalam komponen
function EventRegistration({ eventId }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleClick = async () => {
    setLoading(true);
    try { await fetch('/api/...'); router.refresh(); }
    catch(e) { ... }
    finally { setLoading(false); }
  };
  return <button onClick={handleClick}>...</button>;
}
```

---

## 2. STRUKTUR FOLDER & FILE

### 2.1 Struktur Wajib

```
sbydev/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group: halaman auth
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (main)/                   # Route group: halaman utama
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Event list (home)
│   │   ├── events/[id]/page.tsx
│   │   └── tickets/
│   │       ├── page.tsx
│   │       └── [code]/page.tsx
│   ├── admin/                    # Admin dashboard (ADMIN only)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── events/
│   └── api/                      # API Routes
│       ├── auth/[...nextauth]/route.ts
│       ├── events/
│       │   ├── route.ts          # GET list, POST create
│       │   └── [id]/
│       │       ├── route.ts      # GET, PUT, DELETE
│       │       └── register/route.ts
│       └── tickets/
│           └── [code]/
│               ├── route.ts
│               └── checkin/route.ts
│
├── features/                     # Feature-based modules
│   ├── events/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types.ts
│   │   ├── validations.ts        # Zod schemas
│   │   └── api.ts                # Client-side fetch helpers
│   ├── tickets/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   └── admin/
│       ├── components/
│       └── hooks/
│
├── components/                   # Shared/reusable UI components only
│   ├── ui/                       # Primitive components (shadcn/ui)
│   └── layout/                   # Navbar, Footer, Sidebar
│
├── lib/                          # Shared utilities & infrastructure
│   ├── auth.ts                   # NextAuth config
│   ├── prisma.ts                 # Prisma singleton
│   ├── db/                       # Repository layer
│   │   ├── events.ts             # Event queries
│   │   ├── tickets.ts            # Ticket queries
│   │   └── users.ts              # User queries
│   └── utils.ts                  # cn(), formatDate(), dll
│
├── types/                        # Global TypeScript types
│   └── next-auth.d.ts            # NextAuth type augmentation
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
└── public/
```

### 2.2 Penamaan File & Folder

| Jenis | Convention | Contoh |
|---|---|---|
| React Component | PascalCase | `EventCard.tsx`, `TicketQR.tsx` |
| Hook | camelCase, prefix `use` | `useEvents.ts`, `useAuth.ts` |
| Utility function | camelCase | `formatDate.ts`, `generateTicketCode.ts` |
| Type/Interface | PascalCase | `EventType`, `TicketStatus` |
| API Route | lowercase `route.ts` | `app/api/events/route.ts` |
| Folder | kebab-case | `event-detail/`, `admin-dashboard/` |
| Constant | SCREAMING_SNAKE_CASE | `MAX_QUOTA`, `TICKET_STATUS` |

### 2.3 Aturan Index File

```ts
// ✅ BOLEH — barrel export untuk features
// features/events/index.ts
export { EventCard } from './components/EventCard';
export { useEvents } from './hooks/useEvents';
export type { EventType } from './types';

// ❌ DILARANG — barrel export untuk app/ dan lib/ (membingungkan tree-shaking)
```

---

## 3. LIBRARY YANG DIGUNAKAN

### 3.1 Library WAJIB (jangan diganti)

| Library | Versi | Kegunaan |
|---|---|---|
| `next` | 16.x | Framework utama |
| `prisma` + `@prisma/client` | latest | ORM & database access |
| `next-auth` | v5 (beta) | Authentication |
| `zod` | latest | Schema validation |
| `tailwindcss` | v4 | Styling |
| `motion` | latest | Animasi (import dari `motion/react`) |
| `@phosphor-icons/react` | latest | **Satu-satunya** icon library |
| `zustand` | latest | Client-side global state |
| `@tanstack/react-query` | latest | Server state & caching |
| `bcryptjs` | latest | Password hashing |
| `react-qr-code` | latest | Generate QR tiket |

### 3.2 shadcn/ui — Cara Penggunaan

Gunakan `shadcn/ui` sebagai **base komponen UI primitif** yang kemudian di-style ulang sesuai design system Coursera (DESIGN.md).

```bash
# Install komponen shadcn satu per satu (jangan --all)
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add badge
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add toast
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add skeleton
```

**Aturan override shadcn:**
- Semua komponen shadcn HARUS di-override CSS-nya menggunakan token dari DESIGN.md
- Warna primary → `#0056d2`, radius button → `8px`, font → `Source Sans Pro`
- Jangan pakai shadcn default purple/slate color

### 3.3 Library yang DILARANG

```
❌ lucide-react           → pakai @phosphor-icons/react
❌ axios                  → pakai native fetch() dengan wrapper di lib/
❌ moment.js              → pakai date-fns atau Intl API bawaan JS
❌ lodash                 → pakai utility function sendiri atau es-toolkit
❌ class-variance-authority (cva) versi lama → sudah included di shadcn
❌ @mui/material          → jangan mix dengan shadcn
❌ antd / ant-design      → jangan mix dengan shadcn
❌ jquery                 → dilarang keras
❌ redux / redux-toolkit  → pakai zustand
❌ react-hook-form        → boleh dipakai HANYA jika form sangat kompleks
```

### 3.4 Satu Library Per Kebutuhan

```
❌ DILARANG: pakai motion DAN framer-motion bersamaan
❌ DILARANG: pakai zustand DAN jotai bersamaan
❌ DILARANG: pakai react-query DAN SWR bersamaan
❌ DILARANG: mix icon library (@phosphor + lucide + heroicons)
```

---

## 4. PENULISAN KODE

### 4.1 TypeScript — Aturan Wajib

```ts
// ✅ BOLEH — explicit typing
interface EventCardProps {
  event: EventType;
  onRegister: (id: string) => Promise<void>;
}

// ❌ DILARANG — any & non-null assertion sembarangan
const data: any = await fetch(...);
const user = session.user!;

// ✅ BOLEH — type guard
function isAdmin(user: User | null): user is User & { role: 'ADMIN' } {
  return user?.role === 'ADMIN';
}

// ❌ DILARANG — as casting tanpa validasi
const event = data as EventType; // berbahaya
```

### 4.2 React Component

```tsx
// ✅ BOLEH — functional component dengan explicit return type
export function EventCard({ event, onRegister }: EventCardProps): JSX.Element {
  return (...);
}

// ✅ BOLEH — Server Component default (tidak perlu 'use client' kalau tidak butuh)
// app/(main)/page.tsx → Server Component by default

// ✅ BOLEH — 'use client' hanya jika butuh:
// - useState / useEffect
// - event handler (onClick, onChange, dll)
// - browser API (window, localStorage)
// - motion animations

// ❌ DILARANG — 'use client' di layout atau page yang tidak butuh interaktivitas
```

### 4.3 API Route

```ts
// ✅ BOLEH — structured response dengan status code yang tepat
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = EventSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const event = await createEvent(parsed.data);
    return Response.json({ success: true, data: event }, { status: 201 });

  } catch (error) {
    console.error('[POST /api/events]', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ❌ DILARANG — tidak ada error handling, langsung return data mentah
export async function POST(req: Request) {
  const body = await req.json();
  const event = await prisma.event.create({ data: body }); // berbahaya!
  return Response.json(event);
}
```

### 4.4 Database Access — Repository Pattern

```ts
// ✅ BOLEH — query ada di lib/db/events.ts
// lib/db/events.ts
export async function getEvents(params: GetEventsParams) {
  return prisma.event.findMany({
    where: {
      title: { contains: params.search, mode: 'insensitive' },
      category: params.category || undefined,
    },
    orderBy: { date: 'asc' },
    skip: params.skip,
    take: params.take,
  });
}

// app/api/events/route.ts
import { getEvents } from '@/lib/db/events';
export async function GET(request: Request) {
  const events = await getEvents({ search: '...', take: 10 });
  return Response.json({ success: true, data: events });
}

// ❌ DILARANG — Prisma langsung di API route
export async function GET() {
  const events = await prisma.event.findMany({ where: { ... } }); // jangan!
  return Response.json(events);
}
```

### 4.5 Styling

```tsx
// ✅ BOLEH — Tailwind utility classes dengan cn() helper
import { cn } from '@/lib/utils';

<button
  className={cn(
    'h-9 px-4 rounded-[8px] text-sm font-semibold tracking-[0.14px]',
    'bg-[#0056d2] text-white hover:bg-[#0048b0]',
    'transition-colors duration-150',
    isLoading && 'opacity-60 cursor-not-allowed'
  )}
>

// ✅ BOLEH — CSS Variables untuk design tokens
// app/globals.css
:root {
  --color-primary: #0056d2;
  --color-navy: #002761;
  --color-ink: #0f1114;
  --radius-button: 8px;
  --radius-chip: 50px;
  --radius-card: 16px;
}

// ❌ DILARANG — inline style untuk hal yang bisa dihandle Tailwind
<div style={{ backgroundColor: '#0056d2', borderRadius: '8px' }}>

// ❌ DILARANG — arbitrary values yang tidak konsisten dengan design token
className="rounded-[13px]"   // bukan bagian dari radius scale
className="text-[15px]"      // bukan bagian dari type scale
```

### 4.6 Error Handling

```ts
// ✅ BOLEH — custom error class
class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
  }
}

throw new AppError('Kuota event penuh', 400, 'QUOTA_EXCEEDED');
throw new AppError('Sudah pernah mendaftar', 409, 'DUPLICATE_REGISTRATION');

// ❌ DILARANG — throw error mentah tanpa pesan yang jelas
throw new Error('error');
throw error; // re-throw tanpa context
```

### 4.7 Quota Management — Atomic Operation (WAJIB)

```ts
// ✅ WAJIB — gunakan transaction untuk cek + increment kuota
async function registerUserToEvent(userId: string, eventId: string) {
  return prisma.$transaction(async (tx) => {
    // 1. Lock row & cek kuota
    const event = await tx.event.findFirst({
      where: { id: eventId, registered: { lt: prisma.event.fields.quota } },
    });

    if (!event) throw new AppError('Kuota penuh atau event tidak ditemukan', 400, 'QUOTA_EXCEEDED');

    // 2. Cek duplikasi
    const existing = await tx.ticket.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (existing) throw new AppError('Sudah terdaftar', 409, 'DUPLICATE_REGISTRATION');

    // 3. Buat tiket & increment atomic
    const [ticket] = await Promise.all([
      tx.ticket.create({ data: { userId, eventId, code: generateTicketCode() } }),
      tx.event.update({ where: { id: eventId }, data: { registered: { increment: 1 } } }),
    ]);

    return ticket;
  });
}

// ❌ DILARANG — cek kuota dan insert tanpa transaction (race condition!)
const event = await prisma.event.findUnique(...);
if (event.registered < event.quota) {
  await prisma.ticket.create(...); // bisa duplikat di concurrent request!
}
```

---

## 5. DESIGN SYSTEM

### 5.1 Token Wajib (dari DESIGN.md Coursera)

```css
/* Semua token ini WAJIB ada di globals.css dan dipakai konsisten */

/* Colors */
--color-primary: #0056d2;         /* voltage blue — CTA only */
--color-primary-hover: #0048b0;   /* pressed state */
--color-navy: #002761;            /* callout band & hero */
--color-ink: #0f1114;             /* body text utama */
--color-muted: #5b6780;           /* secondary text */
--color-hairline: #dae1ed;        /* border/divider */
--color-surface: #e8eef7;         /* chip background */
--color-canvas: #ffffff;          /* background utama */

/* Typography — Source Sans Pro */
--font-display: 28px / 600 / -0.28px;
--font-heading: 20px / 600 / -0.1px;
--font-body: 16px / 400 / 0;
--font-body-sm: 14px / 400 / 0;
--font-action: 14px / 600 / 0.14px;

/* Radius */
--radius-button: 8px;     /* semua button */
--radius-card: 16px;      /* semua card */
--radius-chip: 50px;      /* category pill / filter */
--radius-tag: 2px;        /* skill chip inline */
```

### 5.2 Aturan Visual

- `#0056d2` **HANYA** untuk CTA button dan inline link — tidak untuk background besar atau body text
- `#002761` **HANYA** untuk hero callout card dan stat band — tidak untuk nav atau body
- **Satu icon family** — `@phosphor-icons/react` saja, tidak campur lain
- Button utama selalu `rounded-[8px]`, bukan pill
- Filter/kategori chip selalu `rounded-full` (50px)
- **Source Sans Pro** untuk semua teks — tidak ada font kedua

---

## 6. KEAMANAN

### 6.1 Aturan Wajib

```ts
// ✅ WAJIB — validasi input di semua API endpoint
const parsed = Schema.safeParse(body);
if (!parsed.success) return errorResponse(400, parsed.error);

// ✅ WAJIB — cek session/role di semua protected endpoint
const session = await auth();
if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });
if (session.user.role !== 'ADMIN') return Response.json({ error: 'Forbidden' }, { status: 403 });

// ✅ WAJIB — hash password dengan bcrypt cost factor >= 12
const hashed = await bcrypt.hash(password, 12);

// ❌ DILARANG — simpan password plain text
await prisma.user.create({ data: { password: req.body.password } });

// ❌ DILARANG — expose password hash di response
return Response.json(user); // user object mengandung field password!

// ✅ BOLEH — exclude password dari response
const { password: _, ...safeUser } = user;
return Response.json(safeUser);
```

### 6.2 Environment Variables

```
# .env — jangan pernah commit ke git
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# ❌ DILARANG — hardcode credentials di kode
const secret = "mysecret123"; // dilarang keras
```

---

## 7. PERFORMA

### 7.1 Server vs Client Component

```
// Pakai Server Component untuk:
✅ Fetch data (async component)
✅ Halaman statis atau semi-statis
✅ SEO-critical content
✅ Database queries

// Pakai Client Component ('use client') HANYA untuk:
✅ useState, useEffect, useRef
✅ Event handlers (onClick, onChange)
✅ Browser API (window, localStorage, navigator)
✅ Animasi interaktif (motion)
✅ Form dengan controlled input
```

### 7.2 Aturan Image

```tsx
// ✅ WAJIB — gunakan next/image
import Image from 'next/image';
<Image src={event.imageUrl} alt={event.title} width={400} height={225} />

// ❌ DILARANG — <img> tag biasa
<img src={event.imageUrl} />
```

### 7.3 Loading State

```tsx
// ✅ WAJIB — gunakan Skeleton yang sesuai shape konten, bukan spinner generik
<div className="animate-pulse">
  <div className="h-[225px] bg-[#e8eef7] rounded-[16px]" />
  <div className="h-4 bg-[#e8eef7] rounded mt-3 w-3/4" />
  <div className="h-3 bg-[#e8eef7] rounded mt-2 w-1/2" />
</div>

// ❌ DILARANG — spinner generik sebagai satu-satunya loading state
{isLoading && <Spinner />}
```

---

## 8. GIT & COMMIT

### 8.1 Conventional Commits (WAJIB)

```
feat: tambah fitur registrasi event dengan quota check
fix: perbaiki race condition pada endpoint register
style: update warna button sesuai design system Coursera
refactor: pindah prisma queries ke repository layer
chore: setup prisma schema dan seed data
docs: tambah dokumentasi API di README
test: tambah unit test untuk generateTicketCode
```

### 8.2 Aturan Commit

- **Satu commit = satu perubahan logis** — jangan commit banyak fitur sekaligus
- Pesan commit dalam **Bahasa Indonesia atau Inggris** — konsisten per project
- Jangan commit: `.env`, `*.db`, `node_modules/`, `.next/`
- Pastikan `.gitignore` sudah mengcover semua file sensitif

---

## 9. DOKUMENTASI

### 9.1 Komentar Kode

```ts
// ✅ BOLEH — komentar untuk logika yang tidak obvious
// Atomic transaction untuk mencegah race condition pada quota
// Jika dua user register bersamaan, hanya satu yang berhasil
return prisma.$transaction(async (tx) => { ... });

// ✅ BOLEH — JSDoc untuk fungsi public di lib/
/**
 * Generate unique ticket code dengan format: SBYDEV-{eventId slice}-{uuid slice}
 * @param eventId - ID event untuk prefix
 * @returns Ticket code unik, e.g. "SBYDEV-ABC123-XY789"
 */
export function generateTicketCode(eventId: string): string { ... }

// ❌ DILARANG — komentar yang hanya mengulang kode
const user = await getUser(id); // get user by id
```

### 9.2 README.md

README **wajib** mencakup:
- Deskripsi singkat project
- Tech stack
- Prerequisites
- Cara setup lokal (clone → install → env → migrate → seed → dev)
- Daftar API endpoints
- Credentials default untuk testing
- Link live demo (jika ada)

---

## RINGKASAN QUICK REFERENCE

| Topik | Aturan |
|---|---|
| Arsitektur | Feature-Based Modular |
| DB Query | Repository Pattern (`lib/db/*.ts`) |
| Validasi | Zod — selalu safeParse |
| Icon | @phosphor-icons/react saja |
| State (global) | Zustand |
| State (server) | @tanstack/react-query |
| Animasi | motion (`motion/react`) |
| UI Primitif | shadcn/ui + override Coursera tokens |
| Styling | Tailwind v4 + CSS Variables |
| Commit | Conventional Commits |
| Quota | Prisma $transaction wajib |
| Password | bcrypt cost 12 |
| Response | Selalu `{ success, data/error }` |
| Auth Guard | `requireAuth()` / `requireAdmin()` dari `lib/middleware.ts` |
| Error Handler | `withErrorHandler()` dari `lib/middleware.ts` |
| Zod Error | `zodErrorResponse()` dari `lib/middleware.ts` |
| TypeScript Types | Pakai Prisma generated types — jangan tulis ulang manual |
| Icon vs Emoji | **Dilarang emoji** — selalu gunakan `@phosphor-icons/react` |
| Mikro Komponen | Ekstrak komponen repetitif ke `components/ui/` (<150 baris/file) |

---

## 10. SSOT & DRY — ATURAN WAJIB

> **SSOT (Single Source of Truth):** setiap data, tipe, atau logika punya **satu sumber** yang tidak boleh diduplikasi.
> **DRY (Don't Repeat Yourself):** kode yang sama tidak boleh ditulis lebih dari satu kali.

### 10.1 TypeScript Types — Pakai Prisma, Bukan Manual

```ts
// ❌ DILARANG — mendefinisikan ulang tipe yang sudah ada di Prisma
// features/events/validations.ts
export interface EventType {
  id: string;
  title: string;
  quota: number;        // ← bisa drift dari schema.prisma!
  registered: number;   // ← bisa drift dari schema.prisma!
  // ...
}

// ✅ WAJIB — gunakan Prisma generated type sebagai SSOT
import type { Event } from "@prisma/client";
export type EventType = Event;  // otomatis sync dengan schema

// ✅ BOLEH — extend jika butuh relasi
import type { Event, Ticket } from "@prisma/client";
export type EventWithCount = Event & { _count: { tickets: number } };
```

**Rule:** Jika `schema.prisma` berubah, TypeScript types ikut otomatis. Tidak perlu update di dua tempat.

### 10.2 Auth Guard — Satu Tempat, Bukan Copy-Paste

```ts
// ❌ DILARANG — auth guard copy-paste di setiap route (ada di 5 file!)
// app/api/events/route.ts
const session = await auth();
if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });
if (session.user.role !== 'ADMIN') return Response.json({ error: 'Forbidden' }, { status: 403 });

// app/api/tickets/route.ts — copy-paste yang sama!
const session = await auth();
if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

// ✅ WAJIB — pakai helper dari lib/middleware.ts (SSOT)
import { requireAuth, requireAdmin } from "@/lib/middleware";

// Cukup satu baris:
const { session, error } = await requireAuth();
if (error) return error;

const { session, error } = await requireAdmin();
if (error) return error;
```

### 10.3 Error Handling — withErrorHandler HOF

```ts
// ❌ DILARANG — try/catch copy-paste di setiap route
export async function POST(request: Request) {
  try {
    // ... logic
  } catch (error) {
    if (error instanceof AppError) {          // ← copy ini di semua route
      return errorResponse(error.message, error.statusCode, error.code);
    }
    console.error('[POST /api/events]', error); // ← dan ini
    return errorResponse('Internal server error', 500);
  }
}

// ✅ WAJIB — bungkus dengan withErrorHandler (SSOT)
import { withErrorHandler } from "@/lib/middleware";

export const POST = withErrorHandler("POST /api/events", async (request) => {
  // Tulis hanya happy-path logic di sini.
  // Error handling ditangani satu kali di middleware.
  const result = await doSomething();
  return successResponse(result, 201);
});
```

### 10.4 Zod Error Response — Format Konsisten

```ts
// ❌ DILARANG — format error Zod berbeda-beda di tiap route
return errorResponse(JSON.stringify(parsed.error.flatten().fieldErrors), 400);
return errorResponse(parsed.error.flatten() as unknown as string, 400);

// ✅ WAJIB — satu helper, satu format (SSOT)
import { zodErrorResponse } from "@/lib/middleware";

if (!parsed.success) return zodErrorResponse(parsed.error);
// Response selalu: { success: false, error: "Validasi gagal", details: {...} }
```

### 10.5 Response Format — Selalu { success, data/error }

```ts
// ❌ DILARANG — format response tidak konsisten
return Response.json(event);                          // tidak ada success flag
return Response.json({ data: event });                // tidak ada success flag
return Response.json({ error: 'not found' }, { status: 404 }); // format beda

// ✅ WAJIB — selalu gunakan helper dari lib/api.ts (SSOT)
import { successResponse, errorResponse } from "@/lib/api";

return successResponse(event);           // { success: true, data: event }
return successResponse(event, 201);      // { success: true, data: event } + 201
return errorResponse("Not found", 404);  // { success: false, error: "Not found" }
```

### 10.6 Design Tokens — CSS Variables, Bukan Hardcode

```tsx
// ❌ DILARANG — warna hardcode langsung (DRY violation, susah ganti global)
<button style={{ backgroundColor: '#0056d2', borderRadius: '8px' }}>

// ❌ DILARANG — arbitrary Tailwind yang tidak pakai token
className="bg-[#0056d2] rounded-[8px]"  // jika token berubah, susah cari

// ✅ WAJIB — pakai CSS variable (SSOT dari globals.css)
<button style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-button)' }}>
// atau pakai class dari globals.css:
<button className="btn-primary">
```

### 10.7 String Pesan Error — Gunakan Konstanta

```ts
// ❌ DILARANG — string error literal tersebar di mana-mana
throw new AppError('Kuota event penuh', 400, 'QUOTA_EXCEEDED');         // di tickets.ts
return errorResponse('Kuota event sudah penuh', 400, 'QUOTA_EXCEEDED'); // di route.ts — beda teks!

// ✅ BOLEH — definisikan konstanta error di satu tempat
// lib/errors.ts
export const ERR = {
  QUOTA_EXCEEDED: { message: 'Kuota event sudah penuh', status: 400, code: 'QUOTA_EXCEEDED' },
  DUPLICATE_REGISTRATION: { message: 'Kamu sudah terdaftar', status: 409, code: 'DUPLICATE_REGISTRATION' },
  UNAUTHORIZED: { message: 'Kamu harus login', status: 401, code: 'UNAUTHORIZED' },
  FORBIDDEN: { message: 'Akses ditolak', status: 403, code: 'FORBIDDEN' },
  NOT_FOUND: (entity: string) => ({ message: `${entity} tidak ditemukan`, status: 404, code: 'NOT_FOUND' }),
} as const;

throw new AppError(ERR.QUOTA_EXCEEDED.message, ERR.QUOTA_EXCEEDED.status, ERR.QUOTA_EXCEEDED.code);
```

### 10.8 Lokasi File SSOT

| Concern | SSOT Location | Jangan Duplikasi Di |
|---|---|---|
| Prisma types | `@prisma/client` (auto-generated) | `features/*/types.ts` manual interface |
| Zod schemas | `features/*/validations.ts` | API routes, komponen form |
| Auth guard | `lib/middleware.ts` → `requireAuth/requireAdmin` | Setiap API route |
| Error handling | `lib/middleware.ts` → `withErrorHandler` | Setiap API route |
| Response format | `lib/api.ts` → `successResponse/errorResponse` | `Response.json()` langsung |
| Zod error format | `lib/middleware.ts` → `zodErrorResponse` | Setiap route yang validasi |
| Design tokens | `app/globals.css` → CSS variables | Inline style hardcode |
| Error messages | `lib/errors.ts` → `ERR` konstanta | String literal tersebar |

---

## 11. MIKRO KOMPONEN & ZERO EMOJI POLICY

### 11.1 Zero Emoji Policy (WAJIB)

DILARANG menggunakan emoji Unicode (seperti 🚀, 👑, 👤, 🎫, ✨, dll) di dalam antarmuka UI maupun teks. Gunakan ikon resmi dari `@phosphor-icons/react` dengan warna token Coursera.

```tsx
// [DILARANG] — memakai emoji di UI
<div>User: admin@sbydev.id</div>
<button>Daftar Sekarang</button>

// [WAJIB] — pakai icon dari @phosphor-icons/react
import { User, ArrowRight } from '@phosphor-icons/react';

<div className="flex items-center gap-2">
  <User size={16} color="var(--color-primary)" />
  <span>admin@sbydev.id</span>
</div>
```

### 11.2 Mikro Komponen & Panjang File (<150 Baris)

1. **Single Responsibility**: Setiap komponen hanya bertanggung jawab atas satu bagian kecil antarmuka.
2. **Batas Panjang File**: File komponen tidak boleh lebih dari **150 baris**. Jika mendekati batas, pecah menjadi sub-komponen / mikro-komponen.
3. **Komponen UI Primitif di `components/ui/`**:
   - `Badge.tsx` — Status & tags (2px tag vs 50px pill)
   - `Alert.tsx` — Notifikasi error, success, info, warning
   - `ProgressBar.tsx` — Indikator kemajuan kuota & kehadiran
   - `StatCard.tsx` — Kartu metrik ringkasan
   - `EmptyState.tsx` — Tampilan state kosong dengan action
   - `Modal.tsx` — Dialog pop-up konfirmasi & pratinjau
4. **Mikro Komponen Fitur di `features/*/components/`**:
   - `EventQuotaIndicator.tsx` — Progress kuota event
   - `EventRegistrationCard.tsx` — Sticky box registrasi tiket
   - `TicketStatusBadge.tsx` — Mapping status tiket ke variant badge
   - `TicketInfoGrid.tsx` — Grid metadata jadwal & lokasi acara
   - `ImageUploadDropzone.tsx` — Drag & drop photo upload dengan live preview

---

## 12. STANDAR UX & DESIGN SYSTEM BEST PRACTICES (WAJIB)

### 12.1 Skala Tipografi (Typography Scale)

| Token CSS / Kelas | Ukuran Font / Line-Height / Weight | Penggunaan UX |
|---|---|---|
| `text-display` | `28px - 32px` / `leading-tight` / `font-extrabold` | Judul utama section, hero header, judul modal |
| `text-heading` | `20px - 24px` / `leading-snug` / `font-bold` | Judul card, judul panel admin, nama event |
| `text-body` | `16px` / `leading-relaxed` / `font-normal` | Paragraf bacaan utama, deskripsi acara |
| `text-body-sm` | `14px` / `leading-normal` / `font-medium` | Label form, item tabel, tombol navigasi |
| `text-caption` | `12px` / `leading-tight` / `font-semibold` | Badge, pill kategori, petunjuk helper form |
| `font-mono` | Monospaced font | Kode tiket (`SBYDEV-XXXX`), angka kuota, shortcut kbd |

### 12.2 Palet Warna Solid & Kontras (Solid Coursera Tokens)

| Peran Warna | Hex Code | Elemen UI |
|---|---|---|
| **Voltage Blue (CTA)** | `#0056d2` (Hover: `#0048b0`) | Tombol utama, link interaktif, icon aksen |
| **Deep Navy** | `#002761` | Hero callout banner, badge header resmi |
| **Solid Canvas** | `#ffffff` | Background halaman & permukaan kartu |
| **Solid Surface** | `#e8eef7` | Background chip/pill, container preview foto |
| **Solid Hairline** | `#dae1ed` | Border kartu, garis pembatas (divider) |
| **Body Ink** | `#0f1114` | Teks judul & isi dengan rasio kontras tinggi |
| **Muted Text** | `#5b6780` | Subtitle, metadata jadwal, label sekunder |
| **Success State** | `#166534` (Bg: `#dcfce7`) | Tiket terverifikasi, registrasi berhasil |
| **Warning State** | `#92400e` (Bg: `#fef3c7`) | Kuota menipis (sisa <= 10 kursi), peringatan |
| **Danger State** | `#991b1b` (Bg: `#fee2e2`) | Kuota penuh, konfirmasi hapus event |

### 12.3 Standar Area Sentuh & Form (Touch Targets & Accessibility)

1. **Tinggi Minimal Elemen Interaktif**:
   - Tombol Utama / Sekunder: Minimal `h-10` (40px) hingga `h-11` (44px).
   - Form Input & Dropdown: `h-11` (44px) hingga `h-12` (48px).
2. **Padding Input dengan Icon**:
   - Input dengan icon di kiri **wajib** memiliki `paddingLeft: 44px` hingga `48px` agar teks tidak menimpa icon.
3. **Radius Sudut Elemen**:
   - Kartu Utama & Modal: `rounded-2xl` (16px).
   - Tombol Aksi: `rounded-xl` (12px) atau `rounded-lg` (8px).
   - Filter Kategori & Pill: `rounded-full` (50px).
   - Tag Kategori Kecil: `rounded-[2px]`.
4. **Prinsip Perataan Teks (Alignment)**:
   - Seluruh teks, paragraf, deskripsi form, dan card **wajib rata kiri (*left-aligned*)**.
   - Hindari membatasi lebar teks dengan `max-w-xs` yang memaksa pemenggalan kalimat menjadi baris-baris sempit.
5. **Konfirmasi Tindakan Destruktif**:
   - Seluruh aksi penghapusan atau aksi krusial **wajib** menggunakan dialog `Modal` konfirmasi, bukan sekadar klik langsung.


