import Link from "next/link";
import { Heart } from "@phosphor-icons/react/dist/ssr";
import { BrandLogo } from "./BrandLogo";

export function Footer(): JSX.Element {
  return (
    <footer className="border-t border-[var(--color-hairline)] bg-[var(--color-canvas)] mt-auto py-12 text-left">
      <div className="container-app">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-left">
          {/* Col 1: Brand Info */}
          <div className="flex flex-col gap-3 text-left">
            <BrandLogo subtitle="Tech Community Platform" />
            <p className="text-sm text-[var(--color-muted)] leading-relaxed text-left w-full">
              Platform ekosistem event, workshop, dan konferensi teknologi terdepan untuk menghubungkan ribuan developer.
            </p>
          </div>

          {/* Col 2: Fast Navigation */}
          <div className="text-left">
            <h4 className="text-xs font-bold text-[var(--color-ink)] mb-3.5 uppercase tracking-wider text-left">
              Navigasi Cepat
            </h4>
            <div className="flex flex-col gap-2 text-sm text-left">
              <Link href="/" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] no-underline transition-colors text-left">
                Katalog Event Publik
              </Link>
              <Link href="/tickets" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] no-underline transition-colors text-left">
                Tiket & Jadwal Saya
              </Link>
              <Link href="/admin" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] no-underline transition-colors text-left">
                Konsol Manajemen Admin
              </Link>
            </div>
          </div>

          {/* Col 3: Tech Stack */}
          <div className="text-left">
            <h4 className="text-xs font-bold text-[var(--color-ink)] mb-3.5 uppercase tracking-wider text-left">
              Arsitektur Sistem
            </h4>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed text-left">
              Dibangun dengan arsitektur Next.js App Router, Prisma ORM, NextAuth, Tailwind CSS v4, serta Solid Coursera Design System tokens.
            </p>
          </div>
        </div>

        <div className="h-[1px] bg-[var(--color-hairline)] mb-6" />

        <div className="flex justify-between items-center flex-wrap gap-3 text-xs text-[var(--color-muted)] text-left">
          <div className="flex items-center gap-1.5 text-left">
            <span>&copy; {new Date().getFullYear()} DevSphere Platform. Dikembangkan dengan</span>
            <Heart size={14} color="#dc2626" weight="fill" />
            <span>untuk ekosistem developer.</span>
          </div>
          <div className="text-xs text-[var(--color-muted)]">
            <span>Versi Produksi 2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
