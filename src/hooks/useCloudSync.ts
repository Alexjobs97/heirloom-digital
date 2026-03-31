/**
 * useCloudSync.ts — Hook per la sincronizzazione con Supabase.
 *
 * Flusso:
 * 1. All'avvio: controlla se ci sono aggiornamenti remoti → merge
 * 2. Quando le ricette cambiano (debounce 5s): push verso cloud
 * 3. Sync manuale via syncNow()
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { Recipe, SyncStatus } from "../types";
import {
  SYNC_ENABLED,
  getSyncId,
  fetchRemoteBook,
  pushBook,
  hasRemoteUpdates,
  acknowledgeRemoteUpdate,
  getLastSyncTime,
} from "../lib/supabase";

// ── Debounce generico ────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

interface UseCloudSyncOptions {
  /** Chiamato con le ricette remote da unire al db locale */
  onMerge: (remoteRecipes: Recipe[]) => Promise<void>;
  /** Ritorna le ricette correnti da pushare */
  getLocalRecipes: () => Recipe[];
}

export interface CloudSyncAPI {
  status: SyncStatus;
  lastSync: string | null;
  syncId: string;
  isEnabled: boolean;
  syncNow: () => Promise<void>;
  errorMessage: string | null;
}

export function useCloudSync(
  recipes: Recipe[],
  { onMerge, getLocalRecipes }: UseCloudSyncOptions
): CloudSyncAPI {
  const [status,  setStatus]  = useState<SyncStatus>(SYNC_ENABLED ? "idle" : "disabled");
  const [lastSync, setLastSync] = useState<string | null>(getLastSyncTime());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const syncId = getSyncId();

  // Traccia se è già stato fatto il pull iniziale
  const didInitialPull = useRef(false);
  // Traccia quante ricette c'erano all'ultimo push (per evitare push no-op)
  const lastPushedCount = useRef(-1);
  const lastPushedHash  = useRef("");

  // Semplice hash per rilevare cambiamenti
  function recipesHash(rs: Recipe[]): string {
    return rs.map((r) => `${r.id}:${r.updatedAt ?? r.createdAt}`).join("|");
  }

  // ── Pull iniziale ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!SYNC_ENABLED || didInitialPull.current) return;
    didInitialPull.current = true;

    async function doPull() {
      setStatus("syncing");
      setErrorMsg(null);
      try {
        const hasUpdates = await hasRemoteUpdates(syncId);
        if (!hasUpdates) {
          setStatus("idle");
          return;
        }
        const remote = await fetchRemoteBook(syncId);
        if (remote && remote.data?.length > 0) {
          await onMerge(remote.data);
          acknowledgeRemoteUpdate(remote.updated_at);
          setLastSync(new Date().toISOString());
          setStatus("synced");
        } else {
          setStatus("idle");
        }
      } catch (err) {
        setStatus("error");
        setErrorMsg("Sync pull fallito");
        console.error("[CloudSync] pull error:", err);
      }
    }

    // Aspetta un tick per non bloccare il primo render
    const t = setTimeout(doPull, 1500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Push debounced ────────────────────────────────────────────────────────

  const debouncedRecipes = useDebounce(recipes, 5000); // 5s debounce

  useEffect(() => {
    if (!SYNC_ENABLED) return;
    if (!didInitialPull.current) return;            // aspetta il pull iniziale
    if (debouncedRecipes.length === 0) return;      // non pushare libro vuoto

    const hash = recipesHash(debouncedRecipes);
    if (hash === lastPushedHash.current) return;    // nessun cambiamento reale

    async function doPush() {
      setStatus("syncing");
      setErrorMsg(null);
      try {
        const ok = await pushBook(syncId, debouncedRecipes);
        if (ok) {
          lastPushedHash.current = hash;
          lastPushedCount.current = debouncedRecipes.length;
          const now = new Date().toISOString();
          setLastSync(now);
          setStatus("synced");
        } else {
          setStatus("error");
          setErrorMsg("Push fallito");
        }
      } catch (err) {
        setStatus("error");
        setErrorMsg("Errore di rete");
        console.error("[CloudSync] push error:", err);
      }
    }

    doPush();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedRecipes]);

  // ── Sync manuale ──────────────────────────────────────────────────────────

  const syncNow = useCallback(async () => {
    if (!SYNC_ENABLED) return;
    setStatus("syncing");
    setErrorMsg(null);
    try {
      // Pull prima
      const remote = await fetchRemoteBook(syncId);
      if (remote && remote.data?.length > 0) {
        await onMerge(remote.data);
        acknowledgeRemoteUpdate(remote.updated_at);
      }
      // Poi push
      const current = getLocalRecipes();
      const ok = await pushBook(syncId, current);
      if (ok) {
        lastPushedHash.current = recipesHash(current);
        const now = new Date().toISOString();
        setLastSync(now);
        setStatus("synced");
      } else {
        setStatus("error");
        setErrorMsg("Push fallito");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg("Errore di rete");
      console.error("[CloudSync] manual sync error:", err);
    }
  }, [syncId, onMerge, getLocalRecipes]);

  return {
    status,
    lastSync,
    syncId,
    isEnabled: SYNC_ENABLED,
    syncNow,
    errorMessage: errorMsg,
  };
}
