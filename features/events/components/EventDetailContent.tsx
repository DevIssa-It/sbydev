"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarBlank, MapPin, ArrowLeft, Clock } from "@phosphor-icons/react";
import { useEventDetail } from "../hooks/useEventDetail";
import { useEventRegistration } from "../hooks/useEventRegistration";
import { EventRegistrationCard } from "./EventRegistrationCard";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { formatDate, formatTime } from "@/lib/utils";

interface EventDetailContentProps {
  eventId: string;
}

export function EventDetailContent({ eventId }: EventDetailContentProps): React.JSX.Element {
  const { event, isLoading, error } = useEventDetail(eventId);
  const { register, isLoading: isRegistering, error: registerError } = useEventRegistration(eventId);

  if (isLoading) {
    return (
      <div className="w-full py-8">
        <div className="skeleton h-6 w-32 mb-6" />
        <div className="skeleton h-96 w-full rounded-2xl mb-8" />
        <div className="skeleton h-9 w-4/5 mb-4" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center">
        <Alert variant="error" title={error || "Event Tidak Ditemukan"} className="mb-6">
          Event yang kamu cari mungkin telah dihapus atau link tidak sesuai.
        </Alert>
        <Link href="/" className="btn-primary">
          Kembali ke Daftar Event
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full py-6 pb-16">
      <Link href="/" className="btn-ghost mb-6 inline-flex items-center gap-1.5">
        <ArrowLeft size={16} />
        <span>Kembali ke Semua Event</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image & Details (takes 2 cols on lg) */}
        <div className="lg:col-span-2">
          <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden mb-6 bg-[var(--color-surface)] border border-[var(--color-hairline)]">
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[var(--color-navy)] text-[var(--color-canvas)] text-2xl font-semibold">
                {event.category}
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge variant="tag">{event.category}</Badge>
            </div>
          </div>

          <h1 className="text-display text-[var(--color-ink)] mb-4">{event.title}</h1>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-[var(--color-muted)]">
            <div className="flex items-center gap-1.5">
              <CalendarBlank size={16} color="var(--color-primary)" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} color="var(--color-primary)" />
              <span>{formatTime(event.date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={16} color="var(--color-primary)" />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="divider mb-6" />

          <div>
            <h2 className="text-heading text-[var(--color-ink)] mb-3">Tentang Event</h2>
            <div className="text-body text-[var(--color-ink)] whitespace-pre-line leading-relaxed">
              {event.description}
            </div>
          </div>
        </div>

        {/* Right Column: Registration Box (takes 1 col on lg) */}
        <div className="lg:col-span-1">
          <EventRegistrationCard
            eventId={event.id}
            eventTitle={event.title}
            eventDate={event.date}
            eventLocation={event.location}
            registered={event.registered}
            quota={event.quota}
            isRegistering={isRegistering}
            registerError={registerError}
            onRegister={register}
          />
        </div>
      </div>
    </div>
  );
}
