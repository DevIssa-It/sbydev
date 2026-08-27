"use client";

import React, { useState } from "react";
import { CaretDown, Question } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/Badge";

const FAQS = [
  {
    question: "Apakah seluruh event di SurabayaDev gratis untuk diikuti?",
    answer:
      "Ya! Mayoritas besar event bulanan, workshop komunitas, dan meetup teknologi di SurabayaDev bersifat 100% gratis. Beberapa workshop intensif masterclass mungkin memerlukan pendaftaran khusus dengan kuota terbatas.",
  },
  {
    question: "Bagaimana cara mendapatkan tiket digital setelah mendaftar?",
    answer:
      "Setelah Anda menekan tombol 'Daftar Sekarang' pada event yang kuotanya masih tersedia, sistem kami akan langsung membuat tiket digital unik lengkap dengan QR Code yang tersimpan rapi di halaman 'Tiket Saya'.",
  },
  {
    question: "Apa yang terjadi jika kuota event sudah habis?",
    answer:
      "Ketika kuota terisi penuh, tombol pendaftaran akan otomatis dinonaktifkan secara atomic untuk mencegah over-capacity. Anda tetap dapat membaca ringkasan agenda atau menunggu sesi berikutnya diumumkan.",
  },
  {
    question: "Bagaimana proses check-in saat hadir di lokasi acara?",
    answer:
      "Cukup buka tiket digital Anda dari menu 'Tiket Saya' di smartphone dan tunjukkan QR Code kepada panitia di meja registrasi. Panitia akan memindai kode tersebut dan kehadiran Anda langsung terverifikasi secara real-time.",
  },
  {
    question: "Bisakah saya membatalkan pendaftaran jika berhalangan hadir?",
    answer:
      "Tentu. Anda dapat membuka halaman tiket Anda dan melakukan konfirmasi pembatalan agar kuota kursi dapat dialokasikan kembali kepada developer lain yang membutuhkan.",
  },
];

export function FAQAccordion(): React.JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="mb-16 mt-12 scroll-mt-24 text-left">
      <div className="text-left w-full mb-8">
        <div className="inline-flex mb-2">
          <Badge variant="tag">PERTANYAAN UMUM</Badge>
        </div>
        <h2 className="text-display text-2xl sm:text-3xl text-[var(--color-ink)] mb-2.5 font-bold">
          Sering Ditanyakan Seputar Event
        </h2>
        <p className="text-body-sm text-[var(--color-muted)] text-sm sm:text-base leading-relaxed text-left">
          Temukan jawaban cepat mengenai pendaftaran, tiket digital, kuota acara, dan mekanisme check-in.
        </p>
      </div>

      <div className="w-full flex flex-col gap-3 text-left">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`card transition-all duration-200 overflow-hidden text-left ${
                isOpen ? "border-[var(--color-primary)] shadow-sm" : "hover:border-[var(--color-muted)]/40"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFAQ(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 bg-transparent border-0 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3 text-left">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors ${
                      isOpen
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-surface)] text-[var(--color-primary)]"
                    }`}
                  >
                    <Question size={16} weight="bold" />
                  </div>
                  <span className="text-base font-semibold text-[var(--color-ink)] leading-snug text-left">
                    {faq.question}
                  </span>
                </div>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 text-[var(--color-muted)]"
                >
                  <CaretDown size={18} weight="bold" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-[var(--color-muted)] leading-relaxed border-t border-[var(--color-hairline)]/60 text-left">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
