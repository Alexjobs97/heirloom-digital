/**
 * RecipeDetailPage.tsx v6 — Nutrizione + Note personali + Aggiungi alla lista.
 */

import { useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecipe, useRecipes } from "../hooks/useRecipes";
import { useScaledIngredients } from "../hooks/useScaledIngredients";
import { useShoppingList } from "../hooks/useShoppingList";
import { usePersonalNote } from "../hooks/usePersonalNotes";
import { clampServings, formatTime } from "../lib/scaling";
import { exportSingleRecipe } from "../lib/io";
import { getLocalizedContent } from "../lib/recipeLocale";
import type { Locale } from "../lib/recipeLocale";
import type { Ingredient } from "../types";
import ServingsSlider from "../components/ServingsSlider";
import IngredientRow from "../components/IngredientRow";
import { useTranslation } from "../i18n/useTranslation";
import { useLang } from "../i18n/LangContext";
import { calculateNutrition, MACRO_ROWS, formatExtraKey } from "../lib/nutrition";

// ── Icone ─────────────────────────────────────────────────────────────────────
function IconBack()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>; }
function IconEdit()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function IconHeart({ f }: { f?: boolean }) { return <svg viewBox="0 0 24 24" fill={f ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function IconTrash()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>; }
function IconClock()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function IconChef()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>; }
function IconCart()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>; }
function IconClipboard() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>; }
function IconDownload()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }
function IconNutrition() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><path d="M18 2l4 4-4 4"/></svg>; }
function IconNote()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>; }
function IconX()         { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function IconChevron()   { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="6 9 12 15 18 9"/></svg>; }

// ── Hero placeholder ───────────────────────────────────────────────────────────
const PAL = [["#c47a4a","#7a3d1e"],["#8a7a5a","#453c29"],["#6a8a6c","#324035"],["#8a6a7a","#42303a"],["#7a8a5c","#3a422c"],["#5a7a8a","#2a3a42"]];
function HeroPlaceholder({ title }: { title: string }) {
  const p = PAL[(title.trim()[0]?.toUpperCase() ?? "R").charCodeAt(0) % PAL.length];
  return (
    <div style={{ width: "100%", aspectRatio: "16/6", background: `linear-gradient(135deg,${p[0]},${p[1]})`, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-lg)" }}>
      <span style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(3rem,8vw,5rem)", fontWeight: 700, color: "rgba(255,255,255,0.15)" }}>
        {title.trim()[0]?.toUpperCase() ?? "R"}
      </span>
    </div>
  );
}

// ── recipeToText ───────────────────────────────────────────────────────────────
function recipeToText(title: string, y: number, t: number, ings: Ingredient[], steps: string[]): string {
  const l: string[] = [`🍽️  ${title}`, "─".repeat(Math.min(title.length+5,44))];
  if (y>0) l.push(`👥 Porzioni: ${y}`); if (t>0) l.push(`⏱  Tempo: ${formatTime(t)}`);
  l.push("","INGREDIENTI");
  ings.forEach((i) => l.push(`  • ${[i.qty&&String(i.qty)!=="0"?String(i.qty):"",i.unit,i.displayName].filter(Boolean).join(" ")}`));
  l.push("","PROCEDIMENTO");
  steps.forEach((s,i) => l.push(`  ${i+1}. ${s}`));
  l.push("\n─── ✦ Heirloom Digital ✦ ───");
  return l.join("\n");
}

// ── Modale: Aggiungi alla lista ────────────────────────────────────────────────
function AddToListModal({ ingredients, recipeTitle, onClose }: {
  ingredients: Ingredient[]; recipeTitle: string; onClose: () => void;
}) {
  const { addFromRecipe } = useShoppingList();
  const { locale } = useTranslation();
  const filtered = ingredients.filter((i) => { const q = i.qty; return !(typeof q === "string" && (q==="q.b."||q==="qb")); });
  const [sel, setSel] = useState<Set<string>>(new Set(filtered.filter((i) => i.checked).map((i) => i.id)));
  const toggle = (id: string) => setSel((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allOn = sel.size === filtered.length;
  const handle = () => {
    const chosen = filtered.filter((i) => sel.has(i.id));
    if (chosen.length > 0) addFromRecipe(chosen, recipeTitle);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h3 style={{ margin: 0 }}>{locale==="ja" ? "買い物リストに追加" : "Aggiungi alla lista"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}><IconX /></button>
        </div>
        <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => setSel(allOn ? new Set() : new Set(filtered.map((i) => i.id)))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brand)", fontSize: "0.8rem", fontWeight: 700 }}>
            {allOn ? (locale==="ja" ? "すべて解除" : "Deseleziona tutti") : (locale==="ja" ? "すべて選択" : "Seleziona tutti")}
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "50dvh", overflowY: "auto" }}>
          {filtered.map((ing) => (
            <label key={ing.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0", cursor: "pointer", borderBottom: "1px solid var(--border)" }}>
              <input type="checkbox" className="ingredient-checkbox" checked={sel.has(ing.id)} onChange={() => toggle(ing.id)} />
              <span style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>
                {ing.qty && String(ing.qty) !== "0" && <span style={{ color: "var(--brand)", fontWeight: 700, marginRight: "0.3rem" }}>{String(ing.qty)}{ing.unit ? " "+ing.unit : ""}</span>}
                {ing.displayName}
              </span>
            </label>
          ))}
        </div>
        <button className="btn btn-primary" onClick={handle} disabled={sel.size === 0} style={{ width: "100%", marginTop: "1.25rem", gap: "0.4rem" }}>
          <IconCart /> {locale==="ja" ? `${sel.size}品を追加` : `Aggiungi ${sel.size} ingredient${sel.size===1?"e":"i"}`}
        </button>
      </div>
    </div>
  );
}

// ── Modale: Valori nutrizionali ────────────────────────────────────────────────
function NutritionModal({ ingredients, servings, baseYield, onClose }: {
  ingredients: Ingredient[]; servings: number; baseYield: number; onClose: () => void;
}) {
  const { locale } = useTranslation();
  const [showExtra, setShowExtra] = useState(false);
  const totals = useMemo(() => calculateNutrition(ingredients), [ingredients]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h3 style={{ margin: 0 }}>{locale==="ja" ? "栄養成分" : "Valori nutrizionali"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}><IconX /></button>
        </div>
        <p style={{ margin: "0 0 0.875rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
          {locale==="ja" ? `${servings}人分・概算値` : `Per ${servings} ${servings===1?"porzione":"porzioni"} · valori approssimativi`}
        </p>

        {!totals ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center", padding: "2rem 0" }}>
            {locale==="ja" ? "栄養データが見つかりません" : "Dati nutrizionali non disponibili per questa ricetta"}
          </p>
        ) : (
          <>
            {/* Macro donut-like highlight */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {[
                { label: locale==="ja" ? "エネルギー" : "Energia", value: `${totals.energia_kcal}`, unit: "kcal", color: "var(--brand)" },
                { label: locale==="ja" ? "たんぱく質" : "Proteine", value: `${totals.proteine}`, unit: "g", color: "#4CAF50" },
                { label: locale==="ja" ? "炭水化物" : "Carbo", value: `${totals.carboidrati}`, unit: "g", color: "#FF9800" },
              ].map((m) => (
                <div key={m.label} style={{ background: "var(--bg-page)", borderRadius: "var(--radius-md)", padding: "0.75rem 0.5rem", textAlign: "center", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: 700, color: m.color, fontFamily: "var(--font-serif)" }}>{m.value}</div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 700 }}>{m.unit}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Tabella macros */}
            <table className="nutrition-table">
              <tbody>
                {MACRO_ROWS.map((row) => {
                  if (row.key === "energia_kcal") return null; // già mostrata sopra
                  const val = totals[row.key as keyof typeof totals];
                  if (typeof val !== "number") return null;
                  return (
                    <tr key={row.key} className={row.indent ? "indent" : ""}>
                      <td>{row.label}</td>
                      <td>{val} {row.unit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Extra / oligoelementi */}
            {Object.keys(totals.extra).length > 0 && (
              <div style={{ marginTop: "0.875rem" }}>
                <button onClick={() => setShowExtra((v) => !v)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--brand)", fontWeight: 700, fontSize: "0.82rem", padding: "0.25rem 0" }}>
                  <span style={{ transform: showExtra ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "flex" }}><IconChevron /></span>
                  {locale==="ja" ? "その他の栄養素" : "Oligoelementi e micronutrienti"}
                </button>
                {showExtra && (
                  <table className="nutrition-table" style={{ marginTop: "0.5rem", animation: "fadeIn 0.2s ease" }}>
                    <tbody>
                      {Object.entries(totals.extra).map(([key, val]) => {
                        const { label, unit } = formatExtraKey(key);
                        return (
                          <tr key={key}>
                            <td>{label}</td>
                            <td>{val} {unit}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            <p style={{ margin: "0.875rem 0 0", fontSize: "0.68rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              {locale==="ja" ? "値は概算です。食材のデータがない場合は計算に含まれません。" : "Valori calcolati sulla base degli ingredienti con dati disponibili. Gli ingredienti q.b. (eccetto olio) sono esclusi."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ── Delete modal ───────────────────────────────────────────────────────────────
function DeleteModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal modal-centered" onClick={(e) => e.stopPropagation()} style={{ borderRadius: "var(--radius-xl)", maxWidth: 440, margin: "auto" }}>
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RecipeDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t }    = useTranslation();
  const { lang } = useLang();
  const locale   = lang as Locale;

  const { recipe, loading, error } = useRecipe(id);
  const { removeRecipe, toggleStar, markCooked } = useRecipes();
  const { note, updateNote, saving: noteSaving, saved: noteSaved } = usePersonalNote(id ?? "");
  const toast = useToast();

  const [servings,       setServings]       = useState<number | null>(null);
  const [showDelete,     setShowDelete]      = useState(false);
  const [showAddList,    setShowAddList]     = useState(false);
  const [showNutrition,  setShowNutrition]  = useState(false);
  const [checked,        setChecked]         = useState<Record<string, boolean>>({});

  const localized = useMemo(() => recipe ? getLocalizedContent(recipe, locale) : null, [recipe, locale]);
  const currentServings = servings ?? recipe?.yield ?? 4;
  const scaled = useScaledIngredients(localized?.ingredients ?? [], recipe?.yield ?? 4, currentServings);
  // Sempre dalla versione IT base (per nutrizione lingua-indipendente)
  const baseScaled = useScaledIngredients(recipe?.ingredients ?? [], recipe?.yield ?? 4, currentServings);
  const scaledWithCheck = scaled.map((ing) => ({ ...ing, checked: checked[ing.id] ?? false }));
  const allChecked = scaledWithCheck.every((i) => i.checked);

  const handleToggleIngredient = useCallback((ingId: string) => {
    setChecked((p) => ({ ...p, [ingId]: !p[ingId] }));
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
        await navigator.share({ title: localized.title, text }); toast.show("✓ Ricetta condivisa");
      } else {
        await navigator.clipboard.writeText(text); toast.show("📋 Copiata negli appunti");
      }
    } catch {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
      a.download = `${localized.title.replace(/[^a-z0-9]/gi,"_")}.txt`; a.click();
      toast.show("📄 File scaricato");
    }
  }, [recipe, localized, toast]);

  const handleBackup = useCallback(async () => {
    if (!recipe) return;
    await exportSingleRecipe(recipe); toast.show("💾 Backup JSON esportato");
  }, [recipe, toast]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    await removeRecipe(id); navigate("/");
  }, [id, removeRecipe, navigate]);

  const handleStartCooking = useCallback(async () => {
    if (!id) return;
    await markCooked(id).catch(() => {});
    navigate(`/cucina/${id}?servings=${currentServings}`);
  }, [id, navigate, currentServings, markCooked]);

  if (loading) return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1rem" }}>
      <div className="skeleton" style={{ height: 220, borderRadius: "var(--radius-lg)", marginBottom: "1.5rem" }} />
      <div className="skeleton" style={{ height: 32, width: "60%", marginBottom: "0.75rem" }} />
      <div className="skeleton" style={{ height: 18, width: "40%" }} />
    </div>
  );

  if (error || !recipe || !localized) return (
    <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-muted)" }}>
      <p style={{ fontSize: "2.5rem" }}>🍽️</p>
      <h2 style={{ color: "var(--text-primary)" }}>{t("error.notFound")}</h2>
      <button className="btn btn-primary" onClick={() => navigate("/")} style={{ marginTop: "1.5rem" }}>{t("misc.back")}</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "1rem 1rem 5rem" }}>

      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1.1rem", flexWrap: "wrap" }}>
        <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ gap: "0.3rem", padding: "0.45rem 0.7rem", fontSize: "0.82rem" }}>
          <IconBack /> {t("misc.back")}
        </button>
        {localized.hasJa && (
          <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "0.18rem 0.5rem", background: localized.isJa ? "var(--brand)" : "var(--brand-light)", color: localized.isJa ? "var(--brand-text)" : "var(--brand-dark)", borderRadius: "var(--radius-full)" }}>
            {localized.isJa ? "🇯🇵 JP" : "🇮🇹 IT"}
          </span>
        )}
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
          <button className="btn btn-secondary" onClick={() => navigate(`/ricette/${id}/modifica`)} style={{ gap: "0.3rem", padding: "0.45rem 0.8rem", fontSize: "0.82rem" }}><IconEdit /> {t("misc.edit")}</button>
          <button className="btn btn-ghost" onClick={handleToggleStar} style={{ padding: "0.45rem 0.6rem", color: recipe.starred ? "var(--brand)" : undefined }}><IconHeart f={recipe.starred} /></button>
          <button className="btn btn-ghost" onClick={handleCopy} style={{ padding: "0.45rem 0.6rem" }}><IconClipboard /></button>
          <button className="btn btn-ghost" onClick={handleBackup} style={{ padding: "0.45rem 0.6rem" }}><IconDownload /></button>
          <button className="btn btn-ghost" onClick={() => setShowDelete(true)} style={{ padding: "0.45rem 0.6rem", color: "var(--error)" }}><IconTrash /></button>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: "1.25rem" }}>
        {recipe.coverImage
          ? <img src={recipe.coverImage} alt={localized.title} style={{ width: "100%", aspectRatio: "16/6", objectFit: "cover", borderRadius: "var(--radius-lg)", display: "block" }} />
          : <HeroPlaceholder title={localized.title} />
        }
      </div>

      {/* ── Titolo + meta ────────────────────────────────────────────── */}
      <h1 style={{ margin: "0 0 0.5rem", lineHeight: 1.2 }}>{localized.title}</h1>
      <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", alignItems: "center", marginBottom: "0.875rem" }}>
        {recipe.totalTime > 0 && <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.875rem", color: "var(--text-muted)" }}><IconClock /> {formatTime(recipe.totalTime)}</span>}
        {recipe.source && <a href={recipe.source} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{t("detail.source")} ↗</a>}
        {recipe.lastCooked && <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>🕐 {new Date(recipe.lastCooked).toLocaleDateString(locale==="ja"?"ja-JP":"it-IT")}</span>}
      </div>
      {recipe.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "1.25rem" }}>
          {recipe.tags.map((tg) => <span key={tg} className="tag">{tg}</span>)}
        </div>
      )}

      {/* ── Slider porzioni ──────────────────────────────────────────── */}
      <div className="card" style={{ padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("detail.servings")}</p>
        <ServingsSlider value={currentServings} baseYield={recipe.yield} onChange={(n) => setServings(n)} max={20} />
      </div>

      {/* ── Ingredienti ──────────────────────────────────────────────── */}
      <section style={{ marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.15rem" }}>{t("detail.ingredients")}</h2>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {scaledWithCheck.length > 1 && (
              <button onClick={handleCheckAll} style={{ fontSize: "0.78rem", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                {allChecked ? t("detail.ingredients.uncheckAll") : t("detail.ingredients.checkAll")}
              </button>
            )}
            <button className="btn btn-secondary" onClick={() => setShowAddList(true)} style={{ gap: "0.3rem", padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}>
              <IconCart /> {locale==="ja" ? "リストに追加" : "Aggiungi alla lista"}
            </button>
          </div>
        </div>
        <ul style={{ margin: 0, padding: 0 }}>
          {scaledWithCheck.map((ing) => (
            <IngredientRow key={ing.id} ingredient={ing} baseYield={currentServings} targetYield={currentServings} onToggle={handleToggleIngredient} showCheck />
          ))}
        </ul>
        {/* Pulsante valori nutrizionali */}
        <button className="btn btn-ghost" onClick={() => setShowNutrition(true)} style={{ marginTop: "0.875rem", gap: "0.4rem", fontSize: "0.82rem", width: "100%" }}>
          <IconNutrition /> {locale==="ja" ? "栄養成分を表示" : "Mostra valori nutrizionali"}
        </button>
      </section>

      {/* ── Procedimento ─────────────────────────────────────────────── */}
      {localized.steps.length > 0 && (
        <section style={{ marginBottom: "1.75rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1.15rem" }}>{t("detail.steps")}</h2>
          <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {localized.steps.map((step, i) => (
              <li key={i} style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: "0.875rem", alignItems: "start" }}>
                <span style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--brand)", color: "var(--brand-text)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0 }}>{i+1}</span>
                <p style={{ margin: "0.35rem 0 0", lineHeight: 1.7, fontSize: "0.9375rem", color: "var(--text-secondary)" }}>{step}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── Note ricetta ─────────────────────────────────────────────── */}
      {localized.notes && (
        <div className="card" style={{ padding: "1rem 1.25rem", marginBottom: "1.5rem", borderLeft: "3px solid var(--brand)" }}>
          <p style={{ margin: "0 0 0.3rem", fontSize: "0.7rem", fontWeight: 700, color: "var(--brand)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("detail.notes")}</p>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{localized.notes}</p>
        </div>
      )}

      {/* ── Note personali ────────────────────────────────────────────── */}
      <section style={{ marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <IconNote />
          <h2 style={{ margin: 0, fontSize: "1.05rem" }}>{locale==="ja" ? "個人メモ" : "Note personali"}</h2>
          {noteSaving && <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{locale==="ja" ? "保存中…" : "Salvataggio…"}</span>}
          {noteSaved  && <span style={{ fontSize: "0.72rem", color: "var(--brand)", fontWeight: 700 }}>✓ {locale==="ja" ? "保存" : "Salvato"}</span>}
        </div>
        <textarea
          className="input"
          value={note}
          onChange={(e) => updateNote(e.target.value)}
          placeholder={locale==="ja" ? "このレシピのメモを書いてください…\n（次回の変更点、コツ、思い出など）" : "Scrivi le tue note personali…\n(modifiche future, consigli, ricordi)"}
          style={{ minHeight: 110, fontSize: "0.9rem", lineHeight: 1.65, resize: "vertical" }}
        />
      </section>

      {/* ── CTA Cucina ───────────────────────────────────────────────── */}
      <div style={{ position: "sticky", bottom: "calc(var(--bottom-nav-h) + env(safe-area-inset-bottom) + 0.75rem)", display: "flex", justifyContent: "center" }}>
        <button className="btn btn-primary btn-cooking" onClick={handleStartCooking} style={{ gap: "0.5rem", boxShadow: "0 6px 24px color-mix(in srgb, var(--brand) 38%, transparent)", minWidth: 200 }}>
          <IconChef /> {t("detail.cook")}
        </button>
      </div>

      {toast.msg && <div className="toast" role="status">{toast.msg}</div>}
      {showDelete    && <DeleteModal onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />}
      {showAddList   && <AddToListModal ingredients={scaledWithCheck} recipeTitle={localized.title} onClose={() => { setShowAddList(false); toast.show("🛒 " + (locale==="ja" ? "リストに追加しました" : "Aggiunto alla lista!")); }} />}
      {showNutrition && <NutritionModal ingredients={baseScaled} servings={currentServings} baseYield={recipe.yield} onClose={() => setShowNutrition(false)} />}
    </div>
  );
}
