/**
 * IngredientsDBPage.tsx — Editor del database ingredienti.
 * Cerca, visualizza, modifica e aggiunge ingredienti con dati nutrizionali.
 *
 * Accessibile da: /ingredienti  (link dall'header o dalla modale nutrizione)
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { DictionaryEntry, NutritionPer100 } from "../types";
import {
  searchIngredients,
  saveCustomIngredient,
  deleteCustomIngredient,
  emptyEntry,
  isCustom,
  getAllIngredients,
  pullCustomIngredients,
} from "../lib/customIngredients";
import { INGREDIENT_DICTIONARY } from "../lib/ingredients";
import { resolveIngredient } from "../lib/customIngredients";
import { getSyncId, SYNC_ENABLED } from "../lib/supabase";
import { useTranslation } from "../i18n/useTranslation";

// ── Icone ──────────────────────────────────────────────────────────────────────
const IconBack    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>;
const IconSearch  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconEdit    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconPlus    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconTrash   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>;
const IconSave    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>;
const IconX       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconStar    = () => <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="12" height="12"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

// ── NumInput helper ────────────────────────────────────────────────────────────
function NumInput({ label, value, onChange, step = "0.1", min = "0" }: {
  label: string; value: number; onChange: (v: number) => void; step?: string; min?: string;
}) {
  return (
    <div>
      <label>{label}</label>
      <input
        type="number" className="input" step={step} min={min}
        value={value === 0 ? "" : value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        style={{ padding: "0.45rem 0.625rem", fontSize: "0.875rem" }}
      />
    </div>
  );
}

// ── Entry card (risultato ricerca) ────────────────────────────────────────────

function EntryCard({ entry, onEdit }: { entry: DictionaryEntry; onEdit: () => void }) {
  const custom = isCustom(entry.canonicalId);
  const hasNutrition = !!entry.nutrition;
  const itNames = entry.names.it.slice(0, 3).join(", ");

  return (
    <div
      onClick={onEdit}
      style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: "0.875rem 1rem",
        cursor: "pointer", transition: "all 0.18s ease",
        display: "flex", alignItems: "center", gap: "0.875rem",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-hover)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      {/* Stato nutrizionale */}
      <div style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: hasNutrition ? "rgba(92,184,92,0.15)" : "rgba(231,76,60,0.12)",
        fontSize: "1.1rem",
      }}>
        {hasNutrition ? "✓" : "?"}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem" }}>
            {itNames || entry.canonicalId}
          </span>
          {custom && (
            <span style={{
              fontSize: "0.6rem", fontWeight: 700, padding: "0.1rem 0.4rem",
              background: "rgba(245,166,35,0.15)", color: "var(--brand)",
              borderRadius: "var(--radius-full)", border: "1px solid rgba(245,166,35,0.3)",
              display: "flex", alignItems: "center", gap: "0.2rem",
            }}>
              <IconStar /> CUSTOM
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.2rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{entry.canonicalId}</span>
          {hasNutrition && (
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {entry.nutrition!.energia_kcal} kcal · {entry.nutrition!.proteine}g prot
            </span>
          )}
          {!hasNutrition && (
            <span style={{ fontSize: "0.72rem", color: "var(--error)" }}>Nessun dato nutrizionale</span>
          )}
        </div>
      </div>

      <IconEdit />
    </div>
  );
}

// ── Editor form ────────────────────────────────────────────────────────────────

