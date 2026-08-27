"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { registerEventApi } from "../api";

export function useEventRegistration(eventId: string) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successTicketCode, setSuccessTicketCode] = useState<string | null>(null);

  const register = async () => {
    if (status === "unauthenticated" || !session) {
      router.push(`/login?callbackUrl=/events/${eventId}`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await registerEventApi(eventId);
      if (response.success && response.data) {
        setSuccessTicketCode(response.data.code);
        router.push(`/tickets/${response.data.code}?registered=true`);
      } else {
        setError(response.error || "Gagal melakukan pendaftaran event");
      }
    } catch {
      setError("Terjadi kesalahan sistem saat memproses registrasi");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
    successTicketCode,
    isAuthenticated: status === "authenticated",
  };
}
