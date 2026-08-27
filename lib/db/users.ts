import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AppError } from "@/lib/api";

/** Ambil user by email */
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

/** Buat user baru dengan password di-hash */
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    throw new AppError("Email sudah terdaftar", 409, "EMAIL_EXISTS");
  }

  // WAJIB: bcrypt cost factor >= 12 (per AGENTS.md §6.1)
  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: { ...data, password: hashedPassword },
  });

  // Jangan expose password hash (per AGENTS.md §6.1)
  const { password: _, ...safeUser } = user;
  return safeUser;
}

/** Ambil user by ID tanpa password */
export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;
  const { password: _, ...safeUser } = user;
  return safeUser;
}

/** Ambil semua user (admin only) */
export async function getAllUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { tickets: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return users;
}

/** Update profil user */
export async function updateUserProfile(id: string, data: { name?: string }) {
  const user = await prisma.user.update({
    where: { id },
    data,
  });
  const { password: _, ...safeUser } = user;
  return safeUser;
}

