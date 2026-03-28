/**
 * useRecipes.ts — Hook principale per accesso reattivo alle ricette.
 * Cache in-memory condivisa tra tutte le istanze nel render tree.
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Recipe, SearchFilters } from "../types";
import {
  getAllRecipes,
  getRecipeById,
  upsertRecipe,
  deleteRecipe as dbDelete,
} from "../lib/db";
import { generateId } from "../lib/scaling";

// ─── Cache globale in-memory ──────────────────────────────────────────────────

let _cache: Recipe[] | null = null;
const _listeners = new Set<() => void>();

function notifyAll() { _listeners.forEach((fn) => fn()); }

async function refreshCache(): Promise<Recipe[]> {
  _cache = await getAllRecipes();
  notifyAll();
  return _cache;
}

// ─── Hook principale ──────────────────────────────────────────────────────────

export function useRecipes(filters?: SearchFilters) {
  const [recipes, setRecipes] = useState<Recipe[]>(_cache ?? []);
  const [loading, setLoading] = useState(_cache === null);
  const [error,   setError]   = useState<string | null>(null);

  // Caricamento iniziale
  useEffect(() => {
    if (_cache !== null) { setRecipes(_cache); setLoading(false); return; }
    refreshCache()
      .then((r) => { setRecipes(r); setLoading(false); })
      .catch(() => { setError("Errore di accesso al database"); setLoading(false); });
  }, []);

  // Sottoscrizione agli aggiornamenti della cache
  useEffect(() => {
    const update = () => setRecipes([...(_cache ?? [])]);
    _listeners.add(update);
    return () => { _listeners.delete(update); };
  }, []);

  // Filtro + ricerca client-side
  const filtered = useMemo(() => {
    let list = [...recipes];
    if (!filters) {
      return list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    const { query, starred, maxTime, tags, recentOnly } = filters;

    if (starred)    list = list.filter((r) => r.starred);
    if (maxTime)    list = list.filter((r) => r.totalTime > 0 && r.totalTime <= maxTime);
    if (tags?.length) list = list.filter((r) => tags.every((t) => r.tags.includes(t)));

    if (query?.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.ingredients.some(
            (ing) =>
              ing.displayName.toLowerCase().includes(q) ||
              ing.canonicalId.toLowerCase().includes(q)
          )
      );
    }

    if (recentOnly) {
      return list
        .filter((r) => r.lastCooked)
        .sort((a, b) =>
          new Date(b.lastCooked!).getTime() - new Date(a.lastCooked!).getTime()
        )
        .slice(0, 20);
    }

    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [recipes, filters]);

  const allTags = useMemo(
    () => [...new Set(recipes.flatMap((r) => r.tags))].sort(),
    [recipes]
  );

  // ─── Mutazioni ────────────────────────────────────────────────────────────────

  const saveRecipe = useCallback(
    async (
      data: Omit<Recipe, "id" | "createdAt"> & { id?: string; createdAt?: string }
    ): Promise<Recipe> => {
      const full = {
        ...data,
        id:        data.id        ?? generateId(),
        createdAt: data.createdAt ?? new Date().toISOString(),
      } as Recipe;
      await upsertRecipe(full);
      await refreshCache();
      return full;
    },
    []
  );

  const updateRecipe = useCallback(async (recipe: Recipe): Promise<void> => {
    await upsertRecipe(recipe);
    await refreshCache();
  }, []);

  const removeRecipe = useCallback(async (id: string): Promise<void> => {
    await dbDelete(id);
    await refreshCache();
  }, []);

  const toggleStar = useCallback(async (id: string): Promise<void> => {
    const r = await getRecipeById(id);
    if (!r) return;
    await upsertRecipe({ ...r, starred: !r.starred });
    await refreshCache();
  }, []);

  const markCooked = useCallback(async (id: string): Promise<void> => {
    const r = await getRecipeById(id);
    if (!r) return;
    await upsertRecipe({ ...r, lastCooked: new Date().toISOString() });
    await refreshCache();
  }, []);

  const reload = useCallback(() => {
    setLoading(true);
    refreshCache()
      .then((r) => { setRecipes(r); setLoading(false); })
      .catch(() => { setError("Errore di accesso al database"); setLoading(false); });
  }, []);

  return {
    recipes: filtered,
    allRecipes: recipes,
    allTags,
    loading,
    error,
    saveRecipe,
    updateRecipe,
    removeRecipe,
    toggleStar,
    markCooked,
    reload,
  };
}

// ─── Hook singola ricetta ─────────────────────────────────────────────────────

export function useRecipe(id: string | undefined) {
  const [recipe,  setRecipe]  = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }

    const cached = _cache?.find((r) => r.id === id);
    if (cached) { setRecipe(cached); setLoading(false); }
    else {
      getRecipeById(id)
        .then((r) => {
          setRecipe(r ?? null);
          if (!r) setError("Ricetta non trovata");
          setLoading(false);
        })
        .catch(() => { setError("Errore di accesso al database"); setLoading(false); });
    }

    const update = () => {
      const fresh = _cache?.find((r) => r.id === id);
      if (fresh) setRecipe(fresh);
    };
    _listeners.add(update);
    return () => { _listeners.delete(update); };
  }, [id]);

  return { recipe, loading, error };
}
