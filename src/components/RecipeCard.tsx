/**
 * RecipeCard.tsx — Stile magazine: immagine full-bleed con overlay elegante.
 */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Recipe } from "../types";
import { formatTime } from "../lib/scaling";

// ─── Icone ────────────────────────────────────────────────────────────────────

function IconClock() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function IconUsers() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function IconHeart({ filled }: { filled?: boolean }) {
  return <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}

// ─── Paletta colori per placeholder ──────────────────────────────────────────

const CARD_PALETTES = [
  { from: "#c96b3a", to: "#7a3520", text: "rgba(255,240,230,0.5)" },
  { from: "#7a6b52", to: "#3d3324", text: "rgba(255,245,235,0.45)" },
  { from: "#5a7a5c", to: "#2c3d2d", text: "rgba(225,245,225,0.45)" },
  { from: "#7a5c6b", to: "#3d2c36", text: "rgba(245,225,235,0.45)" },
  { from: "#6b7a52", to: "#343d29", text: "rgba(235,245,215,0.45)" },
  { from: "#4a6a7a", to: "#23333d", text: "rgba(215,235,245,0.45)" },
];

function ImagePlaceholder({ title }: { title: string }) {
  const initial = title.trim()[0]?.toUpperCase() ?? "R";
  const palette = CARD_PALETTES[(initial.charCodeAt(0)) % CARD_PALETTES.length];
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: `linear-gradient(160deg, ${palette.from} 0%, ${palette.to} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{
        fontFamily: "var(--font-serif)",
        fontSize: "5rem",
        fontWeight: 700,
        color: palette.text,
        lineHeight: 1,
        letterSpacing: "-0.02em",
      }}>
        {initial}
      </span>
    </div>
  );
}

// ─── Data relativa ────────────────────────────────────────────────────────────

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "oggi";
  if (days === 1) return "ieri";
  if (days < 7)  return `${days}g fa`;
  if (days < 30) return `${Math.floor(days / 7)}sett. fa`;
  return new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "short" });
}

// ─── Componente ───────────────────────────────────────────────────────────────

interface RecipeCardProps {
  recipe: Recipe;
  onToggleStar?: (id: string) => void;
}

export default function RecipeCard({ recipe, onToggleStar }: RecipeCardProps) {
  const navigate = useNavigate();

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
      aria-label={`Apri ricetta: ${recipe.title}`}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--radius-lg)",
        aspectRatio: "2 / 3",
        cursor: "pointer",
        boxShadow: "var(--shadow-card)",
        transition: "transform 0.25s cubic-bezier(.22,.68,0,1.2), box-shadow 0.25s",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px) scale(1.01)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)";
      }}
    >
      {/* ── Sfondo immagine / placeholder ───────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0 }}>
        {recipe.coverImage ? (
          <img
            src={recipe.coverImage}
            alt={recipe.title}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <ImagePlaceholder title={recipe.title} />
        )}
      </div>

      {/* ── Overlay gradiente ────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 35%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.82) 100%)",
        pointerEvents: "none",
      }} />

      {/* ── Top: badge veloce + stelle ───────────────────────────────────── */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        padding: "0.625rem",
      }}>
        {recipe.totalTime > 0 && recipe.totalTime <= 30 ? (
          <span style={{
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            color: "#fff",
            fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em",
            padding: "0.22rem 0.55rem",
            borderRadius: "var(--radius-full)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}>⚡ VELOCE</span>
        ) : <span />}

        {onToggleStar && (
          <button
            onClick={handleStar}
            aria-label={recipe.starred ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
            style={{
              background: recipe.starred ? "rgba(255,213,79,0.25)" : "rgba(0,0,0,0.3)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: recipe.starred ? "1px solid rgba(255,213,79,0.5)" : "1px solid rgba(255,255,255,0.15)",
              borderRadius: "50%",
              width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              color: recipe.starred ? "#ffd54f" : "rgba(255,255,255,0.85)",
              transition: "transform 0.15s, background 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.15)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          >
            <IconHeart filled={recipe.starred} />
          </button>
        )}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* ── Bottom: contenuto ────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 2, padding: "0.875rem 1rem 1rem" }}>

        {/* Tag */}
        {recipe.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginBottom: "0.45rem" }}>
            {recipe.tags.slice(0, 2).map((tag) => (
              <span key={tag} style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(4px)",
                color: "rgba(255,255,255,0.9)",
                fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.05em",
                padding: "0.15rem 0.5rem",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(255,255,255,0.18)",
                textTransform: "uppercase",
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Titolo */}
        <h3 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1.05rem", fontWeight: 700,
          margin: "0 0 0.45rem",
          color: "#fff",
          lineHeight: 1.28,
          textShadow: "0 1px 6px rgba(0,0,0,0.4)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {recipe.title}
        </h3>

        {/* Meta */}
        <div style={{
          display: "flex", gap: "0.75rem",
          color: "rgba(255,255,255,0.72)", fontSize: "0.75rem",
          alignItems: "center",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <IconUsers /> {servingsLabel}
          </span>
          {recipe.totalTime > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <IconClock /> {formatTime(recipe.totalTime)}
            </span>
          )}
          {recipe.lastCooked && (
            <span style={{ marginLeft: "auto", fontSize: "0.68rem", opacity: 0.75 }}>
              {relativeDate(recipe.lastCooked)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
