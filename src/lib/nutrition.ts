/**
 * nutrition.ts v6 — Logica semplificata, un solo punto di risoluzione.
 */

import type { Ingredient, NutritionTotals, DictionaryEntry } from "../types";
import { resolveIngredient, resolveByName } from "./customIngredients";

export type IngredientStatus = "counted" | "not_found" | "skipped" | "no_unit";

export interface IngredientNutritionRow {
  ingredient:   Ingredient;
  status:       IngredientStatus;
  grams:        number;
  resolvedId:   string;          // canonicalId che ha matchato (per debug)
  resolvedVia:  "id" | "name" | "none";  // come è stato trovato
  contribution?: {
    energia_kcal: number;
    proteine:     number;
    carboidrati:  number;
    grassi:       number;
  };
  message?: string;
}

// ── Risoluzione ingrediente (un unico posto, nessuna doppia lookup) ───────────

function resolve(ing: Ingredient): {
  entry: DictionaryEntry | null;
  via:   "id" | "name" | "none";
} {
  // PRIORITÀ 1: cerca per displayName — è sempre il testo originale dell'utente,
  // mentre il canonicalId può essere sbagliato (parser fuzzy troppo permissivo).
  const byName = resolveByName(ing.displayName);
  if (byName) return { entry: byName, via: "name" };

  // PRIORITÀ 2: fallback su canonicalId (utile se displayName è in una lingua
  // non supportata o se il nome custom non matcha)
  if (ing.canonicalId) {
    const byId = resolveIngredient(ing.canonicalId);
    if (byId) return { entry: byId, via: "id" };
  }

  return { entry: null, via: "none" };
}

// ── Calcola grammi + status ───────────────────────────────────────────────────

function processIngredient(ing: Ingredient): IngredientNutritionRow {
  const { entry, via } = resolve(ing);
  const resolvedId = entry?.canonicalId ?? "";
  const raw = ing.qty;

  // Quantità testuale (q.b., qb, ecc.)
  if (typeof raw === "string") {
    const lower = raw.toLowerCase().trim();
    const isQb = lower === "q.b." || lower === "qb" || lower === "a piacere" || lower === "" || lower === "—";
    if (isQb) {
      const isOil =
        resolvedId.includes("oil") || resolvedId.includes("olio") ||
        ing.displayName.toLowerCase().includes("olio") ||
        ing.displayName.toLowerCase().includes("oil");
      if (isOil && entry?.nutrition) {
        return buildRow(ing, entry, via, resolvedId, 10, "q.b. → 10 ml");
      }
      return { ingredient: ing, status: "skipped", grams: 0, resolvedId, resolvedVia: via, message: "q.b. escluso" };
    }
    return { ingredient: ing, status: "skipped", grams: 0, resolvedId, resolvedVia: via, message: `Testo non numerico: "${raw}"` };
  }

  // Quantità numerica
  const qty = typeof raw === "number" ? raw : parseFloat(String(raw));
  if (isNaN(qty) || qty <= 0) {
    return { ingredient: ing, status: "skipped", grams: 0, resolvedId, resolvedVia: via, message: "Quantità non valida" };
  }

  if (!entry) {
    return { ingredient: ing, status: "not_found", grams: 0, resolvedId, resolvedVia: "none", message: "Non trovato nel database" };
  }
  if (!entry.nutrition) {
    return { ingredient: ing, status: "not_found", grams: 0, resolvedId, resolvedVia: via, message: "Nessun dato nutrizionale" };
  }

  // Unità esplicita g/ml
  if (ing.unit === "g" || ing.unit === "ml") {
    return buildRow(ing, entry, via, resolvedId, qty);
  }

  // Nessuna unità → N × peso_medio_unità
  const pw = entry.peso_medio_unità;
  if (pw && pw > 0) {
    const grams = Math.round(qty * pw * 10) / 10;
    return buildRow(ing, entry, via, resolvedId, grams, `${qty} × ${pw}g/unità`);
  }

  // Peso unitario mancante
  return {
    ingredient: ing, status: "no_unit", grams: 0, resolvedId, resolvedVia: via,
    message: `Manca peso_medio_unità (${qty} unità × ? g)`,
  };
}

