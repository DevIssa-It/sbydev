import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

// Source Sans Pro via next/font (sesuai DESIGN.md — satu typeface)
const sourceSansPro = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SurabayaDev Events — Platform Event & Komunitas Developer",
    template: "%s | SurabayaDev Events",
  },
  description:
    "Platform registrasi dan manajemen event komunitas developer Surabaya. Temukan workshop, meetup, hackathon, dan tech conference terbaik di Surabaya & Jawa Timur.",
  keywords: ["developer", "surabayadev", "surabayadev events", "event", "workshop", "meetup", "teknologi", "conference"],
  openGraph: {
    title: "SurabayaDev Events — Platform Event & Komunitas Developer",
    description: "Temukan dan daftarkan diri ke event developer terbaik di SurabayaDev Events.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={sourceSansPro.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
