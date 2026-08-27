"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Sparkle, CheckCircle, ShieldCheck, UsersThree, PencilSimple, CalendarBlank, MapPin, Ticket } from "@phosphor-icons/react";
import { Modal } from "@/components/ui/Modal";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getQuotaPercentage, getRemainingQuota } from "@/lib/utils";

interface EventRegistrationCardProps {
  eventId: string;
  eventTitle?: string;
  eventDate?: Date | string;
  eventLocation?: string;
  registered: number;
  quota: number;
  isRegistering: boolean;
  registerError: string | null;
  onRegister: () => void;
}

export function EventRegistrationCard({
  eventId,
  eventTitle,
  eventDate,
  eventLocation,
  registered,
  quota,
  isRegistering,
  registerError,
  onRegister,
}: EventRegistrationCardProps): React.JSX.Element {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const remaining = getRemainingQuota(registered, quota);
  const percentage = getQuotaPercentage(registered, quota);
  const isFull = remaining <= 0;

  const handleConfirmRegistration = () => {
    setShowConfirmModal(false);
    onRegister();
  };

  return (
    <>
      <div className="card p-7 sticky top-24 shadow-sm border border-[var(--color-hairline)] bg-[var(--color-canvas)] rounded-2xl text-left">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <Sparkle size={18} color="var(--color-primary)" weight="fill" />
            <span className="text-xs font-bold text-[var(--color-primary)]">
              Tiket Masuk Komunitas
            </span>
          </div>
          {isAdmin && <Badge variant="tag">PANITIA ADMIN</Badge>}
        </div>

        <div className="flex items-baseline gap-2 mb-5">
          <span className="text-3xl font-bold text-[var(--color-ink)]">100% Gratis</span>
          <span className="text-xs text-[var(--color-muted)]">/ Kuota Terbatas</span>
        </div>

        {/* Quota Progress */}
        <div className="mb-6 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-hairline)] text-left">
          <div className="flex justify-between text-xs mb-2">
            <span className="font-bold text-[var(--color-ink)]">Status Keterisian Kuota</span>
            <span className="font-bold" style={{ color: isFull ? "#d30a28" : remaining <= 10 ? "#b45309" : "#166534" }}>
              {isFull ? "Kuota Penuh" : `${remaining} Kursi Tersisa`}
            </span>
          </div>

          <ProgressBar value={percentage} height={7} className="mb-2" />

          <div className="flex justify-between text-xs text-[var(--color-muted)] font-medium">
            <span>{registered} pendaftar aktif</span>
            <span>Kapasitas {quota} kursi</span>
          </div>
        </div>

        {registerError && <Alert variant="error" className="mb-4">{registerError}</Alert>}

        {/* Role-based action */}
        {isAdmin ? (
          <div className="flex flex-col gap-2.5 mb-2 text-left">
            <div className="p-3.5 bg-[var(--color-surface)]/70 rounded-xl border border-[var(--color-hairline)] text-xs text-[var(--color-muted)] mb-1 text-left">
              <div className="font-bold text-[var(--color-ink)] mb-1 flex items-center gap-1.5">
                <ShieldCheck size={16} color="var(--color-primary)" weight="bold" />
                <span>Mode Pengelola Event</span>
              </div>
              <span>Anda login sebagai Admin. Anda bertindak sebagai penyelenggara acara untuk mengelola peserta dan jadwal.</span>
            </div>

            <Link
              href={`/admin/events/${eventId}/attendees`}
              className="btn-primary w-full h-11 text-xs font-bold justify-center no-underline gap-1.5 rounded-xl shadow-xs"
            >
              <UsersThree size={16} weight="bold" />
              <span>Lihat Data Peserta ({registered})</span>
            </Link>

            <Link
              href={`/admin/events/${eventId}`}
              className="btn-secondary w-full h-10 text-xs font-bold justify-center no-underline gap-1.5 rounded-xl"
            >
              <PencilSimple size={15} />
              <span>Edit Informasi Event</span>
            </Link>
          </div>
        ) : (
          <>
            <button
              onClick={() => {
                if (!session) {
                  onRegister();
                } else {
                  setShowConfirmModal(true);
                }
              }}
              disabled={isRegistering || isFull}
              className="btn-primary w-full h-11 text-sm font-bold mb-4 rounded-xl shadow-xs justify-center"
            >
              {isRegistering ? (
                <span>Memproses Pendaftaran...</span>
              ) : isFull ? (
                <span>Kuota Penuh (Pendaftaran Ditutup)</span>
              ) : (
                <>
                  <CheckCircle size={18} weight="bold" />
                  <span>Daftar Sekarang (Kunci Slot)</span>
                </>
              )}
            </button>

            <p className="text-xs text-[var(--color-muted)] text-left leading-relaxed">
              Tiket digital resmi dengan QR code unik akan otomatis dibuat dan tersimpan di menu &quot;Tiket Saya&quot; Anda.
            </p>
          </>
        )}
      </div>

      {/* Registration Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Konfirmasi Pendaftaran Event"
        description="Pastikan jadwal Anda sesuai sebelum mengonfirmasi pendaftaran tiket."
        maxWidth="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="btn-secondary h-10 px-4 text-xs font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmRegistration}
              className="btn-primary h-10 px-5 text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1.5"
            >
              <Ticket size={16} weight="bold" />
              <span>Konfirmasi & Dapatkan Tiket QR</span>
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4 text-left">
          <div className="p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-hairline)] text-left">
            <h4 className="text-sm font-bold text-[var(--color-ink)] mb-2 text-left">
              {eventTitle || "Event SurabayaDev"}
            </h4>
            <div className="flex flex-col gap-1.5 text-xs text-[var(--color-muted)] text-left">
              <span className="text-[var(--color-ink)] font-semibold">
                Nama Pendaftar: {session?.user?.name} ({session?.user?.email})
              </span>
              <span>Tiket bersifat gratis dan kuota kursi Anda akan langsung dikunci.</span>
            </div>
          </div>

          <div className="text-xs text-[var(--color-muted)] leading-relaxed text-left">
            Dengan mengonfirmasi pendaftaran, tiket digital resmi akan diterbitkan dengan kode QR unik untuk keperluan check-in di pintu masuk acara.
          </div>
        </div>
      </Modal>
    </>
  );
}
