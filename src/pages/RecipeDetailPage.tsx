/**
 * RecipeDetailPage.tsx — Dettaglio ricetta con scalatura live e mise en place.
 */

import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecipe, useRecipes } from "../hooks/useRecipes";
import { useScaledIngredients } from "../hooks/useScaledIngredients";
import { clampServings, formatTime } from "../lib/scaling";
import { copyRecipeToClipboard } from "../lib/io-enhanced";
import type { Ingredient, Recipe } from "../types";
import ServingsSlider from "../components/ServingsSlider";
import IngredientRow from "../components/IngredientRow";
import { useTranslation } from "../i18n/useTranslation";

// ─── Icone ────────────────────────────────────────────────────────────────────

function IconBack()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>; }
function IconHeart({ f }: { f?: boolean }) { return <svg viewBox="0 0 24 24" fill={f ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function IconShare()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>; }
function IconTrash()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>; }
function IconClock()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function IconChefHat()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>; }
function IconPrint()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>; }

// ─── Modale conferma eliminazione ─────────────────────────────────────────────

function DeleteModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0, fontSize: "1.2rem" }}>Elimina ricetta</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Sei sicuro? Questa azione non può essere annullata.
        </p>
        <div style={{ display: "flex", gap: "0.625rem", justifyContent: "flex-end" }}>
          <button className="btn btn-secondary" onClick={onCancel}>Annulla</button>
          <button className="btn btn-danger"    onClick={onConfirm}>Elimina</button>
        </div>
      </div>
    </div>
  );
}

// ─── Hero placeholder ─────────────────────────────────────────────────────────

