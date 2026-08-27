"use client";

import React from "react";
import Link from "next/link";
import { Ticket, ArrowRight } from "@phosphor-icons/react";
import { useTickets, TicketCard } from "@/features/tickets";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";

export default function TicketsPage(): React.JSX.Element {
  const { tickets, isLoading, error } = useTickets();

  return (
    <div className="w-full py-8 pb-16">
      <div className="mb-7">
        <h1 className="text-display text-2xl text-[var(--color-ink)] mb-2">
          Tiket Event Saya
        </h1>
        <p className="text-body-sm text-[var(--color-muted)]">
          Daftar seluruh tiket digital event SurabayaDev yang telah kamu daftarkan.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="skeleton h-48 w-full rounded-2xl" />
          <div className="skeleton h-48 w-full rounded-2xl" />
          <div className="skeleton h-48 w-full rounded-2xl" />
        </div>
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : tickets.length === 0 ? (
        <EmptyState
          icon={<Ticket size={28} />}
          title="Belum ada tiket terdaftar"
          description="Kamu belum mendaftar ke event mana pun. Jelajahi event menarik dan amankan kursimu sekarang!"
          action={
            <Link href="/" className="btn-primary no-underline">
              <span>Jelajahi Daftar Event</span>
              <ArrowRight size={16} />
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
