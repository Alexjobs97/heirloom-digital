/**
 * nutrition.ts — Calcolo valori nutrizionali da ingredienti scalati.
 *
 * Regole quantità:
 *  - unit "g" o "ml" → qty grammi/ml, confronta con valori per 100g
 *  - unit ""          → qty unità × peso_medio_unità (grammi)
 *  - "q.b."           → skip, eccetto olio → 10 ml
 *  - ingredienti senza dati nutrition → skip silenziosamente
 */

import type { Ingredient, NutritionTotals } from "../types";
import { INGREDIENT_DICTIONARY } from "./ingredients";

// ── Helper: peso in grammi da un ingrediente scalato ─────────────────────────

function toGrams(ing: Ingredient): number | null {
  const entry = INGREDIENT_DICTIONARY[ing.canonicalId];
  if (!entry?.nutrition) return null;

  const raw = ing.qty;

  // q.b. → skip (eccetto olio = 10ml)
  if (typeof raw === "string") {
    const lower = raw.toLowerCase();
    if (lower === "q.b." || lower === "qb" || lower === "a piacere") {
      // olio → 10 ml
      const isOil = ["oil", "olive_oil", "sesame_oil", "olio"].some((k) =>
        ing.canonicalId.includes(k) || ing.displayName.toLowerCase().includes("olio")
      );
      return isOil ? 10 : null;
    }
    return null;
  }

  const qty = typeof raw === "number" ? raw : parseFloat(String(raw));
  if (isNaN(qty) || qty <= 0) return null;

  if (ing.unit === "g" || ing.unit === "ml") {
    return qty; // già in grammi/ml, trattati equivalenti per ora
  }

  // Nessuna unità → "N unità di X"
  const unitWeight = entry.peso_medio_unità;
  if (unitWeight && unitWeight > 0) {
    return qty * unitWeight;
  }

  // Fallback: se defaultUnit è g, assume grammi
  if (entry.defaultUnit === "g") return qty;

  return null;
}

// ── Calcolo principale ────────────────────────────────────────────────────────

const EMPTY: NutritionTotals = {
  energia_kcal: 0,
  proteine: 0,
  carboidrati: 0,
  zuccheri: 0,
  grassi: 0,
  grassi_saturi: 0,
  fibre: 0,
  sale: 0,
  extra: {},
  gramsAccountedFor: 0,
};

/**
 * Calcola i totali nutrizionali per una lista di ingredienti già scalati.
 * Ritorna null se nessun ingrediente ha dati nutrizionali.
 */
export function calculateNutrition(ingredients: Ingredient[]): NutritionTotals | null {
  let found = false;
  const totals: NutritionTotals = { ...EMPTY, extra: {} };

  for (const ing of ingredients) {
    const entry = INGREDIENT_DICTIONARY[ing.canonicalId];
    if (!entry?.nutrition) continue;

    const grams = toGrams(ing);
    if (grams === null || grams <= 0) continue;

    found = true;
    const factor = grams / 100;
    const n = entry.nutrition;

    totals.energia_kcal    += (n.energia_kcal    ?? 0) * factor;
    totals.proteine         += (n.proteine         ?? 0) * factor;
    totals.carboidrati      += (n.carboidrati      ?? 0) * factor;
    totals.zuccheri         += (n.zuccheri         ?? 0) * factor;
    totals.grassi           += (n.grassi           ?? 0) * factor;
    totals.grassi_saturi    += (n.grassi_saturi    ?? 0) * factor;
    totals.fibre            += (n.fibre            ?? 0) * factor;
    totals.sale             += (n.sale             ?? 0) * factor;
    totals.gramsAccountedFor += grams;

    if (n.extra) {
      for (const [key, val] of Object.entries(n.extra)) {
        totals.extra[key] = (totals.extra[key] ?? 0) + (val ?? 0) * factor;
      }
    }
  }

  return found ? roundTotals(totals) : null;
}

function roundTotals(t: NutritionTotals): NutritionTotals {
  const r = (v: number, dec = 1) => Math.round(v * 10 ** dec) / 10 ** dec;
  return {
    energia_kcal:     Math.round(t.energia_kcal),
    proteine:         r(t.proteine),
    carboidrati:      r(t.carboidrati),
    zuccheri:         r(t.zuccheri),
    grassi:           r(t.grassi),
    grassi_saturi:    r(t.grassi_saturi),
    fibre:            r(t.fibre),
    sale:             r(t.sale, 2),
    extra:            Object.fromEntries(
      Object.entries(t.extra).map(([k, v]) => [k, r(v)])
    ),
    gramsAccountedFor: Math.round(t.gramsAccountedFor),
  };
}

// ── Label helpers ─────────────────────────────────────────────────────────────

/** Formatta una chiave "extra" in label leggibile (es. "potassio_mg" → "Potassio") */
export function formatExtraKey(key: string): { label: string; unit: string } {
  const parts = key.split("_");
  const unit  = ["mg", "mcg", "ug", "iu"].includes(parts[parts.length - 1])
    ? parts.pop()!
    : "";
  const label = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
  return { label, unit };
}

/** Macro principali da mostrare nella tabella compatta */
export const MACRO_ROWS: Array<{ key: keyof NutritionTotals; label: string; unit: string; indent?: boolean }> = [
  { key: "energia_kcal", label: "Energia",        unit: "kcal" },
  { key: "grassi",       label: "Grassi",          unit: "g"    },
  { key: "grassi_saturi",label: "di cui saturi",   unit: "g", indent: true },
  { key: "carboidrati",  label: "Carboidrati",      unit: "g"    },
  { key: "zuccheri",     label: "di cui zuccheri", unit: "g", indent: true },
  { key: "proteine",     label: "Proteine",         unit: "g"    },
  { key: "fibre",        label: "Fibre",            unit: "g"    },
  { key: "sale",         label: "Sale",             unit: "g"    },
];
