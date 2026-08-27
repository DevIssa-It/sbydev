import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Gabungkan Tailwind classes dengan aman (handles conflicts) */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format tanggal ke Bahasa Indonesia
 * @example formatDate(new Date()) → "Kamis, 27 Agustus 2026"
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Format tanggal singkat
 * @example formatDateShort(new Date()) → "27 Agt 2026"
 */
export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Format waktu
 * @example formatTime(new Date()) → "09.00 WIB"
 */
export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(date));
}

/**
 * Hitung persentase kuota terisi
 */
export function getQuotaPercentage(registered: number, quota: number): number {
  if (quota === 0) return 100;
  return Math.round((registered / quota) * 100);
}

/**
 * Sisa kuota event
 */
export function getRemainingQuota(registered: number, quota: number): number {
  return Math.max(0, quota - registered);
}

/**
 * Status kuota sebagai label
 */
export function getQuotaStatus(
  registered: number,
  quota: number
): "available" | "limited" | "full" {
  const percentage = getQuotaPercentage(registered, quota);
  if (percentage >= 100) return "full";
  if (percentage >= 80) return "limited";
  return "available";
}
