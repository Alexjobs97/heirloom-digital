/**
 * NutritionModal.tsx v3 — Breakdown con debug: mostra canonicalId e come è stato trovato.
 */

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Ingredient } from "../types";
import { calculateNutritionDetailed, MACRO_ROWS, formatExtraKey } from "../lib/nutrition";
import { useTranslation } from "../i18n/useTranslation";

const IconX        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconChevron  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="6 9 12 15 18 9"/></svg>;
const IconDB       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>;

function statusColor(s: string) {
  if (s === "counted")   return "#5CB85C";
  if (s === "not_found") return "#E74C3C";
  if (s === "no_unit")   return "#F5A623";
  return "var(--text-muted)";
}
function statusIcon(s: string) {
  if (s === "counted")   return "✓";
  if (s === "not_found") return "✗";
  if (s === "no_unit")   return "⚠";
  return "—";
}

interface Props {
  ingredients: Ingredient[];
  servings:    number;
  onClose:     () => void;
}

export default function NutritionModal({ ingredients, servings, onClose }: Props) {
  const { locale } = useTranslation();
  const navigate   = useNavigate();
  const isJa = locale === "ja";

  // Calcolato UNA VOLTA al mount (il modal rimonta ogni apertura grazie al && condizionale)
  const { totals, rows, coveragePercent } = useRef(
    calculateNutritionDetailed(ingredients)
  ).current;

  const [showExtra,     setShowExtra]     = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const hasSomething = rows.some((r) => r.status === "counted");
  const notFound     = rows.filter((r) => r.status === "not_found" || r.status === "no_unit");
  const counted      = rows.filter((r) => r.status === "counted");
  const skipped      = rows.filter((r) => r.status === "skipped");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h3 style={{ margin: 0 }}>{isJa ? "栄養成分" : "Valori nutrizionali"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}><IconX /></button>
        </div>

        <p style={{ margin: "0 0 0.875rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
          {isJa ? `${servings}人分・概算値` : `Per ${servings} ${servings === 1 ? "porzione" : "porzioni"} · valori approssimativi`}
        </p>

        {/* Badge copertura */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          padding: "0.625rem 0.875rem", marginBottom: "1rem", borderRadius: "var(--radius-md)",
          background: coveragePercent >= 80 ? "rgba(92,184,92,0.10)" : coveragePercent >= 50 ? "rgba(245,166,35,0.10)" : "rgba(231,76,60,0.10)",
          border: `1px solid ${coveragePercent >= 80 ? "rgba(92,184,92,0.25)" : coveragePercent >= 50 ? "rgba(245,166,35,0.25)" : "rgba(231,76,60,0.25)"}`,
        }}>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: coveragePercent >= 80 ? "#5CB85C" : coveragePercent >= 50 ? "#F5A623" : "#E74C3C" }}>
            {coveragePercent}%
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {isJa ? "認識率" : "Ingredienti riconosciuti"}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
              {counted.length} {isJa ? "計算済み" : "conteggiati"} · {notFound.length} {isJa ? "不明" : "non trovati"} · {skipped.length} {isJa ? "スキップ" : "esclusi (q.b.)"}
            </div>
          </div>
          {notFound.length > 0 && (
            <button onClick={() => { onClose(); navigate("/ingredienti"); }}
              style={{ background: "none", border: "1px solid rgba(231,76,60,0.4)", borderRadius: "var(--radius-sm)", cursor: "pointer", color: "#E74C3C", padding: "0.3rem 0.5rem", fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem", whiteSpace: "nowrap" }}>
              <IconDB /> {isJa ? "追加" : "Aggiungi"}
            </button>
          )}
        </div>

        {!hasSomething ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🔍</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>
              {isJa ? "栄養データが見つかりません" : "Nessun ingrediente trovato nel database"}
            </p>
            <button className="btn btn-secondary" onClick={() => { onClose(); navigate("/ingredienti"); }} style={{ gap: "0.35rem" }}>
              <IconDB /> {isJa ? "DBを開く" : "Apri database ingredienti"}
            </button>
          </div>
        ) : (
          <>
            {/* Macro highlight */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {([
                { label: isJa ? "エネルギー" : "Energia",  value: totals.energia_kcal, unit: "kcal", color: "var(--brand)" },
                { label: isJa ? "たんぱく質" : "Proteine", value: totals.proteine,      unit: "g",    color: "#5CB85C" },
                { label: isJa ? "炭水化物"   : "Carbo",    value: totals.carboidrati,   unit: "g",    color: "#3498DB" },
              ] as const).map((m) => (
                <div key={m.label} style={{ background: "var(--bg-page)", borderRadius: "var(--radius-md)", padding: "0.75rem 0.5rem", textAlign: "center", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "1.35rem", fontWeight: 700, color: m.color, fontFamily: "var(--font-serif)", lineHeight: 1 }}>{m.value}</div>
                  <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", fontWeight: 700, marginTop: 2 }}>{m.unit}</div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-secondary)", marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Tabella macro */}
            <table className="nutrition-table">
              <tbody>
                {MACRO_ROWS.filter((r) => r.key !== "energia_kcal").map((row) => {
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

            {/* Oligoelementi */}
            {Object.keys(totals.extra).length > 0 && (
              <div style={{ marginTop: "0.875rem" }}>
                <button onClick={() => setShowExtra((v) => !v)}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--brand)", fontWeight: 700, fontSize: "0.82rem", padding: "0.25rem 0" }}>
                  <span style={{ transform: showExtra ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "flex" }}><IconChevron /></span>
                  {isJa ? "その他の栄養素" : "Oligoelementi"}
                </button>
                {showExtra && (
                  <table className="nutrition-table" style={{ marginTop: "0.5rem" }}>
                    <tbody>
                      {Object.entries(totals.extra).map(([key, val]) => {
                        const { label, unit } = formatExtraKey(key);
                        return <tr key={key}><td>{label}</td><td>{val} {unit}</td></tr>;
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}

        {/* Breakdown per ingrediente */}
        <div style={{ marginTop: "1.25rem" }}>
          <button onClick={() => setShowBreakdown((v) => !v)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.8rem", padding: "0.25rem 0", width: "100%" }}>
            <span style={{ transform: showBreakdown ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "flex" }}><IconChevron /></span>
            {isJa ? `食材の詳細 (${rows.length})` : `Dettaglio per ingrediente (${rows.length})`}
          </button>

          {showBreakdown && (
            <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {rows.map((row, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: "0.5rem",
                  padding: "0.5rem 0.625rem", background: "var(--bg-page)",
                  borderRadius: "var(--radius-sm)", opacity: row.status === "skipped" ? 0.5 : 1,
                }}>
                  {/* Status */}
                  <span style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 800, color: statusColor(row.status), background: `${statusColor(row.status)}18`, marginTop: 1 }}>
                    {statusIcon(row.status)}
                  </span>

                  {/* Info ingrediente */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 600 }}>
                      {row.ingredient.displayName}
                      {row.grams > 0 && (
                        <span style={{ color: "var(--text-muted)", fontWeight: 400, marginLeft: "0.35rem" }}>
                          · {row.grams} g
                        </span>
                      )}
                    </div>
                    {/* Debug: canonicalId e come è stato trovato */}
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "monospace", marginTop: 1 }}>
                      {row.resolvedId
                        ? <>id: <em style={{ color: row.resolvedVia === "name" ? "#F5A623" : "var(--text-muted)" }}>{row.resolvedId}</em> {row.resolvedVia === "name" ? "⚡via nome" : ""}</>
                        : <span style={{ color: "var(--error)" }}>id: {row.ingredient.canonicalId ? `"${row.ingredient.canonicalId}" non trovato` : "(vuoto)"}</span>
                      }
                    </div>
                    {row.message && (
                      <div style={{ fontSize: "0.7rem", color: row.status === "no_unit" ? "#F5A623" : "var(--text-muted)", marginTop: 1 }}>
                        {row.message}
                      </div>
                    )}
                  </div>

                  {/* Contributo kcal O bottone aggiungi */}
                  {row.contribution ? (
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--brand)", flexShrink: 0, paddingTop: 2 }}>
                      {row.contribution.energia_kcal} kcal
                    </span>
                  ) : row.status !== "skipped" ? (
                    <button
                      onClick={() => { onClose(); navigate(`/ingredienti?q=${encodeURIComponent(row.ingredient.displayName)}`); }}
                      style={{ fontSize: "0.62rem", background: "rgba(231,76,60,0.12)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: "var(--radius-sm)", color: "#E74C3C", cursor: "pointer", padding: "0.18rem 0.4rem", fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap" }}>
                      + Aggiungi
                    </button>
                  ) : null}
                </div>
              ))}

              <button onClick={() => { onClose(); navigate("/ingredienti"); }}
                style={{ marginTop: "0.375rem", background: "none", border: "1px dashed var(--border-strong)", borderRadius: "var(--radius-md)", cursor: "pointer", color: "var(--text-muted)", padding: "0.5rem", fontSize: "0.78rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", fontWeight: 600 }}>
                <IconDB /> {isJa ? "DBを開く" : "Apri database ingredienti"}
              </button>
            </div>
          )}
        </div>

        <p style={{ margin: "1rem 0 0", fontSize: "0.65rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
          {isJa ? "値は概算です。q.b.（油を除く）は計算から除外されます。" : "Valori approssimativi. q.b. (eccetto olio = 10ml) escluso dal calcolo."}
        </p>
      </div>
    </div>
  );
}
