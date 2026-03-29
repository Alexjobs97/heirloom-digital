/**
 * useScaledIngredients.ts — Ingredienti scalati in tempo reale.
 * useCookingTimer         — Timer multipli concorrenti per CookingMode.
 */

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import type { Ingredient, TimerState } from "../types";
import { scaleIngredients, toDisplayQty, scaleQty, clampServings } from "../lib/scaling";
import { playTimerFinished, playTimerStart, unlockAudio } from "../lib/audio";
import { TIMER_REGEX } from "../lib/parser";
import { generateId } from "../lib/scaling";

// ═══════════════════════════════════════════════════════════════════════════════
// useScaledIngredients
// ═══════════════════════════════════════════════════════════════════════════════

export interface ScaledIngredient extends Ingredient {
  qtyDisplay: string;
}

/**
 * Calcola la lista ingredienti scalata per `targetServings`.
 * Gestisce gracefully baseYield === 0 (ritorna ingredienti invariati).
 */
export function useScaledIngredients(
  ingredients: Ingredient[],
  baseYield: number,
  targetServings: number
): ScaledIngredient[] {
  return useMemo(() => {
    const safeBase   = baseYield    > 0 ? baseYield                : 1;
    const safeTarget = targetServings > 0 ? clampServings(targetServings) : safeBase;

    const scaled = scaleIngredients(ingredients, safeBase, safeTarget);

    return scaled.map((ing) => {
      const scaledQty = scaleQty(ing.qty, safeBase, safeTarget);
      let qtyDisplay = "";
      if (typeof scaledQty === "string") {
        qtyDisplay = scaledQty;
      } else if (scaledQty > 0) {
        qtyDisplay = toDisplayQty(scaledQty);
      }
      return { ...ing, qtyDisplay };
    });
  }, [ingredients, baseYield, targetServings]);
}

// ═══════════════════════════════════════════════════════════════════════════════
// extractTimersFromStep
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Estrae tutti i timer da un testo di passo.
 * Es: "cuoci per 12 minuti" → [{ label: "cuoci per 12 minuti", seconds: 720 }]
 *
 * Usa una copia locale della regex (flag g) per evitare problemi con lastIndex
 * sulla regex module-level condivisa.
 */
export function extractTimersFromStep(stepText: string): Array<{
  label: string;
  seconds: number;
}> {
  // Crea una copia fresca della regex per ogni chiamata — evita stato condiviso
  const re = new RegExp(TIMER_REGEX.source, TIMER_REGEX.flags);
  const results: Array<{ label: string; seconds: number }> = [];
  let match: RegExpExecArray | null;

  while ((match = re.exec(stepText)) !== null) {
    const val  = parseFloat(match[1].replace(",", "."));
    const unit = match[2].toLowerCase();

    let seconds: number;
    if (/^h/i.test(unit) && !/min/i.test(unit)) seconds = Math.round(val * 3600);
    else if (/^sec/i.test(unit))                 seconds = Math.round(val);
    else                                          seconds = Math.round(val * 60);

    if (seconds > 0) {
      const start   = Math.max(0, match.index - 15);
      const snippet = stepText.slice(start, match.index + match[0].length).trim();
      results.push({ label: snippet.slice(0, 45), seconds });
    }
  }

  return results;
}

// ═══════════════════════════════════════════════════════════════════════════════
// useCookingTimer
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Gestisce timer multipli concorrenti.
 * Un singolo setInterval globale aggiorna tutti i timer running.
 */
export function useCookingTimer() {
  const [timers, setTimers] = useState<TimerState[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick ogni secondo
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimers((prev) => {
        const hasRunning = prev.some((t) => t.running && !t.finished);
        if (!hasRunning) return prev;

        return prev.map((t) => {
          if (!t.running || t.finished) return t;
          const remaining = t.remainingSeconds - 1;
          if (remaining <= 0) {
            playTimerFinished();
            return { ...t, remainingSeconds: 0, running: false, finished: true };
          }
          return { ...t, remainingSeconds: remaining };
        });
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = useCallback(
    (label: string, durationSeconds: number): string => {
      unlockAudio();
      playTimerStart();
      const id = generateId();
      setTimers((prev) => [
        ...prev,
        {
          id,
          label,
          durationSeconds,
          remainingSeconds: durationSeconds,
          running: true,
          finished: false,
        },
      ]);
      return id;
    },
    []
  );

  const pauseTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, running: false } : t))
    );
  }, []);

  const resumeTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id && !t.finished ? { ...t, running: true } : t
      )
    );
  }, []);

  const resetTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, remainingSeconds: t.durationSeconds, running: false, finished: false }
          : t
      )
    );
  }, []);

  const removeTimer = useCallback((id: string) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => setTimers([]), []);

  const formatRemaining = useCallback((seconds: number): string => {
    if (seconds >= 3600) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, []);

  return {
    timers,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    removeTimer,
    clearAll,
    formatRemaining,
  };
}
