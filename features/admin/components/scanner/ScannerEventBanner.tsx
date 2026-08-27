"use client";

import React from "react";
import Image from "next/image";
import { CalendarBlank, MapPin, Users } from "@phosphor-icons/react";
import { formatDateShort } from "@/lib/utils";
import type { EventType } from "@/features/events/validations";

interface ScannerEventBannerProps {
  event: EventType;
}

export function ScannerEventBanner({ event }: ScannerEventBannerProps): React.JSX.Element {
  return (
    <div className="rounded-2xl p-6 sm:p-7 mb-7 bg-[var(--color-navy)] text-white shadow-md relative overflow-hidden text-left">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/10 overflow-hidden flex-shrink-0 border border-white/20">
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-xs">
                {event.category}
              </div>
            )}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--color-primary)] text-white mb-1.5">
              <span>MEJA REGISTRASI AKTIF</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-1 leading-snug">
              {event.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-white/80 flex-wrap">
              <span className="flex items-center gap-1">
                <CalendarBlank size={14} />
                {formatDateShort(event.date)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {event.location}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Badge */}
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-xl border border-white/15 flex-shrink-0">
          <Users size={20} className="text-[#86efac]" />
          <div className="text-left">
            <div className="text-xs text-white/70">Total Terdaftar</div>
            <div className="text-base font-extrabold text-white">
              {event.registered} Peserta
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
