/**
 * supabase.ts v2 — Tombstone (deleted_ids) per sync corretto delle cancellazioni.
 *
 * ── Aggiorna la tabella Supabase (SQL Editor) ────────────────────────────────
 *
 * ALTER TABLE recipe_books
 *   ADD COLUMN IF NOT EXISTS deleted_ids jsonb NOT NULL DEFAULT '[]'::jsonb;
 *
 * ── Schema completo (se riparti da zero) ────────────────────────────────────
 *
 * create table recipe_books (
 *   sync_id     text primary key,
 *   data        jsonb not null default '[]'::jsonb,
 *   deleted_ids jsonb not null default '[]'::jsonb,
 *   updated_at  timestamptz not null default now()
 * );
 * alter table recipe_books enable row level security;
 * create policy "anon_all" on recipe_books
 *   for all using (true) with check (true);
 */

import type { Recipe } from "../types";

export const SUPABASE_URL      = "https://algwjaodqfyhndpfvgja.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_cisPyzz0OAKqjj-ERGMzPg_6RD6Oa8K";
export const SYNC_ENABLED = SUPABASE_ANON_KEY !== "YOUR_ANON_KEY_HERE";

const LS_SYNC_ID        = "heirloom_sync_id";
const LS_LAST_SYNC      = "heirloom_last_sync";
const LS_REMOTE_UPDATED = "heirloom_remote_updated";
const LS_DELETED_IDS    = "heirloom_deleted_ids";

// ── Sync ID ───────────────────────────────────────────────────────────────────

export function getSyncId(): string {
  try {
    let id = localStorage.getItem(LS_SYNC_ID);
    if (!id) { id = makeUUID(); localStorage.setItem(LS_SYNC_ID, id); }
    return id;
  } catch { return makeUUID(); }
}

function makeUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ── Tombstone helpers ─────────────────────────────────────────────────────────

export function getLocalDeletedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_DELETED_IDS);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}

export function addLocalDeletedId(id: string) {
  const set = getLocalDeletedIds();
  set.add(id);
  try { localStorage.setItem(LS_DELETED_IDS, JSON.stringify([...set])); } catch {}
}

export function setLocalDeletedIds(ids: string[]) {
  try { localStorage.setItem(LS_DELETED_IDS, JSON.stringify(ids)); } catch {}
}

// ── Timestamp helpers ─────────────────────────────────────────────────────────

export function getLastSyncTime(): string | null {
  try { return localStorage.getItem(LS_LAST_SYNC); } catch { return null; }
}
export function setLastSyncTime(iso: string) {
  try { localStorage.setItem(LS_LAST_SYNC, iso); } catch {}
}
function getRemoteUpdatedAt(): string | null {
  try { return localStorage.getItem(LS_REMOTE_UPDATED); } catch { return null; }
}
function setRemoteUpdatedAt(iso: string) {
  try { localStorage.setItem(LS_REMOTE_UPDATED, iso); } catch {}
}

// ── API ───────────────────────────────────────────────────────────────────────

function h(): Record<string, string> {
  return {
    "Content-Type":  "application/json",
    "apikey":        SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
  };
}

const TABLE_URL = `${SUPABASE_URL}/rest/v1/recipe_books`;

export interface RemoteBook {
  sync_id:     string;
  data:        Recipe[];
  deleted_ids: string[];
  updated_at:  string;
}

export async function fetchRemoteBook(syncId: string): Promise<RemoteBook | null> {
  if (!SYNC_ENABLED) return null;
  try {
    const res = await fetch(
      `${TABLE_URL}?sync_id=eq.${encodeURIComponent(syncId)}&select=sync_id,data,deleted_ids,updated_at`,
      { headers: h() }
    );
    if (!res.ok) return null;
    const rows: RemoteBook[] = await res.json();
    const row = rows[0];
    if (!row) return null;
    return { ...row, deleted_ids: Array.isArray(row.deleted_ids) ? row.deleted_ids : [] };
  } catch { return null; }
}

export async function fetchRemoteMeta(syncId: string): Promise<{ updated_at: string } | null> {
  if (!SYNC_ENABLED) return null;
  try {
    const res = await fetch(
      `${TABLE_URL}?sync_id=eq.${encodeURIComponent(syncId)}&select=updated_at`,
      { headers: h() }
    );
    if (!res.ok) return null;
    const rows: Array<{ updated_at: string }> = await res.json();
    return rows[0] ?? null;
  } catch { return null; }
}

export async function pushBook(
  syncId: string,
  recipes: Recipe[],
  deletedIds: string[]
): Promise<boolean> {
  if (!SYNC_ENABLED) return false;
  const now = new Date().toISOString();
  try {
    const res = await fetch(TABLE_URL, {
      method: "POST",
      headers: { ...h(), "Prefer": "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ sync_id: syncId, data: recipes, deleted_ids: deletedIds, updated_at: now }),
    });
    if (!res.ok) return false;
    setLastSyncTime(now);
    setRemoteUpdatedAt(now);
    return true;
  } catch { return false; }
}

export async function hasRemoteUpdates(syncId: string): Promise<boolean> {
  if (!SYNC_ENABLED) return false;
  const meta = await fetchRemoteMeta(syncId);
  if (!meta) return false;
  return new Date(meta.updated_at).getTime() > new Date(getRemoteUpdatedAt() ?? "1970-01-01").getTime();
}

export function acknowledgeRemoteUpdate(updatedAt: string) {
  setRemoteUpdatedAt(updatedAt);
  setLastSyncTime(new Date().toISOString());
}
