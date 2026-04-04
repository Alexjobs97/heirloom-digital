/**
 * NutritionModal.tsx — Premium nutrition facts modal with expandable extras.
 */

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Ingredient } from "../types";
import { calculateNutritionDetailed, MACRO_ROWS, formatExtraKey } from "../lib/nutrition";
import { useTranslation } from "../i18n/useTranslation";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconX       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconChevron = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polyline points="6 9 12 15 18 9"/></svg>;
const IconDB      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>;

// ── Status styling ────────────────────────────────────────────────────────────
function statusColor(status: string): string {
  if (status === "counted")   return "#5CB85C";
  if (status === "not_found") return "#E74C3C";
  if (status === "no_unit")   return "#F5A623";
  return "var(--text-muted)";
}
function statusIcon(status: string): string {
  if (status === "counted")   return "✓";
  if (status === "not_found") return "?";
  if (status === "no_unit")   return "!";
  return "—";
}
function statusLabel(status: string, locale: string): string {
  if (locale === "ja") {
    if (status === "counted")   return "計算済み";
    if (status === "not_found") return "未登録";
    if (status === "no_unit")   return "単位不明";
    return "スキップ";
  }
  if (status === "counted")   return "Calcolato";
  if (status === "not_found") return "Non trovato";
  if (status === "no_unit")   return "Unita mancante";
  return "Escluso";
}

interface Props {
  ingredients: Ingredient[];
  servings: number;
  onClose: () => void;
}

