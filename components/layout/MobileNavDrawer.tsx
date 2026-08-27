"use client";

import React from "react";
import Link from "next/link";
import { SignOut } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import type { Session } from "next-auth";
import type { NavLinkItem } from "./nav-config";

interface MobileNavDrawerProps {
  isOpen: boolean;
  isDarkNav: boolean;
  isAdminRoute: boolean;
  isAdmin: boolean;
  session: Session | null;
  links: NavLinkItem[];
  onClose: () => void;
  onNavigate: (item: NavLinkItem) => void;
  onOpenLogout: () => void;
}

export function MobileNavDrawer({
  isOpen,
  isDarkNav,
  isAdminRoute,
  isAdmin,
  session,
  links,
  onClose,
  onNavigate,
  onOpenLogout,
}: MobileNavDrawerProps): React.JSX.Element {
  const userInitial = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className={`lg:hidden border-t px-5 py-4 overflow-hidden text-left ${
            isDarkNav ? "bg-[#0f172a] border-white/10 text-white" : "bg-white border-[var(--color-hairline)]"
          }`}
        >
          <div className="flex flex-col space-y-3 text-left">
            {links.map((item) => {
              if (item.adminOnly && !isAdmin) return null;
              if (item.authOnly && !session) return null;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => onNavigate(item)}
                  className={`text-base font-semibold no-underline py-1 ${
                    isDarkNav ? "text-white/90 hover:text-white" : "text-[var(--color-ink)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Profile Actions */}
            <div className={`pt-3 mt-2 border-t ${isDarkNav ? "border-white/10" : "border-[var(--color-hairline)]"}`}>
              {session ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-left">
                    <div className={`w-10 h-10 rounded-full text-sm font-bold flex items-center justify-center ${isDarkNav ? "bg-white text-[#0f172a]" : "bg-[#0f172a] text-white"}`}>
                      {userInitial}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold">{session.user?.name}</div>
                      <div className="text-xs uppercase font-semibold text-[var(--color-primary)]">
                        {isAdmin ? "Admin Panitia" : "Member Peserta"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenLogout();
                    }}
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
                    onClick={onClose}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="btn-secondary text-center justify-center text-sm font-bold h-10 rounded-[10px]"
                    onClick={onClose}
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
  );
}
