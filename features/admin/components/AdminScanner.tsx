"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  QrCode, CheckCircle, ArrowLeft, ArrowRight,
  Sparkle, MagnifyingGlass
} from "@phosphor-icons/react";
import { useTicketCheckin } from "@/features/tickets/hooks/useTicketDetail";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { EventType } from "@/features/events/validations";
import { ScannerEventSelector } from "./scanner/ScannerEventSelector";
import { ScannerEventBanner } from "./scanner/ScannerEventBanner";
import { ScannerSessionLog } from "./scanner/ScannerSessionLog";

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

  // STEP 1: EVENT SELECTION HUB
  if (!selectedEventId || !selectedEvent) {
    return (
      <div className="container-app py-8 pb-16 text-left">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <Link href="/admin" className="btn-ghost inline-flex items-center gap-1.5 text-sm font-semibold no-underline">
            <ArrowLeft size={16} />
            <span>Kembali ke Konsol Admin</span>
          </Link>
          <Badge variant="tag">LANGKAH 1 DARI 2</Badge>
        </div>

        <div className="card p-8 sm:p-10 mb-8 bg-[var(--color-navy)] text-[var(--color-canvas)] border-0 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold mb-3 text-[#86efac] border border-white/20">
            <Sparkle size={14} weight="fill" />
            <span>Meja Registrasi & Scanner Tiket</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
            Pilih Acara untuk Membuka Meja Check-In
          </h1>
          <p className="text-white/80 text-sm leading-relaxed mb-0 font-normal">
            Silakan pilih acara yang sedang berlangsung hari ini untuk membuka workstation validasi QR code peserta.
          </p>
        </div>

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

        <ScannerEventSelector
          events={filteredEvents}
          isLoading={isLoadingEvents}
          onSelectEvent={handleSelectEvent}
        />
      </div>
    );
  }

  // STEP 2: DEDICATED WORKSTATION
  return (
    <div className="container-app py-8 pb-20 text-left" style={{ maxWidth: 840 }}>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <button
          type="button"
          onClick={handleBackToEventSelection}
          className="btn-ghost inline-flex items-center gap-1.5 text-sm font-semibold no-underline cursor-pointer border-0 bg-transparent"
        >
          <ArrowLeft size={16} />
          <span>Ganti Acara Lain</span>
        </button>

        <Link href="/admin" className="btn-ghost text-xs text-[var(--color-muted)] no-underline">
          Konsol Admin
        </Link>
      </div>

      <ScannerEventBanner event={selectedEvent} />

      <div className="card p-7 sm:p-9 text-left">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
            <QrCode size={24} weight="bold" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--color-ink)] m-0">Input / Scan Tiket Peserta</h3>
            <p className="text-xs text-[var(--color-muted)] m-0 mt-0.5">
              Gunakan barcode scanner USB/Bluetooth atau ketik kode tiket peserta secara manual.
            </p>
          </div>
        </div>

        <form onSubmit={handleCheckinSubmit} className="flex gap-3 my-6 flex-wrap text-left">
          <input
            type="text"
            required
            autoFocus
            className="input font-mono uppercase text-base tracking-wider h-13 flex-1 min-w-[260px]"
            placeholder="Scan / Ketik Kode Tiket (e.g. SBYDEV-...)"
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary h-13 px-8 rounded-[10px] text-base font-semibold inline-flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>{isLoading ? "Memvalidasi..." : "Check-In"}</span>
            <ArrowRight size={18} weight="bold" />
          </button>
        </form>

        {error && (
          <Alert variant="error" title="Validasi Gagal" className="mb-6">
            <div className="text-left text-sm leading-relaxed">{error}</div>
          </Alert>
        )}

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

        <ScannerSessionLog checkins={sessionCheckins} />
      </div>
    </div>
  );
}
