/**
 * RecipeDetailPage.tsx — Premium mobile-first recipe detail with hero, bento ingredients, shared notes.
 */

import { useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecipe, useRecipes } from "../hooks/useRecipes";
import { useScaledIngredients } from "../hooks/useScaledIngredients";
import { useShoppingList } from "../hooks/useShoppingList";
import { usePersonalNote } from "../hooks/usePersonalNotes";
import { clampServings, formatTime, toDisplayQty, scaleQty } from "../lib/scaling";
import { exportSingleRecipe } from "../lib/io";
import { getLocalizedContent } from "../lib/recipeLocale";
import type { Locale } from "../lib/recipeLocale";
import type { Ingredient } from "../types";
import { useTranslation } from "../i18n/useTranslation";
import { useLang } from "../i18n/LangContext";
import NutritionModal from "./NutritionModal";

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconBack()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>; }
function IconHeart({ f }: { f?: boolean }) { return <svg viewBox="0 0 24 24" fill={f ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function IconClock()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function IconChef()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>; }
function IconCart()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>; }
function IconShare()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>; }
function IconNutrition() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>; }
function IconUsers()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function IconEdit()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function IconTrash()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>; }
function IconX()         { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function IconMinus()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function IconPlus()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }

// ── Hero placeholder gradient ───────────────────────────────────────────────────
const PAL = [["#8B7355","#5D4E3A"],["#6B8E6B","#3D5C3D"],["#7A6B8A","#4A3D5A"],["#8A7A5A","#5A4A3A"],["#5A7A8A","#3A4A5A"],["#8A5A6A","#5A3A4A"]];
function HeroPlaceholder({ title }: { title: string }) {
  const idx = (title.trim()[0]?.toUpperCase() ?? "R").charCodeAt(0) % PAL.length;
  const [c1, c2] = PAL[idx];
  return (
    <div className="hero-placeholder" style={{ background: `linear-gradient(160deg, ${c1} 0%, ${c2} 100%)` }}>
      <span style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(4rem,12vw,7rem)", fontWeight: 700, color: "rgba(255,255,255,0.08)", userSelect: "none" }}>
        {title.trim()[0]?.toUpperCase() ?? "R"}
      </span>
    </div>
  );
}

// ── recipeToText for sharing ───────────────────────────────────────────────────
function recipeToText(title: string, y: number, t: number, ings: Ingredient[], steps: string[]): string {
  const l: string[] = [title, "─".repeat(Math.min(title.length+2,40))];
  if (y>0) l.push(`Porzioni: ${y}`); if (t>0) l.push(`Tempo: ${formatTime(t)}`);
  l.push("","INGREDIENTI");
  ings.forEach((i) => l.push(`  - ${[i.qty&&String(i.qty)!=="0"?String(i.qty):"",i.unit,i.displayName].filter(Boolean).join(" ")}`));
  l.push("","PROCEDIMENTO");
  steps.forEach((s,i) => l.push(`${i+1}. ${s}`));
  l.push("\n— Heirloom Digital —");
  return l.join("\n");
}

