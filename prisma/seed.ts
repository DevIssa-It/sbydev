import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Admin User — Password sesuai dokumentasi assessment
  const adminPassword = await bcrypt.hash("adminpassword123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@sbydev.id" },
    update: { password: adminPassword },
    create: {
      name: "Admin SurabayaDev",
      email: "admin@sbydev.id",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`[OK] Admin ready: ${admin.email}`);

  // 2. Regular User — Password sesuai dokumentasi assessment
  const userPassword = await bcrypt.hash("userpassword123", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@sbydev.id" },
    update: { password: userPassword },
    create: {
      name: "Budi Santoso",
      email: "user@sbydev.id",
      password: userPassword,
      role: "USER",
    },
  });
  console.log(`[OK] User ready: ${user.email}`);

  // 3. Sample Events
  const events = [
    {
      title: "SurabayaDev 12th Anniversary Tech Conference",
      description:
        "Perayaan 12 tahun SurabayaDev! Konferensi teknologi tahunan terbesar di Surabaya yang menghadirkan pakar industri, tech leaders, dan komunitas developer se-Jawa Timur. Pembahasan mendalam tentang AI Engineering, Modern Web Architecture, Cloud Native, dan Career Roadmap 2026.",
      category: "Conference",
      location: "Grand City Convention Hall, Surabaya",
      date: new Date("2026-10-15T09:00:00+07:00"),
      quota: 300,
      registered: 0,
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    },
    {
      title: "Fullstack Next.js 16 & AI Workshop",
      description:
        "Workshop hands-on membangun full-stack event platform dengan Server Actions, Prisma ORM, Tailwind CSS v4, dan integrasi AI Assistant. Peserta akan dibimbing langsung mulai dari arsitektur modular hingga deployment ke production.",
      category: "Workshop",
      location: "Coworking Space Surabaya, Jl. Pemuda No. 17",
      date: new Date("2026-09-20T09:00:00+07:00"),
      quota: 50,
      registered: 0,
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
    },
    {
      title: "Surabaya JS Meetup #24: State & Architecture",
      description:
        "Sesi sharing & networking bulanan komunitas JavaScript Surabaya. Topik utama: Evaluasi State Management di 2026 (Zustand, TanStack Query, React Server Components) dan best practices modular clean code.",
      category: "Meetup",
      location: "Auditorium Gedung Robotika ITS, Surabaya",
      date: new Date("2026-09-05T18:30:00+07:00"),
      quota: 120,
      registered: 0,
      imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
    },
    {
      title: "Bootcamp Backend Engineering: Go & High-Concurrency",
      description:
        "Bootcamp intensif 3 hari belajar Backend Engineering level intermediate-to-advanced. Fokus pada race condition prevention, database transactions, locking mechanisms, load testing 3.000+ RPS, dan message queues.",
      category: "Bootcamp",
      location: "Online via Interactive Zoom & Discord",
      date: new Date("2026-10-01T08:00:00+07:00"),
      quota: 80,
      registered: 0,
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    },
    {
      title: "Hackathon SurabayaDev 2026: Solusi Digital UMKM Jatim",
      description:
        "Kompetisi hackathon 48 jam untuk menciptakan inovasi teknologi yang memberdayakan UMKM di Jawa Timur. Total hadiah IDR 50.000.000, mentoring dari venture capital, dan akses inkubasi startup.",
      category: "Hackathon",
      location: "MERR Business Center, Surabaya",
      date: new Date("2026-11-08T08:00:00+07:00"),
      quota: 150,
      registered: 0,
      imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    },
    {
      title: "Tech Career Talk: Engineering Leadership & Global Remote",
      description:
        "Diskusi santai dan Q&A interaktif bersama Principal Engineers & Engineering Managers dari tech unicorns dan remote global companies. Tips interview, system design assessment, dan strategi negosiasi penawaran.",
      category: "Talk Show",
      location: "Suara Surabaya Centre, Jl. Raya Bukit Darmo",
      date: new Date("2026-09-27T13:00:00+07:00"),
      quota: 200,
      registered: 0,
      imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
    },
  ];

  for (const item of events) {
    const existing = await prisma.event.findFirst({ where: { title: item.title } });
    if (!existing) {
      const created = await prisma.event.create({ data: item });
      console.log(`[OK] Event created: ${created.title}`);
    }
  }

  console.log("\nDatabase seed selesai!");
  console.log("Credentials Default:");
  console.log("  Admin : admin@sbydev.id / adminpassword123");
  console.log("  User  : user@sbydev.id  / userpassword123\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
