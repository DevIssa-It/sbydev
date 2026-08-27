"use client";

import React, { useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const maxWidthValues = {
  sm: 480,
  md: 580,
  lg: 720,
  xl: 900,
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "md",
  className,
}: ModalProps): React.JSX.Element | null {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const targetWidth = maxWidthValues[maxWidth] || 580;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Dialog Card Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{
              width: "100%",
              maxWidth: `${targetWidth}px`,
              minWidth: "300px",
            }}
            className={cn(
              "relative z-10 w-full bg-white rounded-2xl border border-[var(--color-hairline)] shadow-2xl overflow-hidden text-left",
              className
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4 border-b border-[var(--color-hairline)] text-left bg-white">
              <div className="text-left pr-4">
                {title && (
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--color-ink)] leading-snug text-left">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-1.5 leading-relaxed text-left">
                    {description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)] p-2 rounded-xl bg-transparent border-0 cursor-pointer transition-colors flex-shrink-0"
                aria-label="Tutup dialog"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 text-left bg-white">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-3 p-4 sm:p-5 bg-[var(--color-surface)]/70 border-t border-[var(--color-hairline)] text-left">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
