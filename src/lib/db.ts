/**
 * db.ts — Wrapper leggero su IndexedDB.
 * Tre object store: recipes, settings, dailyPlan.
 *
 * PERFORMANCE: getAllRecipesLight() carica le ricette SENZA coverImage
 * per la visualizzazione nella griglia. L'immagine viene caricata solo
 * al dettaglio ricetta (lazy loading dei dati).
 */

import type { Recipe, AppSettings, DailyPlan } from "../types";

const DB_NAME    = "heirloom-digital";
const DB_VERSION = 1;

export const STORES = {
  RECIPES:    "recipes",
  SETTINGS:   "settings",
  DAILY_PLAN: "dailyPlan",
} as const;

let _db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORES.RECIPES)) {
        const s = db.createObjectStore(STORES.RECIPES, { keyPath: "id" });
        s.createIndex("createdAt",  "createdAt");
        s.createIndex("lastCooked", "lastCooked");
        s.createIndex("starred",    "starred");
      }
      if (!db.objectStoreNames.contains(STORES.SETTINGS))
        db.createObjectStore(STORES.SETTINGS,  { keyPath: "key" });
      if (!db.objectStoreNames.contains(STORES.DAILY_PLAN))
        db.createObjectStore(STORES.DAILY_PLAN, { keyPath: "date" });
    };
    req.onsuccess = () => {
      _db = req.result;
      _db.onversionchange = () => { _db?.close(); _db = null; };
      resolve(_db);
    };
    req.onerror   = () => reject(req.error);
    req.onblocked = () => reject(new Error("DB bloccato da un'altra scheda"));
  });
}

function tx(db: IDBDatabase, store: string, mode: IDBTransactionMode = "readonly"): IDBObjectStore {
  return db.transaction(store, mode).objectStore(store);
}
function wrap<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((res, rej) => { req.onsuccess = () => res(req.result); req.onerror = () => rej(req.error); });
}

// ── RECIPES — full ────────────────────────────────────────────────────────────

export async function getAllRecipes(): Promise<Recipe[]> {
  const db = await openDB();
  return wrap<Recipe[]>(tx(db, STORES.RECIPES).getAll());
}

/**
 * Carica tutte le ricette SENZA il campo coverImage.
 * Usato dalla griglia home: risparmia ~80% di memoria e velocizza
 * il caricamento iniziale con 20+ ricette.
 */
export async function getAllRecipesLight(): Promise<Recipe[]> {
  const db      = await openDB();
  const all     = await wrap<Recipe[]>(tx(db, STORES.RECIPES).getAll());
  return all.map(({ coverImage: _omit, ...rest }) => rest as Recipe);
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

export async function clearAllRecipes(): Promise<void> {
  const db = await openDB();
  await wrap(tx(db, STORES.RECIPES, "readwrite").clear());
}

export async function searchRecipesByIngredient(canonicalId: string): Promise<Recipe[]> {
  const all = await getAllRecipesLight();
  return all.filter((r) => r.ingredients.some((i) => i.canonicalId === canonicalId));
}

// ── SETTINGS ──────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<AppSettings | undefined> {
  const db = await openDB();
  const r  = await wrap<{ key: string; value: AppSettings } | undefined>(tx(db, STORES.SETTINGS).get("app"));
  return r?.value;
}
export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = await openDB();
  await wrap(tx(db, STORES.SETTINGS, "readwrite").put({ key: "app", value: settings }));
}

// ── DAILY PLAN ────────────────────────────────────────────────────────────────

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
