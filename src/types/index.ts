// ─── Ingredient ────────────────────────────────────────────────────────────────

export interface Ingredient {
  id: string;
  qty: number | string;          // 250 | "1/2" | "q.b."
  unit: "ml" | "g" | "";         // ONLY these three values
  displayName: string;           // nome come appare all'utente
  canonicalId: string;           // id neutro per ricerca multilingua
  checked?: boolean;             // mise en place checkbox
  note?: string;                 // es. "a temperatura ambiente"
}

// ─── Bilingual locale ──────────────────────────────────────────────────────────

/**
 * Contenuto tradotto per una singola lingua.
 * Usato quando la ricetta è stata importata con blocchi === IT === / === JP ===
 */
export interface RecipeLocale {
  title: string;
  ingredients: Ingredient[];
  steps: string[];
}

// ─── Recipe ────────────────────────────────────────────────────────────────────

export type RecipeLanguage = "it" | "ja" | "en";

export interface Recipe {
  id: string;                    // UUID
  title: string;                 // italiano (o lingua principale)
  coverImage?: string;           // data URL or external URL
  yield: number;                 // porzioni di base (es. 4)
  totalTime: number;             // minuti totali (0 = non specificato)
  prepTime?: number;             // minuti preparazione
  cookTime?: number;             // minuti cottura
  ingredients: Ingredient[];     // italiano
  steps: string[];               // italiano
  tags: string[];
  language: RecipeLanguage;
  starred?: boolean;
  createdAt: string;             // ISO string
  lastCooked?: string;           // ISO string
  source?: string;               // URL o nome fonte
  notes?: string;                // note libere

  /**
   * Versione giapponese della ricetta (opzionale).
   * Presente solo se il testo originale conteneva === JP === block.
   */
  ja?: RecipeLocale;
}

// ─── Parser ────────────────────────────────────────────────────────────────────

export interface RawIngredient {
  raw: string;                   // testo originale
  qty: number | string;
  unit: string;                  // unità originale (può essere imperiale)
  name: string;
  canonicalId?: string;
  convertedQty?: number;
  convertedUnit?: "ml" | "g" | "";
  ambiguous?: boolean;           // solido dato in volume
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
  warnings: string[];            // es. "solido dato in volume, verifica quantità"

  /**
   * Presente se il testo conteneva un blocco === JP ===
   */
  ja?: {
    title: string;
    ingredients: RawIngredient[];
    steps: string[];
  };
  isBilingual: boolean;
}

// ─── Timer ─────────────────────────────────────────────────────────────────────

export interface TimerState {
  id: string;
  label: string;
  durationSeconds: number;
  remainingSeconds: number;
  running: boolean;
  finished: boolean;
}

// ─── Daily Planner ──────────────────────────────────────────────────────────────

export interface DailyPlan {
  date: string;                  // YYYY-MM-DD
  recipeIds: string[];
}

// ─── Settings ──────────────────────────────────────────────────────────────────

export interface AppSettings {
  language: RecipeLanguage;
  darkMode: boolean;
  defaultServings: number;
}

// ─── Search ────────────────────────────────────────────────────────────────────

export interface SearchFilters {
  query: string;
  starred?: boolean;
  maxTime?: number;              // minuti
  tags?: string[];
  recentOnly?: boolean;
}

// ─── Ingredient Dictionary ─────────────────────────────────────────────────────

export interface DictionaryEntry {
  canonicalId: string;
  names: {
    it: string[];
    ja: string[];
    en: string[];
  };
  defaultUnit?: "g" | "ml" | "";
  isSolid?: boolean;             // true = solido, usato per warning conversione
}

export type IngredientDictionary = Record<string, DictionaryEntry>;