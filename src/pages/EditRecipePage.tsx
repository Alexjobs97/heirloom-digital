/**
 * EditRecipePage.tsx v2 — Modifica ricetta esistente.
 * FIX: preserva recipe.ja quando si salvano le modifiche (non lo cancella).
 * Usa useTranslation() per tutte le etichette.
 */

import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Ingredient, Recipe } from "../types";
import { useRecipe, useRecipes } from "../hooks/useRecipes";
import { generateId } from "../lib/scaling";
import { compressImage } from "../lib/imageUtils";
import { useTranslation } from "../i18n/useTranslation";

// ─── Icone ────────────────────────────────────────────────────────────────────

function IconBack()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>; }
function IconSave()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>; }
function IconPlus()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function IconTrash() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>; }
function IconImage() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>; }

// ─── Image Upload ─────────────────────────────────────────────────────────────

function ImageUpload({ current, onChange }: { current?: string; onChange: (url: string | undefined) => void }) {
  const { t } = useTranslation();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    e.target.value = "";
    try {
      const compressed = await compressImage(file);
      onChange(compressed);
    } catch {
      // Fallback: FileReader senza compressione
      const reader = new FileReader();
      reader.onload = () => onChange(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <label>Foto della ricetta</label>
      <div style={{
        position: "relative", width: "100%", aspectRatio: "16/5",
        borderRadius: "var(--radius-md)", overflow: "hidden",
        border: "2px dashed var(--border)", background: "var(--bg-page)", cursor: "pointer",
        transition: "border-color 0.15s",
      }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
      >
        {current ? (
          <img src={current} alt="Anteprima" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.4rem", color: "var(--text-muted)" }}>
            <IconImage />
            <span style={{ fontSize: "0.8rem" }}>Clicca per aggiungere una foto</span>
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleFile}
          style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
      </div>
      {current && (
        <button type="button" className="btn btn-ghost" onClick={() => onChange(undefined)}
          style={{ fontSize: "0.8rem", color: "var(--error)", alignSelf: "flex-start" }}>
          Rimuovi foto
        </button>
      )}
    </div>
  );
}

// ─── Editable Ingredient ──────────────────────────────────────────────────────

interface EditableIng {
  _id: string;
  qty: string;
  unit: "ml" | "g" | "";
  name: string;
}

function toEditable(ing: Ingredient): EditableIng {
  return { _id: ing.id ?? generateId(), qty: String(ing.qty), unit: ing.unit, name: ing.displayName };
}

function fromEditable(ing: EditableIng): Ingredient {
  const qtyNum = parseFloat(ing.qty.replace(",", "."));
  return {
    id:          ing._id,
    qty:         isNaN(qtyNum) ? ing.qty : qtyNum,
    unit:        ing.unit,
    displayName: ing.name.trim(),
    canonicalId: ing.name.trim().toLowerCase(),
  };
}

// ─── EditRecipePage ───────────────────────────────────────────────────────────

export default function EditRecipePage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipe, loading } = useRecipe(id);
  const { updateRecipe }    = useRecipes();
  const { t } = useTranslation();

  // Form state
  const [title,    setTitle]    = useState("");
  const [yield_,   setYield]    = useState(4);
  const [time,     setTime]     = useState(0);
  const [tags,     setTags]     = useState("");
  const [notes,    setNotes]    = useState("");
  const [source,   setSource]   = useState("");
  const [coverImg, setCoverImg] = useState<string | undefined>(undefined);
  const [steps,    setSteps]    = useState<string[]>([""]);
  const [ingredients, setIngredients] = useState<EditableIng[]>([]);
  const [saving,   setSaving]   = useState(false);
  const [inited,   setInited]   = useState(false);

  // Inizializza il form una volta sola quando recipe arriva
  if (recipe && !inited) {
    setTitle(recipe.title);
    setYield(recipe.yield);
    setTime(recipe.totalTime);
    setTags(recipe.tags.join(", "));
    setNotes(recipe.notes ?? "");
    setSource(recipe.source ?? "");
    setCoverImg(recipe.coverImage);
    setSteps(recipe.steps.length ? recipe.steps : [""]);
    setIngredients(recipe.ingredients.map(toEditable));
    setInited(true);
  }

  const updateIng  = (id: string, field: keyof EditableIng, value: string) =>
    setIngredients((prev) => prev.map((i) => i._id === id ? { ...i, [field]: value } : i));
  const removeIng  = (id: string) => setIngredients((prev) => prev.filter((i) => i._id !== id));
  const addIng     = () => setIngredients((prev) => [...prev, { _id: generateId(), qty: "", unit: "", name: "" }]);
  const updateStep = (i: number, val: string) => setSteps((prev) => prev.map((s, j) => j === i ? val : s));
  const removeStep = (i: number) => setSteps((prev) => prev.filter((_, j) => j !== i));
  const addStep    = () => setSteps((prev) => [...prev, ""]);

  const handleSave = useCallback(async () => {
    if (!recipe) return;
    setSaving(true);
    try {
      const updated: Recipe = {
        ...recipe,               // ← preserva recipe.ja e tutti gli altri campi
        title:       title.trim() || recipe.title,
        yield:       Math.max(1, yield_),
        totalTime:   Math.max(0, time),
        tags:        tags.split(",").map((tg) => tg.trim()).filter(Boolean),
        notes:       notes.trim() || undefined,
        source:      source.trim() || undefined,
        coverImage:  coverImg,
        steps:       steps.map((s) => s.trim()).filter(Boolean),
        ingredients: ingredients.filter((i) => i.name.trim()).map(fromEditable),
        // recipe.ja viene preservato dallo spread sopra — non viene sovrascritto
      };
      await updateRecipe(updated);
      navigate(`/ricette/${recipe.id}`);
    } finally {
      setSaving(false);
    }
  }, [recipe, title, yield_, time, tags, notes, source, coverImg, steps, ingredients, updateRecipe, navigate]);

  if (loading || !recipe) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1rem" }}>
        <div className="skeleton" style={{ height: 40, width: "60%", marginBottom: "1rem" }} />
        <div className="skeleton" style={{ height: 200 }} />
      </div>
    );
  }

  const unitOptions: Array<"ml" | "g" | ""> = ["ml", "g", ""];
  const hasJa = !!recipe.ja;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "1.25rem 1rem 4rem" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ gap: "0.3rem", padding: "0.5rem 0.75rem" }}>
          <IconBack /> {t("misc.back")}
        </button>
        <h1 style={{ margin: 0, flex: 1, fontSize: "clamp(1.2rem, 3vw, 1.6rem)" }}>{t("detail.edit")}</h1>
        {hasJa && (
          <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.55rem", background: "var(--brand-light)", color: "var(--brand-dark)", borderRadius: "var(--radius-full)" }}>
            🌐 IT + JP
          </span>
        )}
        <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ gap: "0.4rem" }}>
          <IconSave /> {saving ? t("review.saving") : t("review.save")}
        </button>
      </div>

      {/* Info banner se bilingue */}
      {hasJa && (
        <div style={{ marginBottom: "1.25rem", padding: "0.75rem 1rem", background: "var(--info-bg)", border: "1px solid var(--info)", borderRadius: "var(--radius-md)", fontSize: "0.85rem", color: "var(--info)" }}>
          ℹ️ Questa ricetta ha una versione giapponese salvata. Le modifiche qui riguardano solo la versione italiana. La versione JP rimane invariata.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Foto */}
        <div className="card" style={{ padding: "1rem 1.25rem" }}>
          <ImageUpload current={coverImg} onChange={setCoverImg} />
        </div>

        {/* Info base */}
        <div className="card" style={{ padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <div>
            <label>{t("review.field.title")}</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label>{t("review.field.yield")}</label>
              <input className="input" type="number" min={1} max={100} value={yield_}
                onChange={(e) => setYield(parseInt(e.target.value) || 1)} />
            </div>
            <div>
              <label>{t("review.field.totalTime")}</label>
              <input className="input" type="number" min={0} value={time}
                onChange={(e) => setTime(parseInt(e.target.value) || 0)} />
            </div>
          </div>
          <div>
            <label>{t("review.field.tags")}</label>
            <input className="input" value={tags} placeholder="es. veloce, italiana, dolce"
              onChange={(e) => setTags(e.target.value)} />
          </div>
          <div>
            <label>Fonte / URL</label>
            <input className="input" value={source} placeholder="https://…"
              onChange={(e) => setSource(e.target.value)} />
          </div>
          <div>
            <label>{t("detail.notes")}</label>
            <textarea className="input" value={notes} placeholder="Varianti, consigli, ricordi…"
              onChange={(e) => setNotes(e.target.value)} style={{ minHeight: 80 }} />
          </div>
        </div>

        {/* Ingredienti IT */}
        <div className="card" style={{ padding: "1rem 1.25rem" }}>
          <p style={{ fontWeight: 700, fontSize: "0.85rem", margin: "0 0 0.75rem", color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {t("review.field.ingredients")} (IT)
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {ingredients.map((ing) => (
              <div key={ing._id} style={{ display: "grid", gridTemplateColumns: "70px 60px 1fr auto", gap: "0.375rem", alignItems: "center" }}>
                <input className="input" placeholder="Qtà" value={ing.qty}
                  onChange={(e) => updateIng(ing._id, "qty", e.target.value)}
                  style={{ padding: "0.4rem 0.5rem", fontSize: "0.875rem" }} />
                <select className="input" value={ing.unit}
                  onChange={(e) => updateIng(ing._id, "unit", e.target.value as "ml" | "g" | "")}
                  style={{ padding: "0.4rem 0.3rem", fontSize: "0.875rem" }}>
                  {unitOptions.map((u) => <option key={u} value={u}>{u || "—"}</option>)}
                </select>
                <input className="input" placeholder={t("review.ingredient.name")} value={ing.name}
                  onChange={(e) => updateIng(ing._id, "name", e.target.value)}
                  style={{ padding: "0.4rem 0.5rem", fontSize: "0.875rem" }} />
                <button onClick={() => removeIng(ing._id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.3rem", display: "flex" }}>
                  <IconTrash />
                </button>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost" onClick={addIng} style={{ marginTop: "0.75rem", gap: "0.35rem", fontSize: "0.875rem" }}>
            <IconPlus /> {t("review.ingredient.add")}
          </button>
        </div>

        {/* Preview ingredienti JP (read-only se esistono) */}
        {hasJa && recipe.ja && recipe.ja.ingredients.length > 0 && (
          <details className="card" style={{ padding: "0.875rem 1rem" }}>
            <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: "0.82rem", color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", listStyle: "none" }}>
              ▸ 材料 (JP) — {recipe.ja.ingredients.length} ingredienti · sola lettura
            </summary>
            <ul style={{ margin: "0.625rem 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {recipe.ja.ingredients.map((ing, i) => (
                <li key={i} style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  {ing.qty && String(ing.qty) !== "" ? `${ing.qty} ` : ""}{ing.unit || ""} {ing.displayName}
                </li>
              ))}
            </ul>
          </details>
        )}

        {/* Passi IT */}
        <div className="card" style={{ padding: "1rem 1.25rem" }}>
          <p style={{ fontWeight: 700, fontSize: "0.85rem", margin: "0 0 0.75rem", color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {t("review.field.steps")} (IT)
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr auto", gap: "0.5rem", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-serif)", fontWeight: 700, color: "var(--brand)", paddingTop: "0.55rem", textAlign: "center", fontSize: "0.875rem" }}>
                  {i + 1}
                </span>
                <textarea className="input" value={step} onChange={(e) => updateStep(i, e.target.value)}
                  style={{ minHeight: 72, fontSize: "0.875rem", lineHeight: 1.6 }}
                  placeholder={`Passo ${i + 1}…`} />
                <button onClick={() => removeStep(i)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.55rem 0.3rem", display: "flex", alignItems: "flex-start" }}>
                  <IconTrash />
                </button>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost" onClick={addStep} style={{ marginTop: "0.75rem", gap: "0.35rem", fontSize: "0.875rem" }}>
            <IconPlus /> {t("review.step.add")}
          </button>
        </div>

        {/* Preview passi JP */}
        {hasJa && recipe.ja && recipe.ja.steps.length > 0 && (
          <details className="card" style={{ padding: "0.875rem 1rem" }}>
            <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: "0.82rem", color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", listStyle: "none" }}>
              ▸ 作り方 (JP) — {recipe.ja.steps.length} passi · sola lettura
            </summary>
            <ol style={{ margin: "0.625rem 0 0", padding: "0 0 0 1.25rem" }}>
              {recipe.ja.steps.map((s, i) => (
                <li key={i} style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>{s}</li>
              ))}
            </ol>
          </details>
        )}

        {/* Salva bottom */}
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}
          style={{ gap: "0.4rem", alignSelf: "flex-end" }}>
          <IconSave /> {saving ? t("review.saving") : t("review.save")}
        </button>
      </div>
    </div>
  );
}
