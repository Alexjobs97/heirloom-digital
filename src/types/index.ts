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

export function parseIngredientTerms(query: string): string[] {
  if (!query) return [];
  return query.split(/[,、;]+/).map((s) => s.trim()).filter((s) => s.length > 0);
}

export function isMultiIngredientQuery(query: string): boolean {
  return /[,、;]/.test(query);
}

// ─── Cloud Sync ───────────────────────────────────────────────────────────────

export type SyncStatus = "idle" | "syncing" | "synced" | "error" | "disabled";

export interface SyncState {
  status: SyncStatus;
  lastSync: string | null;
  error: string | null;
}
