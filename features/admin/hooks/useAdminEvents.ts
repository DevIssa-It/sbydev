"use client";

import { useState, useEffect, useCallback } from "react";
import type { EventType } from "@/features/events/validations";

export function useAdminEvents() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/events?limit=100", { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.data) {
        setEvents(data.data.events);
      } else {
        setError(data.error || "Gagal memuat event admin");
      }
    } catch {
      setError("Kesalahan jaringan saat memuat daftar event admin");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteEvent = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        return true;
      } else {
        setError(data.error || "Gagal menghapus event");
        return false;
      }
    } catch {
      setError("Kesalahan jaringan saat menghapus event");
      return false;
    }
  };

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return { events, isLoading, error, deleteEvent, refetch: loadEvents };
}
