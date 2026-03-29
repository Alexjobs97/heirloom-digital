/**
 * conversions.ts — Mappa di conversione unità imperiali → metriche.
 * Tutte le funzioni sono pure e sincrone. Nessuna dipendenza esterna.
 */

// ─── Mappe di conversione ─────────────────────────────────────────────────────

/** Unità di volume → ml */
export const VOLUME_TO_ML: Record<string, number> = {
  // Tazze
  cup: 240, cups: 240, "c.": 240,
  // Cucchiai
  tablespoon: 15, tablespoons: 15, tbsp: 15, tbs: 15, "tbsp.": 15, "T.": 15,
  // Cucchiaini
  teaspoon: 5, teaspoons: 5, tsp: 5, "tsp.": 5, "t.": 5,
  // Fluid ounces
  "fl oz": 30, "fl. oz": 30, "fl. oz.": 30,
  "fluid ounce": 30, "fluid ounces": 30, floz: 30,
  // Pinte
  pint: 473, pints: 473, pt: 473, "pt.": 473,
  // Quart
  quart: 946, quarts: 946, qt: 946, "qt.": 946,
  // Galloni
  gallon: 3785, gallons: 3785, gal: 3785,
  // Metriche (passthrough)
  ml: 1, mL: 1, milliliter: 1, milliliters: 1, millilitre: 1, millilitres: 1,
  cl: 10, cL: 10, centiliter: 10, centilitri: 10, centilitro: 10,
  dl: 100, dL: 100, deciliter: 100, decilitro: 100, decilitri: 100,
  l: 1000, L: 1000, liter: 1000, liters: 1000, litre: 1000, litres: 1000,
  litro: 1000, litri: 1000,
};

/** Unità di peso → grammi */
export const WEIGHT_TO_G: Record<string, number> = {
  // Once (peso)
  oz: 28.35, "oz.": 28.35, ounce: 28.35, ounces: 28.35,
  // Libbre
  lb: 453.6, lbs: 453.6, "lb.": 453.6, pound: 453.6, pounds: 453.6,
  // Metriche (passthrough)
  g: 1, gr: 1, gram: 1, grams: 1, grammo: 1, grammi: 1,
  kg: 1000, kilogram: 1000, kilograms: 1000, chilogrammo: 1000, chilogrammi: 1000,
};

/** Alias italiani informali per volumi → ml */
export const ITALIAN_VOLUME_TO_ML: Record<string, number> = {
  tazza: 240, tazze: 240,
  cucchiaio: 15, cucchiai: 15,
  cucchiaino: 5, cucchiaini: 5,
  bicchiere: 200, bicchieri: 200,
};

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export type MetricUnit = "ml" | "g" | "";

export interface ConversionResult {
  qty: number;
  unit: MetricUnit;
  wasConverted: boolean;
  originalUnit: string;
}

// ─── Funzioni principali ──────────────────────────────────────────────────────

function normalizeUnit(unit: string): string {
  return unit.toLowerCase().trim();
}

/**
 * Classifica un'unità come volume, peso, o sconosciuta.
 */
export function classifyUnit(
  unit: string
): "volume" | "weight" | "unknown" {
  const u = normalizeUnit(unit);
  if (!u || u === "q.b." || u === "qb" || u === "a piacere" || u === "a gusto")
    return "unknown";
  if (VOLUME_TO_ML[u] !== undefined || ITALIAN_VOLUME_TO_ML[u] !== undefined)
    return "volume";
  if (WEIGHT_TO_G[u] !== undefined) return "weight";
  return "unknown";
}

/**
 * Converte qty + unit → valore metrico (ml oppure g).
 * Se l'unità è già metrica, fa passthrough.
 * Se sconosciuta, ritorna unit="" e qty invariata.
 */
