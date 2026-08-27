"use client";

import { useState, useEffect, useCallback } from "react";
import type { TicketWithRelations } from "../types";
import { fetchUserTicketsApi } from "../api";

export function useTickets() {
  const [tickets, setTickets] = useState<TicketWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchUserTicketsApi();
      if (res.success && res.data) {
        setTickets(res.data);
      } else {
        setError(res.error || "Gagal memuat tiket");
      }
    } catch {
      setError("Terjadi kesalahan jaringan saat mengambil tiket");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  return { tickets, isLoading, error, refetch: loadTickets };
}
