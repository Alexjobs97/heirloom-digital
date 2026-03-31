/**
 * RecipeDetailPage.tsx v5 — Visualizzazione bilingue IT/JP.
 * FIX: usa useLang() (reattivo) invece di getCurrentLocale() (snapshot).
 */

import { useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecipe, useRecipes } from "../hooks/useRecipes";
import { useScaledIngredients } from "../hooks/useScaledIngredients";
import { clampServings, formatTime } from "../lib/scaling";
import { exportSingleRecipe } from "../lib/io";
import { getLocalizedContent } from "../lib/recipeLocale";
import type { Locale } from "../lib/recipeLocale";
import type { Ingredient } from "../types";
import ServingsSlider from "../components/ServingsSlider";
import IngredientRow from "../components/IngredientRow";
import { useTranslation } from "../i18n/useTranslation";
import { useLang } from "../i18n/LangContext";

function IconBack()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>; }
function IconEdit()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function IconHeart({ f }: { f?: boolean }) { return <svg viewBox="0 0 24 24" fill={f ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function IconTrash()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>; }
function IconClock()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function IconChef()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>; }
function IconClipboard() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>; }
function IconDownload()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }

const PALETTES = [
  ["#c47a4a","#7a3d1e"],["#8a7a5a","#453c29"],["#6a8a6c","#324035"],
  ["#8a6a7a","#42303a"],["#7a8a5c","#3a422c"],["#5a7a8a","#2a3a42"],
];

