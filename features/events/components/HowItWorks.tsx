"use client";

import React from "react";
import { MagnifyingGlass, Ticket, QrCode, ArrowRight } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/Badge";

const STEPS = [
  {
    number: "01",
    icon: MagnifyingGlass,
    title: "Pilih Event Impian",
    description: "Jelajahi beragam topik mulai dari AI, Cloud, Mobile, Web Development, hingga Cyber Security sesuai minat Anda.",
  },
  {
    number: "02",
    icon: Ticket,
    title: "Daftar Instan & Kunci Kuota",
    description: "Klik daftar dalam satu sentuhan. Sistem otomatis mengunci slot kuota kursi Anda secara atomic dan adil.",
  },
  {
    number: "03",
    icon: QrCode,
    title: "Tunjukkan QR & Check-In",
    description: "Buka tiket digital di smartphone Anda saat tiba di venue. Panitia akan memindai QR code dalam hitungan detik.",
  },
];

export function HowItWorks(): React.JSX.Element {
  return (
    <section id="how-it-works" className="mb-16 mt-8 scroll-mt-24 text-left">
      <div className="text-left w-full mb-8">
        <div className="inline-flex mb-2">
          <Badge variant="tag">ALUR PENDAFTARAN</Badge>
        </div>
        <h2 className="text-display text-2xl sm:text-3xl text-[var(--color-ink)] mb-2.5 font-bold">
          Cara Mengikuti Event di SurabayaDev
        </h2>
        <p className="text-body-sm text-[var(--color-muted)] text-sm sm:text-base leading-relaxed text-left">
          Tiga langkah mudah untuk bergabung dalam ekosistem teknologi Surabaya dan mengembangkan karier Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.1 }}
              className="card p-7 sm:p-8 flex flex-col justify-between relative group hover:border-[var(--color-primary)] transition-colors duration-200 text-left"
            >
              <div className="text-left">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-surface)] text-[var(--color-primary)] flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-200">
                    <Icon size={24} weight="bold" />
                  </div>
                  <span className="text-2xl font-mono font-bold text-[var(--color-muted)]/40 group-hover:text-[var(--color-primary)]/40 transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-heading-sm text-lg font-bold text-[var(--color-ink)] mb-2.5 text-left">
                  {step.title}
                </h3>
                <p className="text-body-sm text-[var(--color-muted)] leading-relaxed text-left">
                  {step.description}
                </p>
              </div>

              {idx < 2 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[var(--color-hairline)]">
                  <ArrowRight size={20} weight="bold" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
