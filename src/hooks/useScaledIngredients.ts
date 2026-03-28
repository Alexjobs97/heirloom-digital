/**
 * useScaledIngredients.ts — Ingredienti scalati in tempo reale allo slider.
 * useCookingTimer.ts      — Gestione timer multipli in CookingMode.
 */

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import type { Ingredient, TimerState } from "../types";
import { scaleIngredients, formatIngredient, clampServings } from "../lib/scaling";
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
 * Calcola in tempo reale la lista ingredienti scalata per `targetServings`.
 * Usa useMemo: ricalcola solo se cambiano ingredienti, baseYield o target.
 */
export function useScaledIngredients(
  ingredients: Ingredient[],
  baseYield: number,
  targetServings: number
): ScaledIngredient[] {
  return useMemo(() => {
    const scaled = scaleIngredients(
      ingredients,
      baseYield,
      clampServings(targetServings)
    );
    return scaled.map((ing) => {
      const { qtyDisplay } = formatIngredient(
        ing,
        clampServings(targetServings),
        clampServings(targetServings)
      );
      return { ...ing, qtyDisplay };
    });
  }, [ingredients, baseYield, targetServings]);
}

// ═══════════════════════════════════════════════════════════════════════════════
// useCookingTimer
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Estrae tutti i timer da un testo di passo (es. "cuoci 12 minuti" → 720s).
 */
export function extractTimersFromStep(stepText: string): Array<{
  label: string;
  seconds: number;
}> {
  const results: Array<{ label: string; seconds: number }> = [];
  // Reset lastIndex per uso iterativo
  TIMER_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TIMER_REGEX.exec(stepText)) !== null) {
    const val  = parseFloat(match[1].replace(",", "."));
    const unit = match[2].toLowerCase();

    let seconds: number;
    if (/^h/i.test(unit) && !/min/i.test(unit)) seconds = Math.round(val * 3600);
    else if (/^sec/i.test(unit))                 seconds = Math.round(val);
    else                                          seconds = Math.round(val * 60);

    if (seconds > 0) {
      // Estrae il contesto attorno al match per un label leggibile
      const start = Math.max(0, match.index - 20);
      const snippet = stepText.slice(start, match.index + match[0].length + 5).trim();
      results.push({ label: snippet.slice(0, 40), seconds });
    }
  }

  return results;
}

/**
 * Gestisce uno o più timer concorrenti (uno per passo di cottura).
 * Ogni timer ha il suo conto alla rovescia indipendente.
 */
export function useCookingTimer() {
  const [timers, setTimers] = useState<TimerState[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick globale: aggiorna tutti i timer running ogni secondo
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimers((prev) => {
        let changed = false;
        const next = prev.map((t) => {
          if (!t.running || t.finished) return t;
          const remaining = t.remainingSeconds - 1;
          changed = true;
          if (remaining <= 0) {
            playTimerFinished();
            return { ...t, remainingSeconds: 0, running: false, finished: true };
          }
          return { ...t, remainingSeconds: remaining };
        });
        return changed ? next : prev;
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
      const newTimer: TimerState = {
        id,
        label,
        durationSeconds,
        remainingSeconds: durationSeconds,
        running: true,
        finished: false,
      };
      setTimers((prev) => [...prev, newTimer]);
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

  const clearAll = useCallback(() => {
    setTimers([]);
  }, []);

  /** Formatta i secondi rimanenti come MM:SS */
  const formatRemaining = (seconds: number): string => {
    if (seconds >= 3600) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

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
