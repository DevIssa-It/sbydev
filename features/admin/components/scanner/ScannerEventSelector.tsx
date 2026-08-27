"use client";

import React from "react";
import Image from "next/image";
import { CalendarBlank, MapPin, QrCode, CaretRight } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/Badge";
import { EventQuotaIndicator } from "@/features/events/components/EventQuotaIndicator";
import { formatDate } from "@/lib/utils";
import type { EventType } from "@/features/events/validations";

interface ScannerEventSelectorProps {
  events: EventType[];
  isLoading: boolean;
  onSelectEvent: (id: string) => void;
}

export function ScannerEventSelector({
  events,
  isLoading,
  onSelectEvent,
}: ScannerEventSelectorProps): React.JSX.Element {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-80 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="card p-12 text-center text-[var(--color-muted)]">
        <p className="text-base font-semibold">Tidak ada acara yang ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((evt) => (
        <article
          key={evt.id}
          onClick={() => onSelectEvent(evt.id)}
          className="card flex flex-col h-full overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] rounded-2xl cursor-pointer group"
        >
          {/* Thumbnail */}
          <div className="relative w-full h-44 bg-[var(--color-surface)] flex-shrink-0 overflow-hidden">
            {evt.imageUrl ? (
              <Image
                src={evt.imageUrl}
                alt={evt.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[var(--color-navy)] text-white font-bold text-lg p-4 text-center">
                {evt.category}
              </div>
            )}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
              <Badge variant="tag">{evt.category}</Badge>
            </div>
          </div>

          {/* Content Container */}
          <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-[var(--color-ink)] mb-2 line-clamp-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                {evt.title}
              </h3>
              <p className="text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed font-normal">
                {evt.description}
              </p>
            </div>

            {/* Metadata */}
            <div className="flex flex-col gap-2 pt-3 border-t border-[var(--color-hairline)]">
              <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                <CalendarBlank size={15} className="text-[var(--color-primary)] flex-shrink-0" />
                <span>{formatDate(evt.date)}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                <MapPin size={15} className="text-[var(--color-primary)] flex-shrink-0" />
                <span className="truncate">{evt.location}</span>
              </div>

              <div className="mt-1">
                <EventQuotaIndicator registered={evt.registered} quota={evt.quota} />
              </div>
            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                type="button"
                className="btn-primary w-full h-10 rounded-xl text-xs font-bold justify-center gap-2 shadow-2xs group-hover:bg-[var(--color-primary-hover)] cursor-pointer"
              >
                <QrCode size={18} weight="bold" />
                <span>Buka Meja Check-In</span>
                <CaretRight size={14} weight="bold" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
