"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";

interface LogoutModalProps {
  isOpen: boolean;
  isLoggingOut: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({
  isOpen,
  isLoggingOut,
  onClose,
  onConfirm,
}: LogoutModalProps): React.JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col items-center text-center p-4">
        <h3 className="text-2xl font-bold text-[var(--color-ink)] mb-2 text-center">
          Apakah kamu yakin?
        </h3>
        <p className="text-base text-[var(--color-muted)] mb-6 text-center leading-relaxed w-full">
          Kamu akan logout dari akun ini, klik kembali jika tidak ingin logout.
        </p>

        <div className="flex flex-col w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 w-full rounded-[10px] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-canvas)] font-semibold text-base transition-all shadow-sm cursor-pointer"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="h-12 w-full rounded-[10px] bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-ink)] hover:bg-red-50 hover:border-red-500 hover:text-red-600 font-semibold text-base transition-all cursor-pointer"
          >
            {isLoggingOut ? "Memproses Logout..." : "Logout"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
