/**
 * RecipeCard.tsx — Premium gourmet recipe card matching design reference.
 * Features: star ratings, cooking time badge, gradient overlays, hover effects.
 */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Recipe } from "../types";
import { formatTime } from "../lib/scaling";
import { getLocalizedContent } from "../lib/recipeLocale";
import { useLang } from "../i18n/LangContext";
import type { Locale } from "../lib/recipeLocale";

// Icons
function IconClock() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function IconStar({ filled }: { filled?: boolean }) {
  return <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="12" height="12"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
function IconHeart({ filled }: { filled?: boolean }) {
  return <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}

// Gradient palettes for cards without images
const PALETTES = [
  ["#2D1F14", "#1A1410"], // Warm brown
  ["#14201A", "#0A1210"], // Forest green
  ["#1E1420", "#120A14"], // Deep purple
  ["#201814", "#140E0A"], // Espresso
  ["#141E20", "#0A1214"], // Ocean blue
  ["#1E2014", "#12140A"], // Olive
];

function Placeholder({ title }: { title: string }) {
  const idx = (title.trim()[0]?.toUpperCase() ?? "R").charCodeAt(0);
  const [a, b] = PALETTES[idx % PALETTES.length];
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: `linear-gradient(145deg, ${a} 0%, ${b} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{
        fontFamily: "var(--font-serif)", fontSize: "4rem", fontWeight: 700,
        color: "rgba(255,255,255,0.08)", userSelect: "none",
      }}>
        {title.trim()[0]?.toUpperCase() ?? "R"}
      </span>
    </div>
  );
}

// Star rating display (visual only - based on recipe rating or random seed)
function StarRating({ seed }: { seed: string }) {
  // Generate a consistent 4-5 star rating based on recipe ID
  const rating = 4 + (seed.charCodeAt(0) % 2); // 4 or 5 stars
  return (
    <div style={{ display: "flex", gap: "1px", color: "#F5A623" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <IconStar key={i} filled={i <= rating} />
      ))}
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

  return (
    <article
      onClick={handleClick}
      role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      aria-label={localized.title}
      className="recipe-card"
    >
      {/* Image / Placeholder */}
      <div className="recipe-card-image">
        {recipe.coverImage ? (
          <img src={recipe.coverImage} alt={localized.title} loading="lazy" />
        ) : (
          <Placeholder title={localized.title} />
        )}
        
        {/* Gradient overlay */}
        <div className="recipe-card-overlay" />
        
        {/* Favorite button */}
        {onToggleStar && (
          <button
            onClick={handleStar}
            className={`recipe-card-fav ${recipe.starred ? "active" : ""}`}
            aria-label={recipe.starred ? "Remove from favorites" : "Add to favorites"}
          >
            <IconHeart filled={recipe.starred} />
          </button>
        )}
        
        {/* Time badge */}
        {recipe.totalTime > 0 && (
          <div className="recipe-card-time">
            <IconClock />
            <span>{formatTime(recipe.totalTime)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="recipe-card-content">
        <h3 className="recipe-card-title">{localized.title}</h3>
        <StarRating seed={recipe.id} />
      </div>
    </article>
  );
}
