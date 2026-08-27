"use client";

import { useState, useEffect, useCallback } from "react";
import type { EventType } from "../validations";
import { fetchEventByIdApi } from "../api";

export function useEventDetail(eventId: string) {
  const [event, setEvent] = useState<(EventType & { _count?: { tickets: number } }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvent = useCallback(async () => {
    if (!eventId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchEventByIdApi(eventId);
      if (response.success && response.data) {
        setEvent(response.data);
      } else {
        setError(response.error || "Event tidak ditemukan");
      }
    } catch {
      setError("Gagal menghubungi server untuk mengambil detail event");
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  return { event, isLoading, error, refetch: loadEvent };
}
