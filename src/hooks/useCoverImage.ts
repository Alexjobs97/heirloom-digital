/**
 * useCoverImage.ts — Carica l'immagine di copertina on-demand via IntersectionObserver.
 *
 * Il cache principale (useRecipes) tiene le ricette SENZA coverImage per performance.
 * Quando una RecipeCard entra nel viewport, questo hook fetcha l'immagine
 * da IndexedDB e la mostra — zero impatto sullo scrolling.
 */

import { useState, useEffect, useRef } from "react";
import { getRecipeById } from "../lib/db";

// Cache globale in-memory per le immagini già caricate (evita refetch)
const _imgCache = new Map<string, string | null>();

export function useCoverImage(recipeId: string, hasCoverImage: boolean): string | null {
  const [src, setSrc]       = useState<string | null>(_imgCache.get(recipeId) ?? null);
  const cardRef             = useRef<Element | null>(null);
  const observerRef         = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!hasCoverImage) return;
    if (_imgCache.has(recipeId)) { setSrc(_imgCache.get(recipeId) ?? null); return; }

    // IntersectionObserver: carica l'immagine solo quando la card è visibile
    const load = async () => {
      const recipe = await getRecipeById(recipeId).catch(() => null);
      const image  = recipe?.coverImage ?? null;
      _imgCache.set(recipeId, image);
      setSrc(image);
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          load();
          observerRef.current?.disconnect();
        }
      },
      { rootMargin: "200px" }   // pre-carica 200px prima che entri nel viewport
    );

    // Osserva il primo elemento DOM disponibile (cardRef viene settato da RecipeCard)
    if (cardRef.current) {
      observerRef.current.observe(cardRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [recipeId, hasCoverImage]);

  return src;
}

/**
 * Attacca il ref dell'elemento DOM all'observer del hook.
 * Usato da RecipeCard: `ref={attachRef(cardRef)}`.
 */
export function useCardImageLoader(recipeId: string, hasCoverImage: boolean) {
  const [src, setSrc] = useState<string | null>(_imgCache.get(recipeId) ?? null);
  const domRef = useRef<HTMLElement | null>(null);

  const setRef = (el: HTMLElement | null) => {
    if (!el || !hasCoverImage || _imgCache.has(recipeId)) return;
    domRef.current = el;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        const recipe = await getRecipeById(recipeId).catch(() => null);
        const image  = recipe?.coverImage ?? null;
        _imgCache.set(recipeId, image);
        setSrc(image);
      },
      { rootMargin: "250px" }
    );
    observer.observe(el);
  };

  // Se già in cache, non serve observer
  useEffect(() => {
    if (_imgCache.has(recipeId)) setSrc(_imgCache.get(recipeId) ?? null);
  }, [recipeId]);

  return { src, setRef };
}