function buildRow(
  ing: Ingredient,
  entry: DictionaryEntry,
  via: "id" | "name" | "none",
  resolvedId: string,
  grams: number,
  message?: string
): IngredientNutritionRow {
  const n = entry.nutrition!;
  const f = grams / 100;
  return {
    ingredient: ing,
    status: "counted",
    grams: Math.round(grams * 10) / 10,
    resolvedId,
    resolvedVia: via,
    message,
    contribution: {
      energia_kcal: r1((n.energia_kcal ?? 0) * f),
      proteine:      r1((n.proteine     ?? 0) * f),
      carboidrati:   r1((n.carboidrati  ?? 0) * f),
      grassi:        r1((n.grassi       ?? 0) * f),
    },
  };
}

// ── Calcolo totali ─────────────────────────────────────────────────────────────

const EMPTY: NutritionTotals = {
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
  const totals: NutritionTotals = { ...EMPTY, extra: {} };
  let counted = 0, relevant = 0;

  for (const ing of ingredients) {
    const row = processIngredient(ing);
    rows.push(row);

    if (row.status === "skipped") continue;
    relevant++;
    if (row.status !== "counted" || !row.contribution || row.grams <= 0) continue;

    counted++;
    const { entry } = resolve(ing);     // entry già risolto, ok da ricercare (è in cache locale)
    const n = entry?.nutrition;
    if (!n) continue;

    const f = row.grams / 100;
    totals.energia_kcal     += row.contribution.energia_kcal;
    totals.proteine          += row.contribution.proteine;
    totals.carboidrati       += row.contribution.carboidrati;
    totals.grassi            += row.contribution.grassi;
    totals.zuccheri          += r1((n.zuccheri      ?? 0) * f);
    totals.grassi_saturi     += r1((n.grassi_saturi ?? 0) * f);
    totals.fibre             += r1((n.fibre          ?? 0) * f);
    totals.sale              += r2((n.sale           ?? 0) * f);
    totals.gramsAccountedFor += row.grams;

    for (const [k, v] of Object.entries(n.extra ?? {})) {
      totals.extra[k] = r1((totals.extra[k] ?? 0) + (v ?? 0) * f);
    }
  }

  return {
    totals:          roundTotals(totals),
    rows,
    coveragePercent: relevant > 0 ? Math.round((counted / relevant) * 100) : 100,
  };
}

export function calculateNutrition(ingredients: Ingredient[]): NutritionTotals | null {
  const { totals, rows } = calculateNutritionDetailed(ingredients);
  return rows.some((r) => r.status === "counted") ? totals : null;
}

function r1(v: number) { return Math.round(v * 10) / 10; }
function r2(v: number) { return Math.round(v * 100) / 100; }

function roundTotals(t: NutritionTotals): NutritionTotals {
  return {
    energia_kcal:      Math.round(t.energia_kcal),
    proteine:           r1(t.proteine),
    carboidrati:        r1(t.carboidrati),
    zuccheri:           r1(t.zuccheri),
    grassi:             r1(t.grassi),
    grassi_saturi:      r1(t.grassi_saturi),
    fibre:              r1(t.fibre),
    sale:               r2(t.sale),
    extra:              t.extra,
    gramsAccountedFor:  Math.round(t.gramsAccountedFor),
  };
}

export function formatExtraKey(key: string): { label: string; unit: string } {
  const parts = key.split("_");
  const unit = ["mg","mcg","ug","iu"].includes(parts[parts.length - 1]) ? parts.pop()! : "";
  return { label: parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" "), unit };
}

export const MACRO_ROWS: Array<{ key: keyof NutritionTotals; label: string; unit: string; indent?: boolean }> = [
  { key: "energia_kcal",  label: "Energia",         unit: "kcal" },
  { key: "grassi",        label: "Grassi",           unit: "g"   },
  { key: "grassi_saturi", label: "di cui saturi",    unit: "g", indent: true },
  { key: "carboidrati",   label: "Carboidrati",      unit: "g"   },
  { key: "zuccheri",      label: "di cui zuccheri",  unit: "g", indent: true },
  { key: "proteine",      label: "Proteine",         unit: "g"   },
  { key: "fibre",         label: "Fibre",            unit: "g"   },
  { key: "sale",          label: "Sale",             unit: "g"   },
];
