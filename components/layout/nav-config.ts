export interface NavLinkItem {
  label: string;
  href: string;
  sectionId?: string;
  adminOnly?: boolean;
  authOnly?: boolean;
}

export const USER_NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/", sectionId: "home" },
  { label: "Katalog Event", href: "/#daftar-event", sectionId: "daftar-event" },
  { label: "Cara Kerja", href: "/#how-it-works", sectionId: "how-it-works" },
  { label: "Komunitas", href: "/#community", sectionId: "community" },
  { label: "FAQ", href: "/#faq", sectionId: "faq" },
  { label: "Tiket Saya", href: "/tickets", authOnly: true },
];

export const ADMIN_NAV_LINKS: NavLinkItem[] = [
  { label: "Konsol Admin", href: "/admin" },
  { label: "Buat Acara", href: "/admin/events/new" },
  { label: "Scanner Check-In", href: "/admin/scanner" },
];
