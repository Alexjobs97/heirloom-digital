/**
 * io.ts — Export e Import del libro di ricette come JSON.
 * Nessuna dipendenza esterna. Tutto client-side.
 */

import type { Recipe } from "../types";
import { getAllRecipes, upsertRecipe, clearAllRecipes } from "./db";

interface BookExport {
  version: number;
  exportedAt: string;
  recipeCount: number;
  recipes: Recipe[];
}

// ─── Export ──────────────────────────────────────────────────────────────────

export async function exportBook(): Promise<void> {
  const recipes = await getAllRecipes();

  const payload: BookExport = {
    version: 1,
    exportedAt: new Date().toISOString(),
    recipeCount: recipes.length,
    recipes,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ricette_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportSingleRecipe(recipe: Recipe): Promise<void> {
  const payload: BookExport = {
    version: 1,
    exportedAt: new Date().toISOString(),
    recipeCount: 1,
    recipes: [recipe],
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName = recipe.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  a.download = `${safeName}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Import ──────────────────────────────────────────────────────────────────

export interface ImportResult {
  success: boolean;
  count: number;
  errors: string[];
}

export async function importBook(
  file: File,
  mode: "merge" | "replace" = "merge"
): Promise<ImportResult> {
  const errors: string[] = [];

  let raw: string;
  try {
    raw = await file.text();
  } catch {
    return { success: false, count: 0, errors: ["Impossibile leggere il file"] };
  }

  let parsed: BookExport;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { success: false, count: 0, errors: ["File JSON non valido"] };
  }

  if (!parsed.recipes || !Array.isArray(parsed.recipes)) {
    return {
      success: false,
      count: 0,
      errors: ['Il file non contiene un campo "recipes" valido'],
    };
  }

  if (mode === "replace") {
    await clearAllRecipes();
  }

  let imported = 0;
  for (const recipe of parsed.recipes) {
    if (!isValidRecipe(recipe)) {
      errors.push(`Ricetta non valida saltata: ${recipe?.title ?? "senza titolo"}`);
      continue;
    }
    try {
      await upsertRecipe(recipe as Recipe);
      imported++;
    } catch {
      errors.push(`Errore salvando: ${recipe.title}`);
    }
  }

  return {
    success: imported > 0,
    count: imported,
    errors,
  };
}

function isValidRecipe(obj: unknown): boolean {
  if (!obj || typeof obj !== "object") return false;
  const r = obj as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.title === "string" &&
    Array.isArray(r.ingredients) &&
    Array.isArray(r.steps)
  );
}

// ─── Drag & Drop helper ───────────────────────────────────────────────────────

export function setupDropZone(
  element: HTMLElement,
  onDrop: (file: File) => void
): () => void {
  const preventDefault = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    preventDefault(e);
    element.classList.remove("drop-active");
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type === "application/json") {
      onDrop(file);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    preventDefault(e);
    element.classList.add("drop-active");
  };

  const handleDragLeave = () => {
    element.classList.remove("drop-active");
  };

  element.addEventListener("dragover", handleDragOver as EventListener);
  element.addEventListener("dragleave", handleDragLeave);
  element.addEventListener("drop", handleDrop as EventListener);
  element.addEventListener("dragenter", preventDefault);

  // Cleanup
  return () => {
    element.removeEventListener("dragover", handleDragOver as EventListener);
    element.removeEventListener("dragleave", handleDragLeave);
    element.removeEventListener("drop", handleDrop as EventListener);
    element.removeEventListener("dragenter", preventDefault);
  };
}
