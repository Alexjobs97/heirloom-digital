/**
 * RecipeCard.tsx v3 — Carte compatte orizzontali.
 * Sostituisce il formato "magazine portrait" (2/3) con card più leggibili.
 */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Recipe } from "../types";
import { formatTime } from "../lib/scaling";
import { getLocalizedContent } from "../lib/recipeLocale";
import { useLang } from "../i18n/LangContext";
import type { Locale } from "../lib/recipeLocale";

// ─── Icone ────────────────────────────────────────────────────────────────────

function IconClock() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="11" height="11"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function IconUsers() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="11" height="11"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function IconHeart({ filled }: { filled?: boolean }) {
  return <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}

// ─── Paletta colori per placeholder ──────────────────────────────────────────

const CARD_PALETTES = [
  { from: "#c96b3a", to: "#7a3520" },
  { from: "#7a6b52", to: "#3d3324" },
  { from: "#5a7a5c", to: "#2c3d2d" },
  { from: "#7a5c6b", to: "#3d2c36" },
  { from: "#6b7a52", to: "#343d29" },
  { from: "#4a6a7a", to: "#23333d" },
];

function ImagePlaceholder({ title }: { title: string }) {
  const initial = title.trim()[0]?.toUpperCase() ?? "R";
  const palette = CARD_PALETTES[initial.charCodeAt(0) % CARD_PALETTES.length];
  return (
    <div style={{
      width: "100%", height: "100%",
      background: `linear-gradient(160deg, ${palette.from} 0%, ${palette.to} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{
        fontFamily: "var(--font-serif)",
        fontSize: "1.5rem",
        fontWeight: 700,
        color: "rgba(255,240,225,0.55)",
        lineHeight: 1,
      }}>
        {initial}
      </span>
    </div>
  );
}

// ─── Componente ───────────────────────────────────────────────────────────────

interface RecipeCardProps {
  recipe: Recipe;
  onToggleStar?: (id: string) => void;
}

export default function RecipeCard({ recipe, onToggleStar }: RecipeCardProps) {
  const navigate = useNavigate();
  const { lang } = useLang();
  const localized = getLocalizedContent(recipe, lang as Locale);

  const handleClick = useCallback(() => {
    navigate(`/ricette/${recipe.id}`);
  }, [navigate, recipe.id]);

  const handleStar = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleStar?.(recipe.id);
    },
    [onToggleStar, recipe.id]
  );

  const servingsLabel =
    recipe.yield === 1 ? "1 porz." : `${recipe.yield} porz.`;

  return (
    <article
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      aria-label={`Apri ricetta: ${localized.title}`}
      style={{
        display: "flex",
        alignItems: "stretch",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        cursor: "pointer",
        transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
        userSelect: "none",
        boxShadow: "var(--shadow-card)",
        minHeight: 88,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = "var(--shadow-hover)";
        el.style.borderColor = "var(--brand-light)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "var(--shadow-card)";
        el.style.borderColor = "var(--border)";
      }}
    >
      {/* ── Thumbnail ──────────────────────────────────────────────────── */}
      <div style={{
        width: 88, minWidth: 88, height: "auto",
        position: "relative", overflow: "hidden", flexShrink: 0,
      }}>
        {recipe.coverImage ? (
          <img
            src={recipe.coverImage}
            alt={localized.title}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <ImagePlaceholder title={localized.title} />
        )}

        {/* Badge JP */}
        {localized.hasJa && (
          <span style={{
            position: "absolute", bottom: 4, left: 4,
            fontSize: "0.55rem", fontWeight: 800,
            background: "rgba(0,0,0,0.55)", color: "#fff",
            padding: "0.1rem 0.3rem", borderRadius: 4,
            letterSpacing: "0.06em",
          }}>
            {localized.isJa ? "JP" : "IT"}
          </span>
        )}
      </div>

      {/* ── Contenuto ──────────────────────────────────────────────────── */}
      <div style={{
        flex: 1, padding: "0.75rem 0.875rem",
        display: "flex", flexDirection: "column",
        justifyContent: "space-between", gap: "0.25rem",
        minWidth: 0,
      }}>
        {/* Titolo */}
        <p style={{
          margin: 0,
          fontFamily: "var(--font-serif)",
          fontSize: "0.975rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          lineHeight: 1.35,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {localized.title}
        </p>

        {/* Meta */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.7rem",
          flexWrap: "wrap",
        }}>
          {recipe.totalTime > 0 && (
            <span style={{
              display: "flex", alignItems: "center", gap: "0.25rem",
              fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600,
            }}>
              <IconClock /> {formatTime(recipe.totalTime)}
            </span>
          )}
          <span style={{
            display: "flex", alignItems: "center", gap: "0.25rem",
            fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600,
          }}>
            <IconUsers /> {servingsLabel}
          </span>

          {/* Tags — mostra solo i primi 2 */}
          {recipe.tags.slice(0, 2).map((tag) => (
            <span key={tag} style={{
              fontSize: "0.64rem", fontWeight: 700,
              padding: "0.15rem 0.5rem",
              background: "var(--brand-light)", color: "var(--brand-dark)",
              borderRadius: "var(--radius-full)",
              letterSpacing: "0.04em", textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Star ───────────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center",
        padding: "0 0.75rem",
        flexShrink: 0,
      }}>
        <button
          onClick={handleStar}
          aria-label={recipe.starred ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: recipe.starred ? "var(--brand)" : "var(--border)",
            padding: "0.4rem",
            display: "flex", alignItems: "center",
            transition: "color 0.15s, transform 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1.25)";
            (e.currentTarget as HTMLElement).style.color = "var(--brand)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLElement).style.color = recipe.starred ? "var(--brand)" : "var(--border)";
          }}
        >
          <IconHeart filled={recipe.starred} />
        </button>
      </div>
    </article>
  );
}
