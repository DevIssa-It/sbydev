import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-canvas)]">
      {/* 1 Unified Navbar across the whole application */}
      <Navbar />

      {/* Main Admin Content */}
      <main className="flex-grow container-app py-8 pb-16">
        {children}
      </main>

      {/* 1 Unified Footer */}
      <Footer />
    </div>
  );
}
