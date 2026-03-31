/**
 * SearchBar.tsx v2 — Ricerca con supporto multi-ingrediente.
 * Separare i termini con virgola (,) o virgola giapponese (、) per
 * filtrare ricette che contengono TUTTI gli ingredienti elencati.
 */

import { useRef, useCallback } from "react";
import type { SearchFilters } from "../types";
import { parseIngredientTerms, isMultiIngredientQuery } from "../types";
import { useTranslation } from "../i18n/useTranslation";

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
function IconIngredients() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
      <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12"/>
      <path d="M12 8v4l3 3"/>
      <path d="M2 2l4 4"/>
    </svg>
  );
}

interface SearchBarProps {
  filters: SearchFilters;
  onChange: (f: Partial<SearchFilters>) => void;
  allTags: string[];
  totalCount: number;
}

export default function SearchBar({ filters, onChange, allTags, totalCount }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, locale } = useTranslation();

  const clearQuery = useCallback(() => {
    onChange({ query: "" });
    inputRef.current?.focus();
  }, [onChange]);

  // ── Analisi query ─────────────────────────────────────────────────────────
  const isMulti  = isMultiIngredientQuery(filters.query ?? "");
  const terms    = isMulti ? parseIngredientTerms(filters.query ?? "") : [];
  // Rimuove un termine specifico dalla query
  const removeTerm = useCallback((term: string) => {
    const remaining = terms.filter((t) => t !== term);
    onChange({ query: remaining.join(", ") });
  }, [terms, onChange]);

  // ── Chip filtri rapidi ────────────────────────────────────────────────────
  const chips = [
    {
      key: "starred",
      label: t("filter.starred"),
      active: !!filters.starred,
      onClick: () => onChange({ starred: !filters.starred }),
    },
    {
      key: "recent",
      label: t("filter.recent"),
      active: !!filters.recentOnly,
      onClick: () => onChange({ recentOnly: !filters.recentOnly }),
    },
    {
      key: "quick",
      label: t("filter.quick"),
      active: filters.maxTime === 30,
      onClick: () => onChange({ maxTime: filters.maxTime === 30 ? undefined : 30 }),
    },
  ];

  const topTags = allTags.slice(0, 6);

  const hasActiveFilters =
    !!filters.query ||
    filters.starred ||
    filters.recentOnly ||
    filters.maxTime !== undefined ||
    (filters.tags?.length ?? 0) > 0;

  const placeholder = locale === "ja"
    ? "名前・食材・タグで検索… (複数食材はコンマで区切る)"
    : t("search.placeholder");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

      {/* ── Input ricerca ───────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        <div style={{ position: "relative" }}>
          <span style={{
            position: "absolute", left: "0.875rem", top: "50%",
            transform: "translateY(-50%)", color: "var(--text-muted)",
            pointerEvents: "none", display: "flex",
          }}>
            <IconSearch />
          </span>

          <input
            ref={inputRef}
            type="search"
            className="input"
            placeholder={placeholder}
            value={filters.query ?? ""}
            onChange={(e) => onChange({ query: e.target.value })}
            style={{
              paddingLeft: "2.5rem",
              paddingRight: filters.query ? "2.5rem" : "0.875rem",
            }}
            aria-label="Cerca ricette"
          />

          {filters.query && (
            <button
              onClick={clearQuery}
              aria-label="Cancella ricerca"
              style={{
                position: "absolute", right: "0.875rem", top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-muted)", display: "flex", padding: "0.25rem",
              }}
            >
              <IconX />
            </button>
          )}
        </div>

        {/* Hint multi-ingrediente */}
        {!filters.query && (
          <p style={{
            margin: 0, fontSize: "0.75rem", color: "var(--text-muted)",
            paddingLeft: "0.25rem",
          }}>
            {locale === "ja"
              ? "複数の食材で絞り込む例：うまご、牛乳、チーズ"
              : "Più ingredienti in AND: es. uova, latte, formaggio"}
          </p>
        )}

        {/* ── Chips termini multi-ingrediente ───────────────────────────── */}
        {isMulti && terms.length > 0 && (
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "0.35rem",
            padding: "0.5rem 0.625rem",
            background: "var(--brand-light)",
            borderRadius: "var(--radius-md)",
            alignItems: "center",
          }}>
            <span style={{
              display: "flex", alignItems: "center", gap: "0.25rem",
              fontSize: "0.72rem", fontWeight: 700, color: "var(--brand-dark)",
              letterSpacing: "0.04em", textTransform: "uppercase", marginRight: "0.15rem",
            }}>
              <IconIngredients />
              {locale === "ja" ? "AND検索" : "AND"}
            </span>
            {terms.map((term, i) => (
              <button
                key={i}
                onClick={() => removeTerm(term)}
                title={`Rimuovi "${term}"`}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.3rem",
                  padding: "0.2rem 0.55rem 0.2rem 0.65rem",
                  background: "var(--brand)", color: "#fff",
                  border: "none", borderRadius: "var(--radius-full)",
                  fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              >
                {term}
                <span style={{ opacity: 0.7, fontSize: "0.7rem", lineHeight: 1 }}>✕</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Chip filtri rapidi ───────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
        {chips.map((chip) => (
          <button
            key={chip.key}
            onClick={chip.onClick}
            style={{
              padding: "0.3rem 0.75rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.8rem", fontWeight: 700, border: "1.5px solid",
              cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
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
                fontSize: "0.8rem", fontWeight: 700, border: "1.5px solid",
                cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                background: active ? "var(--brand-light)" : "var(--bg-card)",
                borderColor: active ? "var(--brand)" : "var(--border)",
                color: active ? "var(--brand-dark)" : "var(--text-secondary)",
              }}
            >
              {tag}
            </button>
          );
        })}

        {/* Reset filtri */}
        {hasActiveFilters && (
          <button
            onClick={() => onChange({ query: "", starred: false, recentOnly: false, maxTime: undefined, tags: undefined })}
            style={{
              padding: "0.3rem 0.65rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.78rem", fontWeight: 700,
              border: "1.5px dashed var(--border)",
              cursor: "pointer", background: "transparent",
              color: "var(--text-muted)", marginLeft: "auto", whiteSpace: "nowrap",
            }}
          >
            ✕ {locale === "ja" ? "リセット" : "Azzera"}
          </button>
        )}
      </div>

      {/* Contatore risultati */}
      {hasActiveFilters && (
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
          {totalCount === 0
            ? (locale === "ja" ? "レシピが見つかりません" : t("search.noResults"))
            : totalCount === 1
            ? (locale === "ja" ? "1件のレシピが見つかりました" : "1 ricetta trovata")
            : (locale === "ja" ? `${totalCount}件のレシピが見つかりました` : `${totalCount} ricette trovate`)}
        </p>
      )}
    </div>
  );
}
