"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventSchema, type EventFormData } from "@/features/events/validations";

interface UseEventFormProps {
  initialData?: Partial<EventFormData> & { id?: string };
  isEdit?: boolean;
}

export function useEventForm({ initialData, isEdit = false }: UseEventFormProps = {}) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "Conference");
  const [location, setLocation] = useState(initialData?.location || "");
  const [date, setDate] = useState(
    initialData?.date
      ? new Date(initialData.date).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [quota, setQuota] = useState(initialData?.quota ? String(initialData.quota) : "100");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const parsed = EventSchema.safeParse({
      title,
      description,
      category,
      location,
      date,
      quota: Number(quota),
      imageUrl: imageUrl || undefined,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Periksa kembali data formulir event");
      setIsLoading(false);
      return;
    }

    try {
      const url = isEdit && initialData?.id ? `/api/events/${initialData.id}` : "/api/events";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Gagal menyimpan event");
      }
    } catch {
      setError("Terjadi kesalahan koneksi saat menyimpan event");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    location,
    setLocation,
    date,
    setDate,
    quota,
    setQuota,
    imageUrl,
    setImageUrl,
    isLoading,
    error,
    handleSubmit,
  };
}
