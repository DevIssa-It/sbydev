import { prisma } from "@/lib/prisma";

export interface GetEventsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

/** Ambil daftar event dengan filter & pagination */
export async function getEvents(params: GetEventsParams = {}) {
  const { search, category, page = 1, limit = 9 } = params;
  const skip = (page - 1) * limit;

  const where = {
    ...(search && {
      OR: [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ],
    }),
    ...(category && category !== "Semua" && { category }),
  };

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: { date: "asc" },
      skip,
      take: limit,
    }),
    prisma.event.count({ where }),
  ]);

  return { events, total, page, limit, totalPages: Math.ceil(total / limit) };
}

/** Ambil detail satu event by ID */
export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      _count: { select: { tickets: true } },
    },
  });
}

/** Buat event baru */
export async function createEvent(data: {
  title: string;
  description: string;
  category: string;
  location: string;
  date: Date;
  quota: number;
  imageUrl?: string;
}) {
  return prisma.event.create({ data });
}

/** Update event */
export async function updateEvent(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    category: string;
    location: string;
    date: Date;
    quota: number;
    imageUrl: string;
  }>
) {
  return prisma.event.update({ where: { id }, data });
}

/** Hapus event */
export async function deleteEvent(id: string) {
  return prisma.event.delete({ where: { id } });
}

/** Ambil semua kategori unik */
export async function getEventCategories(): Promise<string[]> {
  const events = await prisma.event.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return events.map((e) => e.category);
}
