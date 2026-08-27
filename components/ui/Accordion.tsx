"use client";

import React, { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  allowMultiple?: boolean;
}

export function Accordion({ items, className, allowMultiple = false }: AccordionProps): React.JSX.Element {
  const [openIds, setOpenIds] = useState<string[]>([items[0]?.id || ""]);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            className={cn(
              "card border transition-colors overflow-hidden",
              isOpen ? "border-[var(--color-primary)] shadow-sm" : "border-[var(--color-hairline)]"
            )}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 bg-transparent cursor-pointer select-none"
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold text-[var(--color-ink)] leading-snug">
                {item.question}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-8 h-8 rounded-full bg-[var(--color-surface)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0"
              >
                <CaretDown size={18} weight="bold" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: "easeInOut" }}
                >
                  <div className="px-5 sm:px-6 pb-6 pt-0 text-sm text-[var(--color-muted)] leading-relaxed border-t border-[var(--color-hairline)]/50 pt-4">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