function HeroPlaceholder({ title }: { title: string }) {
  const initial = title.trim()[0]?.toUpperCase() ?? "R";
  const hue = ((initial.charCodeAt(0) - 65) * 13 + 20) % 360;
  return (
    <div style={{
      width: "100%",
      aspectRatio: "16 / 5",
      background: `linear-gradient(135deg, hsl(${hue},30%,90%) 0%, hsl(${hue},25%,82%) 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-lg)",
    }}>
      <span style={{
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(3rem, 8vw, 5rem)",
        fontWeight: 700,
        color: `hsl(${hue},35%,50%)`,
        opacity: 0.6,
      }}>
        {initial}
      </span>
    </div>
  );
}

// ─── Toast minimale ───────────────────────────────────────────────────────────

function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const show = useCallback((m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 2500);
  }, []);
  return { msg, show };
}

// ─── RecipeDetailPage ─────────────────────────────────────────────────────────

export default function RecipeDetailPage() {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const { recipe, loading, error } = useRecipe(id);
  const { updateRecipe, removeRecipe, toggleStar } = useRecipes();
  const { t } = useTranslation();
  const toast = useToast();

  const [servings,     setServings]     = useState<number | null>(null);
  const [showDelete,   setShowDelete]   = useState(false);
  const [ingredients,  setIngredients]  = useState<Ingredient[] | null>(null);

  // Inizializza porzioni e ingredienti dal recipe (una volta sola)
  const currentIngredients = ingredients ?? recipe?.ingredients ?? [];
  const currentServings    = servings    ?? recipe?.yield ?? 4;

  const scaled = useScaledIngredients(currentIngredients, recipe?.yield ?? 4, currentServings);

  // ── Toggle checkbox mise en place ─────────────────────────────────────────

  const handleToggleIngredient = useCallback((ingId: string) => {
    const base = ingredients ?? recipe?.ingredients ?? [];
    setIngredients(
      base.map((ing) =>
        ing.id === ingId ? { ...ing, checked: !ing.checked } : ing
      )
    );
  }, [ingredients, recipe]);

  const handleCheckAll = useCallback(() => {
    const base = ingredients ?? recipe?.ingredients ?? [];
    const allChecked = base.every((i) => i.checked);
    setIngredients(base.map((i) => ({ ...i, checked: !allChecked })));
  }, [ingredients, recipe]);

  // ── Azioni ────────────────────────────────────────────────────────────────

  const handleToggleStar = useCallback(async () => {
    if (!id) return;
    await toggleStar(id);
    toast.show(recipe?.starred ? "Rimossa dai preferiti" : "Aggiunta ai preferiti ⭐");
  }, [id, toggleStar, recipe, toast]);

  const handleExport = useCallback(async () => {
    if (!recipe) return;
    await copyRecipeToClipboard(recipe);
    toast.show(t("action.copied"));
  }, [recipe, toast, t]);

  const handlePrint = useCallback(() => window.print(), []);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    await removeRecipe(id);
    navigate("/");
  }, [id, removeRecipe, navigate]);

  const handleStartCooking = useCallback(() => {
    if (!id) return;
    navigate(`/cucina/${id}?servings=${currentServings}`);
  }, [id, navigate, currentServings]);

  // ── Save inline edits (future) — salva checked quando si naviga via ──────
  // Per ora: l'aggiornamento dei checked è solo in-memory durante la sessione.
  // Per persistere: saveIngredients() su blur/unmount.

  // ─── Loading / Error ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1rem" }}>
        <div className="skeleton" style={{ height: 200, borderRadius: "var(--radius-lg)", marginBottom: "1.5rem" }} />
        <div className="skeleton" style={{ height: 32, width: "60%", marginBottom: "0.75rem" }} />
        <div className="skeleton" style={{ height: 18, width: "40%" }} />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-muted)" }}>
        <p style={{ fontSize: "2.5rem" }}>🍽️</p>
        <h2 style={{ color: "var(--text-primary)" }}>Ricetta non trovata</h2>
        <button className="btn btn-primary" onClick={() => navigate("/")} style={{ marginTop: "1.5rem" }}>
          Torna alle ricette
        </button>
      </div>
    );
  }

  const timeDisplay = recipe.totalTime > 0 ? formatTime(recipe.totalTime) : null;
  const allChecked = currentIngredients.every((i) => i.checked);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "1.25rem 1rem 4rem" }}>

      {/* Back + azioni */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ gap: "0.3rem", padding: "0.5rem 0.75rem" }}>
          <IconBack /> Indietro
        </button>

        <div style={{ marginLeft: "auto", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          <button className="btn btn-ghost" onClick={handleToggleStar} title={recipe.starred ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"} style={{ padding: "0.5rem 0.75rem", gap: "0.3rem", color: recipe.starred ? "var(--brand)" : undefined }}>
            <IconHeart f={recipe.starred} />
          </button>
          <button className="btn btn-ghost" onClick={handleExport} title={t("action.copyToClipboard")} style={{ padding: "0.5rem 0.75rem" }}>
            <IconShare />
          </button>
          <button className="btn btn-ghost no-print" onClick={handlePrint} title={t("detail.print")} style={{ padding: "0.5rem 0.75rem" }}>
            <IconPrint />
          </button>
          <button className="btn btn-ghost" onClick={() => setShowDelete(true)} title={t("detail.delete")} style={{ padding: "0.5rem 0.75rem", color: "var(--error)" }}>
            <IconTrash />
          </button>
        </div>
      </div>

      {/* Hero */}
      {recipe.coverImage ? (
        <img
          src={recipe.coverImage}
          alt={recipe.title}
          style={{
            width: "100%",
            aspectRatio: "16 / 5",
            objectFit: "cover",
            borderRadius: "var(--radius-lg)",
            marginBottom: "1.25rem",
            display: "block",
          }}
        />
      ) : (
        <div style={{ marginBottom: "1.25rem" }}>
          <HeroPlaceholder title={recipe.title} />
        </div>
      )}

      {/* Titolo + meta */}
      <h1 style={{ margin: "0 0 0.5rem", lineHeight: 1.2 }}>{recipe.title}</h1>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "0.875rem" }}>
        {timeDisplay && (
          <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            <IconClock /> {timeDisplay}
          </span>
        )}
        {recipe.source && (
          <a href={recipe.source} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Fonte ↗
          </a>
        )}
      </div>

      {/* Tag */}
      {recipe.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1.5rem" }}>
          {recipe.tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
      )}

      {/* Slider porzioni */}
      <div className="card" style={{ padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Porzioni
        </p>
        <ServingsSlider
          value={currentServings}
          baseYield={recipe.yield}
          onChange={(n) => setServings(n)}
          max={20}
        />
      </div>

      {/* Ingredienti */}
      <section style={{ marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Ingredienti</h2>
          {currentIngredients.length > 1 && (
            <button
              onClick={handleCheckAll}
              style={{ fontSize: "0.8rem", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
            >
              {allChecked ? "Deseleziona tutti" : "Seleziona tutti"}
            </button>
          )}
        </div>

        <ul style={{ margin: 0, padding: 0 }}>
          {scaled.map((ing) => (
            <IngredientRow
              key={ing.id}
              ingredient={ing}
              baseYield={currentServings}
              targetYield={currentServings}
              onToggle={handleToggleIngredient}
              showCheck
            />
          ))}
        </ul>
      </section>

      {/* Procedimento */}
      {recipe.steps.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ margin: "0 0 0.75rem", fontSize: "1.2rem" }}>Procedimento</h2>
          <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {recipe.steps.map((step, i) => (
              <li key={i} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: "0.875rem", alignItems: "start" }}>
                <span style={{
                  width: 32, height: 32,
                  borderRadius: "50%",
                  background: "var(--brand-light)",
                  color: "var(--brand-dark)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-serif)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <p style={{ margin: "0.35rem 0 0", lineHeight: 1.65, fontSize: "0.9375rem" }}>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Note */}
      {recipe.notes && (
        <div className="card" style={{ padding: "1rem 1.25rem", marginBottom: "1.75rem", borderLeft: "3px solid var(--brand)" }}>
          <p style={{ margin: "0 0 0.3rem", fontSize: "0.78rem", fontWeight: 700, color: "var(--brand)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Note</p>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{recipe.notes}</p>
        </div>
      )}

      {/* CTA Cucina */}
      <div style={{ position: "sticky", bottom: "1rem", display: "flex", justifyContent: "center" }} className="no-print">
        <button
          className="btn btn-primary btn-cooking"
          onClick={handleStartCooking}
          style={{ gap: "0.5rem", boxShadow: "var(--shadow-modal)", minWidth: 220 }}
        >
          <IconChefHat /> Inizia a cucinare
        </button>
      </div>

      {/* Toast */}
      {toast.msg && (
        <div className="toast" role="status">{toast.msg}</div>
      )}

      {/* Modale eliminazione */}
      {showDelete && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
