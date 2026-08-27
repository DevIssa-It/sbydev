"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Lock, Envelope, User, ShieldCheck, ArrowRight, Eye, EyeSlash,
  Sparkle, CheckCircle, Ticket, CalendarCheck, Quotes
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useLoginForm } from "../hooks/useAuthForm";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";

export function LoginForm(): React.JSX.Element {
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "true";
  const [showPassword, setShowPassword] = useState(false);
  const { email, setEmail, password, setPassword, isLoading, error, handleSubmit } = useLoginForm();

  // Fast 1-Click Quick Fill for testing
  const handleQuickFill = (role: "user" | "admin") => {
    if (role === "admin") {
      setEmail("admin@sbydev.id");
      setPassword("adminpassword123");
    } else {
      setEmail("user@sbydev.id");
      setPassword("userpassword123");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-5xl mx-auto my-4"
    >
      <div className="card overflow-hidden shadow-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] rounded-2xl grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Brand Showcase Panel (5 Cols) */}
        <div className="lg:col-span-5 callout-navy p-8 sm:p-10 flex flex-col justify-between text-white relative">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold mb-6 text-[#b0e5fb] border border-white/15">
              <Sparkle size={14} weight="fill" />
              <span>SurabayaDev Platform</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
              Satu Akun untuk Seluruh Event Teknologi di Surabaya
            </h2>

            <p className="text-white/80 text-sm leading-relaxed mb-8">
              Daftar ke workshop, conference, dan meetup komunitas dalam satu klik. Akses tiket digital instan dengan validasi QR code.
            </p>

            {/* Benefit Bullets */}
            <div className="flex flex-col gap-3.5 text-xs sm:text-sm text-white/90">
              <div className="flex items-start gap-2.5">
                <CheckCircle size={18} color="#86efac" weight="fill" className="flex-shrink-0 mt-0.5" />
                <span>Registrasi instan & alokasi kuota terproteksi</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Ticket size={18} color="#93c5fd" weight="fill" className="flex-shrink-0 mt-0.5" />
                <span>Tiket digital otomatis tersimpan di smartphone</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CalendarCheck size={18} color="#fed7aa" weight="fill" className="flex-shrink-0 mt-0.5" />
                <span>Check-in cepat tanpa antrean di venue acara</span>
              </div>
            </div>
          </div>

          {/* Bottom Social Proof */}
          <div className="mt-8 pt-6 border-t border-white/15">
            <div className="flex items-center gap-2 text-xs text-[#b0e5fb] mb-1 font-semibold">
              <Quotes size={16} weight="fill" />
              <span>Komunitas Developer Aktif</span>
            </div>
            <p className="text-xs text-white/70 italic leading-relaxed">
              &ldquo;Platform terbaik untuk terhubung dengan sesama engineer di Surabaya.&rdquo;
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Login Form (7 Cols) */}
        <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-[var(--color-canvas)]">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex mb-2">
              <Badge variant="tag">AUTHENTICATION</Badge>
            </div>
            <h1 className="text-display text-2xl sm:text-3xl text-[var(--color-ink)] mb-1.5 font-bold">
              Masuk ke Akun
            </h1>
            <p className="text-body-sm text-[var(--color-muted)] text-sm leading-relaxed">
              Masukkan email dan kata sandi yang telah terdaftar untuk melanjutkan.
            </p>
          </div>

          {/* Status Alerts */}
          {isRegistered && (
            <Alert variant="success" className="mb-5">
              Pendaftaran akun berhasil! Silakan masuk dengan email dan password Anda.
            </Alert>
          )}

          {error && (
            <Alert variant="error" className="mb-5">
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-[var(--color-ink)] mb-1.5">
                Alamat Email
              </label>
              <div className="relative w-full">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] flex items-center pointer-events-none z-10">
                  <Envelope size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="input with-icon-left text-sm h-11"
                  style={{ paddingLeft: 44 }}
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-[var(--color-ink)] mb-1.5">
                Kata Sandi
              </label>
              <div className="relative w-full">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] flex items-center pointer-events-none z-10">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="input with-icon-left text-sm h-11"
                  style={{ paddingLeft: 44, paddingRight: 44 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-ink)] bg-transparent border-0 cursor-pointer p-1"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-11 text-sm font-bold mt-1 justify-center shadow-xs rounded-xl"
            >
              <span>{isLoading ? "Sedang Memverifikasi..." : "Masuk ke Akun Saya"}</span>
              <ArrowRight size={16} weight="bold" />
            </button>
          </form>

          {/* Quick 1-Click Demo Fill */}
          <div className="mt-6 pt-5 border-t border-[var(--color-hairline)]">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-2.5 flex items-center gap-1.5">
              <Sparkle size={13} weight="fill" className="text-[var(--color-primary)]" />
              <span>Akses Cepat Demo Pengujian:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickFill("user")}
                className="btn-secondary h-10 text-xs px-3 justify-start bg-[var(--color-surface)] border-[var(--color-hairline)] hover:border-[var(--color-primary)] text-[var(--color-ink)] rounded-xl"
              >
                <User size={15} color="var(--color-primary)" weight="bold" className="flex-shrink-0" />
                <div className="flex flex-col text-left leading-tight">
                  <span className="font-bold">Akun Member Peserta</span>
                  <span className="text-[10px] text-[var(--color-muted)] font-mono">user@sbydev.id</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("admin")}
                className="btn-secondary h-10 text-xs px-3 justify-start bg-[var(--color-surface)] border-[var(--color-hairline)] hover:border-[var(--color-primary)] text-[var(--color-ink)] rounded-xl"
              >
                <ShieldCheck size={15} color="var(--color-primary)" weight="bold" className="flex-shrink-0" />
                <div className="flex flex-col text-left leading-tight">
                  <span className="font-bold">Akun Panitia Admin</span>
                  <span className="text-[10px] text-[var(--color-muted)] font-mono">admin@sbydev.id</span>
                </div>
              </button>
            </div>
          </div>

          {/* Switch Link */}
          <div className="text-center mt-6 text-sm text-[var(--color-muted)]">
            Belum memiliki akun SurabayaDev?{" "}
            <Link href="/register" className="font-bold text-[var(--color-primary)] hover:underline">
              Daftar Akun Baru
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
