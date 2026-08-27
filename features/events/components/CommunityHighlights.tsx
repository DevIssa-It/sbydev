"use client";

import React from "react";
import { Quotes, Star, CheckCircle } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/Badge";

const TESTIMONIALS = [
  {
    name: "Dimas Aditya",
    role: "Senior Backend Engineer",
    company: "Tech Startup Surabaya",
    quote:
      "SurabayaDev adalah wadah terbaik bagi engineer di Jawa Timur. Eventnya selalu berbobot, pembicaranya top-tier, dan proses registrasi tiketnya sangat mulus!",
  },
  {
    name: "Aulia Rahma",
    role: "Frontend Developer",
    company: "Digital Agency",
    quote:
      "Sangat terbantu dengan workshop intensif yang diadakan. Fitur tiket digital memudahkan check-in tanpa perlu repot mencetak bukti pendaftaran.",
  },
  {
    name: "Rizky Pratama",
    role: "Cloud & DevOps Enthusiast",
    company: "Enterprise IT Solutions",
    quote:
      "Komunitasnya sangat suportif dan aktif berdiskusi. Manajemen kuotanya transparan dan adil, menjamin kepastian hadir di setiap sesi konferensi.",
  },
];

export function CommunityHighlights(): React.JSX.Element {
  return (
    <section id="community" className="mb-16 scroll-mt-24 text-left">
      <div className="text-left w-full mb-8">
        <div className="inline-flex mb-2">
          <Badge variant="tag">SUARA KOMUNITAS</Badge>
        </div>
        <h2 className="text-display text-2xl sm:text-3xl text-[var(--color-ink)] mb-2.5 font-bold">
          Apa Kata Para Developer
        </h2>
        <p className="text-body-sm text-[var(--color-muted)] text-sm sm:text-base leading-relaxed text-left">
          Pengalaman nyata para praktisi dan antusias teknologi yang telah menjadi bagian dari ekosistem SurabayaDev.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {TESTIMONIALS.map((t, idx) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.1 }}
            className="card p-7 sm:p-8 flex flex-col justify-between hover:shadow-sm transition-shadow text-left"
          >
            <div className="text-left">
              {/* Star Rating & Quotes Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-[#f59e0b]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} weight="fill" />
                  ))}
                </div>
                <Quotes size={24} className="text-[var(--color-primary)] opacity-40" weight="fill" />
              </div>

              <p className="text-body-sm text-[var(--color-ink)] leading-relaxed italic mb-6 text-left">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-[var(--color-navy)] text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                {t.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1 text-left">
                  <span className="text-sm font-bold text-[var(--color-ink)]">{t.name}</span>
                  <CheckCircle size={14} color="var(--color-primary)" weight="fill" />
                </div>
                <span className="text-xs text-[var(--color-muted)] text-left">{t.role} • {t.company}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
