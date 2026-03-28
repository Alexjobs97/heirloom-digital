/**
 * scaling.ts — Scalatura porzioni con arrotondamento intelligente a frazioni.
 * Tutte le funzioni sono pure e sincrone.
 */

import type { Ingredient } from "../types";

// ─── Frazioni comuni ──────────────────────────────────────────────────────────

const FRACTION_MAP: Array<[number, string]> = [
  [1 / 8,  "⅛"],
  [1 / 6,  "⅙"],
  [1 / 5,  "⅕"],
  [1 / 4,  "¼"],
  [1 / 3,  "⅓"],
  [3 / 8,  "⅜"],
  [2 / 5,  "⅖"],
  [1 / 2,  "½"],
  [3 / 5,  "⅗"],
  [5 / 8,  "⅝"],
  [2 / 3,  "⅔"],
  [3 / 4,  "¾"],
  [4 / 5,  "⅘"],
  [5 / 6,  "⅚"],
  [7 / 8,  "⅞"],
];

const TOLERANCE = 0.04; // ±4% → considera la frazione abbastanza vicina

// ─── Arrotondamento intelligente ──────────────────────────────────────────────

/**
 * Converte un numero in stringa leggibile con frazioni unicode dove sensato.
 *
 * Esempi:
 *   1.5   → "1½"
 *   0.333 → "⅓"
 *   1.333 → "1⅓"
 *   250   → "250"
 *   12.6  → "13"
 *   0.08  → "0.08"
 */
export function toDisplayQty(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "—";
  if (value === 0) return "0";

  // Valori grandi (≥ 10): arrotonda all'intero
  if (value >= 10) return String(Math.round(value));

  // Valori ≥ 1: intero + eventuale frazione
  if (value >= 1) {
    const intPart = Math.floor(value);
    const decimal = value - intPart;

    if (decimal < TOLERANCE)         return String(intPart);
    if (decimal > 1 - TOLERANCE)     return String(intPart + 1);

    const frac = findFraction(decimal);
    if (frac) return intPart > 0 ? `${intPart}${frac}` : frac;

    return value.toFixed(1).replace(/\.0$/, "");
  }

  // Valori piccoli (< 1)
  if (value < TOLERANCE) return "—";

  const frac = findFraction(value);
  if (frac) return frac;

  if (value < 0.1)
    return value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  return value.toFixed(1).replace(/\.0$/, "");
}

function findFraction(decimal: number): string | null {
  for (const [fval, fsym] of FRACTION_MAP) {
    if (Math.abs(decimal - fval) <= TOLERANCE) return fsym;
  }
  return null;
}

// ─── Scalatura ────────────────────────────────────────────────────────────────

/**
 * Scala una singola quantità numerica da baseYield a targetYield.
 * Quantità testuali (q.b.) restano invariate.
 */
export function scaleQty(
  qty: number | string,
  baseYield: number,
  targetYield: number
): number | string {
  if (typeof qty === "string") return qty;
  if (baseYield <= 0) return qty;
  return qty * (targetYield / baseYield);
}

/**
 * Scala un intero array di Ingredient.
 * Non muta l'originale — ritorna copie.
 */
export function scaleIngredients(
  ingredients: Ingredient[],
  baseYield: number,
  targetYield: number
): Ingredient[] {
  if (baseYield === targetYield) return ingredients;
  return ingredients.map((ing) => ({
    ...ing,
    qty: scaleQty(ing.qty, baseYield, targetYield),
  }));
}

/**
 * Formatta un ingrediente scalato per la UI.
 * Ritorna le tre parti separatamente per il layout flessibile.
 */
export function formatIngredient(
  ing: Ingredient,
  baseYield: number,
  targetYield: number
): { qtyDisplay: string; unit: string; name: string } {
  const scaled = scaleQty(ing.qty, baseYield, targetYield);

  const qtyDisplay =
    typeof scaled === "string"
      ? scaled
      : scaled === 0
      ? ""
      : toDisplayQty(scaled);

  return { qtyDisplay, unit: ing.unit, name: ing.displayName };
}

// ─── Utilità di formato ───────────────────────────────────────────────────────

/** Clamp sicuro per lo slider porzioni (1–50). */
export function clampServings(val: number): number {
  return Math.max(1, Math.min(50, Math.round(val)));
}

/** "1 porzione" / "4 porzioni" */
export function formatServings(n: number): string {
  return n === 1 ? "1 porzione" : `${n} porzioni`;
}

/** 45 → "45 min" | 90 → "1h 30min" | 60 → "1h" */
export function formatTime(minutes: number): string {
  if (minutes <= 0) return "—";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

/** Genera un UUID v4 semplice senza dipendenze. */
export function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
