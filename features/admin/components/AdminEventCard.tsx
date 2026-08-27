"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarBlank, MapPin, Users, PencilSimple, Trash } from "@phosphor-icons/react";
import type { EventType } from "@/features/events";
import { formatDateShort } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { EventQuotaIndicator } from "@/features/events/components/EventQuotaIndicator";

interface AdminEventCardProps {
  event: EventType;
  onDelete: (id: string) => void;
}

export function AdminEventCard({ event, onDelete }: AdminEventCardProps): React.JSX.Element {
  return (
    <article className="card flex flex-col h-full overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md border border-[var(--color-hairline)] bg-[var(--color-canvas)] rounded-2xl">
      {/* Thumbnail */}
      <div className="relative w-full h-44 bg-[var(--color-surface)] flex-shrink-0 overflow-hidden">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--color-navy)] text-white font-bold text-lg p-4 text-center">
            {event.category}
          </div>
        )}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <Badge variant="tag">{event.category}</Badge>
          <Badge variant="neutral">PANITIA</Badge>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between gap-4 text-left">
        <div className="text-left">
          <h3 className="text-base font-bold text-[var(--color-ink)] mb-2 line-clamp-2 leading-snug min-h-[44px] text-left">
            {event.title}
          </h3>

          <p className="text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed min-h-[36px] font-normal text-left">
            {event.description}
          </p>
        </div>

        {/* Schedule & Location */}
        <div className="flex flex-col gap-2 pt-3 border-t border-[var(--color-hairline)] text-left">
          <div className="flex items-center gap-2 text-xs text-[var(--color-ink)] font-medium">
            <CalendarBlank size={15} color="var(--color-primary)" className="flex-shrink-0" />
            <span className="truncate">{formatDateShort(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
            <MapPin size={15} color="var(--color-primary)" className="flex-shrink-0" />
            <span className="truncate" title={event.location}>{event.location}</span>
          </div>

          {/* Quota Progress */}
          <div className="mt-1">
            <EventQuotaIndicator registered={event.registered} quota={event.quota} />
          </div>
        </div>

        {/* Admin Action Buttons */}
        <div className="pt-3 border-t border-[var(--color-hairline)] flex items-center gap-2">
          <Link
            href={`/admin/events/${event.id}/attendees`}
            className="btn-primary flex-1 h-9 text-xs font-bold justify-center no-underline gap-1.5 rounded-xl shadow-2xs"
            title="Kelola Data Peserta"
          >
            <Users size={15} weight="bold" />
            <span>Peserta ({event.registered})</span>
          </Link>

          <Link
            href={`/admin/events/${event.id}`}
            className="btn-secondary h-9 px-3 text-xs font-bold justify-center no-underline gap-1.5 rounded-xl"
            title="Edit Detail Event"
          >
            <PencilSimple size={15} />
            <span>Edit</span>
          </Link>

          <button
            type="button"
            onClick={() => onDelete(event.id)}
            className="btn-secondary h-9 px-2.5 text-xs font-bold text-[#d30a28] hover:bg-red-50 border-red-200 justify-center rounded-xl"
            title="Hapus Event"
          >
            <Trash size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
