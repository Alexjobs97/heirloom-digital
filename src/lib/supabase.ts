/**
 * supabase.ts — Client Supabase + operazioni di cloud sync.
 *
 * ── Setup su Supabase (esegui nell'SQL Editor del tuo progetto) ──────────────
 *
 * create table recipe_books (
 *   sync_id   text primary key,
 *   data      jsonb not null default '[]'::jsonb,
 *   updated_at timestamptz not null default now()
 * );
 *
 * alter table recipe_books enable row level security;
 *
 * -- Permetti accesso anonimo (il sync_id è il "segreto")
 * create policy "anon_all" on recipe_books
 *   for all using (true) with check (true);
 *
 * ── Variabili da configurare ─────────────────────────────────────────────────
 * Inserisci la tua anon key in SUPABASE_ANON_KEY (sostituisci il placeholder).
 */

import type { Recipe } from "../types";

// ── Configurazione ────────────────────────────────────────────────────────────

export const SUPABASE_URL      = "https://algwjaodqfyhndpfvgja.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_cisPyzz0OAKqjj-ERGMzPg_6RD6Oa8K"; // ← sostituisci con la tua anon key

export const SYNC_ENABLED = SUPABASE_ANON_KEY !== "YOUR_ANON_KEY_HERE";

// ── LocalStorage keys ─────────────────────────────────────────────────────────

const LS_SYNC_ID       = "heirloom_sync_id";
const LS_LAST_SYNC     = "heirloom_last_sync";
const LS_REMOTE_UPDATED = "heirloom_remote_updated";

// ── Sync ID (UUID generato al primo avvio) ────────────────────────────────────

export function getSyncId(): string {
  try {
    let id = localStorage.getItem(LS_SYNC_ID);
    if (!id) {
      id = generateUUID();
      localStorage.setItem(LS_SYNC_ID, id);
    }
    return id;
  } catch {
    return generateUUID();
  }
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ── Timestamp helpers ─────────────────────────────────────────────────────────

export function getLastSyncTime(): string | null {
  try { return localStorage.getItem(LS_LAST_SYNC); } catch { return null; }
}

function setLastSyncTime(iso: string) {
  try { localStorage.setItem(LS_LAST_SYNC, iso); } catch {}
}

function getRemoteUpdatedAt(): string | null {
  try { return localStorage.getItem(LS_REMOTE_UPDATED); } catch { return null; }
}

function setRemoteUpdatedAt(iso: string) {
  try { localStorage.setItem(LS_REMOTE_UPDATED, iso); } catch {}
}

// ── API helpers ───────────────────────────────────────────────────────────────

function headers(): HeadersInit {
  return {
    "Content-Type":  "application/json",
    "apikey":        SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Prefer":        "return=representation",
  };
}

const TABLE_URL = `${SUPABASE_URL}/rest/v1/recipe_books`;

// ── Fetch da cloud ─────────────────────────────────────────────────────────────

export interface RemoteBook {
  sync_id: string;
  data: Recipe[];
  updated_at: string;
}

/**
 * Legge il libro ricette dal cloud per il sync_id corrente.
 * Ritorna null se non trovato o in caso di errore.
 */
export async function fetchRemoteBook(syncId: string): Promise<RemoteBook | null> {
  if (!SYNC_ENABLED) return null;
  try {
    const res = await fetch(
      `${TABLE_URL}?sync_id=eq.${encodeURIComponent(syncId)}&select=sync_id,data,updated_at`,
      { headers: headers() }
    );
    if (!res.ok) return null;
    const rows: RemoteBook[] = await res.json();
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * Carica solo i metadata (updated_at) senza scaricare tutto il payload.
 * Usato per decidere se è necessario un pull.
 */
export async function fetchRemoteMeta(syncId: string): Promise<{ updated_at: string } | null> {
  if (!SYNC_ENABLED) return null;
  try {
    const res = await fetch(
      `${TABLE_URL}?sync_id=eq.${encodeURIComponent(syncId)}&select=updated_at`,
      { headers: headers() }
    );
    if (!res.ok) return null;
    const rows: Array<{ updated_at: string }> = await res.json();
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

// ── Push verso cloud ───────────────────────────────────────────────────────────

/**
 * Salva (upsert) il libro ricette sul cloud.
 * Ritorna true se successo.
 */
export async function pushBook(syncId: string, recipes: Recipe[]): Promise<boolean> {
  if (!SYNC_ENABLED) return false;
  const now = new Date().toISOString();
  try {
    const res = await fetch(TABLE_URL, {
      method: "POST",
      headers: {
        ...headers() as Record<string, string>,
        "Prefer": "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        sync_id:    syncId,
        data:       recipes,
        updated_at: now,
      }),
    });
    if (!res.ok) return false;
    setLastSyncTime(now);
    setRemoteUpdatedAt(now);
    return true;
  } catch {
    return false;
  }
}

// ── Pull dal cloud ─────────────────────────────────────────────────────────────

/**
 * Controlla se il cloud ha dati più recenti di quelli visti l'ultima volta.
 */
export async function hasRemoteUpdates(syncId: string): Promise<boolean> {
  if (!SYNC_ENABLED) return false;
  const meta = await fetchRemoteMeta(syncId);
  if (!meta) return false;
  const remoteTs = new Date(meta.updated_at).getTime();
  const knownTs  = new Date(getRemoteUpdatedAt() ?? "1970-01-01").getTime();
  return remoteTs > knownTs;
}

/**
 * Segna come "visto" l'updated_at remoto (dopo il merge).
 */
export function acknowledgeRemoteUpdate(updatedAt: string) {
  setRemoteUpdatedAt(updatedAt);
  setLastSyncTime(new Date().toISOString());
}
