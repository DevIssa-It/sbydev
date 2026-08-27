import { z } from "zod";

// ─── Zod Schemas ──────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(50),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;

// ─── TypeScript Types ──────────────────────────────────────────────────────

export type UserRole = "USER" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
}
