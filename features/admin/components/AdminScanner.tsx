"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  QrCode, CheckCircle, ArrowLeft, ArrowRight,
  CalendarBlank, MapPin, UsersThree, WarningCircle
} from "@phosphor-icons/react";
import { useTicketCheckin } from "@/features/tickets/hooks/useTicketDetail";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatDateShort } from "@/lib/utils";
import type { EventType } from "@/features/events/validations";

export function AdminScanner(): React.JSX.Element {
  const searchParams = useSearchParams();
  const preselectedEventId = searchParams.get("eventId") || "";

  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>(preselectedEventId);
  const [ticketInput, setTicketInput] = useState("");
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const { performCheckin, isLoading, error, lastCheckedTicket, clearError } = useTicketCheckin();

  // Load active events for selector
  useEffect(() => {
    async function loadEvents() {
      setIsLoadingEvents(true);
      try {
        const res = await fetch("/api/events?limit=100", { cache: "no-store" });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setEvents(json.data);
          // If no preselected event, select the first one by default
          if (!preselectedEventId && json.data.length > 0) {
            setSelectedEventId(json.data[0].id);
          }
        }
      } catch (err) {
        console.error("Gagal memuat event list:", err);
      } finally {
        setIsLoadingEvents(false);
      }
    }

    loadEvents();
  }, [preselectedEventId]);

  const activeEvent = events.find((e) => e.id === selectedEventId);

  const handleCheckinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;

    clearError();
    const cleanCode = ticketInput.trim().toUpperCase();
    await performCheckin(cleanCode, selectedEventId || undefined);
    setTicketInput("");
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", paddingBottom: 64 }} className="text-left">
      <Link
        href="/admin"
        className="btn-ghost mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-left no-underline"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Dashboard Admin</span>
      </Link>

      <div className="card p-7 sm:p-9 text-left">
        {/* Header Title */}
        <div className="flex items-center gap-3 mb-2 text-left">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
            <QrCode size={24} weight="bold" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-ink)] m-0 text-left">
              Scanner & Check-In Tiket Per Event
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-muted)] m-0 mt-0.5 text-left">
              Validasi kehadiran peserta secara real-time berdasarkan acara yang sedang dibuka di venue.
            </p>
          </div>
        </div>

        {/* 1. Event Selector Dropdown (WAJIB: Memilih Event Aktif) */}
        <div className="my-6 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-hairline)] text-left">
          <label className="block text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-2 text-left">
            Pilih Acara yang Sedang Berlangsung (Meja Registrasi):
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              clearError();
            }}
            disabled={isLoadingEvents}
            className="input font-semibold text-sm bg-white cursor-pointer"
          >
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title} ({evt.category}) — {formatDateShort(evt.date)}
              </option>
            ))}
          </select>

          {/* Active Event Metadata Card */}
          {activeEvent && (
            <div className="mt-4 pt-3 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[var(--color-muted)] text-left">
              <div className="flex items-center gap-3 flex-wrap text-left">
                <Badge variant="tag">{activeEvent.category}</Badge>
                <div className="flex items-center gap-1">
                  <CalendarBlank size={14} className="text-[var(--color-primary)]" />
                  <span>{formatDate(activeEvent.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} className="text-[var(--color-primary)]" />
                  <span>{activeEvent.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-[var(--color-ink)] bg-white px-3 py-1.5 rounded-lg border border-[var(--color-hairline)]">
                <UsersThree size={16} className="text-[var(--color-primary)]" />
                <span>{activeEvent.registered} Peserta Terdaftar</span>
              </div>
            </div>
          )}
        </div>

        {/* 2. Ticket Code Input Form */}
        <form onSubmit={handleCheckinSubmit} className="flex gap-3 mb-6 flex-wrap text-left">
          <div className="relative flex-1 min-w-[260px]">
            <input
              type="text"
              required
              className="input font-mono uppercase text-base tracking-wider"
              placeholder="Ketik atau Scan Kode Tiket (e.g. SBYDEV-XXXX)"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !selectedEventId}
            className="btn-primary h-12 px-7 rounded-[10px] text-sm font-semibold inline-flex items-center gap-2"
          >
            <span>{isLoading ? "Memvalidasi..." : "Verifikasi Tiket"}</span>
            <ArrowRight size={16} weight="bold" />
          </button>
        </form>

        {/* Error Alert (Event Mismatch, Double Check-In, Not Found) */}
        {error && (
          <Alert variant="error" title="Validasi Gagal" className="mb-6">
            <div className="text-left text-sm leading-relaxed">
              {error}
            </div>
          </Alert>
        )}

        {/* Success Verification Card */}
        {lastCheckedTicket && (
          <div className="p-6 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl text-[#166534] text-left">
            <div className="flex items-center gap-2.5 mb-4 text-left">
              <CheckCircle size={28} weight="fill" color="var(--color-primary)" className="flex-shrink-0" />
              <div>
                <h3 className="text-base font-bold m-0 text-[#166534] text-left">
                  Check-In Berhasil & Kehadiran Terverifikasi!
                </h3>
                <span className="text-xs text-[#15803d] text-left">
                  Peserta berhak memasuki venue acara.
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[var(--color-hairline)] flex flex-col gap-3 text-xs text-[var(--color-ink)] text-left shadow-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[var(--color-hairline)]">
                <span className="text-[var(--color-muted)] font-medium">Acara Terdaftar:</span>
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
                <span className="text-[var(--color-muted)] font-medium">Email:</span>
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
      </div>
    </div>
  );
}
