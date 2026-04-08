/**
 * RecipeCard.tsx — Portrait card con hover via CSS (no JS handlers = più fluido).
 * Le immagini usano loading="lazy" e object-fit: cover per performance ottimale.
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

/**
 * Palette di colori eleganti matte/satin per le card senza foto.
 * Toni ispirati a spezie, erbe, legno, ceramica — saturi ma non aggressivi.
 * Ogni colore è [base, ombra] per un gradiente morbido.
 */
const PALETTES: Array<[string, string, string]> = [
  // Terracotta
  ["#B85C38", "#7A3520", "rgba(255,235,220,0.55)"],
  // Salvia verde
  ["#4A7C59", "#2C4A35", "rgba(220,245,230,0.50)"],
  // Curcuma
  ["#C4912A", "#7A5A10", "rgba(255,245,210,0.55)"],
  // Malva viola
  ["#7B5EA7", "#4A2E72", "rgba(240,225,255,0.50)"],
  // Teal profondo
  ["#2E7D8A", "#1A4A52", "rgba(210,245,248,0.50)"],
  // Cipria rosso-matto
  ["#A0455A", "#6A2035", "rgba(255,220,230,0.50)"],
  // Oliva scuro
  ["#6B7A2A", "#3D4510", "rgba(235,245,200,0.50)"],
  // Ardesia blu
  ["#3D5A7A", "#1E3248", "rgba(210,230,255,0.50)"],
  // Cannella
  ["#9A6235", "#5A3510", "rgba(255,235,210,0.55)"],
  // Menta bosco
  ["#3A7A6A", "#1E4840", "rgba(210,248,240,0.50)"],
];

function Placeholder({ title }: { title: string }) {
  const code = [...(title.trim().toUpperCase())].reduce((a, c) => a + c.charCodeAt(0), 0);
  const [base, shadow, textColor] = PALETTES[code % PALETTES.length];
  const initial = title.trim()[0]?.toUpperCase() ?? "R";

  return (
    <div style={{
      position: "absolute", inset: 0,
      // Gradiente matte: colore base + ombra + luce diffusa in alto
      background: [
        `radial-gradient(ellipse at 30% 25%, ${base}CC 0%, transparent 65%)`,
        `radial-gradient(ellipse at 80% 80%, ${shadow}FF 0%, transparent 60%)`,
        `linear-gradient(155deg, ${base}EE 0%, ${shadow}FF 100%)`,
      ].join(", "),
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {/* Texture noise simulata con pattern SVG */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "180px",
      }} />
      <span style={{
        fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 8vw, 3.5rem)",
        fontWeight: 700, color: textColor,
        letterSpacing: "-0.02em", lineHeight: 1,
        textShadow: `0 2px 12px ${shadow}88`,
      }}>
        {initial}
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

  const handleClick = useCallback(
    () => navigate(`/ricette/${recipe.id}`),
    [navigate, recipe.id]
  );

  const handleStar = useCallback(
    (e: React.MouseEvent) => { e.stopPropagation(); onToggleStar?.(recipe.id); },
    [onToggleStar, recipe.id]
  );

  const isQuick = recipe.totalTime > 0 && recipe.totalTime <= 30;

  return (
    <>
      <article
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        aria-label={localized.title}
        className="recipe-card"
      >
        {/* Foto / placeholder */}
        <div style={{ position: "absolute", inset: 0 }}>
          {recipe.coverImage
            ? <img
                src={recipe.coverImage}
                alt={localized.title}
                loading="lazy"
                decoding="async"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            : <Placeholder title={localized.title} />
          }
        </div>

        {/* Gradiente overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, transparent 38%, rgba(0,0,0,0.10) 55%, rgba(0,0,0,0.90) 100%)",
        }} />

        {/* Top: stella */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "flex-end", padding: "0.55rem 0.55rem 0" }}>
          {onToggleStar && (
            <button
              onClick={handleStar}
              aria-label={recipe.starred ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
              className="recipe-card-star"
              style={{
                background: recipe.starred ? "rgba(245,166,35,0.28)" : "rgba(0,0,0,0.35)",
                backdropFilter: "blur(8px)",
                border: recipe.starred
                  ? "1px solid rgba(245,166,35,0.55)"
                  : "1px solid rgba(255,255,255,0.12)",
                color: recipe.starred ? "#F5A623" : "rgba(255,255,255,0.90)",
              }}
            >
              <IconHeart filled={recipe.starred} />
            </button>
          )}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom */}
        <div style={{ position: "relative", zIndex: 2, padding: "0.625rem 0.75rem 0.75rem" }}>
          {/* Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: "0.3rem" }}>
            {isQuick && (
              <span style={{
                background: "rgba(0,0,0,0.38)", backdropFilter: "blur(8px)",
                color: "rgba(255,255,255,0.95)", fontSize: "0.57rem", fontWeight: 800,
                letterSpacing: "0.1em", padding: "0.18rem 0.5rem",
                borderRadius: "var(--radius-full)", border: "1px solid rgba(255,255,255,0.12)",
                textTransform: "uppercase",
              }}>VELOCE</span>
            )}
            {recipe.tags.slice(0, 2).map((tag) => (
              <span key={tag} style={{
                background: "rgba(255,255,255,0.12)", backdropFilter: "blur(4px)",
                color: "rgba(255,255,255,0.90)", fontSize: "0.57rem", fontWeight: 700,
                letterSpacing: "0.05em", padding: "0.18rem 0.5rem",
                borderRadius: "var(--radius-full)", border: "1px solid rgba(255,255,255,0.14)",
                textTransform: "uppercase",
              }}>{tag}</span>
            ))}
          </div>

          {/* Titolo */}
          <h3 style={{
            fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 0.3rem",
            fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
            color: "#fff", lineHeight: 1.25,
            textShadow: "0 1px 8px rgba(0,0,0,0.6)",
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
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
    </>
  );
}
