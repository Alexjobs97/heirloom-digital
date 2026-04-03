/**
 * supabase.ts v3 — Recipe sync + Shopping List + Personal Notes.
 *
 * ── SQL da eseguire su Supabase ──────────────────────────────────────────────
 *
 * -- Tabella ricette (già esistente, aggiungi la colonna se manca):
 * ALTER TABLE recipe_books ADD COLUMN IF NOT EXISTS deleted_ids jsonb NOT NULL DEFAULT '[]'::jsonb;
 *
 * -- Tabella lista della spesa:
 * CREATE TABLE IF NOT EXISTS shopping_lists (
 *   sync_id    text primary key,
 *   items      jsonb not null default '[]'::jsonb,
 *   updated_at timestamptz not null default now()
 * );
 * ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "anon_all" ON shopping_lists FOR ALL USING (true) WITH CHECK (true);
 *
 * -- Tabella note personali:
 * CREATE TABLE IF NOT EXISTS recipe_notes (
 *   sync_id    text primary key,
 *   notes      jsonb not null default '{}'::jsonb,
 *   updated_at timestamptz not null default now()
 * );
 * ALTER TABLE recipe_notes ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "anon_all" ON recipe_notes FOR ALL USING (true) WITH CHECK (true);
 *
 * -- Ingredienti custom:
 * CREATE TABLE IF NOT EXISTS ingredient_overrides (
 *   sync_id    text primary key,
 *   data       jsonb not null default '{}'::jsonb,
 *   updated_at timestamptz not null default now()
 * );
 * ALTER TABLE ingredient_overrides ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "anon_all" ON ingredient_overrides FOR ALL USING (true) WITH CHECK (true);
 */

import type { Recipe, ShoppingListItem } from "../types";

export const SUPABASE_URL      = "https://algwjaodqfyhndpfvgja.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_cisPyzz0OAKqjj-ERGMzPg_6RD6Oa8K";
export const SYNC_ENABLED = SUPABASE_ANON_KEY !== "YOUR_ANON_KEY_HERE" && SUPABASE_ANON_KEY !== "";

const LS_SYNC_ID        = "heirloom_sync_id";
const LS_LAST_SYNC      = "heirloom_last_sync";
const LS_REMOTE_UPDATED = "heirloom_remote_updated";
const LS_DELETED_IDS    = "heirloom_deleted_ids";

// ── Sync ID ───────────────────────────────────────────────────────────────────

export function getSyncId(): string {
  try {
    let id = localStorage.getItem(LS_SYNC_ID);
    if (!id) { id = uuid(); localStorage.setItem(LS_SYNC_ID, id); }
    return id;
  } catch { return uuid(); }
}

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ── Tombstones ────────────────────────────────────────────────────────────────

export function getLocalDeletedIds(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(LS_DELETED_IDS) ?? "[]")); } catch { return new Set(); }
}
export function addLocalDeletedId(id: string) {
  const s = getLocalDeletedIds(); s.add(id);
  try { localStorage.setItem(LS_DELETED_IDS, JSON.stringify([...s])); } catch {}
}
export function setLocalDeletedIds(ids: string[]) {
  try { localStorage.setItem(LS_DELETED_IDS, JSON.stringify(ids)); } catch {}
}

// ── Timestamps ────────────────────────────────────────────────────────────────

