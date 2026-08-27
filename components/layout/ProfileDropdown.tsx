"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  SignOut, IdentificationCard, EnvelopeSimple,
  PhoneCall, PencilSimple
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import type { Session } from "next-auth";

interface ProfileDropdownProps {
  session: Session;
  isDarkNav: boolean;
  isAdmin: boolean;
  onOpenLogout: () => void;
}

export function ProfileDropdown({
  session,
  isDarkNav,
  isAdmin,
  onOpenLogout,
}: ProfileDropdownProps): React.JSX.Element {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = session.user?.name || "Member SurabayaDev";
  const userEmail = session.user?.email || "user@sbydev.id";
  const userInitial = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const memberCode = isAdmin
    ? "EMP-0001"
    : `EMP-${(session.user?.id || "001").slice(-4).toUpperCase()}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Trigger Button */}
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        title={`Profil ${userName}`}
        aria-label="Buka Menu Akun"
        className={`w-11 h-11 rounded-full font-bold text-base flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 shadow-sm ring-2 ${
          isDarkNav
            ? "bg-white text-[#0f172a] ring-white/40 hover:ring-white"
            : "bg-[#0f172a] text-white ring-[var(--color-primary)]/25 hover:ring-[var(--color-primary)]"
        }`}
      >
        {userInitial}
      </button>

      {/* Wide Profile Dropdown Card (440px) */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-[420px] sm:w-[450px] bg-[#0f172a] text-white rounded-2xl shadow-2xl p-6 z-50 text-left border border-white/15 overflow-hidden"
          >
            {/* Top Header Row */}
            <div className="flex items-center justify-between gap-4 mb-4 text-left">
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-14 h-14 rounded-full bg-[#bbf7d0] text-[#065f46] font-bold text-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
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
            <div className="bg-[#f0fdf4] text-[var(--color-ink)] rounded-2xl p-5 flex flex-col gap-4 my-3 text-left border border-green-200/50">
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
                onOpenLogout();
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
  );
}
