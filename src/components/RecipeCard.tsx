/**
 * RecipeCard.tsx — Flat color placeholder, lazy image loading.
 * Nessun gradiente, nessuna lettera nel placeholder.
 */

import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Recipe } from "../types";
import { formatTime } from "../lib/scaling";
import { getLocalizedContent } from "../lib/recipeLocale";
import { useLang } from "../i18n/LangContext";
import type { Locale } from "../lib/recipeLocale";
import { useCardImageLoader } from "../hooks/useCoverImage";
import { getPlaceholderColor } from "../lib/placeholderColor";

function IconClock() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="10" height="10"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function IconHeart({ filled }: { filled?: boolean }) {
  return <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}

const RecipeCard = memo(function RecipeCard({
  recipe,
  onToggleStar,
}: {
  recipe: Recipe;
  onToggleStar?: (id: string) => void;
}) {
  const navigate  = useNavigate();
  const { lang }  = useLang();
  const isDark    = !document.documentElement.classList.contains("light");
  const localized = getLocalizedContent(recipe, lang as Locale);

  const hasCoverImage = !!(recipe.coverImage || recipe._hasCoverImage);
  const { src: imgSrc, setRef } = useCardImageLoader(recipe.id, hasCoverImage);

  const bgColor = getPlaceholderColor(recipe.title, isDark);

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
    <article
      ref={setRef}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      aria-label={localized.title}
      className="recipe-card"
      style={{ background: bgColor }}
    >
      {/* Foto (lazy) */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={localized.title}
          loading="lazy"
          decoding="async"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", display: "block",
          }}
        />
      )}

      {/* Overlay scuro solo in fondo per leggibilità testo — flat, no gradiente sopra */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.72) 100%)",
      }} />

      {/* Stella */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "flex-end", padding: "0.55rem 0.55rem 0" }}>
        {onToggleStar && (
          <button
            onClick={handleStar}
            aria-label={recipe.starred ? "Rimuovi" : "Preferito"}
            className="recipe-card-star"
            style={{
              background: recipe.starred ? "rgba(245,166,35,0.32)" : "rgba(0,0,0,0.25)",
              backdropFilter: "blur(8px)",
              border: recipe.starred ? "1px solid rgba(245,166,35,0.65)" : "1px solid rgba(255,255,255,0.18)",
              color: recipe.starred ? "#F5A623" : "rgba(255,255,255,0.92)",
            }}
          >
            <IconHeart filled={recipe.starred} />
          </button>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Bottom */}
      <div style={{ position: "relative", zIndex: 2, padding: "0.625rem 0.75rem 0.75rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: "0.3rem" }}>
          {isQuick && (
            <span style={{
              background: "rgba(0,0,0,0.30)", backdropFilter: "blur(8px)",
              color: "#fff", fontSize: "0.57rem", fontWeight: 800,
              letterSpacing: "0.1em", padding: "0.18rem 0.5rem",
              borderRadius: "var(--radius-full)", border: "1px solid rgba(255,255,255,0.14)",
              textTransform: "uppercase",
            }}>VELOCE</span>
          )}
          {recipe.tags.slice(0, 2).map((tag) => (
            <span key={tag} style={{
              background: "rgba(255,255,255,0.16)", backdropFilter: "blur(4px)",
              color: "#fff", fontSize: "0.57rem", fontWeight: 700,
              letterSpacing: "0.05em", padding: "0.18rem 0.5rem",
              borderRadius: "var(--radius-full)", border: "1px solid rgba(255,255,255,0.18)",
              textTransform: "uppercase",
            }}>{tag}</span>
          ))}
        </div>

        <h3 style={{
          fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 0.3rem",
          fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
          color: "#fff", lineHeight: 1.25,
          textShadow: "0 1px 4px rgba(0,0,0,0.4)",
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {localized.title}
        </h3>

        <div style={{
          display: "flex", gap: "0.5rem", alignItems: "center",
          color: "rgba(255,255,255,0.78)", fontSize: "0.72rem",
        }}>
          {recipe.totalTime > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
              <IconClock /> {formatTime(recipe.totalTime)}
            </span>
          )}
          {recipe.totalTime > 0 && <span style={{ opacity: 0.4 }}>·</span>}
          <span>{recipe.yield === 1 ? "1 porz." : `${recipe.yield} porz.`}</span>
        </div>
      </div>
    </article>
  );
});

export default RecipeCard;
