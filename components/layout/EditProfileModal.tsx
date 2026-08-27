"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { User, EnvelopeSimple, PhoneCall, Briefcase, CheckCircle } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentEmail: string;
  currentRole: string;
  currentPhone: string;
  onProfileUpdated?: (updated: { name: string; role: string; phone: string }) => void;
}

export function EditProfileModal({
  isOpen,
  onClose,
  currentName,
  currentEmail,
  currentRole,
  currentPhone,
  onProfileUpdated,
}: EditProfileModalProps): React.JSX.Element {
  const router = useRouter();
  const [name, setName] = useState(currentName);
  const [roleTitle, setRoleTitle] = useState(currentRole);
  const [phone, setPhone] = useState(currentPhone);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Nama tidak boleh kosong");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memperbarui profil");
      }

      setIsSuccess(true);
      if (onProfileUpdated) {
        onProfileUpdated({
          name: name.trim(),
          role: roleTitle.trim() || currentRole,
          phone: phone.trim() || currentPhone,
        });
      }

      // Save custom fields locally for persistence
      localStorage.setItem("sbydev_profile_role", roleTitle.trim());
      localStorage.setItem("sbydev_profile_phone", phone.trim());

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="p-6 text-left">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-hairline)] text-left">
          <div>
            <h3 className="text-xl font-bold text-[var(--color-ink)] m-0 text-left">
              Edit Informasi Profil
            </h3>
            <p className="text-xs text-[var(--color-muted)] mt-1 m-0 text-left">
              Perbarui identitas akun dan informasi kontak Anda di komunitas.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg text-left">
            {errorMsg}
          </div>
        )}

        {isSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2 text-left">
            <CheckCircle size={16} weight="fill" color="var(--color-primary)" />
            <span>Profil berhasil diperbarui!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* 1. Nama Lengkap */}
          <div className="text-left">
            <label className="block text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1.5 text-left">
              Nama Lengkap
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                required
                className="input with-icon-left"
              />
            </div>
          </div>

          {/* 2. Email (Read-Only) */}
          <div className="text-left">
            <label className="block text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1.5 text-left">
              Alamat Email (Akun Terverifikasi)
            </label>
            <div className="relative">
              <EnvelopeSimple size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type="email"
                value={currentEmail}
                disabled
                className="input with-icon-left bg-slate-100/70 text-slate-500 cursor-not-allowed opacity-80"
              />
            </div>
          </div>

          {/* 3. Role / Headline Title */}
          <div className="text-left">
            <label className="block text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1.5 text-left">
              Peran / Keahlian
            </label>
            <div className="relative">
              <Briefcase size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="Contoh: Fullstack Developer / UI Designer"
                className="input with-icon-left"
              />
            </div>
          </div>

          {/* 4. Nomor Telepon / Kontak */}
          <div className="text-left">
            <label className="block text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider mb-1.5 text-left">
              Nomor WhatsApp / Telepon
            </label>
            <div className="relative">
              <PhoneCall size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: +62 812-3456-7890"
                className="input with-icon-left"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-hairline)] mt-6 text-left">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary h-11 px-5 rounded-[10px] text-sm font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary h-11 px-6 rounded-[10px] text-sm font-semibold inline-flex items-center gap-2"
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
