// ─── Ingredient ────────────────────────────────────────────────────────────────

export interface Ingredient {
  id: string;
  qty: number | string;
  unit: "ml" | "g" | "";
  displayName: string;
  canonicalId: string;
  checked?: boolean;
  note?: string;
}

// ─── Nutrition (per 100 g/ml dell'ingrediente) ────────────────────────────────

export interface NutritionPer100 {
  energia_kcal: number;
  grassi: number;
  grassi_saturi: number;
  carboidrati: number;
  zuccheri: number;
  proteine: number;
  fibre: number;
  sale: number;
  extra?: Record<string, number>; // oligoelementi
}

// ─── Ingredient Dictionary entry (esteso) ────────────────────────────────────

export interface DictionaryEntry {
  canonicalId: string;
  names: { it: string[]; ja: string[]; en: string[] };
  defaultUnit?: "g" | "ml" | "";
  isSolid?: boolean;
  nutrition?: NutritionPer100;
  peso_medio_unità?: number; // grammi per "1 unità" (es. 1 uovo = 60g)
}

export type IngredientDictionary = Record<string, DictionaryEntry>;

// ─── Totali nutrizionali calcolati ────────────────────────────────────────────

export interface NutritionTotals {
  energia_kcal: number;
  proteine: number;
  carboidrati: number;
  zuccheri: number;
  grassi: number;
  grassi_saturi: number;
  fibre: number;
  sale: number;
  extra: Record<string, number>;
  /** grammi totali conteggiati (ingredienti con nutrition trovata) */
  gramsAccountedFor: number;
}

// ─── Shopping list ────────────────────────────────────────────────────────────

export interface ShoppingListItem {
  id: string;           // UUID
  canonicalId: string;  // "" per voci manuali
  displayName: string;
  qty: number;          // 0 = nessuna quantità specificata
  unit: "g" | "ml" | "";
  checked: boolean;
  isManual: boolean;
  addedFrom?: string;   // titolo ricetta sorgente
}

// ─── Bilingual locale ─────────────────────────────────────────────────────────

export interface RecipeLocale {
  title: string;
  ingredients: Ingredient[];
  steps: string[];
}

// ─── Recipe ───────────────────────────────────────────────────────────────────

export type RecipeLanguage = "it" | "ja" | "en";

export interface Recipe {
  id: string;
  title: string;
  coverImage?: string;
  yield: number;
  totalTime: number;
  prepTime?: number;
  cookTime?: number;
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
  language: RecipeLanguage;
  starred?: boolean;
  createdAt: string;
  updatedAt?: string;
  lastCooked?: string;
  source?: string;
  notes?: string;
  personalNote?: string; // note private dell'utente
  ja?: RecipeLocale;
}

// ─── Parser ───────────────────────────────────────────────────────────────────

export interface RawIngredient {
  raw: string;
  qty: number | string;
  unit: string;
  name: string;
  canonicalId?: string;
  convertedQty?: number;
  convertedUnit?: "ml" | "g" | "";
  ambiguous?: boolean;
}

export interface ParsedResult {
  title: string;
  yield: number;
  totalTime: number;
  prepTime?: number;
  cookTime?: number;
  ingredients: RawIngredient[];
  steps: string[];
  tags: string[];
  language: RecipeLanguage;
  warnings: string[];
  ja?: { title: string; ingredients: RawIngredient[]; steps: string[] };
  isBilingual: boolean;
}

// ─── Timer ────────────────────────────────────────────────────────────────────

export interface TimerState {
  id: string;
  label: string;
  durationSeconds: number;
  remainingSeconds: number;
  running: boolean;
  finished: boolean;
}

// ─── Daily Planner (legacy, tenuto per compatibilità DB) ──────────────────────

export interface DailyPlan {
  date: string;
  recipeIds: string[];
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface AppSettings {
  language: RecipeLanguage;
  darkMode: boolean;
  defaultServings: number;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchFilters {
  query: string;
  starred?: boolean;
  maxTime?: number;
  tags?: string[];
  recentOnly?: boolean;
}

// ── Query parser con operatori logici ─────────────────────────────────────────

export interface ParsedQuery {
  /** Termini che devono TUTTI essere presenti (AND/virgola) */
  must: string[];
  /** Termini di cui almeno uno deve essere presente (OR/+) */
  should: string[][];   // array di gruppi OR — ogni gruppo è [a, b] dove a OR b
  /** Termini che devono essere ASSENTI (NOT/-) */
  mustNot: string[];
  /** True se c'è qualche operatore/virgola */
  hasOperators: boolean;
}

/**
 * Parsa la query di ricerca con supporto operatori:
 *  - ","  o "、" → AND (tutti gli ingredienti devono essere presenti)
 *  - "-"  o "not" (spazio-delimitato) → NOT (ingrediente deve essere assente)
 *  - "+"  o "or"  (spazio-delimitato) → OR (almeno uno del gruppo)
 *
 * Esempi:
 *   "uova, riso - spinaci - funghi"
 *     → must:[uova, riso], mustNot:[spinaci, funghi]
 *
 *   "pasta, sugo or pesto, cipolla"
 *     → must:[pasta, cipolla], should:[[sugo, pesto]]
 *
 *   "pollo + tacchino"
 *     → should:[[pollo, tacchino]]
 */
export function parseSearchQuery(raw: string): ParsedQuery {
  if (!raw.trim()) return { must: [], should: [], mustNot: [], hasOperators: false };

  // Normalizza: "not X" → "- X", "X or Y" → "X + Y"
  let q = raw
    .replace(/not\s+/gi, "- ")
    .replace(/\s+or\s+/gi, " + ");

  // Splitta per virgola/punto-virgola/virgola giapponese
  const segments = q.split(/[,、;]+/).map((s) => s.trim()).filter(Boolean);

  const must:    string[]   = [];
  const should:  string[][] = [];
  const mustNot: string[]   = [];

  for (const seg of segments) {
    // Controlla se il segmento inizia con "-" (NOT)
    if (/^[-–]/.test(seg)) {
      const term = seg.replace(/^[-–]\s*/, "").trim();
      if (term) mustNot.push(term);
      continue;
    }

    // Controlla se contiene "+" (OR group)
    if (seg.includes("+")) {
      const parts = seg.split("+").map((p) => {
        // Ogni parte può iniziare con "-" (NOT nel gruppo OR — raro ma gestiamo)
        const t = p.trim().replace(/^[-–]\s*/, "");
        return t;
      }).filter(Boolean);

      if (parts.length >= 2) {
        should.push(parts);
      } else if (parts.length === 1) {
        must.push(parts[0]);
      }
      continue;
    }

    // Termine semplice: AND
    const term = seg.replace(/^[-–]\s*/, "").trim();
    if (term) must.push(term);
  }

  const hasOperators = mustNot.length > 0 || should.length > 0 || must.length > 1;
  return { must, should, mustNot, hasOperators };
}

/** Legacy helper (backward compat) */
export function parseIngredientTerms(query: string): string[] {
  const { must } = parseSearchQuery(query);
  return must;
}

export function isMultiIngredientQuery(query: string): boolean {
  const { hasOperators, must } = parseSearchQuery(query);
  return hasOperators || must.length > 1;
}

// ─── Cloud Sync ───────────────────────────────────────────────────────────────

export type SyncStatus = "idle" | "syncing" | "synced" | "error" | "disabled";

export interface SyncState {
  status: SyncStatus;
  lastSync: string | null;
  error: string | null;
}
