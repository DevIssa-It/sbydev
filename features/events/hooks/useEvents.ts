"use client";

import { useState, useEffect, useCallback } from "react";
import type { EventType, EventCategory } from "../validations";
import { fetchEventsApi } from "../api";

export function useEvents(initialCategory: EventCategory = "Semua") {
  const [events, setEvents] = useState<EventType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchEventsApi({
        search: searchQuery,
        category: selectedCategory === "Semua" ? undefined : selectedCategory,
        page,
        limit: 6,
      });

      if (response.success && response.data) {
        setEvents(response.data.events);
        setTotalPages(response.data.totalPages);
        setTotal(response.data.total);
        if (response.data.categories?.length) {
          setCategories(["Semua", ...response.data.categories.filter((c) => c !== "Semua")]);
        }
      } else {
        setError(response.error || "Gagal memuat daftar event");
      }
    } catch {
      setError("Terjadi kendala jaringan saat memuat event");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, page]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleCategoryChange = (category: EventCategory) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  return {
    events,
    categories,
    selectedCategory,
    searchQuery,
    page,
    totalPages,
    total,
    isLoading,
    error,
    setPage,
    handleCategoryChange,
    handleSearchChange,
    refetch: loadEvents,
  };
}
