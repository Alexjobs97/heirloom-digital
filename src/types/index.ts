// ─── Ingredient ────────────────────────────────────────────────────────────────

export interface Ingredient {
  id: string;
  qty: number | string;          // 250 | "1/2" | "q.b."
  unit: "ml" | "g" | "";
  displayName: string;
  canonicalId: string;
  checked?: boolean;
  note?: string;
}

// ─── Bilingual locale ──────────────────────────────────────────────────────────

export interface RecipeLocale {
  title: string;
  ingredients: Ingredient[];
  steps: string[];
}

// ─── Recipe ────────────────────────────────────────────────────────────────────

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
  createdAt: string;             // ISO string
  updatedAt?: string;            // ISO string — per merge cloud sync
  lastCooked?: string;
  source?: string;
  notes?: string;

  /** Versione giapponese (opzionale). Presente solo se importata con === JP === */
  ja?: RecipeLocale;
}

// ─── Parser ────────────────────────────────────────────────────────────────────

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

// ─── Daily Planner ─────────────────────────────────────────────────────────────

export interface DailyPlan {
  date: string;
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
  /**
   * Testo libero — se contiene virgole (o 、) viene interpretato come
   * lista di ingredienti in AND (tutti presenti nella ricetta).
   */
  query: string;
  starred?: boolean;
  maxTime?: number;
  tags?: string[];
  recentOnly?: boolean;
}

/** Helper: estrae i termini ingrediente dalla query (split su , / 、 / ; ) */
export function parseIngredientTerms(query: string): string[] {
  if (!query) return [];
  // Divide su virgola italiana, giapponese, punto e virgola
  return query
    .split(/[,、;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** True se la query è in "modalità multi-ingrediente" */
export function isMultiIngredientQuery(query: string): boolean {
  return /[,、;]/.test(query);
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
  isSolid?: boolean;
}

export type IngredientDictionary = Record<string, DictionaryEntry>;

// ─── Cloud Sync ────────────────────────────────────────────────────────────────

export type SyncStatus = "idle" | "syncing" | "synced" | "error" | "disabled";

export interface SyncState {
  status: SyncStatus;
  lastSync: string | null;       // ISO string
  error: string | null;
}
