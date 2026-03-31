/**
 * useRecipes.ts — Hook principale per accesso reattivo alle ricette.
 * FIX: ricerca giapponese (cerca anche in recipe.ja) + multi-ingrediente AND.
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Recipe, SearchFilters } from "../types";
import { parseIngredientTerms, isMultiIngredientQuery } from "../types";
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

// ─── Matching helpers ─────────────────────────────────────────────────────────

/**
 * Controlla se una ricetta contiene un singolo termine (testo libero).
 * Cerca in: titolo IT, titolo JP, tag, ingredienti IT, ingredienti JP.
 */
function recipeMatchesTerm(r: Recipe, term: string): boolean {
  const q = term.toLowerCase();

  // Titolo italiano
  if (r.title.toLowerCase().includes(q)) return true;

  // Titolo giapponese
  if (r.ja?.title?.toLowerCase().includes(q)) return true;

  // Tag
  if (r.tags.some((t) => t.toLowerCase().includes(q))) return true;

  // Ingredienti italiani
  if (r.ingredients.some(
    (ing) =>
      ing.displayName.toLowerCase().includes(q) ||
      ing.canonicalId.toLowerCase().includes(q)
  )) return true;

  // Ingredienti giapponesi
  if (r.ja?.ingredients?.some(
    (ing) =>
      ing.displayName.toLowerCase().includes(q) ||
      ing.canonicalId.toLowerCase().includes(q)
  )) return true;

  return false;
}

/**
 * Controlla se la ricetta ha TUTTI i termini in almeno uno dei
 * suoi ingredienti (IT o JP). Usato per la ricerca multi-ingrediente.
 */
function recipeHasAllIngredients(r: Recipe, terms: string[]): boolean {
  return terms.every((term) => {
    const q = term.toLowerCase();

    // Ingredienti italiani
    const inIt = r.ingredients.some(
      (ing) =>
        ing.displayName.toLowerCase().includes(q) ||
        ing.canonicalId.toLowerCase().includes(q)
    );
    if (inIt) return true;

    // Ingredienti giapponesi
    const inJa = r.ja?.ingredients?.some(
      (ing) =>
        ing.displayName.toLowerCase().includes(q) ||
        ing.canonicalId.toLowerCase().includes(q)
    );
    if (inJa) return true;

    // Anche titolo e tag (per flessibilità)
    if (r.title.toLowerCase().includes(q)) return true;
    if (r.ja?.title?.toLowerCase().includes(q)) return true;
    if (r.tags.some((t) => t.toLowerCase().includes(q))) return true;

    return false;
  });
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

    if (starred)      list = list.filter((r) => r.starred);
    if (maxTime)      list = list.filter((r) => r.totalTime > 0 && r.totalTime <= maxTime);
    if (tags?.length) list = list.filter((r) => tags.every((t) => r.tags.includes(t)));

    if (query?.trim()) {
      if (isMultiIngredientQuery(query)) {
        // ── Modalità multi-ingrediente: AND su tutti i termini ──────────────
        const terms = parseIngredientTerms(query);
        if (terms.length > 0) {
          list = list.filter((r) => recipeHasAllIngredients(r, terms));
        }
      } else {
        // ── Ricerca testo libero singolo termine ────────────────────────────
        list = list.filter((r) => recipeMatchesTerm(r, query.trim()));
      }
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
      const now = new Date().toISOString();
      const full = {
        ...data,
        id:        data.id        ?? generateId(),
        createdAt: data.createdAt ?? now,
        updatedAt: now,
      } as Recipe;
      await upsertRecipe(full);
      await refreshCache();
      return full;
    },
    []
  );

  const updateRecipe = useCallback(async (recipe: Recipe): Promise<void> => {
    const updated = { ...recipe, updatedAt: new Date().toISOString() };
    await upsertRecipe(updated);
    await refreshCache();
  }, []);

  const removeRecipe = useCallback(async (id: string): Promise<void> => {
    await dbDelete(id);
    await refreshCache();
  }, []);

  const toggleStar = useCallback(async (id: string): Promise<void> => {
    const r = await getRecipeById(id);
    if (!r) return;
    await upsertRecipe({ ...r, starred: !r.starred, updatedAt: new Date().toISOString() });
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

  /**
   * Sostituisce l'intera cache con un array di ricette (usato dal cloud sync).
   * Non cancella ricette locali non presenti nel cloud — fa un merge per ID.
   */
  const mergeFromCloud = useCallback(async (remoteRecipes: Recipe[]): Promise<void> => {
    const local = _cache ?? await getAllRecipes();

    // Indice locale per ID
    const localById = new Map(local.map((r) => [r.id, r]));

    // Merge: per ogni ricetta remota, prende quella più recente
    for (const remote of remoteRecipes) {
      const loc = localById.get(remote.id);
      if (!loc) {
        // Nuova ricetta remota non presente in locale → aggiungi
        await upsertRecipe(remote);
      } else {
        // Entrambe presenti: usa updatedAt per determinare quella più recente
        const remoteTs = new Date(remote.updatedAt ?? remote.createdAt).getTime();
        const localTs  = new Date(loc.updatedAt  ?? loc.createdAt).getTime();
        if (remoteTs > localTs) {
          await upsertRecipe(remote);
        }
        // altrimenti mantieni quella locale
      }
      localById.delete(remote.id); // segnala come processata
    }
    // Le ricette locali non presenti nel cloud rimangono intatte (solo aggiunta, mai eliminazione)

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

// ─── Espone refreshCache per il cloud sync ────────────────────────────────────
export { refreshCache };
