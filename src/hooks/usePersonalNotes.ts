/**
 * usePersonalNotes.ts — Note personali per ricetta, sync Supabase.
 * Salva un oggetto { recipeId: noteText } in localStorage e su Supabase.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import {
  loadLocalNotes, saveLocalNotes,
  fetchRemoteNotes, pushNotes, SYNC_ENABLED, getSyncId,
} from "../lib/supabase";

export function usePersonalNote(recipeId: string) {
  const syncId   = getSyncId();
  const [note, setNote] = useState<string>(() => loadLocalNotes()[recipeId] ?? "");
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Carica nota dal cloud al primo mount
  useEffect(() => {
    if (!SYNC_ENABLED || !recipeId) return;
    fetchRemoteNotes(syncId).then((remote) => {
      if (!remote) return;
      const remoteNote = remote.notes[recipeId];
      if (remoteNote !== undefined) {
        const localNotes = loadLocalNotes();
        // Usa il remote se diverso (simple last-write-wins: non abbiamo timestamps per nota)
        if (remoteNote !== localNotes[recipeId]) {
          localNotes[recipeId] = remoteNote;
          saveLocalNotes(localNotes);
          setNote(remoteNote);
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId, syncId]);

  const updateNote = useCallback((text: string) => {
    setNote(text);
    setSaved(false);

    // Salva in locale immediatamente
    const notes = loadLocalNotes();
    notes[recipeId] = text;
    saveLocalNotes(notes);

    // Push debounced (2s) al cloud
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(async () => {
      setSaving(true);
      const latest = loadLocalNotes();
      await pushNotes(syncId, latest);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 2000);
  }, [recipeId, syncId]);

  return { note, updateNote, saving, saved };
}
