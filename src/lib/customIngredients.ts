/**
 * customIngredients.ts — Ingredienti custom salvati in localStorage + Supabase.
 * Hanno priorità sul dizionario built-in (ingredients.ts).
 *
 * ── SQL Supabase ────────────────────────────────────────────────────────────
 * CREATE TABLE IF NOT EXISTS ingredient_overrides (
 *   sync_id    text primary key,
 *   data       jsonb not null default '{}'::jsonb,
 *   updated_at timestamptz not null default now()
 * );
 * ALTER TABLE ingredient_overrides ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "anon_all" ON ingredient_overrides
 *   FOR ALL USING (true) WITH CHECK (true);
 */

import type { DictionaryEntry, NutritionPer100 } from "../types";
import { INGREDIENT_DICTIONARY } from "./ingredients";
import { SUPABASE_URL, SUPABASE_ANON_KEY, SYNC_ENABLED, getSyncId } from "./supabase";

const LS_KEY = "heirloom_custom_ingredients";
const TABLE  = `${SUPABASE_URL}/rest/v1/ingredient_overrides`;

function h(): Record<string, string> {
  return {
    "Content-Type":  "application/json",
    "apikey":        SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
  };
}

// ── localStorage ──────────────────────────────────────────────────────────────

export function getCustomIngredients(): Record<string, DictionaryEntry> {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}");
  } catch { return {}; }
}

function setCustomIngredients(data: Record<string, DictionaryEntry>) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
}

// ── CRUD locale ───────────────────────────────────────────────────────────────

export function saveCustomIngredient(entry: DictionaryEntry) {
  const all = getCustomIngredients();
  all[entry.canonicalId] = entry;
  setCustomIngredients(all);
  if (SYNC_ENABLED) pushCustomIngredients(getSyncId(), all);
}

export function deleteCustomIngredient(canonicalId: string) {
  const all = getCustomIngredients();
  delete all[canonicalId];
  setCustomIngredients(all);
  if (SYNC_ENABLED) pushCustomIngredients(getSyncId(), all);
}

// ── Resolver: custom prima, poi built-in ──────────────────────────────────────

export function resolveIngredient(canonicalId: string): DictionaryEntry | null {
  if (!canonicalId) return null;
  const custom = getCustomIngredients();
  if (custom[canonicalId]) return custom[canonicalId];
  if (INGREDIENT_DICTIONARY[canonicalId]) return INGREDIENT_DICTIONARY[canonicalId];
  return null;
}

/**
 * Cerca un ingrediente per nome (IT/JP/EN) o canonicalId.
 * Restituisce l'elenco ordinato: custom first, poi built-in.
 */
export function searchIngredients(query: string): DictionaryEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const custom  = getCustomIngredients();
  const results: DictionaryEntry[] = [];
  const seen    = new Set<string>();

  const matches = (entry: DictionaryEntry): boolean => {
    if (entry.canonicalId.includes(q)) return true;
    for (const names of Object.values(entry.names)) {
      if (names.some((n) => n.toLowerCase().includes(q))) return true;
    }
    return false;
  };

  // 1. Custom
  for (const entry of Object.values(custom)) {
    if (matches(entry)) { results.push(entry); seen.add(entry.canonicalId); }
  }
  // 2. Built-in
  for (const entry of Object.values(INGREDIENT_DICTIONARY)) {
    if (!seen.has(entry.canonicalId) && matches(entry)) {
      results.push(entry as DictionaryEntry);
    }
  }
  return results.slice(0, 40);
}

/**
 * Cerca un ingrediente per nome (IT/JP/EN) — usato come fallback quando
 * il canonicalId è vuoto o non trovato.
 */
export function resolveByName(displayName: string): DictionaryEntry | null {
  if (!displayName) return null;
  const q = displayName.toLowerCase().trim();

  const matches = (entry: DictionaryEntry): boolean => {
    // 1. Prova il canonicalId direttamente (utile se names è vuoto)
    if (entry.canonicalId.toLowerCase() === q) return true;
    if (q.replace(/\s+/g, "_") === entry.canonicalId.toLowerCase()) return true;
    // 2. Prova tutti i nomi (IT/JP/EN)
    for (const names of Object.values(entry.names)) {
      if (names.some((n: string) => {
        const nl = n.toLowerCase();
        return nl === q || q === nl || nl.includes(q) || q.includes(nl);
      })) return true;
    }
    return false;
  };

  // Custom first (hanno priorità)
  const custom = getCustomIngredients();
  for (const entry of Object.values(custom)) {
    if (matches(entry)) return entry;
  }

  // Built-in
  for (const entry of Object.values(INGREDIENT_DICTIONARY)) {
    if (matches(entry as DictionaryEntry)) return entry as DictionaryEntry;
  }
  return null;
}

/** Restituisce tutte le entries (custom override > built-in) */
export function getAllIngredients(): DictionaryEntry[] {
  const custom = getCustomIngredients();
  const all: Record<string, DictionaryEntry> = { ...INGREDIENT_DICTIONARY as Record<string, DictionaryEntry>, ...custom };
  return Object.values(all).sort((a, b) =>
    (a.names.it[0] ?? a.canonicalId).localeCompare(b.names.it[0] ?? b.canonicalId, "it")
  );
}

// ── Supabase sync ─────────────────────────────────────────────────────────────

export async function pushCustomIngredients(
  syncId: string,
  data: Record<string, DictionaryEntry>
): Promise<void> {
  if (!SYNC_ENABLED) return;
  try {
    await fetch(TABLE, {
      method: "POST",
      headers: { ...h(), "Prefer": "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ sync_id: syncId, data, updated_at: new Date().toISOString() }),
    });
  } catch { /* silenzioso */ }
}

export async function pullCustomIngredients(syncId: string): Promise<void> {
  if (!SYNC_ENABLED) return;
  try {
    const res = await fetch(
      `${TABLE}?sync_id=eq.${encodeURIComponent(syncId)}&select=data`,
      { headers: h() }
    );
    if (!res.ok) return;
    const rows: Array<{ data: Record<string, DictionaryEntry> }> = await res.json();
    const remote = rows[0]?.data;
    if (remote && Object.keys(remote).length > 0) {
      const local = getCustomIngredients();
      // Merge: custom locale + remoti (remoti non sovrascrivono locali)
      const merged = { ...remote, ...local };
      setCustomIngredients(merged);
    }
  } catch { /* silenzioso */ }
}

// ── Helper: entry vuota per un nuovo ingrediente ──────────────────────────────

export function emptyEntry(canonicalId = ""): DictionaryEntry {
  return {
    canonicalId,
    names: { it: [], ja: [], en: [] },
    defaultUnit: "g",
    isSolid: true,
    peso_medio_unità: undefined,
    nutrition: {
      energia_kcal: 0, grassi: 0, grassi_saturi: 0,
      carboidrati: 0, zuccheri: 0, proteine: 0,
      fibre: 0, sale: 0, extra: {},
    },
  };
}

/** Controlla se un'entry è custom (sovrascritta dall'utente) */
export function isCustom(canonicalId: string): boolean {
  return !!getCustomIngredients()[canonicalId];
}
