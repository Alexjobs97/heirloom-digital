/**
 * SearchBar.tsx — Barra di ricerca con filtri rapidi.
 */

import { useRef, useCallback } from "react";
import type { SearchFilters } from "../types";

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" width="14" height="14">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

interface FilterChip {
  key: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface SearchBarProps {
  filters: SearchFilters;
  onChange: (f: Partial<SearchFilters>) => void;
  allTags: string[];
  totalCount: number;
}

export default function SearchBar({
  filters,
  onChange,
  allTags,
  totalCount,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const clearQuery = useCallback(() => {
    onChange({ query: "" });
    inputRef.current?.focus();
  }, [onChange]);

  // Chip filtri rapidi
  const chips: FilterChip[] = [
    {
      key: "starred",
      label: "⭐ Preferite",
      active: !!filters.starred,
      onClick: () => onChange({ starred: !filters.starred }),
    },
    {
      key: "recent",
      label: "🕐 Recenti",
      active: !!filters.recentOnly,
      onClick: () => onChange({ recentOnly: !filters.recentOnly }),
    },
    {
      key: "quick",
      label: "⚡ < 30 min",
      active: filters.maxTime === 30,
      onClick: () => onChange({ maxTime: filters.maxTime === 30 ? undefined : 30 }),
    },
  ];

  // Tag più usati (max 6 mostrati)
  const topTags = allTags.slice(0, 6);

  const hasActiveFilters =
    !!filters.query ||
    filters.starred ||
    filters.recentOnly ||
    filters.maxTime !== undefined ||
    (filters.tags?.length ?? 0) > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Input ricerca */}
      <div style={{ position: "relative" }}>
        <span style={{
          position: "absolute",
          left: "0.875rem",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-muted)",
          pointerEvents: "none",
          display: "flex",
        }}>
          <IconSearch />
        </span>

        <input
          ref={inputRef}
          type="search"
          className="input"
          placeholder="Cerca per nome, ingrediente o tag…"
          value={filters.query ?? ""}
          onChange={(e) => onChange({ query: e.target.value })}
          style={{ paddingLeft: "2.5rem", paddingRight: filters.query ? "2.5rem" : "0.875rem" }}
          aria-label="Cerca ricette"
        />

        {filters.query && (
          <button
            onClick={clearQuery}
            aria-label="Cancella ricerca"
            style={{
              position: "absolute",
              right: "0.875rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              padding: "0.25rem",
            }}
          >
            <IconX />
          </button>
        )}
      </div>

      {/* Riga filtri rapidi */}
      <div style={{
        display: "flex",
        gap: "0.4rem",
        flexWrap: "wrap",
        alignItems: "center",
      }}>
        {chips.map((chip) => (
          <button
            key={chip.key}
            onClick={chip.onClick}
            style={{
              padding: "0.3rem 0.75rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.8rem",
              fontWeight: 700,
              border: "1.5px solid",
              cursor: "pointer",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
              background: chip.active ? "var(--brand)" : "var(--bg-card)",
              borderColor: chip.active ? "var(--brand)" : "var(--border)",
              color: chip.active ? "#fff" : "var(--text-secondary)",
            }}
          >
            {chip.label}
          </button>
        ))}

        {/* Tag rapidi */}
        {topTags.map((tag) => {
          const active = filters.tags?.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => {
                const current = filters.tags ?? [];
                const next = active
                  ? current.filter((t) => t !== tag)
                  : [...current, tag];
                onChange({ tags: next.length ? next : undefined });
              }}
              style={{
                padding: "0.3rem 0.75rem",
                borderRadius: "var(--radius-full)",
                fontSize: "0.8rem",
                fontWeight: 700,
                border: "1.5px solid",
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                background: active ? "var(--brand-light)" : "var(--bg-card)",
                borderColor: active ? "var(--brand)" : "var(--border)",
                color: active ? "var(--brand-dark)" : "var(--text-secondary)",
              }}
            >
              {tag}
            </button>
          );
        })}

        {/* Reset tutti i filtri */}
        {hasActiveFilters && (
          <button
            onClick={() =>
              onChange({ query: "", starred: false, recentOnly: false, maxTime: undefined, tags: undefined })
            }
            style={{
              padding: "0.3rem 0.65rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.78rem",
              fontWeight: 700,
              border: "1.5px dashed var(--border)",
              cursor: "pointer",
              background: "transparent",
              color: "var(--text-muted)",
              marginLeft: "auto",
              whiteSpace: "nowrap",
            }}
          >
            ✕ Azzera
          </button>
        )}
      </div>

      {/* Contatore risultati (solo se ricerca attiva) */}
      {hasActiveFilters && (
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
          {totalCount === 0
            ? "Nessuna ricetta trovata"
            : totalCount === 1
            ? "1 ricetta trovata"
            : `${totalCount} ricette trovate`}
        </p>
      )}
    </div>
  );
}
