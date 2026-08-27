"use client";

import { useState, useEffect, useCallback } from "react";
import type { TicketWithRelations } from "../types";
import { fetchTicketByCodeApi, checkinTicketApi } from "../api";

export function useTicketDetail(ticketCode: string) {
  const [ticket, setTicket] = useState<TicketWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTicket = useCallback(async () => {
    if (!ticketCode) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchTicketByCodeApi(ticketCode);
      if (res.success && res.data) {
        setTicket(res.data);
      } else {
        setError(res.error || "Tiket tidak ditemukan");
      }
    } catch {
      setError("Gagal menghubungi server untuk memuat tiket");
    } finally {
      setIsLoading(false);
    }
  }, [ticketCode]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  return { ticket, isLoading, error, refetch: loadTicket };
}

export function useTicketCheckin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCheckedTicket, setLastCheckedTicket] = useState<TicketWithRelations | null>(null);

  const performCheckin = async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await checkinTicketApi(code);
      if (res.success && res.data) {
        setLastCheckedTicket(res.data);
        return { success: true, ticket: res.data };
      } else {
        setError(res.error || "Gagal melakukan check-in tiket");
        return { success: false, error: res.error };
      }
    } catch {
      setError("Terjadi kesalahan jaringan saat proses validasi tiket");
      return { success: false, error: "Network error" };
    } finally {
      setIsLoading(false);
    }
  };

  return { performCheckin, isLoading, error, lastCheckedTicket, clearError: () => setError(null) };
}
