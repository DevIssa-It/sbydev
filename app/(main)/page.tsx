import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  EventHero,
  EventList,
  HowItWorks,
  CommunityHighlights,
  FAQAccordion,
} from "@/features/events";

export default async function HomePage(): Promise<React.JSX.Element> {
  const session = await auth();

  // Admin diarahkan langsung ke Dashboard Organizer khusus Admin
  if (session?.user?.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="w-full pb-12">
      {/* 1. Hero Showcase untuk Peserta / Publik */}
      <EventHero />

      {/* 2. Main Event Catalog & Filter */}
      <EventList />

      {/* 3. Section Khusus Calon Peserta */}
      <HowItWorks />
      <CommunityHighlights />
      <FAQAccordion />
    </div>
  );
}
