"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Sparkle, MagnifyingGlass } from "@phosphor-icons/react";
import { fetchEventsApi } from "@/features/events/api";
import { Badge } from "@/components/ui/Badge";
import type { EventType } from "@/features/events/validations";
import { ScannerEventSelector } from "./scanner/ScannerEventSelector";
import { ScannerEventBanner } from "./scanner/ScannerEventBanner";
import { ScannerCheckinForm } from "./scanner/ScannerCheckinForm";

interface SessionEntry {
  code: string;
  name: string;
  time: string;
}

export function AdminScanner(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventIdParam = searchParams.get("eventId");

  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(eventIdParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [sessionCheckins, setSessionCheckins] = useState<SessionEntry[]>([]);

  useEffect(() => {
    async function loadEvents() {
      setIsLoadingEvents(true);
      try {
        const res = await fetchEventsApi({ limit: 100 });
        if (res.success && res.data?.events) {
          setEvents(res.data.events);
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
  }, [eventIdParam]);

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  const handleSelectEvent = (id: string) => {
    setSelectedEventId(id);
    router.push(`/admin/scanner?eventId=${id}`);
  };

  const handleBackToEventSelection = () => {
    setSelectedEventId(null);
    router.push("/admin/scanner");
  };

  const handleCheckinSuccess = (entry: SessionEntry) => {
    setSessionCheckins((prev) => [entry, ...prev]);
  };

  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // STEP 1: EVENT SELECTION HUB
  if (!selectedEventId || !selectedEvent) {
    return (
      <div className="container-app py-8 pb-16 text-left">
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

        <div className="rounded-2xl p-8 sm:p-10 mb-8 bg-[var(--color-navy)] text-white shadow-sm">
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
          <MagnifyingGlass
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          />
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

      <ScannerCheckinForm
        eventId={selectedEvent.id}
        sessionCheckins={sessionCheckins}
        onCheckinSuccess={handleCheckinSuccess}
      />
    </div>
  );
}