// ── Add to list modal ────────────────────────────────────────────────────────
function AddToListModal({ ingredients, recipeTitle, onClose }: {
  ingredients: Ingredient[]; recipeTitle: string; onClose: () => void;
}) {
  const { addFromRecipe } = useShoppingList();
  const { locale } = useTranslation();
  const filtered = ingredients.filter((i) => { const q = i.qty; return !(typeof q === "string" && (q==="q.b."||q==="qb")); });
  const [sel, setSel] = useState<Set<string>>(new Set(filtered.filter((i) => !i.checked).map((i) => i.id)));
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
          <h3 style={{ margin: 0, fontFamily: "var(--font-serif)" }}>{locale==="ja" ? "買い物リストに追加" : "Aggiungi alla lista"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: "0.25rem" }}><IconX /></button>
        </div>
        <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => setSel(allOn ? new Set() : new Set(filtered.map((i) => i.id)))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brand)", fontSize: "0.82rem", fontWeight: 700 }}>
            {allOn ? (locale==="ja" ? "すべて解除" : "Deseleziona") : (locale==="ja" ? "すべて選択" : "Seleziona tutti")}
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", maxHeight: "50dvh", overflowY: "auto" }}>
          {filtered.map((ing) => (
            <label key={ing.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.5rem", cursor: "pointer", borderRadius: "var(--radius-md)", background: sel.has(ing.id) ? "var(--brand-light)" : "transparent", transition: "background 0.15s" }}>
              <input type="checkbox" className="ingredient-checkbox" checked={sel.has(ing.id)} onChange={() => toggle(ing.id)} />
              <span style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>
                {ing.qty && String(ing.qty) !== "0" && <span style={{ color: "var(--brand)", fontWeight: 700, marginRight: "0.35rem" }}>{String(ing.qty)}{ing.unit ? " "+ing.unit : ""}</span>}
                {ing.displayName}
              </span>
            </label>
          ))}
        </div>
        <button className="btn btn-primary" onClick={handle} disabled={sel.size === 0} style={{ width: "100%", marginTop: "1.25rem", gap: "0.5rem" }}>
          <IconCart /> {locale==="ja" ? `${sel.size}品を追加` : `Aggiungi ${sel.size} articol${sel.size===1?"o":"i"}`}
        </button>
      </div>
    </div>
  );
}

// ── Delete confirmation modal ───────────────────────────────────────────────────
function DeleteModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="modal-overlay modal-centered" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center", maxWidth: 380 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--error-bg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
          <IconTrash />
        </div>
        <h2 style={{ marginTop: 0, fontSize: "1.25rem", fontFamily: "var(--font-serif)" }}>{t("detail.delete")}</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>{t("detail.delete.confirm")}</p>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn btn-ghost" onClick={onCancel} style={{ flex: 1 }}>{t("detail.delete.no")}</button>
          <button className="btn btn-danger" onClick={onConfirm} style={{ flex: 1 }}>{t("detail.delete.yes")}</button>
        </div>
      </div>
    </div>
  );
}

// ── Toast hook ────────────────────────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const show = useCallback((m: string) => { setMsg(m); setTimeout(() => setMsg(null), 2500); }, []);
  return { msg, show };
}

