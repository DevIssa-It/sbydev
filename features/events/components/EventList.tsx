"use client";

import React from "react";
import { useEvents } from "../hooks/useEvents";
import { EventCard } from "./EventCard";
import { EventFilter } from "./EventFilter";
import { EventGridSkeleton } from "./EventSkeleton";
import { CaretLeft, CaretRight, CalendarX } from "@phosphor-icons/react";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";

export function EventList(): React.JSX.Element {
  const {
    events,
    categories,
    selectedCategory,
    searchQuery,
    page,
    totalPages,
    total,
    isLoading,
    error,
    setPage,
    handleCategoryChange,
    handleSearchChange,
  } = useEvents();

  return (
    <section id="daftar-event" style={{ marginBottom: 64 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 className="text-heading" style={{ color: "var(--color-ink)", marginBottom: 8 }}>
          Jelajahi Event SurabayaDev
        </h2>
        <p className="text-body-sm" style={{ color: "var(--color-muted)" }}>
          Temukan acara teknologi terbaru dan daftarkan diri kamu sebelum kuota habis.
        </p>
      </div>

      <EventFilter
        categories={categories}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
      />

      {error && <Alert variant="error" className="mb-6">{error}</Alert>}

      {isLoading ? (
        <EventGridSkeleton count={6} />
      ) : events.length === 0 ? (
        <EmptyState
          icon={<CalendarX size={28} />}
          title="Tidak ada event ditemukan"
          description={
            searchQuery || selectedCategory !== "Semua"
              ? "Coba gunakan kata kunci pencarian yang lain atau ganti filter kategori."
              : "Belum ada event yang dipublikasikan saat ini. Silakan cek kembali nanti."
          }
          action={
            (searchQuery || selectedCategory !== "Semua") ? (
              <button
                onClick={() => {
                  handleSearchChange("");
                  handleCategoryChange("Semua");
                }}
                className="btn-secondary"
              >
                Reset Filter
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
              marginBottom: 32,
            }}
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="btn-secondary"
                style={{ padding: "8px 12px" }}
                aria-label="Halaman sebelumnya"
              >
                <CaretLeft size={16} />
                <span>Sebelumnya</span>
              </button>

              <span style={{ fontSize: 14, color: "var(--color-muted)" }}>
                Halaman <strong>{page}</strong> dari <strong>{totalPages}</strong> ({total} total event)
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="btn-secondary"
                style={{ padding: "8px 12px" }}
                aria-label="Halaman berikutnya"
              >
                <span>Selanjutnya</span>
                <CaretRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
