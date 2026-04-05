/**
 * nutrition.ts v5 — Calcolo nutrizionale con breakdown per-ingrediente.
 *
 * FIX CRITICO: toGrams ora restituisce anche l'entry trovata (con fallback
 * su displayName), così il loop non fa una seconda lookup che mancherebbe
 * del fallback, causando il bug "8 ✓ ma 13% e totali errati".
 */

import type { Ingredient, NutritionTotals } from "../types";
import { resolveIngredient, resolveByName } from "./customIngredients";

// ── Status per ingrediente ────────────────────────────────────────────────────

export type IngredientStatus = "counted" | "not_found" | "skipped" | "no_unit";

export interface IngredientNutritionRow {
  ingredient:    Ingredient;
  status:        IngredientStatus;
  grams:         number;
  contribution?: {
    energia_kcal: number;
    proteine:     number;
    carboidrati:  number;
    grassi:       number;
  };
  message?:      string;
}

// ── Import DictionaryEntry type ───────────────────────────────────────────────

import type { DictionaryEntry } from "../types";

// ── toGrams — restituisce anche l'entry per evitare doppie lookup ─────────────

function toGrams(ing: Ingredient): {
  grams:   number;
  status:  IngredientStatus;
  message?: string;
  entry:   DictionaryEntry | null;   // ← l'entry trovata, usata dal loop principale
} {
  // Risolve: canonicalId prima, poi fallback per nome (gestisce canonicalId vuoti/errati)
  const entry: DictionaryEntry | null =
    resolveIngredient(ing.canonicalId) ?? resolveByName(ing.displayName);

  const raw = ing.qty;

  // ── q.b. / a piacere ───────────────────────────────────────────────────────
  if (typeof raw === "string") {
    const lower = raw.toLowerCase().trim();
    if (lower === "q.b." || lower === "qb" || lower === "a piacere" || lower === "" || lower === "—") {
      const isOil =
        ing.canonicalId.includes("oil") ||
        ing.canonicalId.includes("olio") ||
        ing.displayName.toLowerCase().includes("olio") ||
        ing.displayName.toLowerCase().includes("oil");
      if (isOil) {
        return { grams: 10, status: entry?.nutrition ? "counted" : "not_found", message: "q.b. → 10 ml", entry };
      }
      return { grams: 0, status: "skipped", message: "q.b. escluso", entry };
    }
    return { grams: 0, status: "skipped", message: `Quantità testuale: "${raw}"`, entry };
  }

  const qty = typeof raw === "number" ? raw : parseFloat(String(raw));
  if (isNaN(qty) || qty <= 0) return { grams: 0, status: "skipped", message: "Quantità non valida", entry };

  if (!entry)           return { grams: 0, status: "not_found", message: "Ingrediente non trovato nel database", entry: null };
  if (!entry.nutrition) return { grams: 0, status: "not_found", message: "Nessun dato nutrizionale nel database", entry };

  // ── g o ml → diretto ────────────────────────────────────────────────────────
  if (ing.unit === "g" || ing.unit === "ml") {
    return { grams: qty, status: "counted", entry };
  }

  // ── Nessuna unità → N × peso_medio_unità ────────────────────────────────────
  if (entry.peso_medio_unità && entry.peso_medio_unità > 0) {
    const grams = Math.round(qty * entry.peso_medio_unità * 10) / 10;
    return {
      grams,
      status: "counted",
      message: `${qty} × ${entry.peso_medio_unità}g/unità`,
      entry,
    };
  }

  // Nessun peso unitario → segnala come non conteggiato
  return {
    grams: 0,
    status: "no_unit",
    message: `Aggiungi peso_medio_unità nel DB (${qty} unità × ? g)`,
    entry,
  };
}

// ── Calcolo principale ────────────────────────────────────────────────────────

const EMPTY_TOTALS: NutritionTotals = {
  energia_kcal: 0, proteine: 0, carboidrati: 0, zuccheri: 0,
  grassi: 0, grassi_saturi: 0, fibre: 0, sale: 0,
  extra: {}, gramsAccountedFor: 0,
};

export interface NutritionResult {
  totals:          NutritionTotals;
  rows:            IngredientNutritionRow[];
  coveragePercent: number;
}

