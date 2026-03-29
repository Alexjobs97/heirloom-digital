/**
 * db.ts — wrapper leggero su IndexedDB senza dipendenze esterne.
 * Tre object store: recipes, settings, dailyPlan.
 */

import type { Recipe, AppSettings, DailyPlan } from "../types";

const DB_NAME = "heirloom-digital";
const DB_VERSION = 1;

// ─── Store names ──────────────────────────────────────────────────────────────

export const STORES = {
  RECIPES: "recipes",
  SETTINGS: "settings",
  DAILY_PLAN: "dailyPlan",
} as const;

// ─── Open DB ──────────────────────────────────────────────────────────────────

let _db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (_db) return Promise.resolve(_db);

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;

      // recipes store — keyPath: id, index su starred e lastCooked
      if (!db.objectStoreNames.contains(STORES.RECIPES)) {
        const recipeStore = db.createObjectStore(STORES.RECIPES, {
          keyPath: "id",
        });
        recipeStore.createIndex("createdAt", "createdAt");
        recipeStore.createIndex("lastCooked", "lastCooked");
        recipeStore.createIndex("starred", "starred");
      }

      // settings store — chiave singola "app"
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: "key" });
      }

      // dailyPlan store — keyPath: date (YYYY-MM-DD)
      if (!db.objectStoreNames.contains(STORES.DAILY_PLAN)) {
        db.createObjectStore(STORES.DAILY_PLAN, { keyPath: "date" });
      }
    };

    req.onsuccess = () => {
      _db = req.result;

      // Gestisci chiusura esterna (es. browser vuole aggiornare lo schema)
      _db.onversionchange = () => {
        _db?.close();
        _db = null;
      };

      resolve(_db);
    };

    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error("DB bloccato da un'altra scheda"));
  });
}

// ─── Generic helpers ──────────────────────────────────────────────────────────

function tx(
  db: IDBDatabase,
  store: string,
  mode: IDBTransactionMode = "readonly"
): IDBObjectStore {
  return db.transaction(store, mode).objectStore(store);
}

function wrap<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ─── RECIPES ─────────────────────────────────────────────────────────────────

export async function getAllRecipes(): Promise<Recipe[]> {
  const db = await openDB();
  return wrap<Recipe[]>(tx(db, STORES.RECIPES).getAll());
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  const db = await openDB();
  return wrap<Recipe | undefined>(tx(db, STORES.RECIPES).get(id));
}

export async function upsertRecipe(recipe: Recipe): Promise<void> {
  const db = await openDB();
  await wrap(tx(db, STORES.RECIPES, "readwrite").put(recipe));
}

export async function deleteRecipe(id: string): Promise<void> {
  const db = await openDB();
  await wrap(tx(db, STORES.RECIPES, "readwrite").delete(id));
}

/**
 * Cerca ricette per ingrediente usando canonicalId.
 * Scansione lineare — per <1000 ricette è istantanea.
 */
export async function searchRecipesByIngredient(
  canonicalId: string
): Promise<Recipe[]> {
  const all = await getAllRecipes();
  return all.filter((r) =>
    r.ingredients.some((ing) => ing.canonicalId === canonicalId)
  );
}

/**
 * Ricerca full-text su titolo, tag e ingredienti (canonicalId + displayName).
 */
export async function searchRecipes(query: string): Promise<Recipe[]> {
  const all = await getAllRecipes();
  const q = query.toLowerCase().trim();
  if (!q) return all;

  return all.filter((r) => {
    if (r.title.toLowerCase().includes(q)) return true;
    if (r.tags.some((t) => t.toLowerCase().includes(q))) return true;
    if (
      r.ingredients.some(
        (ing) =>
          ing.displayName.toLowerCase().includes(q) ||
          ing.canonicalId.toLowerCase().includes(q)
      )
    )
      return true;
    return false;
  });
}

export async function clearAllRecipes(): Promise<void> {
  const db = await openDB();
  await wrap(tx(db, STORES.RECIPES, "readwrite").clear());
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<AppSettings> {
  const db = await openDB();
  const result = await wrap<{ key: string; value: AppSettings } | undefined>(
    tx(db, STORES.SETTINGS).get("app")
  );
  return (
    result?.value ?? {
      language: "it",
      darkMode: false,
      defaultServings: 4,
    }
  );
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = await openDB();
  await wrap(
    tx(db, STORES.SETTINGS, "readwrite").put({ key: "app", value: settings })
  );
}

// ─── DAILY PLAN ──────────────────────────────────────────────────────────────

export async function getDailyPlan(date: string): Promise<DailyPlan | undefined> {
  const db = await openDB();
  return wrap<DailyPlan | undefined>(tx(db, STORES.DAILY_PLAN).get(date));
}

export async function saveDailyPlan(plan: DailyPlan): Promise<void> {
  const db = await openDB();
  await wrap(tx(db, STORES.DAILY_PLAN, "readwrite").put(plan));
}

export async function deleteDailyPlan(date: string): Promise<void> {
  const db = await openDB();
  await wrap(tx(db, STORES.DAILY_PLAN, "readwrite").delete(date));
}
