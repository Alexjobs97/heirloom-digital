/**
 * AddRecipePage.tsx — Incolla testo + ParseReview + salvataggio.
 */

import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { ParsedResult, RawIngredient, Recipe } from "../types";
import { parseRecipe } from "../lib/parser";
import { useRecipes } from "../hooks/useRecipes";
import { generateId } from "../lib/scaling";

// ─── Icone ────────────────────────────────────────────────────────────────────

function IconBack()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>; }
function IconWand()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8L19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2L19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2L11 5"/></svg>; }
function IconSave()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>; }
function IconPlus()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function IconTrash() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>; }

// ─── Step 1: Paste area ───────────────────────────────────────────────────────

function PasteStep({
  onAnalyze,
}: {
  onAnalyze: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAnalyze = () => {
    if (!text.trim()) return;
    setLoading(true);
    // Piccolo timeout per mostrare lo stato di caricamento
    setTimeout(() => {
      onAnalyze(text);
      setLoading(false);
    }, 120);
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.5rem 1rem 3rem" }}>
      <h1 style={{ marginBottom: "0.35rem" }}>Aggiungi una ricetta</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.925rem" }}>
        Incolla il testo di qualsiasi ricetta — anche in inglese con tazze e once.
        Convertiamo tutto automaticamente in ml e grammi.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <textarea
          ref={textareaRef}
          className="input"
          placeholder={[
            "Incolla qui la tua ricetta (qualsiasi formato)…",
            "",
            "Funziona con:",
            "• Ricette da siti e blog",
            "• Testo libero copiato da PDF",
            "• Ricette americane (1 cup farina → 240 ml)",
            "• Qualsiasi lingua",
          ].join("\n")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ minHeight: 320, fontSize: "0.9rem", lineHeight: 1.65, fontFamily: "var(--font-mono, monospace)" }}
          autoFocus
        />

        <div style={{ display: "flex", gap: "0.625rem", justifyContent: "flex-end" }}>
          {text && (
            <button
              className="btn btn-ghost"
              onClick={() => setText("")}
            >
              Cancella
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={!text.trim() || loading}
            style={{ gap: "0.4rem" }}
          >
            <IconWand />
            {loading ? "Analisi in corso…" : "Analizza ricetta"}
          </button>
        </div>
      </div>

      {/* Hint */}
      <div style={{
        marginTop: "1.5rem",
        padding: "1rem",
        background: "var(--brand-light)",
        borderRadius: "var(--radius-md)",
        fontSize: "0.85rem",
        color: "var(--brand-dark)",
        lineHeight: 1.6,
      }}>
        <strong>Conversioni automatiche:</strong> 1 cup → 240 ml · 1 tbsp → 15 ml ·
        1 tsp → 5 ml · 1 oz → 28 g · 1 lb → 454 g
      </div>
    </div>
  );
}

// ─── Step 2: ParseReview ──────────────────────────────────────────────────────

interface EditableIngredient extends RawIngredient {
  _id: string;
}

function ParseReview({
  parsed,
  originalText,
  onSave,
  onBack,
}: {
  parsed: ParsedResult;
  originalText: string;
  onSave: (recipe: Omit<Recipe, "id" | "createdAt">) => Promise<void>;
  onBack: () => void;
}) {
  const [title,    setTitle]    = useState(parsed.title);
  const [yield_,   setYield]    = useState(parsed.yield);
  const [time,     setTime]     = useState(parsed.totalTime);
  const [steps,    setSteps]    = useState<string[]>(parsed.steps.length ? parsed.steps : [""]);
  const [tags,     setTags]     = useState(parsed.tags.join(", "));
  const [saving,   setSaving]   = useState(false);

  const [ingredients, setIngredients] = useState<EditableIngredient[]>(() =>
    parsed.ingredients.map((ing) => ({ ...ing, _id: generateId() }))
  );

  // ── Ingredienti ─────────────────────────────────────────────────────────────

  const updateIngredient = (id: string, field: string, value: string | number) => {
    setIngredients((prev) =>
      prev.map((ing) => (ing._id === id ? { ...ing, [field]: value } : ing))
    );
  };

  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i._id !== id));
  };

  const addIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      { _id: generateId(), raw: "", qty: "", unit: "", name: "", canonicalId: "" },
    ]);
  };

  // ── Passi ────────────────────────────────────────────────────────────────────

  const updateStep = (i: number, val: string) =>
    setSteps((prev) => prev.map((s, j) => (j === i ? val : s)));

  const removeStep = (i: number) =>
    setSteps((prev) => prev.filter((_, j) => j !== i));

  const addStep = () => setSteps((prev) => [...prev, ""]);

  // ── Salvataggio ──────────────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true);
    try {
      const recipe: Omit<Recipe, "id" | "createdAt"> = {
        title:      title.trim() || "Nuova ricetta",
        yield:      Math.max(1, yield_),
        totalTime:  Math.max(0, time),
        language:   parsed.language,
        tags:       tags.split(",").map((t) => t.trim()).filter(Boolean),
        steps:      steps.map((s) => s.trim()).filter(Boolean),
        ingredients: ingredients
          .filter((i) => i.name.trim())
          .map(({ _id: _ignored, ...rest }) => ({
            id:          generateId(),
            qty:         typeof rest.qty === "number" ? rest.qty : (rest.qty || "q.b."),
            unit:        (rest.unit === "ml" || rest.unit === "g" ? rest.unit : "") as "ml" | "g" | "",
            displayName: rest.name.trim(),
            canonicalId: rest.canonicalId || rest.name.trim().toLowerCase(),
          })),
      };
      await onSave(recipe);
    } finally {
      setSaving(false);
    }
  };

  const unitOptions: Array<"ml" | "g" | ""> = ["ml", "g", ""];

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "1.25rem 1rem 4rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button className="btn btn-ghost" onClick={onBack} style={{ gap: "0.3rem", padding: "0.5rem 0.75rem" }}>
          <IconBack /> Indietro
        </button>
        <h1 style={{ margin: 0, fontSize: "clamp(1.2rem, 3vw, 1.6rem)", flex: 1 }}>
          Verifica e modifica
        </h1>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
          style={{ gap: "0.4rem" }}
        >
          <IconSave />
          {saving ? "Salvataggio…" : "Salva nel libro"}
        </button>
      </div>

      {/* Warning conversioni */}
      {parsed.warnings.length > 0 && (
        <div className="warning-box" style={{ marginBottom: "1.25rem" }}>
          <strong>⚠ Attenzione:</strong>
          <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.25rem", fontSize: "0.875rem" }}>
            {parsed.warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}

      {/* Layout a due colonne su desktop */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) minmax(0,1.4fr)",
        gap: "1.5rem",
        alignItems: "start",
      }}
        className="parse-review-grid"
      >
        {/* Colonna sx: testo originale */}
        <div>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Testo originale
          </p>
          <div style={{
            background: "var(--bg-page)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "1rem",
            maxHeight: 520,
            overflowY: "auto",
            fontSize: "0.82rem",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono, monospace)",
          }}>
            {originalText}
          </div>
        </div>

        {/* Colonna dx: form editabile */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Titolo + meta */}
          <div className="card" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <div>
              <label>Titolo</label>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
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

          {/* Ingredienti */}
          <div className="card" style={{ padding: "1rem" }}>
            <p style={{ fontWeight: 700, fontSize: "0.9rem", margin: "0 0 0.75rem", color: "var(--text-secondary)", letterSpacing: "0.03em" }}>
              INGREDIENTI
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {ingredients.map((ing) => (
                <div key={ing._id} style={{ display: "grid", gridTemplateColumns: "70px 60px 1fr auto", gap: "0.375rem", alignItems: "center" }}>
                  <input
                    className="input"
                    placeholder="Qtà"
                    value={String(ing.qty)}
                    onChange={(e) => updateIngredient(ing._id, "qty", e.target.value)}
                    style={{ padding: "0.4rem 0.5rem", fontSize: "0.875rem" }}
                  />
                  <select
                    className="input"
                    value={ing.unit}
                    onChange={(e) => updateIngredient(ing._id, "unit", e.target.value)}
                    style={{ padding: "0.4rem 0.3rem", fontSize: "0.875rem" }}
                  >
                    {unitOptions.map((u) => (
                      <option key={u} value={u}>{u || "—"}</option>
                    ))}
                  </select>
                  <input
                    className="input"
                    placeholder="Ingrediente"
                    value={ing.name}
                    onChange={(e) => updateIngredient(ing._id, "name", e.target.value)}
                    style={{ padding: "0.4rem 0.5rem", fontSize: "0.875rem" }}
                  />
                  <button
                    onClick={() => removeIngredient(ing._id)}
                    aria-label="Rimuovi ingrediente"
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--text-muted)", padding: "0.3rem",
                      display: "flex", alignItems: "center",
                    }}
                  >
                    <IconTrash />
                  </button>
                </div>
              ))}
            </div>

            {ing_ambiguous(ingredients) && (
              <p style={{ fontSize: "0.78rem", color: "var(--warning)", marginTop: "0.5rem" }}>
                ⚠ Alcuni solidi sono dati in ml (conversione da cup). Verifica le quantità.
              </p>
            )}

            <button
              className="btn btn-ghost"
              onClick={addIngredient}
              style={{ marginTop: "0.75rem", gap: "0.35rem", fontSize: "0.875rem", alignSelf: "flex-start" }}
            >
              <IconPlus /> Aggiungi ingrediente
            </button>
          </div>

          {/* Passi */}
          <div className="card" style={{ padding: "1rem" }}>
            <p style={{ fontWeight: 700, fontSize: "0.9rem", margin: "0 0 0.75rem", color: "var(--text-secondary)", letterSpacing: "0.03em" }}>
              PROCEDIMENTO
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {steps.map((step, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr auto", gap: "0.5rem", alignItems: "flex-start" }}>
                  <span style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 700,
                    color: "var(--brand)",
                    paddingTop: "0.55rem",
                    textAlign: "center",
                    fontSize: "0.875rem",
                  }}>
                    {i + 1}
                  </span>
                  <textarea
                    className="input"
                    value={step}
                    onChange={(e) => updateStep(i, e.target.value)}
                    style={{ minHeight: 72, fontSize: "0.875rem", lineHeight: 1.6 }}
                    placeholder={`Passo ${i + 1}…`}
                  />
                  <button
                    onClick={() => removeStep(i)}
                    aria-label="Rimuovi passo"
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--text-muted)", padding: "0.55rem 0.3rem",
                      display: "flex", alignItems: "flex-start",
                    }}
                  >
                    <IconTrash />
                  </button>
                </div>
              ))}
            </div>

            <button
              className="btn btn-ghost"
              onClick={addStep}
              style={{ marginTop: "0.75rem", gap: "0.35rem", fontSize: "0.875rem", alignSelf: "flex-start" }}
            >
              <IconPlus /> Aggiungi passo
            </button>
          </div>

          {/* Salva (anche in fondo) */}
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
            style={{ gap: "0.4rem", alignSelf: "flex-end" }}
          >
            <IconSave />
            {saving ? "Salvataggio…" : "Salva nel libro"}
          </button>
        </div>
      </div>

      {/* Responsive: su mobile stack a colonna singola */}
      <style>{`
        @media (max-width: 640px) {
          .parse-review-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function ing_ambiguous(ingredients: EditableIngredient[]): boolean {
  return ingredients.some((i) => i.ambiguous);
}

// ─── AddRecipePage ────────────────────────────────────────────────────────────

export default function AddRecipePage() {
  const navigate = useNavigate();
  const [parsed,       setParsed]       = useState<ParsedResult | null>(null);
  const [originalText, setOriginalText] = useState("");

  const { saveRecipe } = useRecipes();

  const handleAnalyze = useCallback((text: string) => {
    setOriginalText(text);
    setParsed(parseRecipe(text));
  }, []);

  const handleSave = useCallback(
    async (data: Omit<Recipe, "id" | "createdAt">) => {
      const saved = await saveRecipe(data);
      navigate(`/ricette/${saved.id}`);
    },
    [saveRecipe, navigate]
  );

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
