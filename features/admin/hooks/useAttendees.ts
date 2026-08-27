"use client";

import { useState, useEffect, useCallback } from "react";
import type { EventType } from "@/features/events/validations";
import type { TicketWithRelations } from "@/features/tickets/types";

export function useAttendees(eventId: string) {
  const [event, setEvent] = useState<EventType | null>(null);
  const [tickets, setTickets] = useState<TicketWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const loadAttendees = useCallback(async () => {
    if (!eventId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${eventId}/attendees`);
      const data = await res.json();
      if (data.success && data.data) {
        setEvent(data.data.event);
        setTickets(data.data.tickets);
      } else {
        setError(data.error || "Gagal memuat data peserta");
      }
    } catch {
      setError("Kesalahan koneksi saat mengambil daftar peserta");
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadAttendees();
  }, [loadAttendees]);

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === "ALL") return true;
    return t.status === filterStatus;
  });

  const checkedInCount = tickets.filter((t) => t.status === "CHECKED_IN").length;

  return {
    event,
    tickets: filteredTickets,
    rawTickets: tickets,
    checkedInCount,
    isLoading,
    error,
    filterStatus,
    setFilterStatus,
    refetch: loadAttendees,
  };
}