export function calculateNutritionDetailed(ingredients: Ingredient[]): NutritionResult {
  const rows: IngredientNutritionRow[] = [];
  const totals: NutritionTotals = { ...EMPTY_TOTALS, extra: {} };
  let countedN     = 0;
  let totalRelevant = 0;

  for (const ing of ingredients) {
    // toGrams ora restituisce anche l'entry — NON ripetiamo la lookup
    const { grams, status, message, entry } = toGrams(ing);

    if (status === "skipped") {
      rows.push({ ingredient: ing, status, grams: 0, message });
      continue;
    }

    totalRelevant++;

    // Se non conteggiato per qualsiasi motivo
    if (status !== "counted" || !entry?.nutrition || grams <= 0) {
      rows.push({ ingredient: ing, status, grams, message });
      continue;
    }

    // Somma ai totali
    countedN++;
    const factor = grams / 100;
    const n      = entry.nutrition;

    const contrib = {
      energia_kcal: round1((n.energia_kcal    ?? 0) * factor),
      proteine:      round1((n.proteine         ?? 0) * factor),
      carboidrati:   round1((n.carboidrati      ?? 0) * factor),
      grassi:        round1((n.grassi           ?? 0) * factor),
    };

    totals.energia_kcal     += contrib.energia_kcal;
    totals.proteine          += contrib.proteine;
    totals.carboidrati       += contrib.carboidrati;
    totals.zuccheri          += round1((n.zuccheri      ?? 0) * factor);
    totals.grassi            += contrib.grassi;
    totals.grassi_saturi     += round1((n.grassi_saturi ?? 0) * factor);
    totals.fibre             += round1((n.fibre          ?? 0) * factor);
    totals.sale              += round2((n.sale           ?? 0) * factor);
    totals.gramsAccountedFor += grams;

    if (n.extra) {
      for (const [key, val] of Object.entries(n.extra)) {
        totals.extra[key] = round1((totals.extra[key] ?? 0) + (val ?? 0) * factor);
      }
    }

    rows.push({ ingredient: ing, status, grams: round0(grams), contribution: contrib, message });
  }

  return {
    totals:          roundTotals(totals),
    rows,
    coveragePercent: totalRelevant > 0 ? Math.round((countedN / totalRelevant) * 100) : 100,
  };
}

/** Shortcut — solo totali (per compatibilità) */
export function calculateNutrition(ingredients: Ingredient[]): NutritionTotals | null {
  const { totals, rows } = calculateNutritionDetailed(ingredients);
  return rows.some((r) => r.status === "counted") ? totals : null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function round0(v: number) { return Math.round(v); }
function round1(v: number) { return Math.round(v * 10) / 10; }
function round2(v: number) { return Math.round(v * 100) / 100; }

function roundTotals(t: NutritionTotals): NutritionTotals {
  return {
    energia_kcal:      Math.round(t.energia_kcal),
    proteine:           round1(t.proteine),
    carboidrati:        round1(t.carboidrati),
    zuccheri:           round1(t.zuccheri),
    grassi:             round1(t.grassi),
    grassi_saturi:      round1(t.grassi_saturi),
    fibre:              round1(t.fibre),
    sale:               round2(t.sale),
    extra:              t.extra,
    gramsAccountedFor:  Math.round(t.gramsAccountedFor),
  };
}

export function formatExtraKey(key: string): { label: string; unit: string } {
  const parts = key.split("_");
  const unit = ["mg","mcg","ug","iu"].includes(parts[parts.length - 1]) ? parts.pop()! : "";
  const label = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
  return { label, unit };
}

export const MACRO_ROWS: Array<{
  key: keyof NutritionTotals; label: string; unit: string; indent?: boolean;
}> = [
  { key: "energia_kcal",  label: "Energia",          unit: "kcal" },
  { key: "grassi",        label: "Grassi",            unit: "g"    },
  { key: "grassi_saturi", label: "di cui saturi",     unit: "g", indent: true },
  { key: "carboidrati",   label: "Carboidrati",       unit: "g"    },
  { key: "zuccheri",      label: "di cui zuccheri",   unit: "g", indent: true },
  { key: "proteine",      label: "Proteine",          unit: "g"    },
  { key: "fibre",         label: "Fibre",             unit: "g"    },
  { key: "sale",          label: "Sale",              unit: "g"    },
];
