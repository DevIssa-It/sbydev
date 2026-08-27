"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkle, ArrowRight, CheckCircle, UsersThree, CalendarCheck, ShieldCheck,
  Lightning, MapPin
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/Badge";

export function EventHero(): React.JSX.Element {
  return (
    <section className="mb-14 mt-4">
      {/* 1. Main Hero Card with Solid Navy Background & Semi-transparent Photo Overlay */}
      <div className="relative rounded-2xl overflow-hidden border border-[var(--color-hairline)] bg-[var(--color-navy)] text-white shadow-sm">
        {/* Real photo background with solid navy dark tint (NO multi-color gradient) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80"
            alt="SurabayaDev Community Conference"
            fill
            priority
            className="object-cover object-center opacity-15"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 p-8 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Hero Copywriting (7 Cols) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="lg:col-span-7 flex flex-col justify-center"
            >
              {/* Top Eyebrow Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold mb-4 text-[#b0e5fb] border border-white/20 w-fit">
                <Sparkle size={14} weight="fill" />
                <span>Komunitas Developer Surabaya</span>
              </div>

              {/* Main Headline (Solid Clean White Text) */}
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-white leading-tight tracking-tight mb-4">
                Akselerasi Skill & Jaringan di SurabayaDev
              </h1>

              {/* Subtitle */}
              <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-7 w-full font-normal">
                Ikuti konferensi teknologi, workshop intensif, meetup bulanan, dan hackathon bergengsi. Dapatkan tiket digital instan dengan validasi QR code otomatis.
              </p>

              {/* Dual Action CTAs */}
              <div className="flex items-center gap-3.5 flex-wrap mb-8">
                <Link
                  href="#daftar-event"
                  className="btn-primary h-11 px-6 text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap"
                >
                  <span>Lihat Jadwal Event</span>
                  <ArrowRight size={15} weight="bold" />
                </Link>
                <Link
                  href="/register"
                  className="btn-secondary h-11 px-5 text-sm font-semibold bg-white/10 text-white border-white/30 hover:bg-white/20 transition-colors inline-flex items-center gap-2"
                >
                  <span>Daftar Akun Gratis</span>
                </Link>
              </div>

              {/* Metric Stats Bar (Solid Navy background with white borders) */}
              <div className="pt-5 border-t border-white/20 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">3.000+</div>
                  <div className="text-xs text-white/75 mt-0.5">Software Engineer</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">50+</div>
                  <div className="text-xs text-white/75 mt-0.5">Event Komunitas</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">100%</div>
                  <div className="text-xs text-white/75 mt-0.5">Gratis & Terbuka</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Featured Spotlight Card (5 Cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="bg-white p-7 rounded-xl shadow-sm border border-[var(--color-hairline)] text-[var(--color-ink)]">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="tag">EVENT PILIHAN</Badge>
                  <div className="flex items-center gap-1 text-xs text-[var(--color-muted)] font-medium">
                    <MapPin size={14} color="var(--color-primary)" />
                    <span>Surabaya</span>
                  </div>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-[var(--color-ink)] mb-2 leading-snug">
                  SurabayaDev 12th Anniversary Conference
                </h2>

                <p className="text-xs text-[var(--color-muted)] leading-relaxed mb-4 line-clamp-2">
                  Konferensi tahunan terbesar menghadirkan 8+ tech lead industri mengenai Cloud Architecture, AI, dan Scalable Systems.
                </p>

                <div className="flex flex-col gap-2 mb-5 pt-3 border-t border-[var(--color-hairline)] text-xs text-[var(--color-ink)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={15} color="var(--color-primary)" weight="fill" className="flex-shrink-0" />
                    <span>Tiket Masuk Komunitas 100% Gratis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarCheck size={15} color="var(--color-primary)" weight="fill" className="flex-shrink-0" />
                    <span>Sertifikat Digital & Sesi Diskusi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={15} color="var(--color-primary)" weight="fill" className="flex-shrink-0" />
                    <span>Validasi Tiket Digital QR Code</span>
                  </div>
                </div>

                <Link
                  href="#daftar-event"
                  className="btn-primary w-full h-10 text-xs font-semibold justify-center no-underline"
                >
                  <span>Daftar & Kunci Slot Kuota</span>
                  <ArrowRight size={14} weight="bold" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
