/**
 * RecipeCard.tsx — Card ricetta per la griglia homepage.
 */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Recipe } from "../types";
import { formatTime } from "../lib/scaling";

// ─── Icone ────────────────────────────────────────────────────────────────────

function IconClock()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function IconUsers()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function IconHeart({ filled }: { filled?: boolean }) {
  return <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}

// ─── Placeholder immagine ─────────────────────────────────────────────────────

function ImagePlaceholder({ title }: { title: string }) {
  const initial = title.trim()[0]?.toUpperCase() ?? "R";
  // Colori basati sulla prima lettera per varietà visiva
  const hue = ((initial.charCodeAt(0) - 65) * 13 + 20) % 360;
  return (
    <div style={{
      width: "100%",
      aspectRatio: "4 / 3",
      background: `hsl(${hue}, 35%, 88%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
    }}>
      <span style={{
        fontFamily: "var(--font-serif)",
        fontSize: "3rem",
        fontWeight: 700,
        color: `hsl(${hue}, 40%, 45%)`,
        opacity: 0.7,
      }}>
        {initial}
      </span>
    </div>
  );
}

// ─── Data ultima cottura ──────────────────────────────────────────────────────

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "oggi";
  if (days === 1) return "ieri";
  if (days < 7)  return `${days} giorni fa`;
  if (days < 30) return `${Math.floor(days / 7)} sett. fa`;
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
    recipe.yield === 1 ? "1 porzione" : `${recipe.yield} porzioni`;

  return (
    <article
      className="card card-clickable"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      aria-label={`Apri ricetta: ${recipe.title}`}
      style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      {/* Immagine */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        {recipe.coverImage ? (
          <img
            src={recipe.coverImage}
            alt={recipe.title}
            loading="lazy"
            style={{
              width: "100%",
              aspectRatio: "4 / 3",
              objectFit: "cover",
              borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
              display: "block",
            }}
          />
        ) : (
          <ImagePlaceholder title={recipe.title} />
        )}

        {/* Stella preferiti */}
        {onToggleStar && (
          <button
            onClick={handleStar}
            aria-label={recipe.starred ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
              background: "rgba(255,255,255,0.9)",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: recipe.starred ? "#b5541e" : "#a8a29e",
              backdropFilter: "blur(4px)",
              transition: "transform 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <IconHeart filled={recipe.starred} />
          </button>
        )}

        {/* Badge "veloce" */}
        {recipe.totalTime > 0 && recipe.totalTime <= 30 && (
          <span style={{
            position: "absolute",
            top: "0.5rem",
            left: "0.5rem",
            background: "var(--brand)",
            color: "#fff",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            padding: "0.2rem 0.5rem",
            borderRadius: "var(--radius-full)",
          }}>
            VELOCE
          </span>
        )}
      </div>

      {/* Corpo */}
      <div style={{ padding: "0.875rem 1rem 1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h3 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1rem",
          fontWeight: 600,
          margin: 0,
          color: "var(--text-primary)",
          lineHeight: 1.3,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {recipe.title}
        </h3>

        {/* Meta: porzioni + tempo */}
        <div style={{ display: "flex", gap: "0.875rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <IconUsers /> {servingsLabel}
          </span>
          {recipe.totalTime > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <IconClock /> {formatTime(recipe.totalTime)}
            </span>
          )}
        </div>

        {/* Tag */}
        {recipe.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.25rem" }}>
            {recipe.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag" style={{ fontSize: "0.72rem" }}>
                {tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                +{recipe.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Ultima cottura */}
        {recipe.lastCooked && (
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0, marginTop: "auto", paddingTop: "0.375rem" }}>
            Cucinata {relativeDate(recipe.lastCooked)}
          </p>
        )}
      </div>
    </article>
  );
}
