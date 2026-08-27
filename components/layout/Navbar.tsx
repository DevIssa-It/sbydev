"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { List, X } from "@phosphor-icons/react";
import { BrandLogo } from "./BrandLogo";
import { ProfileDropdown } from "./ProfileDropdown";
import { LogoutModal } from "./LogoutModal";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { USER_NAV_LINKS, ADMIN_NAV_LINKS, type NavLinkItem } from "./nav-config";
import { useNavScrollSpy } from "./useNavScrollSpy";

export function Navbar(): React.JSX.Element {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";
  const isAdminRoute = Boolean(typeof window !== "undefined" && window.location.pathname.startsWith("/admin"));

  const { activeSection, scrollToSection, pathname } = useNavScrollSpy(isAdminRoute);
  const isDarkNav = pathname?.startsWith("/admin") || false;
  const navLinks = isDarkNav ? ADMIN_NAV_LINKS : USER_NAV_LINKS;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/" });
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const isLinkActive = (item: NavLinkItem): boolean => {
    if (isDarkNav) {
      return pathname === item.href;
    }
    if (item.sectionId) {
      return pathname === "/" && activeSection === item.sectionId;
    }
    return pathname?.startsWith(item.href) || false;
  };

  return (
    <>
      <nav
        aria-label="Navigasi utama"
        className={`sticky top-0 z-40 transition-colors duration-200 ${
          isDarkNav
            ? "bg-[var(--color-navy)] text-[var(--color-canvas)] border-b border-white/10"
            : "bg-[var(--color-canvas)] text-[var(--color-ink)] border-b border-[var(--color-hairline)]"
        }`}
      >
        <div className="container-app">
          <div className="flex items-center justify-between h-[76px] gap-6">
            {/* 1. Brand Logo */}
            <BrandLogo isDark={isDarkNav} href={isAdmin ? "/admin" : "/"} />

            {/* 2. Desktop Navigation Links (DRY & SSOT via CSS variables) */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((item) => {
                if (item.adminOnly && !isAdmin) return null;
                if (item.authOnly && !session) return null;

                const active = isLinkActive(item);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => scrollToSection(item.sectionId)}
                    className={`relative py-2 text-[16px] xl:text-[17px] font-semibold transition-all duration-200 group no-underline inline-block cursor-pointer ${
                      active
                        ? isDarkNav
                          ? "text-white font-bold"
                          : "text-[var(--color-primary)] font-bold"
                        : isDarkNav
                        ? "text-white/75 hover:text-white"
                        : "text-[var(--color-ink)] hover:text-[var(--color-primary)]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`absolute bottom-0 left-0 h-[3px] rounded-full transition-all duration-300 ${
                        active
                          ? isDarkNav
                            ? "w-full bg-[var(--color-primary)]"
                            : "w-full bg-[var(--color-primary)]"
                          : isDarkNav
                          ? "w-0 group-hover:w-full bg-white/70"
                          : "w-0 group-hover:w-full bg-[var(--color-primary)]/70"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* 3. Right Side Account Profile / Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {session ? (
                <ProfileDropdown
                  session={session}
                  isDarkNav={isDarkNav}
                  isAdmin={isAdmin}
                  onOpenLogout={() => setShowLogoutModal(true)}
                />
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="h-11 px-6 text-base font-semibold rounded-[10px] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-canvas)] inline-flex items-center justify-center no-underline transition-all hover:scale-105 shadow-sm"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className={`h-11 px-6 text-base font-semibold rounded-[10px] border-2 inline-flex items-center justify-center no-underline transition-all hover:scale-105 ${
                      isDarkNav
                        ? "border-white/80 text-white hover:bg-white/10"
                        : "border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-surface)]"
                    }`}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* 4. Mobile Menu Toggle */}
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

        {/* 5. Mobile Drawer */}
        <MobileNavDrawer
          isOpen={mobileOpen}
          isDarkNav={isDarkNav}
          isAdminRoute={isDarkNav}
          isAdmin={isAdmin}
          session={session}
          links={navLinks}
          onClose={() => setMobileOpen(false)}
          onNavigate={(item) => {
            scrollToSection(item.sectionId);
            setMobileOpen(false);
          }}
          onOpenLogout={() => setShowLogoutModal(true)}
        />
      </nav>

      {/* 6. Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        isLoggingOut={isLoggingOut}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
