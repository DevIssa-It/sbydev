"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginSchema, RegisterSchema } from "../validations";

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const validation = LoginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Input tidak valid");
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError("Email atau password yang Anda masukkan salah.");
      } else {
        // If logging in as admin and no specific callback was requested, go straight to Admin Dashboard
        const targetUrl = callbackUrl === "/" && email.toLowerCase().includes("admin") ? "/admin" : callbackUrl;
        router.push(targetUrl);
        router.refresh();
      }
    } catch {
      setError("Terjadi kendala saat login. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, isLoading, error, handleSubmit };
}

export function useRegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const validation = RegisterSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Periksa kembali input form Anda");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (data.success) {
        // Auto login setelah registrasi
        const loginRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
          callbackUrl: "/",
        });

        if (loginRes?.ok) {
          router.push("/");
          router.refresh();
        } else {
          router.push("/login?registered=true");
        }
      } else {
        setError(data.error || "Gagal membuat akun");
      }
    } catch {
      setError("Terjadi kesalahan jaringan saat registrasi");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    error,
    handleSubmit,
  };
}
