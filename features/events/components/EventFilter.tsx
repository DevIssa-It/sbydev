"use client";

import React from "react";
import { MagnifyingGlass, Funnel } from "@phosphor-icons/react";
import type { EventCategory } from "../validations";
import { EVENT_CATEGORIES } from "../validations";

interface EventFilterProps {
  categories: string[];
  selectedCategory: EventCategory;
  searchQuery: string;
  onCategoryChange: (category: EventCategory) => void;
  onSearchChange: (query: string) => void;
}

export function EventFilter({
  categories,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: EventFilterProps): React.JSX.Element {
  const displayCategories = categories.length > 0 ? (categories as EventCategory[]) : EVENT_CATEGORIES;

  return (
    <div className="flex flex-col gap-5 mb-8">
      {/* Search Bar */}
      <div className="relative w-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] flex items-center pointer-events-none z-10">
          <MagnifyingGlass size={20} />
        </div>
        <input
          type="text"
          className="input with-icon-left"
          style={{ paddingLeft: 48 }}
          placeholder="Cari event teknologi, workshop, meetup, conference..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Cari event"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 text-[var(--color-muted)] text-xs font-semibold mr-1 flex-shrink-0">
          <Funnel size={16} />
          <span>Kategori:</span>
        </div>
        {displayCategories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`chip ${isActive ? "active" : ""}`}
              style={{
                backgroundColor: isActive ? "var(--color-surface)" : "var(--color-canvas)",
                borderColor: isActive ? "var(--color-primary)" : "var(--color-hairline)",
                color: isActive ? "var(--color-primary)" : "var(--color-ink)",
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
