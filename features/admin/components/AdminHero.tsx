"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, QrCode } from "@phosphor-icons/react";

export interface AdminHeroProps {
  totalEvents?: number;
  totalAttendees?: number;
  totalCheckedIn?: number;
}

export function AdminHero({
  totalEvents,
  totalAttendees,
  totalCheckedIn,
}: AdminHeroProps = {}): React.JSX.Element {
  return (
    <section className="mb-10 text-left">
      {/* Minimalist & Clean CampusHub Vue Admin Hero with Image */}
      <div className="bg-[#0f172a] rounded-2xl px-6 sm:px-10 lg:px-12 py-10 sm:py-12 text-white shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          {/* Left Text Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white mb-4 leading-tight tracking-tight text-left">
              Buat Acara dengan Mudah, Jalin Hubungan dengan Peserta Anda!
            </h1>

            <p className="text-white/85 text-base sm:text-lg font-normal leading-relaxed mb-8 w-full text-left">
              Personalisasi acara Anda dengan gambar dan deskripsi yang menarik untuk perhatian pengunjung.
            </p>

            <div className="flex items-center gap-3.5 flex-wrap text-left">
              <Link
                href="/admin/events/new"
                className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#16a34a] hover:bg-[#15803d] text-white transition-all no-underline shadow-sm whitespace-nowrap"
              >
                <Plus size={18} weight="bold" />
                <span>Buat Sekarang</span>
              </Link>

              <Link
                href="/admin/scanner"
                className="h-11 sm:h-12 px-6 text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2 rounded-[10px] bg-white/10 hover:bg-white/20 text-white border border-white/25 transition-all no-underline whitespace-nowrap"
              >
                <QrCode size={18} />
                <span>Check-In Peserta</span>
              </Link>
            </div>
          </div>

          {/* Right Image Column (5 cols) - CampusHub Organizer Illustration */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] h-[240px] sm:h-[280px]">
              <Image
                src="/images/admin-hero.svg"
                alt="Organizer Illustration"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
