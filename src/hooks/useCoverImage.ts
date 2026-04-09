/**
 * useCoverImage.ts — Lazy loading immagini con cache invalidabile.
 *
 * Cache globale cancellabile per recipeId: quando una ricetta viene
 * salvata/modificata, clearImageCache(id) forza il reload.
 */

import { useState, useEffect, useRef } from "react";
import { getRecipeById } from "../lib/db";

const _imgCache = new Map<string, string | null>();

/** Chiamato da useRecipes dopo upsertRecipe — invalida la cache dell'immagine */
export function clearImageCache(recipeId: string) {
  _imgCache.delete(recipeId);
}

export function useCardImageLoader(recipeId: string, hasCoverImage: boolean) {
  const [src, setSrc] = useState<string | null>(
    hasCoverImage && _imgCache.has(recipeId) ? _imgCache.get(recipeId)! : null
  );
  const observedRef = useRef(false);

  const setRef = (el: HTMLElement | null) => {
    if (!el || !hasCoverImage || observedRef.current) return;
    observedRef.current = true;

    // Se già in cache (valida), usa subito
    if (_imgCache.has(recipeId)) {
      setSrc(_imgCache.get(recipeId) ?? null);
      return;
    }

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

  // Re-check quando hasCoverImage cambia (es. immagine rimossa)
  useEffect(() => {
    if (!hasCoverImage) {
      _imgCache.delete(recipeId);
      setSrc(null);
    }
  }, [hasCoverImage, recipeId]);

  return { src, setRef };
}