export function getLastSyncTime(): string | null { try { return localStorage.getItem(LS_LAST_SYNC); } catch { return null; } }
export function setLastSyncTime(iso: string) { try { localStorage.setItem(LS_LAST_SYNC, iso); } catch {} }
function getRemoteUpdatedAt(): string | null { try { return localStorage.getItem(LS_REMOTE_UPDATED); } catch { return null; } }
function setRemoteUpdatedAt(iso: string) { try { localStorage.setItem(LS_REMOTE_UPDATED, iso); } catch {} }

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function h(): Record<string, string> {
  return { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}` };
}
const BASE = SUPABASE_URL + "/rest/v1";

// ══════════════════════════════════════════════════════════════════════════════
// RECIPE BOOKS
// ══════════════════════════════════════════════════════════════════════════════

export interface RemoteBook { sync_id: string; data: Recipe[]; deleted_ids: string[]; updated_at: string; }

export async function fetchRemoteBook(syncId: string): Promise<RemoteBook | null> {
  if (!SYNC_ENABLED) return null;
  try {
    const res = await fetch(`${BASE}/recipe_books?sync_id=eq.${encodeURIComponent(syncId)}&select=sync_id,data,deleted_ids,updated_at`, { headers: h() });
    if (!res.ok) return null;
    const rows: RemoteBook[] = await res.json();
    const row = rows[0]; if (!row) return null;
    return { ...row, deleted_ids: Array.isArray(row.deleted_ids) ? row.deleted_ids : [] };
  } catch { return null; }
}

export async function fetchRemoteMeta(syncId: string): Promise<{ updated_at: string } | null> {
  if (!SYNC_ENABLED) return null;
  try {
    const res = await fetch(`${BASE}/recipe_books?sync_id=eq.${encodeURIComponent(syncId)}&select=updated_at`, { headers: h() });
    if (!res.ok) return null;
    const rows: Array<{ updated_at: string }> = await res.json();
    return rows[0] ?? null;
  } catch { return null; }
}

export async function pushBook(syncId: string, recipes: Recipe[], deletedIds: string[]): Promise<boolean> {
  if (!SYNC_ENABLED) return false;
  const now = new Date().toISOString();
  try {
    const res = await fetch(`${BASE}/recipe_books`, {
      method: "POST",
      headers: { ...h(), "Prefer": "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ sync_id: syncId, data: recipes, deleted_ids: deletedIds, updated_at: now }),
    });
    if (!res.ok) return false;
    setLastSyncTime(now); setRemoteUpdatedAt(now); return true;
  } catch { return false; }
}

export async function hasRemoteUpdates(syncId: string): Promise<boolean> {
  if (!SYNC_ENABLED) return false;
  const meta = await fetchRemoteMeta(syncId); if (!meta) return false;
  return new Date(meta.updated_at).getTime() > new Date(getRemoteUpdatedAt() ?? "1970-01-01").getTime();
}

export function acknowledgeRemoteUpdate(updatedAt: string) {
  setRemoteUpdatedAt(updatedAt); setLastSyncTime(new Date().toISOString());
}

// ══════════════════════════════════════════════════════════════════════════════
// SHOPPING LIST
// ══════════════════════════════════════════════════════════════════════════════

const LS_SHOPPING = "heirloom_shopping";

export function loadLocalShopping(): ShoppingListItem[] {
  try { return JSON.parse(localStorage.getItem(LS_SHOPPING) ?? "[]"); } catch { return []; }
}
export function saveLocalShopping(items: ShoppingListItem[]) {
  try { localStorage.setItem(LS_SHOPPING, JSON.stringify(items)); } catch {}
}

export async function fetchRemoteShopping(syncId: string): Promise<{ items: ShoppingListItem[]; updated_at: string } | null> {
  if (!SYNC_ENABLED) return null;
  try {
    const res = await fetch(`${BASE}/shopping_lists?sync_id=eq.${encodeURIComponent(syncId)}&select=items,updated_at`, { headers: h() });
    if (!res.ok) return null;
    const rows: Array<{ items: ShoppingListItem[]; updated_at: string }> = await res.json();
    return rows[0] ?? null;
  } catch { return null; }
}

export async function pushShopping(syncId: string, items: ShoppingListItem[]): Promise<boolean> {
  if (!SYNC_ENABLED) return false;
  try {
    const res = await fetch(`${BASE}/shopping_lists`, {
      method: "POST",
      headers: { ...h(), "Prefer": "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ sync_id: syncId, items, updated_at: new Date().toISOString() }),
    });
    return res.ok;
  } catch { return false; }
}

// ══════════════════════════════════════════════════════════════════════════════
// PERSONAL NOTES  { recipeId: noteText }
// ══════════════════════════════════════════════════════════════════════════════

const LS_NOTES = "heirloom_notes";

export function loadLocalNotes(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(LS_NOTES) ?? "{}"); } catch { return {}; }
}
export function saveLocalNotes(notes: Record<string, string>) {
  try { localStorage.setItem(LS_NOTES, JSON.stringify(notes)); } catch {}
}

export async function fetchRemoteNotes(syncId: string): Promise<{ notes: Record<string, string>; updated_at: string } | null> {
  if (!SYNC_ENABLED) return null;
  try {
    const res = await fetch(`${BASE}/recipe_notes?sync_id=eq.${encodeURIComponent(syncId)}&select=notes,updated_at`, { headers: h() });
    if (!res.ok) return null;
    const rows: Array<{ notes: Record<string, string>; updated_at: string }> = await res.json();
    return rows[0] ?? null;
  } catch { return null; }
}

export async function pushNotes(syncId: string, notes: Record<string, string>): Promise<boolean> {
  if (!SYNC_ENABLED) return false;
  try {
    const res = await fetch(`${BASE}/recipe_notes`, {
      method: "POST",
      headers: { ...h(), "Prefer": "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ sync_id: syncId, notes, updated_at: new Date().toISOString() }),
    });
    return res.ok;
  } catch { return false; }
}
