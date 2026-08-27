"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { CalendarBlank, MapPin, ArrowRight, ShieldCheck, UsersThree } from "@phosphor-icons/react";
import type { EventType } from "../validations";
import { formatDateShort, getRemainingQuota } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { EventQuotaIndicator } from "./EventQuotaIndicator";

interface EventCardProps {
  event: EventType;
}

export function EventCard({ event }: EventCardProps): React.JSX.Element {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const remaining = getRemainingQuota(event.registered, event.quota);
  const isFull = remaining <= 0;

  return (
    <article className="card flex flex-col h-full overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md border border-[var(--color-hairline)] bg-[var(--color-canvas)]">
      {/* Thumbnail */}
      <div className="relative w-full h-48 bg-[var(--color-surface)] flex-shrink-0 overflow-hidden">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--color-navy)] text-[var(--color-canvas)] font-bold text-lg p-4 text-center">
            {event.category}
          </div>
        )}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <Badge variant="tag">{event.category}</Badge>
          {isAdmin && <Badge variant="neutral">PANITIA</Badge>}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[var(--color-ink)] mb-2 line-clamp-2 leading-snug min-h-[44px]">
            {event.title}
          </h3>

          <p className="text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed min-h-[36px] font-normal">
            {event.description}
          </p>
        </div>

        {/* Event Schedule & Location Metadata */}
        <div className="flex flex-col gap-2 pt-3 border-t border-[var(--color-hairline)]">
          <div className="flex items-center gap-2 text-xs text-[var(--color-ink)] font-medium">
            <CalendarBlank size={15} color="var(--color-primary)" className="flex-shrink-0" />
            <span className="truncate">{formatDateShort(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
            <MapPin size={15} color="var(--color-primary)" className="flex-shrink-0" />
            <span className="truncate" title={event.location}>{event.location}</span>
          </div>

          {/* Quota Progress Bar Indicator */}
          <div className="mt-1">
            <EventQuotaIndicator registered={event.registered} quota={event.quota} />
          </div>
        </div>

        {/* Action Button: Role-Aware (Admin vs Regular User) */}
        {isAdmin ? (
          <Link
            href={`/admin/events/${event.id}/attendees`}
            className="w-full h-10 rounded-lg font-bold text-xs inline-flex items-center justify-center gap-2 no-underline transition-colors btn-primary shadow-xs bg-[var(--color-navy)] hover:bg-[var(--color-primary)]"
          >
            <UsersThree size={16} weight="bold" />
            <span>Kelola Peserta ({event.registered})</span>
            <ArrowRight size={14} weight="bold" className="flex-shrink-0" />
          </Link>
        ) : (
          <Link
            href={`/events/${event.id}`}
            className={`w-full h-10 rounded-lg font-semibold text-xs inline-flex items-center justify-center gap-2 no-underline transition-colors ${
              isFull
                ? "btn-secondary text-[var(--color-muted)]"
                : "btn-primary shadow-xs"
            }`}
          >
            <span>{isFull ? "Lihat Informasi Event" : "Daftar Event Sekarang"}</span>
            <ArrowRight size={14} weight="bold" className="flex-shrink-0" />
          </Link>
        )}
      </div>
    </article>
  );
}
