"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Lock, Envelope, User, ArrowRight, Eye, EyeSlash,
  Sparkle, CheckCircle, Ticket, CalendarCheck, UsersThree
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useRegisterForm } from "../hooks/useAuthForm";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";

export function RegisterForm(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const {
    name, setName, email, setEmail, password, setPassword,
    confirmPassword, setConfirmPassword, isLoading, error, handleSubmit,
  } = useRegisterForm();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-5xl mx-auto my-4"
    >
      <div className="card overflow-hidden shadow-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] rounded-2xl grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Community Showcase Panel (5 Cols) */}
        <div className="lg:col-span-5 callout-navy p-8 sm:p-10 flex flex-col justify-between text-white relative">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold mb-6 text-[#b0e5fb] border border-white/15">
              <Sparkle size={14} weight="fill" />
              <span>Gabung SurabayaDev</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
              Akses Komunitas Developer Terbesar di Jawa Timur
            </h2>

            <p className="text-white/80 text-sm leading-relaxed mb-8">
              Buat akun gratis Anda untuk mendaftar ke konferensi tahunan, workshop praktis, dan meetup networking.
            </p>

            <div className="flex flex-col gap-3.5 text-xs sm:text-sm text-white/90">
              <div className="flex items-start gap-2.5">
                <CheckCircle size={18} color="#86efac" weight="fill" className="flex-shrink-0 mt-0.5" />
                <span>100% Gratis akses ke seluruh event reguler</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Ticket size={18} color="#93c5fd" weight="fill" className="flex-shrink-0 mt-0.5" />
                <span>Tiket digital instan dengan QR code validasi</span>
              </div>
              <div className="flex items-start gap-2.5">
                <UsersThree size={18} color="#fed7aa" weight="fill" className="flex-shrink-0 mt-0.5" />
                <span>Terhubung langsung dengan 3.000+ developer</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15">
            <div className="text-xs text-[#b0e5fb] font-semibold mb-1">
              Keamanan Akun Terproteksi
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Kata sandi dienkripsi dengan standar keamanan industri bcrypt.
            </p>
          </div>
        </div>

        {/* Right Column: Register Form (7 Cols) */}
        <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-[var(--color-canvas)]">
          <div className="mb-6">
            <div className="inline-flex mb-2">
              <Badge variant="tag">PENDAFTARAN AKUN</Badge>
            </div>
            <h1 className="text-display text-2xl sm:text-3xl text-[var(--color-ink)] mb-1.5 font-bold">
              Buat Akun Baru
            </h1>
            <p className="text-body-sm text-[var(--color-muted)] text-sm leading-relaxed">
              Lengkapi formulir di bawah ini untuk memulai.
            </p>
          </div>

          {error && <Alert variant="error" className="mb-5">{error}</Alert>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-[var(--color-ink)] mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative w-full">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] flex items-center pointer-events-none z-10">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  className="input with-icon-left text-sm h-11"
                  style={{ paddingLeft: 44 }}
                  placeholder="Nama Lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>

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
                Password (min. 6 karakter)
              </label>
              <div className="relative w-full">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] flex items-center pointer-events-none z-10">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className="input with-icon-left text-sm h-11"
                  style={{ paddingLeft: 44, paddingRight: 44 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-[var(--color-ink)] mb-1.5">
                Konfirmasi Password
              </label>
              <div className="relative w-full">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] flex items-center pointer-events-none z-10">
                  <Lock size={18} />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className="input with-icon-left text-sm h-11"
                  style={{ paddingLeft: 44 }}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-11 text-sm font-bold mt-1 justify-center shadow-xs rounded-xl"
            >
              <span>{isLoading ? "Mendaftarkan Akun..." : "Daftar Akun Baru"}</span>
              <ArrowRight size={16} weight="bold" />
            </button>
          </form>

          <div className="text-center mt-6 pt-4 border-t border-[var(--color-hairline)] text-sm text-[var(--color-muted)]">
            Sudah memiliki akun?{" "}
            <Link href="/login" className="font-bold text-[var(--color-primary)] hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
