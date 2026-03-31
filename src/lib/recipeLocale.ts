/**
 * recipeLocale.ts — Restituisce il contenuto della ricetta nella lingua corrente.
 * CORRETTO: usa recipe.ja?.title / recipe.ja?.ingredients / recipe.ja?.steps
 * in linea con il tipo Recipe (non i vecchi campi titleJa/stepsJa).
 */

import type { Recipe, Ingredient } from "../types";

export type Locale = "it" | "ja";

/** Fallback: legge la lingua da localStorage. Usare il hook useLang() nei componenti. */
export function getCurrentLocale(): Locale {
  try {
    const saved = localStorage.getItem("heirloom_lang");
    if (saved === "ja") return "ja";
  } catch { /* noop */ }
  return "it";
}

export interface LocalizedRecipe {
  title: string;
  ingredients: Ingredient[];
  steps: string[];
  notes?: string;
  isJa: boolean;
  hasJa: boolean;
}

/**
 * Ritorna titolo, ingredienti e passi nella lingua corrente.
 * Fallback all'italiano se la traduzione JP non è disponibile.
 *
 * Usa recipe.ja (RecipeLocale) — NON i vecchi campi titleJa/stepsJa.
 */
export function getLocalizedContent(recipe: Recipe, locale?: Locale): LocalizedRecipe {
  const lang = locale ?? getCurrentLocale();

  // Controlla se esiste una versione giapponese valida
  const hasJa = !!(
    recipe.ja &&
    (recipe.ja.title || recipe.ja.steps?.length || recipe.ja.ingredients?.length)
  );

  if (lang === "ja" && hasJa && recipe.ja) {
    return {
      title:       recipe.ja.title       || recipe.title,
      ingredients: recipe.ja.ingredients?.length ? recipe.ja.ingredients : recipe.ingredients,
      steps:       recipe.ja.steps?.length       ? recipe.ja.steps       : recipe.steps,
      notes:       recipe.notes,      // le note rimangono in italiano (campo unico)
      isJa: true,
      hasJa,
    };
  }

  return {
    title:       recipe.title,
    ingredients: recipe.ingredients,
    steps:       recipe.steps,
    notes:       recipe.notes,
    isJa: false,
    hasJa,
  };
}
