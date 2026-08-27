"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, QrCode, MagnifyingGlass, Sparkle, Warning, Trash } from "@phosphor-icons/react";
import { useAdminEvents } from "../hooks/useAdminEvents";
import { AdminHero } from "./AdminHero";
import { AdminEventCard } from "./AdminEventCard";
import { Modal } from "@/components/ui/Modal";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";
import type { EventType } from "@/features/events";

const CATEGORIES = ["Semua", "Conference", "Workshop", "Meetup", "Hackathon"];

export function AdminEventList(): React.JSX.Element {
  const { events, isLoading, error, deleteEvent } = useAdminEvents();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [eventToDelete, setEventToDelete] = useState<EventType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalEvents = events.length;
  const totalAttendees = events.reduce((acc, curr) => acc + (curr.registered || 0), 0);

  const filteredEvents = events.filter((e) => {
    const matchCategory = selectedCategory === "Semua" || e.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    try {
      await deleteEvent(eventToDelete.id);
      setEventToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 text-left">
        <div className="skeleton h-64 w-full rounded-2xl mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="skeleton h-96 w-full rounded-2xl" />
          <div className="skeleton h-96 w-full rounded-2xl" />
          <div className="skeleton h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  return (
    <div className="w-full pb-12 text-left">
      {/* 1. Specialized Admin Hero Banner */}
      <AdminHero
        totalEvents={totalEvents}
        totalAttendees={totalAttendees}
        totalCheckedIn={Math.floor(totalAttendees * 0.75)}
      />

      {/* 2. Management Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 text-left">
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`h-9 px-4 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
                  isSelected
                    ? "bg-[var(--color-navy)] text-white border-[var(--color-navy)] shadow-xs"
                    : "bg-[var(--color-surface)] text-[var(--color-ink)] border-[var(--color-hairline)] hover:bg-[var(--color-hairline)]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="w-full md:w-80 relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none flex items-center">
            <MagnifyingGlass size={16} color="var(--color-primary)" />
          </div>
          <input
            type="text"
            className="input with-icon-left text-sm h-10 w-full rounded-xl"
            style={{ paddingLeft: 40 }}
            placeholder="Cari acara yang Anda kelola..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 3. Section Header */}
      <div className="flex justify-between items-center mb-6 text-left">
        <div className="flex items-center gap-2 text-left">
          <h2 className="text-display text-xl sm:text-2xl text-[var(--color-ink)] font-bold text-left">
            Daftar Acara Dikelola
          </h2>
          <span className="font-mono text-xs font-bold text-[var(--color-primary)] bg-[var(--color-surface)] px-2.5 py-0.5 rounded-full border border-[var(--color-hairline)]">
            {filteredEvents.length} Event
          </span>
        </div>
      </div>

      {/* 4. Events Grid of Cards */}
      {events.length === 0 ? (
        <EmptyState
          icon={<Sparkle size={26} weight="fill" />}
          title="Belum ada acara yang dibuat"
          description="Realisasikan acaramu sekarang dengan langkah yang mudah! Buat acara teknologi pertama Anda dan jalin koneksi dengan ribuan developer."
          action={
            <Link href="/admin/events/new" className="btn-primary h-11 px-5 text-xs font-bold inline-flex items-center gap-2 rounded-xl">
              <Plus size={16} weight="bold" />
              <span>Buat Event Sekarang</span>
            </Link>
          }
        />
      ) : filteredEvents.length === 0 ? (
        <div className="card p-8 text-left border border-[var(--color-hairline)] bg-[var(--color-canvas)] rounded-2xl">
          <p className="text-sm text-[var(--color-muted)] text-left">
            Tidak ditemukan acara yang cocok dengan kriteria filter Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-left">
          {filteredEvents.map((event) => (
            <AdminEventCard
              key={event.id}
              event={event}
              onDelete={() => setEventToDelete(event)}
            />
          ))}
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(eventToDelete)}
        onClose={() => setEventToDelete(null)}
        title="Konfirmasi Hapus Acara"
        description="Tindakan ini tidak dapat dibatalkan dan akan menghapus seluruh data terkait."
        maxWidth="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setEventToDelete(null)}
              className="btn-secondary h-10 px-4 text-xs font-bold rounded-xl"
              disabled={isDeleting}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="btn-secondary h-10 px-4 text-xs font-bold rounded-xl bg-[#fee2e2] text-[#991b1b] border-red-200 hover:bg-red-200 inline-flex items-center gap-1.5"
              disabled={isDeleting}
            >
              <Trash size={15} />
              <span>{isDeleting ? "Menghapus..." : "Ya, Hapus Acara"}</span>
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-3 text-left">
          <div className="flex items-start gap-3 p-3.5 bg-[#fef3c7] rounded-xl border border-[#fde68a] text-xs text-[#92400e]">
            <Warning size={20} weight="fill" className="flex-shrink-0 mt-0.5" />
            <span>
              Menghapus acara <strong>&quot;{eventToDelete?.title}&quot;</strong> akan membatalkan seluruh tiket ({eventToDelete?.registered} peserta) yang telah terdaftar.
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
