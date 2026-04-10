/**
 * AddRecipePage.tsx v5 — Incolla testo + ParseReview + salvataggio bilingue + Immagine.
 * FEATURE: Supporto URL immagine (alternativo al file) nella fase di creazione.
 * FIX CRITICO: i dati JP vengono salvati in recipe.ja (RecipeLocale).
 */
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { ParsedResult, RawIngredient, Recipe, Ingredient } from "../types";
import { parseRecipe } from "../lib/parser";
import { useRecipes } from "../hooks/useRecipes";
import { generateId } from "../lib/scaling";
import { useTranslation } from "../i18n/useTranslation";

// ─── Icone ────────────────────────────────────────────────────────────────────
function IconBack()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>; }
function IconWand()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8L19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2L19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2L11 5"/></svg>; }
function IconSave()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>; }
function IconPlus()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function IconTrash() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>; }
function IconImage() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>; }

// ─── Paste Step ───────────────────────────────────────────────────────────────
function PasteStep({ onAnalyze }: { onAnalyze: (text: string) => void }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleAnalyze = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => { onAnalyze(text); setLoading(false); }, 120);
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.5rem 1rem 3rem" }}>
      <h1 style={{ marginBottom: "0.35rem" }}>{t("add.title")}</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.925rem", lineHeight: 1.6 }}>
        Incolla una ricetta in qualsiasi formato. Supporta il formato bilingue Gemini con blocchi{" "}
        <code style={{ background: "var(--brand-light)", padding: "0.1rem 0.35rem", borderRadius: 4, fontSize: "0.85em" }}>
          === IT === / === JP ===
        </code>
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <textarea
          className="input"
          placeholder={`Incolla qui la tua ricetta…
Formato bilingue Gemini:
=== IT ===
🍽️  Ricetta …
INGREDIENTI
• 200 ml latte
PROCEDIMENTO
1. …
=== JP ===
🍽️  レシピ …`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ minHeight: 320, fontSize: "0.875rem", lineHeight: 1.7, fontFamily: "monospace" }}
          autoFocus
        />
        <div style={{ display: "flex", gap: "0.625rem", justifyContent: "flex-end" }}>
          {text && (
            <button className="btn btn-ghost" onClick={() => setText("")}>
              {t("add.paste.clear")}
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={!text.trim() || loading}
            style={{ gap: "0.4rem" }}
          >
            <IconWand />
            {loading ? t("add.paste.analyzing") : t("add.paste.analyze")}
          </button>
        </div>
      </div>
      <div style={{
        marginTop: "1.5rem", padding: "1rem",
        background: "var(--brand-light)", borderRadius: "var(--radius-md)",
        fontSize: "0.85rem", color: "var(--brand-dark)", lineHeight: 1.65,
      }}>
        <strong>Conversioni automatiche:</strong> 1 cup → 240 ml · 1 tbsp → 15 ml ·
        1 tsp → 5 ml · 1 oz → 28 g · 1 lb → 454 g
      </div>
    </div>
  );
}

// ─── Helpers conversione ingredienti ─────────────────────────────────────────
interface EditableIng extends RawIngredient { _id: string; }
function toEditable(ing: RawIngredient): EditableIng {
  return { ...ing, _id: generateId() };
}
function fromEditable(ing: EditableIng): Ingredient {
  const qtyNum = typeof ing.qty === "number" ? ing.qty
    : parseFloat(String(ing.qty).replace(",", "."));
  return {
    id:          generateId(),
    qty:         isNaN(qtyNum) ? (ing.qty || "q.b.") : qtyNum,
    unit:        (["ml", "g"].includes(ing.unit) ? ing.unit : "") as "ml" | "g" | "",
    displayName: ing.name.trim(),
    canonicalId: ing.canonicalId || ing.name.trim().toLowerCase(),
  };
}

