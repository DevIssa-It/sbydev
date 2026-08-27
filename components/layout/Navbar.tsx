"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  SignOut, List, X, IdentificationCard, EnvelopeSimple,
  PhoneCall, PencilSimple
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { Modal } from "@/components/ui/Modal";
import { BrandLogo } from "./BrandLogo";

export function Navbar(): React.JSX.Element {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = session?.user?.role === "ADMIN";
  const isAdminRoute = pathname?.startsWith("/admin");
  const isTicketsRoute = pathname?.startsWith("/tickets");

  const userName = session?.user?.name || "Member SurabayaDev";
  const userEmail = session?.user?.email || "user@sbydev.id";
  const userInitial = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Member ID formatting
  const memberCode = isAdmin ? "EMP-0001" : `EMP-${(session?.user?.id || "001").slice(-4).toUpperCase()}`;

  // CampusHub Theme logic: Solid Deep Navy on Admin routes, Solid White on Public routes
  const isDarkNav = isAdminRoute;

  // Active section scroll spy listener on home page
  useEffect(() => {
    if (pathname !== "/" || isAdminRoute) {
      return;
    }

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120; // 120px offset for sticky navbar
      const sections = [
        { id: "faq", name: "faq" },
        { id: "community", name: "community" },
        { id: "how-it-works", name: "how-it-works" },
        { id: "daftar-event", name: "daftar-event" },
      ];

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(section.name);
            return;
          }
        }
      }

      setActiveSection("home");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, isAdminRoute]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/" });
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setMobileOpen(false);
    if (pathname === "/") {
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(id);
        if (el) {
          const offsetTop = el.offsetTop - 80;
          window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
      }
    }
  };

  const navItemClass = (isActive: boolean) => `
    relative py-2 text-[16px] xl:text-[17px] font-semibold transition-all duration-200 group no-underline inline-block cursor-pointer
    ${
      isActive
        ? isDarkNav
          ? "text-white font-bold"
          : "text-[var(--color-primary)] font-bold"
        : isDarkNav
        ? "text-white/75 hover:text-white"
        : "text-[var(--color-ink)] hover:text-[var(--color-primary)]"
    }
  `;

  const indicatorClass = (isActive: boolean) => `
    absolute bottom-0 left-0 h-[3px] rounded-full transition-all duration-300
    ${
      isActive
        ? isDarkNav
          ? "w-full bg-[#38bdf8]"
          : "w-full bg-[var(--color-primary)]"
        : isDarkNav
        ? "w-0 group-hover:w-full bg-white/70"
        : "w-0 group-hover:w-full bg-[var(--color-primary)]/70"
    }
  `;

  return (
    <>
      <nav
        aria-label="Navigasi utama"
        className={`sticky top-0 z-40 transition-colors duration-200 ${
          isDarkNav
            ? "bg-[#002761] text-white border-b border-white/10"
            : "bg-white text-[var(--color-ink)] border-b border-[var(--color-hairline)]"
        }`}
      >
        <div className="container-app">
          <div className="flex items-center justify-between h-[76px] gap-6">
            {/* 1. Brand Logo */}
            <BrandLogo isDark={isDarkNav} href={isAdmin ? "/admin" : "/"} />

            {/* 2. Navigation Center with Reactive Section Highlighting */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {isAdminRoute ? (
                <>
                  <Link href="/admin" className={navItemClass(pathname === "/admin")}>
                    <span>Konsol Admin</span>
                    <span className={indicatorClass(pathname === "/admin")} />
                  </Link>

                  <Link href="/admin/events/new" className={navItemClass(pathname === "/admin/events/new")}>
                    <span>Buat Acara</span>
                    <span className={indicatorClass(pathname === "/admin/events/new")} />
                  </Link>

                  <Link href="/admin/scanner" className={navItemClass(pathname === "/admin/scanner")}>
                    <span>Scanner Check-In</span>
                    <span className={indicatorClass(pathname === "/admin/scanner")} />
                  </Link>

                  <Link href="/" className={navItemClass(false)}>
                    <span>Katalog Publik</span>
                    <span className={indicatorClass(false)} />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    onClick={() => scrollToSection("home")}
                    className={navItemClass(pathname === "/" && activeSection === "home")}
                  >
                    <span>Home</span>
                    <span className={indicatorClass(pathname === "/" && activeSection === "home")} />
                  </Link>

                  <Link
                    href="/#daftar-event"
                    onClick={() => scrollToSection("daftar-event")}
                    className={navItemClass(pathname === "/" && activeSection === "daftar-event")}
                  >
                    <span>Katalog Event</span>
                    <span className={indicatorClass(pathname === "/" && activeSection === "daftar-event")} />
                  </Link>

                  <Link
                    href="/#how-it-works"
                    onClick={() => scrollToSection("how-it-works")}
                    className={navItemClass(pathname === "/" && activeSection === "how-it-works")}
                  >
                    <span>Cara Kerja</span>
                    <span className={indicatorClass(pathname === "/" && activeSection === "how-it-works")} />
                  </Link>

                  <Link
                    href="/#community"
                    onClick={() => scrollToSection("community")}
                    className={navItemClass(pathname === "/" && activeSection === "community")}
                  >
                    <span>Komunitas</span>
                    <span className={indicatorClass(pathname === "/" && activeSection === "community")} />
                  </Link>

                  <Link
                    href="/#faq"
                    onClick={() => scrollToSection("faq")}
                    className={navItemClass(pathname === "/" && activeSection === "faq")}
                  >
                    <span>FAQ</span>
                    <span className={indicatorClass(pathname === "/" && activeSection === "faq")} />
                  </Link>

                  {session && (
                    <Link
                      href="/tickets"
                      className={navItemClass(isTicketsRoute)}
                    >
                      <span>Tiket Saya</span>
                      <span className={indicatorClass(isTicketsRoute)} />
                    </Link>
                  )}

                  {isAdmin && (
                    <Link href="/admin" className={navItemClass(false)}>
                      <span>Panel Admin</span>
                      <span className={indicatorClass(false)} />
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* 3. Right Side Account Profile Section with Wide Dropdown */}
            <div className="hidden md:flex items-center gap-4">
              {session ? (
                <div className="relative" ref={dropdownRef}>
                  {/* Avatar Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    title={`Profil ${userName}`}
                    aria-label="Buka Menu Akun"
                    className={`w-11 h-11 rounded-full font-bold text-base flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 shadow-sm ring-2 ${
                      isDarkNav
                        ? "bg-white text-[#002761] ring-white/40 hover:ring-white"
                        : "bg-[#002761] text-white ring-[var(--color-primary)]/25 hover:ring-[var(--color-primary)]"
                    }`}
                  >
                    {userInitial}
                  </button>

                  {/* Wide Profile Dropdown Card */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 10 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-[420px] sm:w-[450px] bg-[#002761] text-white rounded-2xl shadow-2xl p-6 z-50 text-left border border-white/15 overflow-hidden"
                      >
                        {/* Top Header Row */}
                        <div className="flex items-center justify-between gap-4 mb-4 text-left">
                          <div className="flex items-center gap-3.5 text-left">
                            <div className="w-14 h-14 rounded-full bg-[#93c5fd] text-[#002761] font-bold text-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                              {userInitial.slice(0, 1)}
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="font-extrabold text-lg text-white tracking-wide uppercase leading-snug">
                                {userName}
                              </span>
                              <span className="text-xs text-white/80 font-medium leading-tight mt-0.5">
                                {isAdmin ? "Organizer & Admin" : "Fullstack Developer"}
                              </span>
                            </div>
                          </div>

                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/90 cursor-pointer hover:bg-white/20 transition-colors flex-shrink-0">
                            <PencilSimple size={20} weight="bold" />
                          </div>
                        </div>

                        {/* Middle Light Surface Card Container */}
                        <div className="bg-[#e8eef7] text-[var(--color-ink)] rounded-2xl p-5 flex flex-col gap-4 my-3 text-left">
                          <div className="flex items-center gap-3.5 text-left">
                            <IdentificationCard size={24} color="var(--color-primary)" weight="bold" className="flex-shrink-0" />
                            <span className="font-mono text-sm font-extrabold text-[var(--color-ink)] tracking-wider">
                              {memberCode}
                            </span>
                          </div>

                          <div className="flex items-center gap-3.5 text-left">
                            <EnvelopeSimple size={24} color="var(--color-primary)" weight="bold" className="flex-shrink-0" />
                            <span className="text-sm font-medium text-[var(--color-ink)] truncate">
                              {userEmail}
                            </span>
                          </div>

                          <div className="flex items-center gap-3.5 text-left">
                            <PhoneCall size={24} color="var(--color-primary)" weight="bold" className="flex-shrink-0" />
                            <span className="text-sm font-medium text-[var(--color-ink)]">
                              +62 8248430
                            </span>
                          </div>
                        </div>

                        {/* Bottom Logout Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            setShowLogoutModal(true);
                          }}
                          className="w-full flex items-center gap-3 pt-3 pb-1 text-white hover:text-red-300 font-bold text-base transition-colors bg-transparent border-0 cursor-pointer text-left"
                        >
                          <SignOut size={22} weight="bold" />
                          <span>Log Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="h-11 px-6 text-base font-semibold rounded-[10px] bg-[#0056d2] hover:bg-[#0048b0] text-white inline-flex items-center justify-center no-underline transition-all hover:scale-105 shadow-sm"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className={`h-11 px-6 text-base font-semibold rounded-[10px] border-2 inline-flex items-center justify-center no-underline transition-all hover:scale-105 ${
                      isDarkNav
                        ? "border-white/80 text-white hover:bg-white/10"
                        : "border-[#0056d2] text-[#0056d2] hover:bg-[#e8eef7]"
                    }`}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-lg border cursor-pointer flex items-center justify-center ${
                isDarkNav
                  ? "bg-white/10 text-white border-white/20"
                  : "bg-[var(--color-surface)] text-[var(--color-ink)] border-[var(--color-hairline)]"
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`lg:hidden border-t px-5 py-4 overflow-hidden text-left ${
                isDarkNav ? "bg-[#002761] border-white/10 text-white" : "bg-white border-[var(--color-hairline)]"
              }`}
            >
              <div className="flex flex-col space-y-3 text-left">
                {isAdminRoute ? (
                  <>
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="text-base font-semibold text-white no-underline py-1"
                    >
                      Konsol Admin
                    </Link>
                    <Link
                      href="/admin/events/new"
                      onClick={() => setMobileOpen(false)}
                      className="text-base font-semibold text-white/80 hover:text-white no-underline py-1"
                    >
                      Buat Acara
                    </Link>
                    <Link
                      href="/admin/scanner"
                      onClick={() => setMobileOpen(false)}
                      className="text-base font-semibold text-white/80 hover:text-white no-underline py-1"
                    >
                      Scanner Check-In
                    </Link>
                    <Link
                      href="/"
                      onClick={() => setMobileOpen(false)}
                      className="text-sm text-white/60 hover:text-white no-underline py-1"
                    >
                      Katalog Publik
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/"
                      onClick={() => scrollToSection("home")}
                      className="text-base font-semibold text-[var(--color-ink)] no-underline py-1"
                    >
                      Home
                    </Link>
                    <Link
                      href="/#daftar-event"
                      onClick={() => scrollToSection("daftar-event")}
                      className="text-base font-semibold text-[var(--color-ink)] no-underline py-1"
                    >
                      Katalog Event
                    </Link>
                    <Link
                      href="/#how-it-works"
                      onClick={() => scrollToSection("how-it-works")}
                      className="text-base font-semibold text-[var(--color-ink)] no-underline py-1"
                    >
                      Cara Kerja
                    </Link>
                    <Link
                      href="/#community"
                      onClick={() => scrollToSection("community")}
                      className="text-base font-semibold text-[var(--color-ink)] no-underline py-1"
                    >
                      Komunitas
                    </Link>
                    <Link
                      href="/#faq"
                      onClick={() => scrollToSection("faq")}
                      className="text-base font-semibold text-[var(--color-ink)] no-underline py-1"
                    >
                      FAQ
                    </Link>
                    {session && (
                      <Link
                        href="/tickets"
                        onClick={() => setMobileOpen(false)}
                        className="text-base font-semibold text-[var(--color-ink)] no-underline py-1"
                      >
                        Tiket Saya
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="text-base font-semibold text-[var(--color-primary)] no-underline py-1"
                      >
                        Panel Admin
                      </Link>
                    )}
                  </>
                )}

                {/* Mobile Profile Actions */}
                <div className={`pt-3 mt-2 border-t ${isDarkNav ? "border-white/10" : "border-[var(--color-hairline)]"}`}>
                  {session ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-left">
                        <div className={`w-10 h-10 rounded-full text-sm font-bold flex items-center justify-center ${isDarkNav ? "bg-white text-[#002761]" : "bg-[#002761] text-white"}`}>
                          {userInitial}
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold">{session.user?.name}</div>
                          <div className={`text-xs uppercase font-semibold ${isDarkNav ? "text-[#93c5fd]" : "text-[var(--color-primary)]"}`}>
                            {isAdmin ? "Admin Panitia" : "Member Peserta"}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => { setShowLogoutModal(true); setMobileOpen(false); }}
                        className="btn-secondary h-9 px-3 text-xs text-[#d30a28]"
                      >
                        <SignOut size={15} />
                        <span>Keluar</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/login"
                        className="btn-primary text-center justify-center text-sm font-bold h-10 rounded-[10px]"
                        onClick={() => setMobileOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="btn-secondary text-center justify-center text-sm font-bold h-10 rounded-[10px]"
                        onClick={() => setMobileOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* CampusHub PopUpLogOut Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        maxWidth="sm"
      >
        <div className="flex flex-col items-center text-center p-4">
          <h3 className="text-2xl font-bold text-[var(--color-ink)] mb-2 text-center">
            Apakah kamu yakin?
          </h3>
          <p className="text-base text-[var(--color-muted)] mb-6 text-center leading-relaxed w-full">
            Kamu akan logout dari akun ini, klik kembali jika tidak ingin logout.
          </p>

          <div className="flex flex-col w-full gap-3">
            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="h-12 w-full rounded-[10px] bg-[#0056d2] hover:bg-[#0048b0] text-white font-semibold text-base transition-all shadow-sm cursor-pointer"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="h-12 w-full rounded-[10px] bg-transparent border-2 border-[#0056d2] text-[var(--color-ink)] hover:bg-red-50 hover:border-red-500 hover:text-red-600 font-semibold text-base transition-all cursor-pointer"
            >
              {isLoggingOut ? "Memproses Logout..." : "Logout"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