export default function NutritionModal({ ingredients, servings, onClose }: Props) {
  const { locale } = useTranslation();
  const navigate = useNavigate();
  const [showExtra,     setShowExtra]     = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const resultRef = useRef(calculateNutritionDetailed(ingredients));
  const result = resultRef.current;
  const { totals, rows, coveragePercent } = result;

  const hasSomething = rows.some((r) => r.status === "counted");
  const notFound     = rows.filter((r) => r.status === "not_found" || r.status === "no_unit");
  const counted      = rows.filter((r) => r.status === "counted");
  const skipped      = rows.filter((r) => r.status === "skipped");
  const extraKeys    = Object.keys(totals.extra);

  const isJa = locale === "ja";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal nutrition-modal" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="nutrition-header">
          <div>
            <h3 className="nutrition-title">{isJa ? "栄養成分表" : "Valori Nutrizionali"}</h3>
            <p className="nutrition-subtitle">
              {isJa ? `${servings}人分 · 概算値` : `${servings} ${servings === 1 ? "porzione" : "porzioni"} · valori approssimativi`}
            </p>
          </div>
          <button onClick={onClose} className="nutrition-close" aria-label="Close">
            <IconX />
          </button>
        </div>

        {/* ── Coverage badge ────────────────────────────────────────────── */}
        <div className={`coverage-badge ${coveragePercent >= 80 ? "good" : coveragePercent >= 50 ? "ok" : "low"}`}>
          <div className="coverage-percent">{coveragePercent}%</div>
          <div className="coverage-text">
            <strong>{isJa ? "認識率" : "Copertura"}</strong>
            <span>
              {counted.length} {isJa ? "計算済み" : "calcolati"} · {notFound.length} {isJa ? "不明" : "mancanti"} · {skipped.length} {isJa ? "除外" : "esclusi"}
            </span>
          </div>
          {notFound.length > 0 && (
            <button onClick={() => { onClose(); navigate("/ingredienti"); }} className="coverage-action">
              <IconDB /> {isJa ? "追加" : "Aggiungi"}
            </button>
          )}
        </div>

        {!hasSomething ? (
          /* ── Empty state ──────────────────────────────────────────────── */
          <div className="nutrition-empty">
            <div className="empty-icon">?</div>
            <p>{isJa ? "栄養データが見つかりません" : "Nessun dato nutrizionale trovato"}</p>
            <button className="btn btn-secondary" onClick={() => { onClose(); navigate("/ingredienti"); }}>
              <IconDB /> {isJa ? "データベースを開く" : "Apri database"}
            </button>
          </div>
        ) : (
          <>
            {/* ── Macro highlights ────────────────────────────────────────── */}
            <div className="macro-highlights">
              <div className="macro-card energy">
                <span className="macro-value">{totals.energia_kcal}</span>
                <span className="macro-unit">kcal</span>
                <span className="macro-label">{isJa ? "エネルギー" : "Energia"}</span>
              </div>
              <div className="macro-card protein">
                <span className="macro-value">{totals.proteine}</span>
                <span className="macro-unit">g</span>
                <span className="macro-label">{isJa ? "たんぱく質" : "Proteine"}</span>
              </div>
              <div className="macro-card carbs">
                <span className="macro-value">{totals.carboidrati}</span>
                <span className="macro-unit">g</span>
                <span className="macro-label">{isJa ? "炭水化物" : "Carboidrati"}</span>
              </div>
              <div className="macro-card fats">
                <span className="macro-value">{totals.grassi}</span>
                <span className="macro-unit">g</span>
                <span className="macro-label">{isJa ? "脂質" : "Grassi"}</span>
              </div>
            </div>

            {/* ── Detailed macros table ────────────────────────────────────── */}
            <div className="nutrition-details">
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
            </div>

            {/* ── Expandable extras ─────────────────────────────────────────── */}
            {extraKeys.length > 0 && (
              <div className="nutrition-section">
                <button onClick={() => setShowExtra((v) => !v)} className="section-toggle">
                  <span className={`toggle-icon ${showExtra ? "open" : ""}`}><IconChevron /></span>
                  <span>{isJa ? "ビタミン・ミネラル" : "Vitamine e Minerali"}</span>
                  <span className="toggle-count">{extraKeys.length}</span>
                </button>
                {showExtra && (
                  <div className="extras-grid">
                    {extraKeys.map((key) => {
                      const { label, unit } = formatExtraKey(key);
                      return (
                        <div key={key} className="extra-item">
                          <span className="extra-label">{label}</span>
                          <span className="extra-value">{totals.extra[key]} {unit}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Ingredient breakdown ──────────────────────────────────────── */}
            <div className="nutrition-section">
              <button onClick={() => setShowBreakdown((v) => !v)} className="section-toggle">
                <span className={`toggle-icon ${showBreakdown ? "open" : ""}`}><IconChevron /></span>
                <span>{isJa ? "食材の詳細" : "Dettaglio ingredienti"}</span>
                <span className="toggle-count">{rows.length}</span>
              </button>

              {showBreakdown && (
                <div className="breakdown-list">
                  {rows.map((row, i) => (
                    <div key={i} className={`breakdown-item ${row.status}`}>
                      <span className="breakdown-status" style={{ background: `${statusColor(row.status)}20`, color: statusColor(row.status) }}>
                        {statusIcon(row.status)}
                      </span>
                      <div className="breakdown-info">
                        <span className="breakdown-name">
                          {row.ingredient.displayName}
                          {row.grams > 0 && <span className="breakdown-grams"> · {row.grams}g</span>}
                        </span>
                        {row.message && <span className="breakdown-message">{row.message}</span>}
                      </div>
                      {row.contribution ? (
                        <span className="breakdown-kcal">{row.contribution.energia_kcal} kcal</span>
                      ) : row.status !== "skipped" && (
                        <button
                          onClick={() => { onClose(); navigate("/ingredienti?q=" + encodeURIComponent(row.ingredient.displayName)); }}
                          className="breakdown-add"
                        >
                          + {isJa ? "追加" : "Aggiungi"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Disclaimer ────────────────────────────────────────────────── */}
        <p className="nutrition-disclaimer">
          {isJa
            ? "値は概算です。データのない食材は計算に含まれません。"
            : "Valori calcolati in base ai dati disponibili. Ingredienti q.b. esclusi."}
        </p>
      </div>
    </div>
  );
}