export function convertUnit(qty: number, unit: string): ConversionResult {
  const u = normalizeUnit(unit);

  if (VOLUME_TO_ML[u] !== undefined) {
    const factor = VOLUME_TO_ML[u];
    return {
      qty: Math.round(qty * factor),
      unit: "ml",
      wasConverted: factor !== 1,
      originalUnit: unit,
    };
  }

  if (ITALIAN_VOLUME_TO_ML[u] !== undefined) {
    const factor = ITALIAN_VOLUME_TO_ML[u];
    return {
      qty: Math.round(qty * factor),
      unit: "ml",
      wasConverted: factor !== 1,
      originalUnit: unit,
    };
  }

  if (WEIGHT_TO_G[u] !== undefined) {
    const factor = WEIGHT_TO_G[u];
    return {
      qty: Math.round(qty * factor * 10) / 10,
      unit: "g",
      wasConverted: factor !== 1,
      originalUnit: unit,
    };
  }

  // Unità sconosciuta (es. "spicchi", "fette", "mazzetto")
  return { qty, unit: "", wasConverted: false, originalUnit: unit };
}

// ─── Parser di quantità ───────────────────────────────────────────────────────

/**
 * Tabella frazioni Unicode → valore numerico.
 */
const UNICODE_FRACTIONS: Record<string, number> = {
  "½": 0.5,   "⅓": 1 / 3, "⅔": 2 / 3,
  "¼": 0.25,  "¾": 0.75,  "⅕": 0.2,
  "⅖": 0.4,   "⅗": 0.6,   "⅘": 0.8,
  "⅙": 1 / 6, "⅚": 5 / 6, "⅛": 0.125,
  "⅜": 0.375, "⅝": 0.625, "⅞": 0.875,
};

const UNICODE_FRAC_PATTERN = Object.keys(UNICODE_FRACTIONS).join("|");

/**
 * Converte una stringa quantità (es. "1½", "1/2", "2-3", "3") in numero.
 * Ritorna null se non riconosce il formato.
 */
export function parseFraction(str: string): number | null {
  const s = str.trim();
  if (!s) return null;

  // Intero + frazione unicode  →  "1½", "2⅓"
  const intPlusFrac = new RegExp(
    `^(\\d+)\\s*(${UNICODE_FRAC_PATTERN})$`
  ).exec(s);
  if (intPlusFrac) {
    return parseInt(intPlusFrac[1]) + (UNICODE_FRACTIONS[intPlusFrac[2]] ?? 0);
  }

  // Singola frazione unicode  →  "½", "¾"
  if (UNICODE_FRACTIONS[s] !== undefined) return UNICODE_FRACTIONS[s];

  // Intero + slash fraction  →  "1 1/2", "2 3/4"
  const intAndSlash = /^(\d+)\s+(\d+)\/(\d+)$/.exec(s);
  if (intAndSlash) {
    const den = parseInt(intAndSlash[3]);
    if (den === 0) return null;
    return parseInt(intAndSlash[1]) + parseInt(intAndSlash[2]) / den;
  }

  // Slash fraction  →  "1/2", "3/4"
  const slashFrac = /^(\d+)\/(\d+)$/.exec(s);
  if (slashFrac) {
    const den = parseInt(slashFrac[2]);
    if (den === 0) return null;
    return parseInt(slashFrac[1]) / den;
  }

  // Range  →  "2-3", "4 to 5", "2 a 3"  → media
  const range = /^(\d+(?:[.,]\d+)?)\s*(?:-|to|a)\s*(\d+(?:[.,]\d+)?)$/.exec(s);
  if (range) {
    const a = parseFloat(range[1].replace(",", "."));
    const b = parseFloat(range[2].replace(",", "."));
    return (a + b) / 2;
  }

  // Decimale o intero (supporta virgola italiana)
  const num = parseFloat(s.replace(",", "."));
  if (!isNaN(num)) return num;

  return null;
}

/**
 * Rimuove approssimazioni verbali prima del numero
 * ("about", "circa", "roughly", "quasi", ecc.)
 */
export function stripApproximation(str: string): string {
  return str
    .replace(
      /^\s*(about|approximately|roughly|around|circa|quasi|almeno|fino\s+a|roughly)\s+/gi,
      ""
    )
    .trim();
}
