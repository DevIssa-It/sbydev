"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function useNavScrollSpy(isAdminRoute: boolean) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    if (pathname !== "/" || isAdminRoute) {
      return;
    }

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      const sections = [
        { id: "faq", name: "faq" },
        { id: "community", name: "community" },
        { id: "how-it-works", name: "how-it-works" },
        { id: "daftar-event", name: "daftar-event" },
      ];

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && scrollPos >= el.offsetTop) {
          setActiveSection(section.name);
          return;
        }
      }

      setActiveSection("home");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, isAdminRoute]);

  const scrollToSection = (id?: string) => {
    if (!id) return;
    setActiveSection(id);

    if (pathname === "/") {
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(id);
        if (el) {
          window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
        }
      }
    }
  };

  return { activeSection, scrollToSection, pathname };
}
