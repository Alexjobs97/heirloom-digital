/**
 * useRecipes.ts v2 — mergeFromCloud usa tombstones per rispettare le cancellazioni.
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Recipe, SearchFilters } from "../types";
import { parseSearchQuery } from "../types";
import {
  getAllRecipes,
  getAllRecipesLight,
  getRecipeById,
  upsertRecipe,
  deleteRecipe as dbDelete,
} from "../lib/db";
import { clearImageCache } from "./useCoverImage";
import { invalidateImage, invalidateAllImages } from "../lib/imageCache";
import { generateId } from "../lib/scaling";
import {
  addLocalDeletedId,
  getLocalDeletedIds,
  setLocalDeletedIds,
} from "../lib/supabase";

let _cache: Recipe[] | null = null;
const _listeners = new Set<() => void>();

function notifyAll() { _listeners.forEach((fn) => fn()); }

async function refreshCache(): Promise<Recipe[]> {
  // Light: senza coverImage — risparmia ~80% di memoria per la griglia.
  // Il dettaglio ricetta carica l'immagine on-demand via getRecipeById().
  _cache = await getAllRecipesLight();
  notifyAll();
  return _cache;
}

// ── Matching helpers ──────────────────────────────────────────────────────────

function recipeMatchesTerm(r: Recipe, term: string): boolean {
  const q = term.toLowerCase();
  if (r.title.toLowerCase().includes(q)) return true;
  if (r.ja?.title?.toLowerCase().includes(q)) return true;
  if (r.tags.some((t) => t.toLowerCase().includes(q))) return true;
  if (r.ingredients.some((ing) =>
    ing.displayName.toLowerCase().includes(q) ||
    ing.canonicalId.toLowerCase().includes(q)
  )) return true;
  if (r.ja?.ingredients?.some((ing) =>
    ing.displayName.toLowerCase().includes(q) ||
    ing.canonicalId.toLowerCase().includes(q)
  )) return true;
  return false;
}


// ── Hook principale ───────────────────────────────────────────────────────────

export function useRecipes(filters?: SearchFilters) {
  const [recipes, setRecipes] = useState<Recipe[]>(_cache ?? []);
  // Nota: usiamo il riferimento diretto a _cache, non una copia.
  // React.memo su RecipeCard garantisce che solo le card effettivamente cambiate ri-renderizzino.
  const [loading, setLoading] = useState(_cache === null);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (_cache !== null) { setRecipes(_cache); setLoading(false); return; }
    refreshCache()
      .then((r) => { setRecipes(r); setLoading(false); })
      .catch(() => { setError("Errore di accesso al database"); setLoading(false); });
  }, []);

  useEffect(() => {
    // Usa il riferimento diretto alla cache (non copia) — React.memo evita re-render inutili
    const update = () => setRecipes(_cache ?? []);
    _listeners.add(update);
    return () => { _listeners.delete(update); };
  }, []);

  const filtered = useMemo(() => {
    let list = [...recipes];
    if (!filters) {
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    const { query, starred, maxTime, tags, recentOnly } = filters;
    if (starred)      list = list.filter((r) => r.starred);
    if (maxTime)      list = list.filter((r) => r.totalTime > 0 && r.totalTime <= maxTime);
    if (tags?.length) list = list.filter((r) => tags.every((t) => r.tags.includes(t)));
    if (query?.trim()) {
      const parsed = parseSearchQuery(query);
      if (parsed.hasOperators || parsed.must.length > 1 || parsed.mustNot.length > 0 || parsed.should.length > 0) {
        if (parsed.must.length > 0)
          list = list.filter((r) => parsed.must.every((t) => recipeMatchesTerm(r, t)));
        if (parsed.mustNot.length > 0)
          list = list.filter((r) => !parsed.mustNot.some((t) => recipeMatchesTerm(r, t)));
        if (parsed.should.length > 0)
          list = list.filter((r) => parsed.should.every((grp) => grp.some((t) => recipeMatchesTerm(r, t))));
      } else {
        list = list.filter((r) => recipeMatchesTerm(r, query.trim()));
      }
    }
    if (recentOnly) {
      return list
        .filter((r) => r.lastCooked)
        .sort((a, b) => new Date(b.lastCooked!).getTime() - new Date(a.lastCooked!).getTime())
        .slice(0, 20);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [recipes, filters]);

  const allTags = useMemo(
    () => [...new Set(recipes.flatMap((r) => r.tags))].sort(),
    [recipes]
  );

  const saveRecipe = useCallback(
    async (data: Omit<Recipe, "id" | "createdAt"> & { id?: string; createdAt?: string }): Promise<Recipe> => {
      const now = new Date().toISOString();
      const full = { ...data, id: data.id ?? generateId(), createdAt: data.createdAt ?? now, updatedAt: now } as Recipe;
      await upsertRecipe(full);
      invalidateImage(full.id); // invalida cache immagine
      await refreshCache();
      return full;
    }, []
  );

  const updateRecipe = useCallback(async (recipe: Recipe): Promise<void> => {
    const _upd = { ...recipe, updatedAt: new Date().toISOString() };
    await upsertRecipe(_upd);
    invalidateImage(recipe.id);
    invalidateAllImages(); // dopo merge bulk, invalida tutto
    await refreshCache();
  }, []);

  const removeRecipe = useCallback(async (id: string): Promise<void> => {
    // Registra il tombstone PRIMA di cancellare dal DB
    addLocalDeletedId(id);
    await dbDelete(id);
    invalidateImage(id);
    invalidateAllImages(); // dopo merge bulk, invalida tutto
    await refreshCache();
  }, []);

  const toggleStar = useCallback(async (id: string): Promise<void> => {
    const r = await getRecipeById(id);
    if (!r) return;
    await upsertRecipe({ ...r, starred: !r.starred, updatedAt: new Date().toISOString() });
    invalidateAllImages(); // dopo merge bulk, invalida tutto
    await refreshCache();
  }, []);

  const markCooked = useCallback(async (id: string): Promise<void> => {
    const r = await getRecipeById(id);
    if (!r) return;
    await upsertRecipe({ ...r, lastCooked: new Date().toISOString() });
    invalidateAllImages(); // dopo merge bulk, invalida tutto
    await refreshCache();
  }, []);

  const reload = useCallback(() => {
    setLoading(true);
    refreshCache()
      .then((r) => { setRecipes(r); setLoading(false); })
      .catch(() => { setError("Errore di accesso al database"); setLoading(false); });
  }, []);

  /**
   * Merge dal cloud con supporto tombstones.
   *
   * 1. Applica i deleted_ids remoti → cancella localmente
   * 2. Unisce i deleted_ids remoti con quelli locali → la lista cresce sempre
   * 3. Per ogni ricetta remota non cancellata → prende la più recente (updatedAt)
   */
  const mergeFromCloud = useCallback(async (
    remoteRecipes: Recipe[],
    remoteDeletedIds: string[] = []
  ): Promise<void> => {
    // Merge usa la lista completa (con immagini) per non perdere coverImage
    const local = await getAllRecipes();
    const localById = new Map(local.map((r) => [r.id, r]));

    // Unione tombstones: locale + remoti
    const localDeleted = getLocalDeletedIds();
    const allDeleted = new Set([...localDeleted, ...remoteDeletedIds]);

    // 1. Cancella localmente le ricette che risultano cancellate (da qualunque dispositivo)
    for (const deletedId of allDeleted) {
      if (localById.has(deletedId)) {
        await dbDelete(deletedId);
        localById.delete(deletedId);
      }
    }

    // 2. Aggiorna la lista tombstone locale con tutti gli ID noti
    setLocalDeletedIds([...allDeleted]);

    // 3. Merge ricette remote non cancellate
    for (const remote of remoteRecipes) {
      if (allDeleted.has(remote.id)) continue;   // tombstone → salta
      const loc = localById.get(remote.id);
      if (!loc) {
        await upsertRecipe(remote);
      } else {
        const remoteTs = new Date(remote.updatedAt ?? remote.createdAt).getTime();
        const localTs  = new Date(loc.updatedAt  ?? loc.createdAt).getTime();
        if (remoteTs > localTs) await upsertRecipe(remote);
      }
    }

    invalidateAllImages(); // dopo merge bulk, invalida tutto
    await refreshCache();
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
    mergeFromCloud,
  };
}

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
        .then((r) => { setRecipe(r ?? null); if (!r) setError("Ricetta non trovata"); setLoading(false); })
        .catch(() => { setError("Errore di accesso al database"); setLoading(false); });
    }
    const update = () => { const fresh = _cache?.find((r) => r.id === id); if (fresh) setRecipe(fresh); };
    _listeners.add(update);
    return () => { _listeners.delete(update); };
  }, [id]);

  return { recipe, loading, error };
}

export { refreshCache };
