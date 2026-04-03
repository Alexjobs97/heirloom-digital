/**
 * RecipeCard.tsx — Portrait card immersiva, stile gourmet scuro.
 * Semplificata: rimossi badge IT/JP e fulmine ridondante.
 */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Recipe } from "../types";
import { formatTime } from "../lib/scaling";
import { getLocalizedContent } from "../lib/recipeLocale";
import { useLang } from "../i18n/LangContext";
import type { Locale } from "../lib/recipeLocale";

function IconClock() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="10" height="10"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function IconHeart({ filled }: { filled?: boolean }) {
  return <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}

const PALETTES = [
  ["#1a1a1a","#2d1f14"], ["#14201a","#1f3028"], ["#1e1420","#2e1a2e"],
  ["#201814","#302018"], ["#141e20","#1a2e32"], ["#1e2014","#2a2e1a"],
];

function Placeholder({ title }: { title: string }) {
  const idx = (title.trim()[0]?.toUpperCase() ?? "R").charCodeAt(0);
  const [a, b] = PALETTES[idx % PALETTES.length];
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: `linear-gradient(160deg, ${a}, ${b})`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{
        fontFamily: "var(--font-serif)", fontSize: "3rem", fontWeight: 700,
        color: "rgba(255,255,255,0.10)",
      }}>
        {title.trim()[0]?.toUpperCase() ?? "R"}
      </span>
    </div>
  );
}

interface RecipeCardProps {
  recipe: Recipe;
  onToggleStar?: (id: string) => void;
}

export default function RecipeCard({ recipe, onToggleStar }: RecipeCardProps) {
  const navigate  = useNavigate();
  const { lang }  = useLang();
  const localized = getLocalizedContent(recipe, lang as Locale);

  const handleClick = useCallback(() => navigate(`/ricette/${recipe.id}`), [navigate, recipe.id]);
  const handleStar  = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleStar?.(recipe.id);
  }, [onToggleStar, recipe.id]);

  const isQuick = recipe.totalTime > 0 && recipe.totalTime <= 30;

  return (
    <article
      onClick={handleClick}
      role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      aria-label={localized.title}
      style={{
        position: "relative",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        aspectRatio: "3/4",
        cursor: "pointer",
        boxShadow: "var(--shadow-card)",
        transition: "transform 0.22s cubic-bezier(.22,.68,0,1.2), box-shadow 0.22s ease",
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        background: "#111",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-4px) scale(1.02)";
        el.style.boxShadow = "var(--shadow-hover)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "none";
        el.style.boxShadow = "var(--shadow-card)";
      }}
    >
      {/* Foto / placeholder */}
      <div style={{ position: "absolute", inset: 0 }}>
        {recipe.coverImage
          ? <img src={recipe.coverImage} alt={localized.title} loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <Placeholder title={localized.title} />
        }
      </div>

      {/* Gradiente overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, transparent 38%, rgba(0,0,0,0.10) 55%, rgba(0,0,0,0.90) 100%)",
        pointerEvents: "none",
      }} />

      {/* Top: solo stella */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "flex-end", padding: "0.55rem 0.55rem 0" }}>
        {onToggleStar && (
          <button
            onClick={handleStar}
            aria-label={recipe.starred ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
            style={{
              background: recipe.starred ? "rgba(245,166,35,0.28)" : "rgba(0,0,0,0.35)",
              backdropFilter: "blur(8px)",
              border: recipe.starred ? "1px solid rgba(245,166,35,0.55)" : "1px solid rgba(255,255,255,0.12)",
              borderRadius: "50%",
              width: 30, height: 30,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              color: recipe.starred ? "#F5A623" : "rgba(255,255,255,0.90)",
              transition: "transform 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.18)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          >
            <IconHeart filled={recipe.starred} />
          </button>
        )}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Bottom: tags + titolo + meta */}
      <div style={{ position: "relative", zIndex: 2, padding: "0.625rem 0.75rem 0.75rem" }}>

        {/* Tags — solo tags utente, no badge lingua */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: "0.3rem" }}>
          {recipe.tags.slice(0, 2).map((tag) => (
            <span key={tag} style={{
              background: "rgba(255,255,255,0.12)", backdropFilter: "blur(4px)",
              color: "rgba(255,255,255,0.90)",
              fontSize: "0.57rem", fontWeight: 700, letterSpacing: "0.05em",
              padding: "0.18rem 0.5rem", borderRadius: "var(--radius-full)",
              border: "1px solid rgba(255,255,255,0.14)", textTransform: "uppercase",
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Titolo */}
        <h3 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
          fontWeight: 700, margin: "0 0 0.3rem",
          color: "#fff", lineHeight: 1.25,
          textShadow: "0 1px 8px rgba(0,0,0,0.6)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {localized.title}
        </h3>

        {/* Meta */}
        <div style={{
          display: "flex", gap: "0.5rem", alignItems: "center",
          color: "rgba(255,255,255,0.68)", fontSize: "0.72rem",
        }}>
          {recipe.totalTime > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
              <IconClock /> {formatTime(recipe.totalTime)}
            </span>
          )}
          {recipe.totalTime > 0 && <span style={{ opacity: 0.45 }}>·</span>}
          <span>{recipe.yield === 1 ? "1 porz." : `${recipe.yield} porz.`}</span>
        </div>
      </div>
    </article>
  );
}
