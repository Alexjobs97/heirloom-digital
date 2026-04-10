/**
 * useCoverImage.ts — Lazy loading immagini con cache invalidabile.
 *
 * Cache globale cancellabile per recipeId: quando una ricetta viene
 * salvata/modificata, clearImageCache(id) svuota la cache E notifica
 * tutti i hook attivi per quell'id, che resettano e ricaricano.
 */

import { useState, useEffect, useRef } from "react";
import { getRecipeById } from "../lib/db";

const _imgCache = new Map<string, string | null>();

// Listeners per invalidazione: recipeId → Set di callback
const _imgListeners = new Map<string, Set<() => void>>();

/** Chiamato da useRecipes dopo upsertRecipe — invalida la cache e notifica gli hook attivi */
export function clearImageCache(recipeId: string) {
  _imgCache.delete(recipeId);
  _imgListeners.get(recipeId)?.forEach((fn) => fn());
}

export function useCardImageLoader(recipeId: string, hasCoverImage: boolean) {
  const [src, setSrc] = useState<string | null>(() =>
    hasCoverImage && _imgCache.has(recipeId) ? (_imgCache.get(recipeId) ?? null) : null
  );
  const observedRef = useRef(false);

  // Iscriviti alle invalidazioni della cache per questo recipeId.
  // Quando clearImageCache(id) viene chiamato, resetta il flag e pulisce src
  // così al prossimo render setRef può ripartire da capo.
  useEffect(() => {
    if (!_imgListeners.has(recipeId)) {
      _imgListeners.set(recipeId, new Set());
    }
    const onInvalidate = () => {
      observedRef.current = false;
      setSrc(null);
    };
    _imgListeners.get(recipeId)!.add(onInvalidate);
    return () => {
      _imgListeners.get(recipeId)?.delete(onInvalidate);
    };
  }, [recipeId]);

  // Se hasCoverImage diventa false (immagine rimossa), svuota
  useEffect(() => {
    if (!hasCoverImage) {
      _imgCache.delete(recipeId);
      setSrc(null);
      observedRef.current = false;
    }
  }, [hasCoverImage, recipeId]);

  // ref callback: chiamato da React quando il DOM node è montato/smontato.
  // Grazie a observedRef evita di avviare più observer per lo stesso elemento.
  // Dopo un'invalidazione (onInvalidate resetta observedRef), il prossimo render
  // passa una nuova funzione → React chiama prima quella vecchia con null, poi
  // quella nuova con l'elemento → si riparte.
  const setRef = (el: HTMLElement | null) => {
    if (!el || !hasCoverImage || observedRef.current) return;

    // Già in cache (valida): usa subito senza observer
    if (_imgCache.has(recipeId)) {
      setSrc(_imgCache.get(recipeId) ?? null);
      return;
    }

    observedRef.current = true;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        try {
          const recipe = await getRecipeById(recipeId);
          const image  = recipe?.coverImage ?? null;
          _imgCache.set(recipeId, image);
          setSrc(image);
        } catch { /* noop */ }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
  };

  return { src, setRef };
}
