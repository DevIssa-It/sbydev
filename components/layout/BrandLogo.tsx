"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  isDark?: boolean;
  href?: string;
  className?: string;
  subtitle?: string;
}

export function BrandLogo({
  isDark = false,
  href = "/",
  className,
  subtitle,
}: BrandLogoProps): React.JSX.Element {
  const bracketColor = isDark ? "var(--color-canvas)" : "var(--color-ink)";
  const greenAccent = "var(--color-primary)";

  return (
    <Link
      href={href}
      className={cn("flex items-center gap-3 no-underline flex-shrink-0 group", className)}
      title="SurabayaDev Events Platform"
    >
      {/* Modernized Event-Centric Tech Emblem: < 🏛️ > within a Ticket Stamp Geometric Box */}
      <div
        className={cn(
          "w-10 h-10 rounded-[10px] flex items-center justify-center shadow-xs transition-all duration-200 group-hover:scale-105 border flex-shrink-0",
          isDark
            ? "bg-white/10 border-white/20 text-[var(--color-canvas)]"
            : "bg-[var(--color-navy)] border-transparent text-[var(--color-canvas)]"
        )}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-200 group-hover:rotate-3"
        >
          {/* Left Code Bracket < */}
          <path
            d="M7 8L2.5 14L7 20"
            stroke={bracketColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Center Stylized Surabaya Hero Monument (Tugu Pahlawan) */}
          <path
            d="M14 3.5L16.5 7.5V20.5L14 24.5L11.5 20.5V7.5L14 3.5Z"
            fill="currentColor"
            className="text-[var(--color-primary)]"
          />

          {/* Right Code Bracket > */}
          <path
            d="M21 8L25.5 14L21 20"
            stroke={bracketColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Floating Event Ticket Star / Node Dot */}
          <circle cx="14" cy="14" r="2" fill="var(--color-canvas)" />
        </svg>
      </div>

      {/* Brand Typography with Dedicated "EVENTS" Platform Badge */}
      <div className="flex flex-col leading-tight text-left">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-normal tracking-tight text-left text-xl sm:text-2xl transition-colors",
              isDark ? "text-[var(--color-canvas)]" : "text-[var(--color-ink)]"
            )}
          >
            Surabaya<span className="font-extrabold">Dev</span>
          </span>

          {/* Event-Focused Platform Badge */}
          <span
            className={cn(
              "text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-[6px] shadow-2xs font-mono",
              isDark
                ? "bg-[var(--color-primary)] text-[var(--color-canvas)] border border-green-400/30"
                : "bg-[var(--color-primary)] text-[var(--color-canvas)]"
            )}
          >
            EVENTS
          </span>
        </div>

        {subtitle && (
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider mt-0.5",
              isDark ? "text-white/70" : "text-[var(--color-muted)]"
            )}
          >
            {subtitle}
          </span>
        )}
      </div>
    </Link>
  );
}