function IngredientEditor({
  initial, onSave, onDelete, onClose,
}: {
  initial: DictionaryEntry;
  onSave: (entry: DictionaryEntry) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const [entry, setEntry] = useState<DictionaryEntry>(JSON.parse(JSON.stringify(initial)));
  const [extraKey,   setExtraKey]   = useState("");
  const [extraValue, setExtraValue] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [saved, setSaved] = useState(false);
  const isNew = !INGREDIENT_DICTIONARY[entry.canonicalId] && !isCustom(initial.canonicalId);

  const setField = <K extends keyof DictionaryEntry>(key: K, value: DictionaryEntry[K]) =>
    setEntry((p) => ({ ...p, [key]: value }));

  const setNutrField = (key: keyof NutritionPer100, value: number) =>
    setEntry((p) => ({
      ...p,
      nutrition: { ...(p.nutrition ?? { energia_kcal:0, grassi:0, grassi_saturi:0, carboidrati:0, zuccheri:0, proteine:0, fibre:0, sale:0 }), [key]: value },
    }));

  const setNamesList = (lang: "it" | "ja" | "en", raw: string) =>
    setEntry((p) => ({
      ...p,
      names: { ...p.names, [lang]: raw.split(",").map((s) => s.trim()).filter(Boolean) },
    }));

  const addExtra = () => {
    if (!extraKey.trim() || isNaN(parseFloat(extraValue))) return;
    const key = extraKey.trim().toLowerCase().replace(/\s+/g, "_");
    setEntry((p) => ({
      ...p,
      nutrition: { ...(p.nutrition!), extra: { ...(p.nutrition?.extra ?? {}), [key]: parseFloat(extraValue) } },
    }));
    setExtraKey(""); setExtraValue("");
  };
  const removeExtra = (key: string) =>
    setEntry((p) => {
      const extra = { ...(p.nutrition?.extra ?? {}) };
      delete extra[key];
      return { ...p, nutrition: { ...p.nutrition!, extra } };
    });

  const handleSave = () => {
    if (!entry.canonicalId.trim()) return;
    onSave(entry);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 600);
  };

  const nutr = entry.nutrition ?? { energia_kcal:0, grassi:0, grassi_saturi:0, carboidrati:0, zuccheri:0, proteine:0, fibre:0, sale:0, extra:{} };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "1rem 1rem 3rem" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button className="btn btn-ghost" onClick={onClose} style={{ gap: "0.3rem", padding: "0.45rem 0.7rem", fontSize: "0.82rem" }}>
          <IconBack /> Indietro
        </button>
        <h2 style={{ margin: 0, flex: 1 }}>{isNew ? "Nuovo ingrediente" : "Modifica ingrediente"}</h2>
        {onDelete && isCustom(initial.canonicalId) && (
          <button className="btn btn-ghost" onClick={() => setShowDelete(true)} style={{ color: "var(--error)", padding: "0.45rem 0.7rem" }}>
            <IconTrash />
          </button>
        )}
        <button className="btn btn-primary" onClick={handleSave} style={{ gap: "0.35rem" }}>
          <IconSave /> {saved ? "✓ Salvato!" : "Salva"}
        </button>
      </div>

      {showDelete && (
        <div style={{ marginBottom: "1.25rem", padding: "0.875rem 1rem", background: "var(--error-bg)", borderRadius: "var(--radius-md)", border: "1px solid rgba(231,76,60,0.3)" }}>
          <p style={{ margin: "0 0 0.625rem", color: "var(--error)", fontWeight: 700 }}>Eliminare questo ingrediente custom?</p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn btn-danger" onClick={() => { onDelete?.(); onClose(); }}>Elimina</button>
            <button className="btn btn-ghost" onClick={() => setShowDelete(false)}>Annulla</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Identificazione */}
        <div className="card" style={{ padding: "1rem" }}>
          <p style={{ margin: "0 0 0.75rem", fontSize: "0.72rem", fontWeight: 700, color: "var(--brand)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Identificazione</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            <div>
              <label>Canonical ID <span style={{ color: "var(--text-muted)", fontWeight: 400, textTransform: "none" }}>(univoco, snake_case)</span></label>
              <input className="input" value={entry.canonicalId}
                onChange={(e) => setField("canonicalId", e.target.value.toLowerCase().replace(/\s+/g, "_"))}
                placeholder="es. parmigiano_reggiano"
                disabled={!isNew}
                style={{ opacity: isNew ? 1 : 0.6, fontFamily: "monospace", fontSize: "0.875rem" }}
              />
            </div>
            <div>
              <label>Nomi italiani <span style={{ color: "var(--text-muted)", fontWeight: 400, textTransform: "none" }}>(separati da virgola)</span></label>
              <input className="input" value={entry.names.it.join(", ")}
                onChange={(e) => setNamesList("it", e.target.value)}
                placeholder="es. parmigiano, parmigiano reggiano, grana" />
            </div>
            <div>
              <label>Nomi giapponesi</label>
              <input className="input" value={entry.names.ja.join(", ")}
                onChange={(e) => setNamesList("ja", e.target.value)}
                placeholder="es. パルメザン, パルミジャーノ" />
            </div>
            <div>
              <label>Nomi inglesi</label>
              <input className="input" value={entry.names.en.join(", ")}
                onChange={(e) => setNamesList("en", e.target.value)}
                placeholder="es. parmesan, parmigiano reggiano" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.625rem" }}>
              <div>
                <label>Unità default</label>
                <select className="input" value={entry.defaultUnit ?? "g"}
                  onChange={(e) => setField("defaultUnit", e.target.value as "g" | "ml" | "")}>
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="">—</option>
                </select>
              </div>
              <div>
                <label>Tipo</label>
                <select className="input" value={entry.isSolid ? "solid" : "liquid"}
                  onChange={(e) => setField("isSolid", e.target.value === "solid")}>
                  <option value="solid">Solido</option>
                  <option value="liquid">Liquido</option>
                </select>
              </div>
              <NumInput
                label="Peso 1 unità (g)"
                value={entry.peso_medio_unità ?? 0}
                onChange={(v) => setField("peso_medio_unità", v || undefined)}
                step="1"
              />
            </div>
            <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              <strong>Peso 1 unità:</strong> usato quando la ricetta dice "2 uova" (non "120g"). Es: uovo = 60, banana = 120, limone = 100.
            </p>
          </div>
        </div>

        {/* Macro per 100g */}
        <div className="card" style={{ padding: "1rem" }}>
          <p style={{ margin: "0 0 0.75rem", fontSize: "0.72rem", fontWeight: 700, color: "var(--brand)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Valori nutrizionali per 100 g/ml
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
            <NumInput label="Energia (kcal)" value={nutr.energia_kcal}    onChange={(v) => setNutrField("energia_kcal", v)}    step="1" />
            <NumInput label="Proteine (g)"   value={nutr.proteine}         onChange={(v) => setNutrField("proteine", v)} />
            <NumInput label="Carboidrati (g)"value={nutr.carboidrati}      onChange={(v) => setNutrField("carboidrati", v)} />
            <NumInput label="Zuccheri (g)"   value={nutr.zuccheri}         onChange={(v) => setNutrField("zuccheri", v)} />
            <NumInput label="Grassi (g)"     value={nutr.grassi}           onChange={(v) => setNutrField("grassi", v)} />
            <NumInput label="Grassi saturi"  value={nutr.grassi_saturi}    onChange={(v) => setNutrField("grassi_saturi", v)} />
            <NumInput label="Fibre (g)"      value={nutr.fibre}            onChange={(v) => setNutrField("fibre", v)} />
            <NumInput label="Sale (g)"       value={nutr.sale}             onChange={(v) => setNutrField("sale", v)} step="0.01" />
          </div>
        </div>

        {/* Oligoelementi */}
        <div className="card" style={{ padding: "1rem" }}>
          <p style={{ margin: "0 0 0.75rem", fontSize: "0.72rem", fontWeight: 700, color: "var(--brand)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Oligoelementi / Micronutrienti
            <span style={{ fontWeight: 400, textTransform: "none", marginLeft: "0.4rem", color: "var(--text-muted)" }}>(opzionali)</span>
          </p>

          {/* Esistenti */}
          {Object.entries(nutr.extra ?? {}).length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "0.75rem" }}>
              {Object.entries(nutr.extra ?? {}).map(([key, val]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.625rem", background: "var(--bg-page)", borderRadius: "var(--radius-md)" }}>
                  <span style={{ flex: 1, fontSize: "0.82rem", fontFamily: "monospace", color: "var(--text-secondary)" }}>{key}</span>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.82rem" }}>{val}</span>
                  <button onClick={() => removeExtra(key)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: "0.2rem" }}>
                    <IconX />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Aggiungi nuovo */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px auto", gap: "0.5rem", alignItems: "flex-end" }}>
            <div>
              <label>Chiave (es. potassio_mg)</label>
              <input className="input" value={extraKey} onChange={(e) => setExtraKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addExtra()}
                placeholder="vitamina_c_mg" style={{ fontSize: "0.85rem", fontFamily: "monospace" }} />
            </div>
            <div>
              <label>Valore</label>
              <input className="input" type="number" value={extraValue} onChange={(e) => setExtraValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addExtra()}
                placeholder="0" style={{ fontSize: "0.85rem" }} />
            </div>
            <button className="btn btn-secondary" onClick={addExtra} disabled={!extraKey.trim()} style={{ gap: "0.3rem", alignSelf: "flex-end" }}>
              <IconPlus /> Add
            </button>
          </div>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.7rem", color: "var(--text-muted)" }}>
            Formato chiave: nome_unità (es. potassio_mg, vitamina_d_mcg). Il suffisso _mg/_mcg compare come unità nella tabella.
          </p>
        </div>

      </div>
    </div>
  );
}

// ── Pagina principale ──────────────────────────────────────────────────────────

export default function IngredientsDBPage() {
  const navigate = useNavigate();
  const { locale } = useTranslation();
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const [editing, setEditing] = useState<DictionaryEntry | null>(null);
  const [pulled,  setPulled]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pull custom dal cloud al primo avvio
  useEffect(() => {
    if (!pulled && SYNC_ENABLED) {
      pullCustomIngredients(getSyncId()).then(() => setPulled(true));
    } else {
      setPulled(true);
    }
  }, []);

  // Ricerca
  useEffect(() => {
    if (!pulled) return;
    if (query.trim().length === 0) {
      setResults([]);
    } else {
      setResults(searchIngredients(query.trim()));
    }
  }, [query, pulled]);

  const handleSave = useCallback((entry: DictionaryEntry) => {
    saveCustomIngredient(entry);
    setEditing(null);
    // Aggiorna risultati
    if (query.trim()) setResults(searchIngredients(query.trim()));
  }, [query]);

  const handleDelete = useCallback((canonicalId: string) => {
    deleteCustomIngredient(canonicalId);
    setEditing(null);
    if (query.trim()) setResults(searchIngredients(query.trim()));
  }, [query]);

  // Se stiamo editando, mostra il form
  if (editing) {
    return (
      <IngredientEditor
        initial={editing}
        onSave={handleSave}
        onDelete={isCustom(editing.canonicalId) ? () => handleDelete(editing.canonicalId) : undefined}
        onClose={() => setEditing(null)}
      />
    );
  }

  const customCount = Object.keys(
    (() => { try { return JSON.parse(localStorage.getItem("heirloom_custom_ingredients") ?? "{}"); } catch { return {}; } })()
  ).length;

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "1rem 1rem 3rem" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ gap: "0.3rem", padding: "0.45rem 0.7rem", fontSize: "0.82rem" }}>
          <IconBack /> Indietro
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: "1.4rem" }}>Database ingredienti</h1>
          {customCount > 0 && (
            <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--brand)" }}>
              {customCount} ingredient{customCount === 1 ? "e custom" : "i custom"}
            </p>
          )}
        </div>
      </div>

      {/* Ricerca */}
      <div style={{ position: "relative", marginBottom: "1.25rem" }}>
        <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", display: "flex", pointerEvents: "none" }}>
          <IconSearch />
        </span>
        <input
          ref={inputRef}
          type="search"
          className="input"
          autoFocus
          placeholder="Cerca per nome (IT/JP/EN) o canonical ID…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ paddingLeft: "2.5rem" }}
        />
      </div>

      {/* Risultati */}
      {results.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {results.map((entry) => (
            <EntryCard key={entry.canonicalId} entry={entry} onEdit={() => setEditing(entry)} />
          ))}
        </div>
      ) : query.trim() ? (
        /* Nessun risultato → offri di aggiungere */
        <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
          <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🔍</p>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
            Nessun ingrediente trovato per <strong>"{query}"</strong>
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setEditing(emptyEntry(query.trim().toLowerCase().replace(/\s+/g, "_")))}
            style={{ gap: "0.4rem" }}
          >
            <IconPlus /> Aggiungi "{query}"
          </button>
        </div>
      ) : (
        /* Stato iniziale */
        <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🥕</p>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 360, margin: "0 auto 1.5rem" }}>
            Cerca un ingrediente per nome per vedere i suoi dati nutrizionali, modificarli, o aggiungerne uno nuovo.
          </p>
          <button className="btn btn-secondary" onClick={() => setEditing(emptyEntry())} style={{ gap: "0.4rem" }}>
            <IconPlus /> Aggiungi nuovo ingrediente
          </button>
        </div>
      )}
    </div>
  );
}
