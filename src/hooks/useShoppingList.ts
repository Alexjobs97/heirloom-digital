/**
 * useShoppingList.ts — Hook per la lista della spesa con sync Supabase.
 * Aggregazione per canonicalId: ingredienti identici vengono sommati.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { Ingredient, ShoppingListItem } from "../types";
import {
  loadLocalShopping, saveLocalShopping,
  fetchRemoteShopping, pushShopping, SYNC_ENABLED, getSyncId,
} from "../lib/supabase";

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

// ── Aggregazione ──────────────────────────────────────────────────────────────

function canAggregate(a: ShoppingListItem, b: ShoppingListItem): boolean {
  if (!a.canonicalId || !b.canonicalId) return false;
  if (a.canonicalId !== b.canonicalId) return false;
  // Aggrega solo se unità compatibili
  return a.unit === b.unit;
}

/**
 * Aggiunge ingredienti a una lista esistente, sommando le quantità
 * degli ingredienti con lo stesso canonicalId + unit.
 */
function mergeIntoList(
  existing: ShoppingListItem[],
  toAdd: ShoppingListItem[]
): ShoppingListItem[] {
  const result = [...existing];
  for (const item of toAdd) {
    const idx = result.findIndex((r) => canAggregate(r, item));
    if (idx >= 0) {
      result[idx] = { ...result[idx], qty: result[idx].qty + item.qty };
    } else {
      result.push(item);
    }
  }
  return result;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>(() => loadLocalShopping());
  const syncId   = getSyncId();
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Persist + debounced push ─────────────────────────────────────────────

  const persist = useCallback((next: ShoppingListItem[]) => {
    setItems(next);
    saveLocalShopping(next);
    if (!SYNC_ENABLED) return;
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => { pushShopping(syncId, next); }, 3000);
  }, [syncId]);

  // ── Pull iniziale ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!SYNC_ENABLED) return;
    fetchRemoteShopping(syncId).then((remote) => {
      if (!remote || !remote.items?.length) return;
      // Se il remote ha più elementi di locale, usa remote (merge semplice)
      const local = loadLocalShopping();
      if (remote.items.length > local.length) {
        saveLocalShopping(remote.items);
        setItems(remote.items);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncId]);

  // ── Aggiungi ingredienti da ricetta ──────────────────────────────────────

  const addFromRecipe = useCallback((
    ingredients: Ingredient[],
    recipeTitle: string
  ) => {
    const toAdd: ShoppingListItem[] = ingredients
      .filter((ing) => {
        const q = ing.qty;
        if (typeof q === "string" && (q === "q.b." || q === "qb")) return false;
        return true;
      })
      .map((ing) => {
        const rawQty = typeof ing.qty === "number" ? ing.qty : parseFloat(String(ing.qty));
        return {
          id:          uuid(),
          canonicalId: ing.canonicalId ?? "",
          displayName: ing.displayName,
          qty:         isNaN(rawQty) ? 0 : rawQty,
          unit:        ing.unit,
          checked:     false,
          isManual:    false,
          addedFrom:   recipeTitle,
        } satisfies ShoppingListItem;
      });

    persist(mergeIntoList(items, toAdd));
  }, [items, persist]);

  // ── Aggiungi voce manuale ────────────────────────────────────────────────

  const addManual = useCallback((name: string) => {
    if (!name.trim()) return;
    const item: ShoppingListItem = {
      id: uuid(), canonicalId: "", displayName: name.trim(),
      qty: 0, unit: "", checked: false, isManual: true,
    };
    persist([...items, item]);
  }, [items, persist]);

  // ── Toggle checkbox ──────────────────────────────────────────────────────

  const toggleItem = useCallback((id: string) => {
    persist(items.map((i) => i.id === id ? { ...i, checked: !i.checked } : i));
  }, [items, persist]);

  // ── Rimuovi singolo ──────────────────────────────────────────────────────

  const removeItem = useCallback((id: string) => {
    persist(items.filter((i) => i.id !== id));
  }, [items, persist]);

  // ── Svuota lista ─────────────────────────────────────────────────────────

  const clearAll = useCallback(() => persist([]), [persist]);

  // ── Svuota solo quelli spuntati ──────────────────────────────────────────

  const clearChecked = useCallback(() => {
    persist(items.filter((i) => !i.checked));
  }, [items, persist]);

  // ── Copia negli appunti ──────────────────────────────────────────────────

  const copyToClipboard = useCallback(async (): Promise<boolean> => {
    const lines = items.map((i) => {
      const qty  = i.qty > 0 ? `${i.qty}${i.unit ? " " + i.unit : ""}` : "";
      return `${i.checked ? "✓" : "•"} ${qty ? qty + " " : ""}${i.displayName}`;
    });
    const text = "🛒 Lista della spesa\n\n" + lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch { return false; }
  }, [items]);

  return {
    items,
    checkedCount: items.filter((i) => i.checked).length,
    totalCount:   items.length,
    addFromRecipe,
    addManual,
    toggleItem,
    removeItem,
    clearAll,
    clearChecked,
    copyToClipboard,
  };
}