// ── Premium Servings Slider ────────────────────────────────────────────────────
function PremiumServingsSlider({ value, baseYield, onChange, min = 1, max = 12 }: {
  value: number; baseYield: number; onChange: (n: number) => void; min?: number; max?: number;
}) {
  const { locale } = useTranslation();
  const dec = useCallback(() => onChange(clampServings(value - 1)), [value, onChange]);
  const inc = useCallback(() => onChange(clampServings(value + 1)), [value, onChange]);
  const isBase = value === baseYield;
  
  return (
    <div className="servings-slider">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <IconUsers />
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {locale === "ja" ? "人数" : "Porzioni"}
          </span>
        </div>
        {!isBase && (
          <button onClick={() => onChange(baseYield)} style={{ fontSize: "0.75rem", color: "var(--brand)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
            {locale === "ja" ? "リセット" : "Reset"} ({baseYield})
          </button>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button onClick={dec} disabled={value <= min} className="servings-btn" aria-label="Decrease">
          <IconMinus />
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 700, color: "var(--brand)", lineHeight: 1 }}>
            {value}
          </span>
        </div>
        <button onClick={inc} disabled={value >= max} className="servings-btn" aria-label="Increase">
          <IconPlus />
        </button>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(clampServings(parseInt(e.target.value)))}
        style={{ width: "100%", marginTop: "0.75rem" }}
      />
    </div>
  );
}

// ── Bento Ingredient Card ────────────────────────────────────────────────────
// Uses Spoonacular CDN for ingredient images - no local storage needed!
import { getIngredientImageUrl, getIngredientFallbackStyle } from "../lib/ingredientIcons";

function BentoIngredientCard({ ingredient, baseYield, targetYield }: {
  ingredient: Ingredient; baseYield: number; targetYield: number;
}) {
  const [imgError, setImgError] = useState(false);
  const scaled = scaleQty(ingredient.qty, baseYield, targetYield);
  let qtyDisplay = "";
  if (typeof scaled === "string") {
    qtyDisplay = scaled;
  } else if (scaled > 0) {
    qtyDisplay = toDisplayQty(scaled);
  }
  
  // Get image URL from Spoonacular CDN (free, no API key needed for images)
  const imageUrl = getIngredientImageUrl(ingredient.displayName, ingredient.canonicalId);
  const fallback = getIngredientFallbackStyle(ingredient.displayName);
  const showImage = imageUrl && !imgError;
  
  return (
    <div className="bento-ingredient">
      <div 
        className="bento-ingredient-icon" 
        style={{ 
          background: showImage ? "#fff" : fallback.bg,
          border: showImage ? "2px solid #f0f0f0" : "none",
        }}
      >
        {showImage ? (
          <img 
            src={imageUrl} 
            alt={ingredient.displayName}
            onError={() => setImgError(true)}
            loading="lazy"
            style={{ width: "80%", height: "80%", objectFit: "contain" }}
          />
        ) : (
          <span style={{ fontSize: "1.25rem", fontWeight: 700, color: fallback.text }}>
            {ingredient.displayName.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="bento-ingredient-name">{ingredient.displayName}</div>
      {qtyDisplay && (
        <div className="bento-ingredient-qty">
          {qtyDisplay}{ingredient.unit ? ` ${ingredient.unit}` : ""}
        </div>
      )}
    </div>
  );
}

// ── Shared Notes (Post-it style) ────────────────────────────────────────────────
function SharedNotes({ recipeId, locale }: { recipeId: string; locale: string }) {
  const { note, updateNote, saving, saved } = usePersonalNote(recipeId);
  
  return (
    <div className="shared-notes">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {locale === "ja" ? "共有メモ" : "Note condivise"}
        </span>
        {saving && <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{locale === "ja" ? "保存中..." : "Salvando..."}</span>}
        {saved && <span style={{ fontSize: "0.7rem", color: "var(--brand)", fontWeight: 600 }}>{locale === "ja" ? "保存完了" : "Salvato"}</span>}
      </div>
      <textarea
        value={note}
        onChange={(e) => updateNote(e.target.value)}
        placeholder={locale === "ja" 
          ? "ここにメモを書いてください...\n次回の調整点やコツなど"
          : "Scrivi qui le note per te e il tuo partner...\nModifiche, variazioni, ricordi speciali"}
        className="shared-notes-textarea"
      />
    </div>
  );
}

// ── Main Page Component ──────────────────────────────────────────────────────────
export default function RecipeDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t }    = useTranslation();
  const { lang } = useLang();
  const locale   = lang as Locale;

  const { recipe, loading, error } = useRecipe(id);
  const { removeRecipe, toggleStar, markCooked } = useRecipes();
  const toast = useToast();

  const [servings,       setServings]       = useState<number | null>(null);
  const [showDelete,     setShowDelete]     = useState(false);
  const [showAddList,    setShowAddList]    = useState(false);
  const [showNutrition,  setShowNutrition]  = useState(false);
  const [showMenu,       setShowMenu]       = useState(false);

  const localized = useMemo(() => recipe ? getLocalizedContent(recipe, locale) : null, [recipe, locale]);
  const currentServings = servings ?? recipe?.yield ?? 4;
  const scaled = useScaledIngredients(localized?.ingredients ?? [], recipe?.yield ?? 4, currentServings);
  const baseScaled = useScaledIngredients(recipe?.ingredients ?? [], recipe?.yield ?? 4, currentServings);

  const handleToggleStar = useCallback(async () => {
    if (!id) return;
    await toggleStar(id);
    toast.show(recipe?.starred ? (locale==="ja" ? "お気に入りから削除" : "Rimossa dai preferiti") : (locale==="ja" ? "お気に入りに追加" : "Aggiunta ai preferiti"));
  }, [id, toggleStar, recipe, toast, locale]);

  const handleShare = useCallback(async () => {
    if (!recipe || !localized) return;
    const text = recipeToText(localized.title, recipe.yield, recipe.totalTime, localized.ingredients, localized.steps);
    try {
      if (navigator.share && /Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        await navigator.share({ title: localized.title, text });
        toast.show(locale==="ja" ? "共有しました" : "Condiviso");
      } else {
        await navigator.clipboard.writeText(text);
        toast.show(locale==="ja" ? "コピーしました" : "Copiato");
      }
    } catch {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
      a.download = `${localized.title.replace(/[^a-z0-9]/gi,"_")}.txt`;
      a.click();
      toast.show(locale==="ja" ? "ダウンロードしました" : "Scaricato");
    }
    setShowMenu(false);
  }, [recipe, localized, toast, locale]);

  const handleBackup = useCallback(async () => {
    if (!recipe) return;
    await exportSingleRecipe(recipe);
    toast.show(locale==="ja" ? "バックアップ完了" : "Backup esportato");
    setShowMenu(false);
  }, [recipe, toast, locale]);

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

  // Loading state
  if (loading) return (
    <div className="recipe-detail-loading">
      <div className="skeleton hero-skeleton" />
      <div style={{ padding: "1.5rem" }}>
        <div className="skeleton" style={{ height: 36, width: "75%", marginBottom: "1rem" }} />
        <div className="skeleton" style={{ height: 20, width: "40%", marginBottom: "2rem" }} />
        <div className="skeleton" style={{ height: 100, marginBottom: "1.5rem" }} />
        <div className="skeleton" style={{ height: 150 }} />
      </div>
    </div>
  );

  // Error state
  if (error || !recipe || !localized) return (
    <div style={{ textAlign: "center", padding: "4rem 1.5rem", color: "var(--text-muted)" }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem", opacity: 0.3 }}>?</div>
      <h2 style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>{t("error.notFound")}</h2>
      <button className="btn btn-primary" onClick={() => navigate("/")} style={{ marginTop: "1.5rem" }}>{t("misc.back")}</button>
    </div>
  );

  return (
    <div className="recipe-detail">
      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <div className="recipe-hero">
        {recipe.coverImage ? (
          <img src={recipe.coverImage} alt={localized.title} className="recipe-hero-img" />
        ) : (
          <HeroPlaceholder title={localized.title} />
        )}
        
        {/* Floating back button */}
        <button onClick={() => navigate(-1)} className="hero-back-btn" aria-label="Back">
          <IconBack />
        </button>
        
        {/* Floating favorite button */}
        <button onClick={handleToggleStar} className="hero-fav-btn" aria-label="Favorite" style={{ color: recipe.starred ? "var(--brand)" : undefined }}>
          <IconHeart f={recipe.starred} />
        </button>

        {/* Hero overlay gradient */}
        <div className="recipe-hero-overlay" />
        
        {/* Title overlay */}
        <div className="recipe-hero-content">
          <h1 className="recipe-hero-title">{localized.title}</h1>
          <div className="recipe-hero-meta">
            {recipe.totalTime > 0 && (
              <span className="recipe-meta-item">
                <IconClock /> {formatTime(recipe.totalTime)}
              </span>
            )}
            {recipe.yield > 0 && (
              <span className="recipe-meta-item">
                <IconUsers /> {recipe.yield} {locale === "ja" ? "人分" : "porzioni"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Content Section ────────────────────────────────────────────── */}
      <div className="recipe-content">
        {/* Tags */}
        {recipe.tags.length > 0 && (
          <div className="recipe-tags">
            {recipe.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
          </div>
        )}

        {/* Action bar */}
        <div className="recipe-actions">
          <button className="action-btn action-btn--teal" onClick={() => setShowAddList(true)}>
            <IconCart />
            <span>{locale === "ja" ? "リスト" : "Lista"}</span>
          </button>
          <button className="action-btn action-btn--orange" onClick={() => setShowNutrition(true)}>
            <IconNutrition />
            <span>{locale === "ja" ? "栄養" : "Nutrizione"}</span>
          </button>
          <button className="action-btn action-btn--purple" onClick={handleShare}>
            <IconShare />
            <span>{locale === "ja" ? "共有" : "Condividi"}</span>
          </button>
          <button className="action-btn action-btn--blue" onClick={() => setShowMenu(v => !v)}>
            <IconEdit />
            <span>{locale === "ja" ? "編集" : "Modifica"}</span>
          </button>
        </div>

        {/* Dropdown menu */}
        {showMenu && (
          <>
            <div style={{ position: "fixed", inset: 0, zIndex: 45 }} onClick={() => setShowMenu(false)} />
            <div className="recipe-menu">
              <button onClick={() => { navigate(`/ricette/${id}/modifica`); setShowMenu(false); }}>
                {locale === "ja" ? "レシピを編集" : "Modifica ricetta"}
              </button>
              <button onClick={handleBackup}>
                {locale === "ja" ? "バックアップ" : "Esporta backup"}
              </button>
              <button onClick={() => { setShowDelete(true); setShowMenu(false); }} style={{ color: "var(--error)" }}>
                {locale === "ja" ? "削除" : "Elimina"}
              </button>
            </div>
          </>
        )}

        {/* Servings slider */}
        <section className="recipe-section">
          <PremiumServingsSlider
            value={currentServings}
            baseYield={recipe.yield}
            onChange={(n) => setServings(n)}
            max={16}
          />
        </section>

        {/* Bento-style Ingredients */}
        <section className="recipe-section">
          <h2 className="section-title">{locale === "ja" ? "材料" : "Ingredienti"}</h2>
          <div className="bento-grid">
            {scaled.map((ing) => (
              <BentoIngredientCard
                key={ing.id}
                ingredient={ing}
                baseYield={currentServings}
                targetYield={currentServings}
              />
            ))}
          </div>
        </section>

        {/* Steps */}
        {localized.steps.length > 0 && (
          <section className="recipe-section">
            <h2 className="section-title">{locale === "ja" ? "作り方" : "Procedimento"}</h2>
            <ol className="recipe-steps">
              {localized.steps.map((step, i) => (
                <li key={i} className="recipe-step">
                  <span className="step-number">{i + 1}</span>
                  <p className="step-text">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Recipe notes (original) */}
        {localized.notes && (
          <div className="recipe-notes-card">
            <p className="notes-label">{locale === "ja" ? "メモ" : "Note della ricetta"}</p>
            <p className="notes-text">{localized.notes}</p>
          </div>
        )}

        {/* Shared notes (post-it style) */}
        <section className="recipe-section">
          <SharedNotes recipeId={id ?? ""} locale={locale} />
        </section>
      </div>

      {/* ── Floating CTA ───────────────────────────────────────────────── */}
      <div className="recipe-cta">
        <button className="btn btn-primary btn-cooking" onClick={handleStartCooking}>
          <IconChef /> {locale === "ja" ? "調理開始" : "Inizia a cucinare"}
        </button>
      </div>

      {/* ── Toast ────────────────────────────────────────────────────────── */}
      {toast.msg && <div className="toast" role="status">{toast.msg}</div>}

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      {showDelete && <DeleteModal onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />}
      {showAddList && (
        <AddToListModal
          ingredients={scaled}
          recipeTitle={localized.title}
          onClose={() => {
            setShowAddList(false);
            toast.show(locale === "ja" ? "リストに追加しました" : "Aggiunto alla lista");
          }}
        />
      )}
      {showNutrition && <NutritionModal ingredients={baseScaled} servings={currentServings} onClose={() => setShowNutrition(false)} />}
    </div>
  );
}
