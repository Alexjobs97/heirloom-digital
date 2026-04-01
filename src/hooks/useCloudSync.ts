/**
 * useCloudSync.ts v2 — Accetta syncId dall'esterno (per multi-device paste).
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { Recipe, SyncStatus } from "../types";
import {
  SYNC_ENABLED,
  fetchRemoteBook,
  pushBook,
  hasRemoteUpdates,
  acknowledgeRemoteUpdate,
  getLastSyncTime,
} from "../lib/supabase";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

interface UseCloudSyncOptions {
  onMerge: (remoteRecipes: Recipe[]) => Promise<void>;
  getLocalRecipes: () => Recipe[];
  /** Sync ID passato dall'esterno — può cambiare se l'utente incolla un nuovo ID */
  syncId: string;
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
  { onMerge, getLocalRecipes, syncId }: UseCloudSyncOptions
): CloudSyncAPI {
  const [status,  setStatus]   = useState<SyncStatus>(SYNC_ENABLED ? "idle" : "disabled");
  const [lastSync, setLastSync] = useState<string | null>(getLastSyncTime());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Traccia l'ultimo syncId usato per il pull — quando cambia, rifai il pull
  const lastPullId   = useRef<string>("");
  const lastPushedHash = useRef<string>("");

  function recipesHash(rs: Recipe[]): string {
    return rs.map((r) => `${r.id}:${r.updatedAt ?? r.createdAt}`).join("|");
  }

  // ── Pull: all'avvio e ogni volta che syncId cambia ───────────────────────

  useEffect(() => {
    if (!SYNC_ENABLED) return;
    if (lastPullId.current === syncId) return;   // già pullato per questo ID
    lastPullId.current = syncId;
    lastPushedHash.current = "";                  // reset hash push per il nuovo ID

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
          const now = new Date().toISOString();
          setLastSync(now);
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

    const t = setTimeout(doPull, 800);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncId]);

  // ── Push debounced (5s) ───────────────────────────────────────────────────

  const debouncedRecipes = useDebounce(recipes, 5000);

  useEffect(() => {
    if (!SYNC_ENABLED) return;
    if (!lastPullId.current) return;       // aspetta almeno un pull tentato
    if (debouncedRecipes.length === 0) return;

    const hash = recipesHash(debouncedRecipes);
    if (hash === lastPushedHash.current) return;

    async function doPush() {
      setStatus("syncing");
      setErrorMsg(null);
      try {
        const ok = await pushBook(syncId, debouncedRecipes);
        if (ok) {
          lastPushedHash.current = hash;
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
  }, [debouncedRecipes, syncId]);

  // ── Sync manuale ─────────────────────────────────────────────────────────

  const syncNow = useCallback(async () => {
    if (!SYNC_ENABLED) return;
    setStatus("syncing");
    setErrorMsg(null);
    try {
      const remote = await fetchRemoteBook(syncId);
      if (remote && remote.data?.length > 0) {
        await onMerge(remote.data);
        acknowledgeRemoteUpdate(remote.updated_at);
      }
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

  return { status, lastSync, syncId, isEnabled: SYNC_ENABLED, syncNow, errorMessage: errorMsg };
}
