/**
 * RecipeCard.tsx — Portrait card con lazy image loading via IntersectionObserver.
 * Placeholder: sfondo colorato satinato senza lettera, gradiente morbido verso il basso.
 */

import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Recipe } from "../types";
import { formatTime } from "../lib/scaling";
import { getLocalizedContent } from "../lib/recipeLocale";
import { useLang } from "../i18n/LangContext";
import type { Locale } from "../lib/recipeLocale";
import { useCardImageLoader } from "../hooks/useCoverImage";

function IconClock() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="10" height="10"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function IconHeart({ filled }: { filled?: boolean }) {
  return <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}

// ── Palette DAY mode — vivaci, saturi, moderni ──────────────────────────────
const PALETTES_DAY: Array<[string, string]> = [
  ["#F0A830", "#C87820"],  // amber dorato
  ["#35A3A2", "#1E7A7A"],  // teal acqua
  ["#E8345A", "#B01840"],  // rosso corallo
  ["#4092FF", "#2060CC"],  // blu elettrico
  ["#E8702A", "#B04010"],  // arancio speziato
  ["#5BAD72", "#328050"],  // verde salvia
  ["#C45AA8", "#8A2878"],  // viola ciliegia
  ["#3AB8D0", "#1888A0"],  // azzurro laguna
  ["#D4A020", "#A07010"],  // oro curcuma
  ["#E85070", "#B02848"],  // rosa vibrante
];

// ── Palette NIGHT mode — più profondi, jewel tones ─────────────────────────
const PALETTES_NIGHT: Array<[string, string]> = [
  ["#C87A18", "#8A5008"],  // oro antico
  ["#1E8A89", "#0E5A5A"],  // teal profondo
  ["#B82040", "#780F28"],  // rosso rubino
  ["#2860CC", "#103898"],  // blu zaffiro
  ["#B84A18", "#782808"],  // ambra scura
  ["#2E8A50", "#185830"],  // verde foresta
  ["#882878", "#580858"],  // viola ametista
  ["#187898", "#086078"],  // petrolio
  ["#A07808", "#705000"],  // bronzo
  ["#B81840", "#780828"],  // bordeaux
];

function Placeholder({ title, dark }: { title: string; dark?: boolean }) {
  const palettes = dark ? PALETTES_NIGHT : PALETTES_DAY;
  // Hash semplice sul titolo per colore stabile
  const hash = [...title].reduce((a, c) => a + c.charCodeAt(0), 0);
  const [base, deep] = palettes[hash % palettes.length];

  return (
    <div style={{
      position: "absolute", inset: 0,
      // Colore uniforme nella parte alta, più scuro verso il basso
      // così il testo bianco in fondo rimane leggibile
      background: `linear-gradient(to bottom, ${base} 0%, ${base} 50%, ${deep} 100%)`,
    }} />
  );
}

interface RecipeCardProps {
  recipe: Recipe;
  onToggleStar?: (id: string) => void;
}

const RecipeCard = memo(function RecipeCard({ recipe, onToggleStar }: RecipeCardProps) {
  const navigate  = useNavigate();
  const { lang }  = useLang();
  const isDark    = document.documentElement.classList.contains("dark") &&
                    !document.documentElement.classList.contains("light");
  const localized = getLocalizedContent(recipe, lang as Locale);

  // Lazy image loading — non tiene l'immagine nel cache principale
  const hasCoverImage = !!(recipe.coverImage || recipe._hasCoverImage);
  const { src: imgSrc, setRef } = useCardImageLoader(recipe.id, hasCoverImage);

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
    >
      {/* Foto (lazy) o placeholder colorato */}
      <div style={{ position: "absolute", inset: 0 }}>
        {imgSrc
          ? <img
              src={imgSrc}
              alt={localized.title}
              loading="lazy"
              decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          : <Placeholder title={localized.title} dark={isDark} />
        }
      </div>

      {/* Gradiente overlay per leggibilità testo in basso */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: imgSrc
          ? "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, transparent 38%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0.88) 100%)"
          : "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)",
      }} />

      {/* Stella */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "flex-end", padding: "0.55rem 0.55rem 0" }}>
        {onToggleStar && (
          <button
            onClick={handleStar}
            aria-label={recipe.starred ? "Rimuovi" : "Preferito"}
            className="recipe-card-star"
            style={{
              background: recipe.starred ? "rgba(245,166,35,0.30)" : "rgba(0,0,0,0.28)",
              backdropFilter: "blur(8px)",
              border: recipe.starred ? "1px solid rgba(245,166,35,0.6)" : "1px solid rgba(255,255,255,0.15)",
              color: recipe.starred ? "#F5A623" : "rgba(255,255,255,0.92)",
            }}
          >
            <IconHeart filled={recipe.starred} />
          </button>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Contenuto bottom */}
      <div style={{ position: "relative", zIndex: 2, padding: "0.625rem 0.75rem 0.75rem" }}>
        {/* Tags + VELOCE */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: "0.3rem" }}>
          {isQuick && (
            <span style={{
              background: "rgba(0,0,0,0.32)", backdropFilter: "blur(8px)",
              color: "rgba(255,255,255,0.95)", fontSize: "0.57rem", fontWeight: 800,
              letterSpacing: "0.1em", padding: "0.18rem 0.5rem",
              borderRadius: "var(--radius-full)", border: "1px solid rgba(255,255,255,0.14)",
              textTransform: "uppercase",
            }}>VELOCE</span>
          )}
          {recipe.tags.slice(0, 2).map((tag) => (
            <span key={tag} style={{
              background: "rgba(255,255,255,0.14)", backdropFilter: "blur(4px)",
              color: "rgba(255,255,255,0.92)", fontSize: "0.57rem", fontWeight: 700,
              letterSpacing: "0.05em", padding: "0.18rem 0.5rem",
              borderRadius: "var(--radius-full)", border: "1px solid rgba(255,255,255,0.16)",
              textTransform: "uppercase",
            }}>{tag}</span>
          ))}
        </div>

        {/* Titolo */}
        <h3 style={{
          fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 0.3rem",
          fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
          color: "#fff", lineHeight: 1.25,
          textShadow: "0 1px 6px rgba(0,0,0,0.5)",
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {localized.title}
        </h3>

        {/* Meta */}
        <div style={{
          display: "flex", gap: "0.5rem", alignItems: "center",
          color: "rgba(255,255,255,0.72)", fontSize: "0.72rem",
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
