"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, User, Envelope } from "@phosphor-icons/react";
import { useAttendees } from "../hooks/useAttendees";
import { TicketStatusBadge } from "@/features/tickets/components/TicketStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { Alert } from "@/components/ui/Alert";
import { formatDateShort } from "@/lib/utils";

interface AdminAttendeesTableProps {
  eventId: string;
}

export function AdminAttendeesTable({ eventId }: AdminAttendeesTableProps): React.JSX.Element {
  const { event, tickets, rawTickets, checkedInCount, isLoading, error, filterStatus, setFilterStatus } =
    useAttendees(eventId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-56 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !event) {
    return <Alert variant="error">{error || "Event tidak ditemukan"}</Alert>;
  }

  const checkinRate = rawTickets.length > 0 ? Math.round((checkedInCount / rawTickets.length) * 100) : 0;

  return (
    <div className="w-full pb-16">
      <Link href="/admin" className="btn-ghost mb-6 inline-flex items-center gap-1.5">
        <ArrowLeft size={16} />
        <span>Kembali ke Manajemen Event</span>
      </Link>

      {/* Header Summary */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="tag">{event.category}</Badge>
          <span className="text-xs text-[var(--color-muted)]">• ID: {event.id}</span>
        </div>
        <h1 className="text-display text-2xl text-[var(--color-ink)] mb-2">
          Data Peserta: {event.title}
        </h1>
        <p className="text-body-sm text-[var(--color-muted)]">
          Daftar seluruh pendaftar, status tiket, dan log waktu validasi check-in panitia.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Pendaftar"
          value={rawTickets.length}
          subtext={`Kapasitas: ${event.quota} kuota`}
        />
        <StatCard
          label="Sudah Hadir (Check-In)"
          value={checkedInCount}
          valueColor="#166534"
          subtext="Peserta terverifikasi"
        />
        <StatCard
          label="Tingkat Kehadiran"
          value={`${checkinRate}%`}
          valueColor="var(--color-primary)"
          subtext="Attendance rate acara"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {["ALL", "PENDING", "CHECKED_IN", "CANCELLED"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`chip ${filterStatus === st ? "active" : ""}`}
            style={{
              backgroundColor: filterStatus === st ? "var(--color-surface)" : "var(--color-canvas)",
              borderColor: filterStatus === st ? "var(--color-primary)" : "var(--color-hairline)",
              color: filterStatus === st ? "var(--color-primary)" : "var(--color-ink)",
              fontWeight: filterStatus === st ? 600 : 500,
            }}
          >
            {st === "ALL" ? "Semua Peserta" : st === "PENDING" ? "Belum Hadir" : st === "CHECKED_IN" ? "Sudah Hadir" : "Batal"}
          </button>
        ))}
      </div>

      {/* Table */}
      {tickets.length === 0 ? (
        <div className="card p-12 text-center text-[var(--color-muted)]">
          Tidak ada peserta dengan filter ini.
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[var(--color-surface)] border-b border-[var(--color-hairline)]">
                <th className="p-3.5 font-semibold text-[var(--color-ink)]">No</th>
                <th className="p-3.5 font-semibold text-[var(--color-ink)]">Nama Peserta</th>
                <th className="p-3.5 font-semibold text-[var(--color-ink)]">Email</th>
                <th className="p-3.5 font-semibold text-[var(--color-ink)]">Kode Tiket</th>
                <th className="p-3.5 font-semibold text-[var(--color-ink)]">Status</th>
                <th className="p-3.5 font-semibold text-[var(--color-ink)]">Waktu Check-In</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t, idx) => (
                <tr key={t.id} className="border-b border-[var(--color-hairline)]">
                  <td className="p-3.5 text-[var(--color-muted)]">{idx + 1}</td>
                  <td className="p-3.5 font-semibold text-[var(--color-ink)]">
                    <div className="flex items-center gap-1.5">
                      <User size={15} color="var(--color-primary)" />
                      <span>{t.user?.name || "Peserta"}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-[var(--color-muted)]">
                    <div className="flex items-center gap-1.5">
                      <Envelope size={15} />
                      <span>{t.user?.email || "-"}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono font-semibold">
                    <Link href={`/tickets/${t.code}`} className="btn-ghost text-xs">
                      {t.code}
                    </Link>
                  </td>
                  <td className="p-3.5">
                    <TicketStatusBadge status={t.status} />
                  </td>
                  <td className="p-3.5 text-xs text-[var(--color-muted)]">
                    {t.checkedAt ? (
                      <div className="flex items-center gap-1 text-[#166534]">
                        <CheckCircle size={15} weight="fill" />
                        <span>{formatDateShort(t.checkedAt)}</span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
