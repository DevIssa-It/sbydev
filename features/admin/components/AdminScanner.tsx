"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  QrCode, CheckCircle, ArrowLeft, ArrowRight,
  CalendarBlank, MapPin, Users, CaretRight,
  Sparkle, MagnifyingGlass
} from "@phosphor-icons/react";
import { useTicketCheckin } from "@/features/tickets/hooks/useTicketDetail";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { EventQuotaIndicator } from "@/features/events/components/EventQuotaIndicator";
import { formatDate, formatDateShort } from "@/lib/utils";
import type { EventType } from "@/features/events/validations";

export function AdminScanner(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventIdParam = searchParams.get("eventId");

  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(eventIdParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketInput, setTicketInput] = useState("");
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [sessionCheckins, setSessionCheckins] = useState<Array<{ code: string; name: string; time: string }>>([]);

  const { performCheckin, isLoading, error, lastCheckedTicket, clearError } = useTicketCheckin();

  // Load events
  useEffect(() => {
    async function loadEvents() {
      setIsLoadingEvents(true);
      try {
        const res = await fetch("/api/events?limit=100", { cache: "no-store" });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setEvents(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat event:", err);
      } finally {
        setIsLoadingEvents(false);
      }
    }
    loadEvents();
  }, []);

  // Sync state with URL param
  useEffect(() => {
    setSelectedEventId(eventIdParam);
    clearError();
  }, [eventIdParam, clearError]);

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  const handleSelectEvent = (id: string) => {
    setSelectedEventId(id);
    router.push(`/admin/scanner?eventId=${id}`);
    clearError();
  };

  const handleBackToEventSelection = () => {
    setSelectedEventId(null);
    router.push("/admin/scanner");
    clearError();
  };

  const handleCheckinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim() || !selectedEventId) return;

    clearError();
    const cleanCode = ticketInput.trim().toUpperCase();
    const result = await performCheckin(cleanCode, selectedEventId);

    if (result.success && result.ticket) {
      setSessionCheckins((prev) => [
        {
          code: result.ticket.code,
          name: result.ticket.user?.name || "Peserta",
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        },
        ...prev,
      ]);
    }
    setTicketInput("");
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 1: EVENT SELECTION HUB (Card Grid like User Dashboard)
  // ─────────────────────────────────────────────────────────────────────────
  if (!selectedEventId || !selectedEvent) {
    return (
      <div className="container-app py-8 pb-16 text-left">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <Link
            href="/admin"
            className="btn-ghost inline-flex items-center gap-1.5 text-sm font-semibold no-underline"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Konsol Admin</span>
          </Link>
          <Badge variant="tag">LANGKAH 1 DARI 2</Badge>
        </div>

        {/* Hero Header */}
        <div className="card p-8 sm:p-10 mb-8 bg-[var(--color-navy)] text-[var(--color-canvas)] border-0 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold mb-3 text-[#86efac] border border-white/20">
              <Sparkle size={14} weight="fill" />
              <span>Meja Registrasi & Scanner Tiket</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
              Pilih Acara untuk Membuka Meja Check-In
            </h1>
            <p className="text-white/80 text-sm leading-relaxed mb-0 font-normal">
              Silakan pilih acara yang sedang berlangsung hari ini untuk membuka workstation validasi QR code & kode tiket peserta.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Cari acara berdasarkan judul, kategori, atau lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input with-icon-left bg-white text-base"
          />
        </div>

        {/* Event Cards Grid */}
        {isLoadingEvents ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-80 rounded-2xl" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="card p-12 text-center text-[var(--color-muted)]">
            <p className="text-base font-semibold">Tidak ada acara yang ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <article
                key={evt.id}
                onClick={() => handleSelectEvent(evt.id)}
                className="card flex flex-col h-full overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] rounded-2xl cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="relative w-full h-44 bg-[var(--color-surface)] flex-shrink-0 overflow-hidden">
                  {evt.imageUrl ? (
                    <Image
                      src={evt.imageUrl}
                      alt={evt.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--color-navy)] text-white font-bold text-lg p-4 text-center">
                      {evt.category}
                    </div>
                  )}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                    <Badge variant="tag">{evt.category}</Badge>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-[var(--color-ink)] mb-2 line-clamp-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed font-normal">
                      {evt.description}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-col gap-2 pt-3 border-t border-[var(--color-hairline)]">
                    <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                      <CalendarBlank size={15} className="text-[var(--color-primary)] flex-shrink-0" />
                      <span>{formatDate(evt.date)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                      <MapPin size={15} className="text-[var(--color-primary)] flex-shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>

                    <div className="mt-1">
                      <EventQuotaIndicator registered={evt.registered} quota={evt.quota} />
                    </div>
                  </div>

                  {/* Open Scanner CTA */}
                  <div className="pt-2">
                    <button
                      type="button"
                      className="btn-primary w-full h-10 rounded-xl text-xs font-bold justify-center gap-2 shadow-2xs group-hover:bg-[var(--color-primary-hover)] cursor-pointer"
                    >
                      <QrCode size={18} weight="bold" />
                      <span>Buka Meja Check-In</span>
                      <CaretRight size={14} weight="bold" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 2: DEDICATED EVENT SCANNER WORKSTATION
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="container-app py-8 pb-20 text-left" style={{ maxWidth: 840 }}>
      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <button
          type="button"
          onClick={handleBackToEventSelection}
          className="btn-ghost inline-flex items-center gap-1.5 text-sm font-semibold no-underline cursor-pointer border-0 bg-transparent"
        >
          <ArrowLeft size={16} />
          <span>Ganti Acara Lain</span>
        </button>

        <Link
          href="/admin"
          className="btn-ghost text-xs text-[var(--color-muted)] no-underline"
        >
          Konsol Admin
        </Link>
      </div>

      {/* 1. Selected Event Workstation Banner */}
      <div className="card p-6 sm:p-7 mb-7 bg-[var(--color-navy)] text-white rounded-2xl border-0 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/10 overflow-hidden flex-shrink-0 border border-white/20">
              {selectedEvent.imageUrl ? (
                <Image
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-xs">
                  {selectedEvent.category}
                </div>
              )}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--color-primary)] text-white mb-1.5">
                <span>MEJA REGISTRASI AKTIF</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-1 leading-snug">
                {selectedEvent.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-white/80 flex-wrap">
                <span className="flex items-center gap-1">
                  <CalendarBlank size={14} />
                  {formatDateShort(selectedEvent.date)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {selectedEvent.location}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Badge */}
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-xl border border-white/15 flex-shrink-0">
            <Users size={20} className="text-[#86efac]" />
            <div className="text-left">
              <div className="text-xs text-white/70">Total Terdaftar</div>
              <div className="text-base font-extrabold text-white">
                {selectedEvent.registered} Peserta
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Scanner Card Workstation */}
      <div className="card p-7 sm:p-9 text-left">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
            <QrCode size={24} weight="bold" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--color-ink)] m-0">
              Input / Scan Tiket Peserta
            </h3>
            <p className="text-xs text-[var(--color-muted)] m-0 mt-0.5">
              Gunakan barcode scanner USB/Bluetooth atau ketik kode tiket peserta secara manual.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCheckinSubmit} className="flex gap-3 my-6 flex-wrap text-left">
          <div className="relative flex-1 min-w-[260px]">
            <input
              type="text"
              required
              autoFocus
              className="input font-mono uppercase text-base tracking-wider h-13"
              placeholder="Scan / Ketik Kode Tiket (e.g. SBYDEV-...)"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary h-13 px-8 rounded-[10px] text-base font-semibold inline-flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>{isLoading ? "Memvalidasi..." : "Check-In"}</span>
            <ArrowRight size={18} weight="bold" />
          </button>
        </form>

        {/* Error Alert */}
        {error && (
          <Alert variant="error" title="Validasi Gagal" className="mb-6">
            <div className="text-left text-sm leading-relaxed">
              {error}
            </div>
          </Alert>
        )}

        {/* Success Verification Card */}
        {lastCheckedTicket && (
          <div className="p-6 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl text-[#166534] text-left mb-6">
            <div className="flex items-center gap-3 mb-4 text-left">
              <CheckCircle size={32} weight="fill" color="var(--color-primary)" className="flex-shrink-0" />
              <div>
                <h4 className="text-base sm:text-lg font-bold m-0 text-[#166534] text-left">
                  Check-In Berhasil! Kehadiran Terverifikasi
                </h4>
                <span className="text-xs text-[#15803d] text-left">
                  Peserta terdaftar secara sah dan berhak mengikuti acara.
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[var(--color-hairline)] flex flex-col gap-3 text-xs text-[var(--color-ink)] text-left shadow-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[var(--color-hairline)]">
                <span className="text-[var(--color-muted)] font-medium">Acara:</span>
                <strong className="text-sm text-[var(--color-primary)]">{lastCheckedTicket.event?.title}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-muted)] font-medium">Kode Tiket:</span>
                <strong className="font-mono text-sm">{lastCheckedTicket.code}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-muted)] font-medium">Nama Peserta:</span>
                <strong className="text-sm">{lastCheckedTicket.user?.name}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-muted)] font-medium">Email Peserta:</span>
                <span>{lastCheckedTicket.user?.email}</span>
              </div>
              {lastCheckedTicket.checkedAt && (
                <div className="flex justify-between items-center pt-2 border-t border-[var(--color-hairline)]">
                  <span className="text-[var(--color-muted)] font-medium">Waktu Check-In:</span>
                  <span className="text-[#166534] font-bold">{formatDate(lastCheckedTicket.checkedAt)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Session Check-In Log (Peserta yang baru saja diabsen di meja ini) */}
        {sessionCheckins.length > 0 && (
          <div className="mt-8 pt-6 border-t border-[var(--color-hairline)] text-left">
            <h4 className="text-sm font-bold text-[var(--color-ink)] uppercase tracking-wider mb-3 text-left">
              Riwayat Check-In Sesi Ini ({sessionCheckins.length} Peserta)
            </h4>
            <div className="divide-y divide-[var(--color-hairline)] rounded-xl border border-[var(--color-hairline)] overflow-hidden bg-white">
              {sessionCheckins.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-[var(--color-surface)] transition-colors">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={18} weight="fill" color="var(--color-primary)" />
                    <div>
                      <strong className="text-[var(--color-ink)]">{item.name}</strong>
                      <span className="font-mono text-[var(--color-muted)] ml-2">({item.code})</span>
                    </div>
                  </div>
                  <span className="text-[var(--color-muted)] font-mono">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