function HeroPlaceholder({ title }: { title: string }) {
  const initial = title.trim()[0]?.toUpperCase() ?? "R";
  const p = PALETTES[initial.charCodeAt(0) % PALETTES.length];
  return (
    <div style={{
      width: "100%", aspectRatio: "16/5",
      background: `linear-gradient(135deg, ${p[0]} 0%, ${p[1]} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: "var(--radius-lg)",
    }}>
      <span style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(3rem,8vw,5rem)", fontWeight: 700, color: "rgba(255,255,255,0.2)" }}>
        {initial}
      </span>
    </div>
  );
}

function recipeToText(title: string, yieldN: number, totalTime: number, ingredients: Ingredient[], steps: string[]): string {
  const lines: string[] = [];
  lines.push(`🍽️  ${title}`);
  lines.push("─".repeat(Math.min(title.length + 5, 44)));
  if (yieldN > 0)    lines.push(`👥 Porzioni: ${yieldN}`);
  if (totalTime > 0) lines.push(`⏱  Tempo: ${formatTime(totalTime)}`);
  lines.push(""); lines.push("INGREDIENTI");
  ingredients.forEach((ing) => {
    const qty  = ing.qty && String(ing.qty) !== "0" ? String(ing.qty) : "";
    const unit = ing.unit ?? "";
    lines.push(`  • ${[qty, unit, ing.displayName].filter(Boolean).join(" ")}`);
  });
  lines.push(""); lines.push("PROCEDIMENTO");
  steps.forEach((step, i) => lines.push(`  ${i + 1}. ${step}`));
  lines.push("\n─── ✦ Heirloom Digital ✦ ───");
  return lines.join("\n");
}

function DeleteModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <p style={{ fontSize: "2rem", margin: "0 0 0.75rem" }}>🗑️</p>
        <h2 style={{ marginTop: 0, fontSize: "1.2rem" }}>{t("detail.delete")}</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>{t("detail.delete.confirm")}</p>
        <div style={{ display: "flex", gap: "0.625rem", justifyContent: "flex-end" }}>
          <button className="btn btn-secondary" onClick={onCancel}>{t("detail.delete.no")}</button>
          <button className="btn btn-danger" onClick={onConfirm}>{t("detail.delete.yes")}</button>
        </div>
      </div>
    </div>
  );
}

function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const show = useCallback((m: string) => { setMsg(m); setTimeout(() => setMsg(null), 2500); }, []);
  return { msg, show };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RecipeDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t }    = useTranslation();
  const { lang } = useLang();               // ← reattivo
  const locale   = lang as Locale;

  const { recipe, loading, error } = useRecipe(id);
  const { removeRecipe, toggleStar, markCooked } = useRecipes();
  const toast = useToast();

  const [servings,   setServings]   = useState<number | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [checked,    setChecked]    = useState<Record<string, boolean>>({});

  // Contenuto localizzato — ricalcola quando lang cambia
  const localized = useMemo(
    () => recipe ? getLocalizedContent(recipe, locale) : null,
    [recipe, locale]
  );

  const currentServings = servings ?? recipe?.yield ?? 4;
  const baseIngredients = localized?.ingredients ?? [];
  const scaled = useScaledIngredients(baseIngredients, recipe?.yield ?? 4, currentServings);
  const scaledWithCheck = scaled.map((ing) => ({ ...ing, checked: checked[ing.id] ?? false }));
  const allChecked = scaledWithCheck.every((i) => i.checked);

  const handleToggleIngredient = useCallback((ingId: string) => {
    setChecked((prev) => ({ ...prev, [ingId]: !prev[ingId] }));
  }, []);

  const handleCheckAll = useCallback(() => {
    const next: Record<string, boolean> = {};
    scaledWithCheck.forEach((i) => { next[i.id] = !allChecked; });
    setChecked(next);
  }, [scaledWithCheck, allChecked]);

  const handleToggleStar = useCallback(async () => {
    if (!id) return;
    await toggleStar(id);
    toast.show(recipe?.starred ? "Rimossa dai preferiti" : "⭐ Aggiunta ai preferiti");
  }, [id, toggleStar, recipe, toast]);

  const handleCopy = useCallback(async () => {
    if (!recipe || !localized) return;
    const text = recipeToText(localized.title, recipe.yield, recipe.totalTime, localized.ingredients, localized.steps);
    try {
      if (navigator.share && /Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        await navigator.share({ title: localized.title, text });
        toast.show("✓ Ricetta condivisa");
      } else {
        await navigator.clipboard.writeText(text);
        toast.show("📋 Copiata negli appunti");
      }
    } catch {
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = `${localized.title.replace(/[^a-z0-9]/gi, "_")}.txt`; a.click();
      URL.revokeObjectURL(url);
      toast.show("📄 File .txt scaricato");
    }
  }, [recipe, localized, toast]);

  const handleBackup = useCallback(async () => {
    if (!recipe) return;
    await exportSingleRecipe(recipe);
    toast.show("💾 Backup JSON esportato");
  }, [recipe, toast]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    await removeRecipe(id);
    navigate("/");
  }, [id, removeRecipe, navigate]);

  const handleStartCooking = useCallback(async () => {
    if (!id) return;
    await markCooked(id).catch(() => {});
    navigate(`/cucina/${id}?servings=${currentServings}`);
  }, [id, navigate, currentServings, markCooked]);

  // ── Loading / Error ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1rem" }}>
        <div className="skeleton" style={{ height: 200, borderRadius: "var(--radius-lg)", marginBottom: "1.5rem" }} />
        <div className="skeleton" style={{ height: 32, width: "60%", marginBottom: "0.75rem" }} />
        <div className="skeleton" style={{ height: 18, width: "40%" }} />
      </div>
    );
  }

  if (error || !recipe || !localized) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-muted)" }}>
        <p style={{ fontSize: "2.5rem" }}>🍽️</p>
        <h2 style={{ color: "var(--text-primary)" }}>{t("error.notFound")}</h2>
        <button className="btn btn-primary" onClick={() => navigate("/")} style={{ marginTop: "1.5rem" }}>
          {t("misc.back")}
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "1.25rem 1rem 6rem" }}>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}
          style={{ gap: "0.3rem", padding: "0.5rem 0.75rem" }}>
          <IconBack /> {t("misc.back")}
        </button>

        {/* Badge bilingue */}
        {localized.hasJa && (
          <span style={{
            fontSize: "0.68rem", fontWeight: 700, padding: "0.2rem 0.55rem",
            background: localized.isJa ? "var(--brand)" : "var(--brand-light)",
            color: localized.isJa ? "#fff" : "var(--brand-dark)",
            borderRadius: "var(--radius-full)", letterSpacing: "0.04em",
          }}>
            {localized.isJa ? "🇯🇵 JP" : "🇮🇹 IT"}
          </span>
        )}

        <div style={{ marginLeft: "auto", display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
          <button className="btn btn-secondary" onClick={() => navigate(`/ricette/${id}/modifica`)}
            style={{ gap: "0.35rem", padding: "0.5rem 0.875rem", fontSize: "0.875rem" }}>
            <IconEdit /> {t("misc.edit")}
          </button>
          <button className="btn btn-ghost" onClick={handleToggleStar}
            style={{ padding: "0.5rem 0.65rem", color: recipe.starred ? "#b5541e" : undefined }}>
            <IconHeart f={recipe.starred} />
          </button>
          <button className="btn btn-ghost" onClick={handleCopy}
            title={t("detail.share")} style={{ padding: "0.5rem 0.65rem" }}>
            <IconClipboard />
          </button>
          <button className="btn btn-ghost" onClick={handleBackup}
            title="Backup JSON" style={{ padding: "0.5rem 0.65rem" }}>
            <IconDownload />
          </button>
          <button className="btn btn-ghost" onClick={() => setShowDelete(true)}
            style={{ padding: "0.5rem 0.65rem", color: "var(--error)" }}>
            <IconTrash />
          </button>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: "1.5rem" }}>
        {recipe.coverImage
          ? <img src={recipe.coverImage} alt={localized.title}
              style={{ width: "100%", aspectRatio: "16/5", objectFit: "cover", borderRadius: "var(--radius-lg)", display: "block" }} />
          : <HeroPlaceholder title={localized.title} />
        }
      </div>

      {/* ── Titolo + meta ────────────────────────────────────────────────── */}
      <h1 style={{ margin: "0 0 0.5rem", lineHeight: 1.2 }}>{localized.title}</h1>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "0.875rem" }}>
        {recipe.totalTime > 0 && (
          <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            <IconClock /> {formatTime(recipe.totalTime)}
          </span>
        )}
        {recipe.source && (
          <a href={recipe.source} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {t("detail.source")} ↗
          </a>
        )}
        {recipe.lastCooked && (
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            🕐 {new Date(recipe.lastCooked).toLocaleDateString(locale === "ja" ? "ja-JP" : "it-IT")}
          </span>
        )}
      </div>

      {recipe.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1.5rem" }}>
          {recipe.tags.map((tg) => <span key={tg} className="tag">{tg}</span>)}
        </div>
      )}

      {/* ── Slider porzioni ──────────────────────────────────────────────── */}
      <div className="card" style={{ padding: "1rem 1.25rem", marginBottom: "1.75rem" }}>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {t("detail.servings")}
        </p>
        <ServingsSlider value={currentServings} baseYield={recipe.yield}
          onChange={(n) => setServings(n)} max={20} />
      </div>

      {/* ── Ingredienti ──────────────────────────────────────────────────── */}
      <section style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{t("detail.ingredients")}</h2>
          {scaledWithCheck.length > 1 && (
            <button onClick={handleCheckAll}
              style={{ fontSize: "0.8rem", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              {allChecked ? t("detail.ingredients.uncheckAll") : t("detail.ingredients.checkAll")}
            </button>
          )}
        </div>
        <ul style={{ margin: 0, padding: 0 }}>
          {scaledWithCheck.map((ing) => (
            <IngredientRow key={ing.id} ingredient={ing}
              baseYield={currentServings} targetYield={currentServings}
              onToggle={handleToggleIngredient} showCheck />
          ))}
        </ul>
      </section>

      {/* ── Procedimento ─────────────────────────────────────────────────── */}
      {localized.steps.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1.2rem" }}>{t("detail.steps")}</h2>
          <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {localized.steps.map((step, i) => (
              <li key={i} style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: "1rem", alignItems: "start" }}>
                <span style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "var(--brand)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0,
                }}>{i + 1}</span>
                <p style={{ margin: "0.4rem 0 0", lineHeight: 1.7, fontSize: "0.9375rem", color: "var(--text-secondary)" }}>{step}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── Note ─────────────────────────────────────────────────────────── */}
      {localized.notes && (
        <div className="card" style={{ padding: "1rem 1.25rem", marginBottom: "1.75rem", borderLeft: "3px solid var(--brand)" }}>
          <p style={{ margin: "0 0 0.3rem", fontSize: "0.72rem", fontWeight: 700, color: "var(--brand)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {t("detail.notes")}
          </p>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{localized.notes}</p>
        </div>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <div style={{ position: "sticky", bottom: "1.25rem", display: "flex", justifyContent: "center" }}>
        <button className="btn btn-primary btn-cooking" onClick={handleStartCooking}
          style={{ gap: "0.5rem", boxShadow: "0 6px 24px rgba(181,84,30,0.38)", minWidth: 220 }}>
          <IconChef /> {t("detail.cook")}
        </button>
      </div>

      {toast.msg && <div className="toast" role="status">{toast.msg}</div>}
      {showDelete && <DeleteModal onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />}
    </div>
  );
}
