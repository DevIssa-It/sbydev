"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Check, Sparkle, CalendarBlank, MapPin, Users } from "@phosphor-icons/react";
import { useEventForm } from "../hooks/useEventForm";
import { EVENT_CATEGORIES, type EventFormData } from "@/features/events/validations";
import { ImageUploadDropzone } from "./ImageUploadDropzone";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";

interface AdminEventFormProps {
  initialData?: Partial<EventFormData> & { id?: string };
  isEdit?: boolean;
}

export function AdminEventForm({ initialData, isEdit = false }: AdminEventFormProps): React.JSX.Element {
  const {
    title, setTitle, description, setDescription, category, setCategory,
    location, setLocation, date, setDate, quota, setQuota, imageUrl, setImageUrl,
    isLoading, error, handleSubmit,
  } = useEventForm({ initialData, isEdit });

  const categories = EVENT_CATEGORIES.filter((c) => c !== "Semua");

  return (
    <div className="w-full max-w-4xl mx-auto pb-16 text-left">
      {/* Top Back Link */}
      <Link
        href="/admin"
        className="btn-ghost mb-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-ink)] hover:text-[var(--color-primary)]"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Konsol Manajemen</span>
      </Link>

      <div className="card p-8 sm:p-10 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] shadow-sm text-left">
        {/* Form Header */}
        <div className="mb-8 text-left">
          <div className="inline-flex mb-2">
            <Badge variant="tag">{isEdit ? "PERBARUI ACARA" : "PUBLIKASI EVENT"}</Badge>
          </div>
          <h1 className="text-display text-2xl sm:text-3xl text-[var(--color-ink)] mb-2 font-extrabold text-left">
            {isEdit ? "Edit Informasi Event" : "Buat Event Baru SurabayaDev"}
          </h1>
          <p className="text-body-sm text-[var(--color-muted)] text-sm leading-relaxed text-left">
            Lengkapi rincian agenda, kuota kehadiran, lokasi pelaksanaan, dan foto sampul acara.
          </p>
        </div>

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
          {/* Judul Event */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-ink)] mb-2">
              Judul Event *
            </label>
            <input
              type="text"
              required
              className="input text-base h-12"
              placeholder="Contoh: SurabayaDev Tech Summit 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Kategori & Kuota */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-[var(--color-ink)] mb-2">
                Kategori Topik *
              </label>
              <select
                className="input bg-[var(--color-canvas)] text-sm h-12 font-medium"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--color-ink)] mb-2">
                Kapasitas Kuota Peserta *
              </label>
              <input
                type="number"
                required
                min={1}
                max={10000}
                className="input text-base h-12 font-mono"
                placeholder="50"
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
              />
            </div>
          </div>

          {/* Tanggal & Lokasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-[var(--color-ink)] mb-2">
                Tanggal & Waktu Pelaksanaan *
              </label>
              <input
                type="datetime-local"
                required
                className="input text-sm h-12"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--color-ink)] mb-2">
                Lokasi Venue Acara *
              </label>
              <input
                type="text"
                required
                className="input text-base h-12"
                placeholder="Grand City Convex / Zoom Online"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Photo / Image Upload Dropzone Component */}
          <ImageUploadDropzone
            value={imageUrl}
            onChange={setImageUrl}
          />

          {/* Deskripsi Lengkap */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-ink)] mb-2">
              Deskripsi & Agenda Acara * (min. 20 karakter)
            </label>
            <textarea
              required
              rows={5}
              className="input h-auto p-4 resize-y text-sm leading-relaxed"
              placeholder="Jelaskan topik materi, profil pembicara, fasilitas yang didapatkan, dan syarat kehadiran..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-3 mt-4 pt-6 border-t border-[var(--color-hairline)]">
            <Link
              href="/admin"
              className="btn-secondary h-11 px-5 text-sm font-bold no-underline rounded-xl"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary h-11 px-6 text-sm font-bold rounded-xl shadow-xs inline-flex items-center gap-2"
            >
              <Check size={18} weight="bold" />
              <span>{isLoading ? "Menyimpan ke Database..." : isEdit ? "Simpan Perubahan Acara" : "Publikasikan Event Sekarang"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