// ─── ParseReview ──────────────────────────────────────────────────────────────
function ParseReview({
  parsed, originalText, onSave, onBack,
}: {
  parsed: ParsedResult;
  originalText: string;
  onSave: (r: Omit<Recipe, "id" | "createdAt">) => Promise<void>;
  onBack: () => void;
}) {
  const { t } = useTranslation();

  // Dati IT (editabili)
  const [title,  setTitle]  = useState(parsed.title);
  const [yield_, setYield]  = useState(parsed.yield);
  const [time,   setTime]   = useState(parsed.totalTime);
  const [steps,  setSteps]  = useState<string[]>(parsed.steps.length ? parsed.steps : [""]);
  const [tags,   setTags]   = useState(parsed.tags.join(", "));
  const [saving, setSaving] = useState(false);
  const [coverImg, setCoverImg] = useState<string | undefined>(undefined); // ✅ Nuova
  const [ingredients, setIngredients] = useState<EditableIng[]>(() =>
    parsed.ingredients.map(toEditable)
  );

  // Dati JP (presenti se parsed.isBilingual === true)
  const jaData = parsed.ja;
  const hasBilingual = parsed.isBilingual && !!jaData;
  const unitOptions: Array<"ml" | "g" | ""> = ["ml", "g", ""];

  const updateIng  = (id: string, field: string, value: string) =>
    setIngredients((p) => p.map((i) => i._id === id ? { ...i, [field]: value } : i));
  const removeIng  = (id: string) => setIngredients((p) => p.filter((i) => i._id !== id));
  const addIng     = () => setIngredients((p) => [...p, { _id: generateId(), raw: "", qty: "", unit: "", name: "", canonicalId: "" }]);
  const updateStep = (i: number, v: string) => setSteps((p) => p.map((s, j) => j === i ? v : s));
  const removeStep = (i: number) => setSteps((p) => p.filter((_, j) => j !== i));
  const addStep    = () => setSteps((p) => [...p, ""]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const itIngredients = ingredients.filter((i) => i.name.trim()).map(fromEditable);
      const itSteps = steps.map((s) => s.trim()).filter(Boolean);

      const jaLocale = hasBilingual && jaData ? {
        title:       jaData.title,
        ingredients: jaData.ingredients
          .filter((i) => i.name.trim())
          .map((ri) => fromEditable({ ...ri, _id: generateId() })),
        steps: jaData.steps.filter(Boolean),
      } : undefined;

      const recipe: Omit<Recipe, "id" | "createdAt"> = {
        title:       title.trim() || "Nuova ricetta",
        yield:       Math.max(1, yield_),
        totalTime:   Math.max(0, time),
        language:    "it",
        tags:        tags.split(",").map((tg) => tg.trim()).filter(Boolean),
        steps:       itSteps,
        ingredients: itIngredients,
        coverImage:  coverImg, // ✅ Salvataggio immagine (URL o base64)
        ...(jaLocale ? { ja: jaLocale } : {}),
      };
      await onSave(recipe);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "1.25rem 1rem 4rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button className="btn btn-ghost" onClick={onBack} style={{ gap: "0.3rem", padding: "0.5rem 0.75rem" }}>
          <IconBack /> {t("misc.back")}
        </button>
        <h1 style={{ margin: 0, fontSize: "clamp(1.2rem,3vw,1.6rem)", flex: 1 }}>
          {t("review.title")}
        </h1>
        {hasBilingual && (
          <span style={{
            fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.65rem",
            background: "var(--brand-light)", color: "var(--brand-dark)",
            borderRadius: "var(--radius-full)", letterSpacing: "0.05em",
          }}>🌐 IT + JP</span>
        )}
        <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ gap: "0.4rem" }}>
          <IconSave /> {saving ? t("review.saving") : t("review.save")}
        </button>
      </div>

      {parsed.warnings.length > 0 && (
        <div className="warning-box" style={{ marginBottom: "1.25rem" }}>
          <strong>⚠ Attenzione:</strong>
          <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.25rem", fontSize: "0.875rem" }}>
            {parsed.warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}

      <div
        style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.4fr)", gap: "1.5rem", alignItems: "start" }}
        className="parse-review-grid"
      >
        {/* Testo originale */}
        <div>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Testo originale
          </p>
          <div style={{
            background: "var(--bg-page)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)", padding: "1rem",
            maxHeight: 520, overflowY: "auto", fontSize: "0.82rem", lineHeight: 1.7,
            whiteSpace: "pre-wrap", color: "var(--text-secondary)", fontFamily: "monospace",
          }}>
            {originalText}
          </div>
        </div>

        {/* Form editabile */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* ✅ Immagine Ricetta (URL o File) */}
          <div className="card" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>📸 Immagine ricetta</label>
            <input
              className="input"
              placeholder="Incolla link immagine (opzionale)…"
              value={coverImg?.startsWith("http") ? coverImg : ""}
              onChange={(e) => setCoverImg(e.target.value.trim() || undefined)}
              style={{ fontSize: "0.85rem" }}
            />
            <div style={{
              position: "relative", width: "100%", aspectRatio: "16/5",
              borderRadius: "var(--radius-md)", overflow: "hidden",
              border: "2px dashed var(--border)", background: "var(--bg-page)", cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              {coverImg ? (
                <img src={coverImg} alt="Anteprima" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "var(--bg-surface, var(--bg-page))" }}>
                  <IconImage />
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Clicca per caricare file</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !file.type.startsWith("image/")) return;
                e.target.value = "";
                setCoverImg(""); // Pulisce URL se si carica file
                const reader = new FileReader();
                reader.onload = () => setCoverImg(reader.result as string);
                reader.readAsDataURL(file);
              }} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
            </div>
          </div>

          {/* Titolo + meta */}
          <div className="card" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <div>
              <label>Titolo (IT)</label>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            {hasBilingual && jaData?.title && (
              <div>
                <label style={{ color: "var(--text-muted)" }}>タイトル (JP — auto)</label>
                <input className="input" value={jaData.title} readOnly
                  style={{ opacity: 0.65, background: "var(--bg-page)" }} />
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label>Porzioni</label>
                <input className="input" type="number" min={1} max={100} value={yield_}
                  onChange={(e) => setYield(parseInt(e.target.value) || 1)} />
              </div>
              <div>
                <label>Tempo totale (min)</label>
                <input className="input" type="number" min={0} value={time}
                  onChange={(e) => setTime(parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div>
              <label>Tag (separati da virgola)</label>
              <input className="input" value={tags} placeholder="es. veloce, italiana, dolce"
                onChange={(e) => setTags(e.target.value)} />
            </div>
          </div>

          {/* Ingredienti IT */}
          <div className="card" style={{ padding: "1rem" }}>
            <p style={{ fontWeight: 700, fontSize: "0.85rem", margin: "0 0 0.75rem", color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Ingredienti (IT)
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {ingredients.map((ing) => (
                <div key={ing._id} style={{ display: "grid", gridTemplateColumns: "70px 60px 1fr auto", gap: "0.375rem", alignItems: "center" }}>
                  <input className="input" placeholder="Qtà" value={String(ing.qty)}
                    onChange={(e) => updateIng(ing._id, "qty", e.target.value)}
                    style={{ padding: "0.4rem 0.5rem", fontSize: "0.875rem" }} />
                  <select className="input" value={ing.unit}
                    onChange={(e) => updateIng(ing._id, "unit", e.target.value)}
                    style={{ padding: "0.4rem 0.3rem", fontSize: "0.875rem" }}>
                    {unitOptions.map((u) => <option key={u} value={u}>{u || "—"}</option>)}
                  </select>
                  <input className="input" placeholder="Ingrediente" value={ing.name}
                    onChange={(e) => updateIng(ing._id, "name", e.target.value)}
                    style={{ padding: "0.4rem 0.5rem", fontSize: "0.875rem" }} />
                  <button onClick={() => removeIng(ing._id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.3rem", display: "flex" }}>
                    <IconTrash />
                  </button>
                </div>
              ))}
            </div>
            <button className="btn btn-ghost" onClick={addIng}
              style={{ marginTop: "0.75rem", gap: "0.35rem", fontSize: "0.875rem" }}>
              <IconPlus /> Aggiungi ingrediente
            </button>
          </div>

          {/* Preview ingredienti JP (read-only, collassato) */}
          {hasBilingual && jaData && jaData.ingredients.length > 0 && (
            <details className="card" style={{ padding: "0.875rem 1rem" }}>
              <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: "0.82rem", color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", listStyle: "none" }}>
                ▸ 材料 (JP) — {jaData.ingredients.length} ingredienti · auto
              </summary>
              <ul style={{ margin: "0.625rem 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {jaData.ingredients.map((ing, i) => (
                  <li key={i} style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    {ing.qty && String(ing.qty) !== "" ? `${ing.qty} ` : ""}{ing.unit || ""} {ing.name}
                  </li>
                ))}
              </ul>
            </details>
          )}

          {/* Passi IT */}
          <div className="card" style={{ padding: "1rem" }}>
            <p style={{ fontWeight: 700, fontSize: "0.85rem", margin: "0 0 0.75rem", color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Procedimento (IT)
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
            <button className="btn btn-ghost" onClick={addStep}
              style={{ marginTop: "0.75rem", gap: "0.35rem", fontSize: "0.875rem" }}>
              <IconPlus /> Aggiungi passo
            </button>
          </div>

          {/* Preview passi JP */}
          {hasBilingual && jaData && jaData.steps.length > 0 && (
            <details className="card" style={{ padding: "0.875rem 1rem" }}>
              <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: "0.82rem", color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", listStyle: "none" }}>
                ▸ 作り方 (JP) — {jaData.steps.length} passi · auto
              </summary>
              <ol style={{ margin: "0.625rem 0 0", padding: "0 0 0 1.25rem" }}>
                {jaData.steps.map((step, i) => (
                  <li key={i} style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>{step}</li>
                ))}
              </ol>
            </details>
          )}

          <button className="btn btn-primary" onClick={handleSave} disabled={saving}
            style={{ gap: "0.4rem", alignSelf: "flex-end" }}>
            <IconSave /> {saving ? t("review.saving") : t("review.save")}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) { .parse-review-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function AddRecipePage() {
  const navigate = useNavigate();
  const [parsed,       setParsed]       = useState<ParsedResult | null>(null);
  const [originalText, setOriginalText] = useState("");
  const { saveRecipe } = useRecipes();

  const handleAnalyze = useCallback((text: string) => {
    setOriginalText(text);
    setParsed(parseRecipe(text));
  }, []);

  const handleSave = useCallback(async (data: Omit<Recipe, "id" | "createdAt">) => {
    const saved = await saveRecipe(data);
    navigate(`/ricette/${saved.id}`);
  }, [saveRecipe, navigate]);

  if (parsed) {
    return (
      <ParseReview
        parsed={parsed}
        originalText={originalText}
        onSave={handleSave}
        onBack={() => setParsed(null)}
      />
    );
  }
  return <PasteStep onAnalyze={handleAnalyze} />;
}