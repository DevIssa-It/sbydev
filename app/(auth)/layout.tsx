import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkle } from "@phosphor-icons/react/dist/ssr";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-canvas)]">
      {/* Auth Header */}
      <header className="border-b border-[var(--color-hairline)] bg-[var(--color-canvas)] sticky top-0 z-40">
        <div className="container-app flex justify-between items-center h-16">
          <Link
            href="/"
            className="font-bold text-xl text-[var(--color-primary)] no-underline tracking-tight inline-flex items-center gap-1.5"
          >
            <Sparkle size={20} weight="fill" />
            <span>SurabayaDev</span>
          </Link>
          <Link href="/" className="btn-ghost inline-flex items-center gap-1.5 text-sm">
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-10 px-4">
        {children}
      </main>

      {/* Auth Footer */}
      <footer className="border-t border-[var(--color-hairline)] py-6 text-center text-xs text-[var(--color-muted)]">
        <div className="container-app">
          &copy; {new Date().getFullYear()} SurabayaDev. All rights reserved. Platform Komunitas Developer Surabaya.
        </div>
      </footer>
    </div>
  );
}
