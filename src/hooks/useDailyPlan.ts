/**
 * useDailyPlan.ts — Pianificatore giornaliero semplice.
 */

import { useState, useEffect, useCallback } from "react";
import type { DailyPlan } from "../types";
import {
  getDailyPlan,
  saveDailyPlan,
  deleteDailyPlan,
} from "../lib/db";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useDailyPlan(date: string = todayISO()) {
  const [plan,    setPlan]    = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDailyPlan(date)
      .then((p) => { setPlan(p ?? { date, recipeIds: [] }); setLoading(false); })
      .catch(() => { setPlan({ date, recipeIds: [] }); setLoading(false); });
  }, [date]);

  const addRecipe = useCallback(
    async (recipeId: string) => {
      const current = plan ?? { date, recipeIds: [] };
      if (current.recipeIds.includes(recipeId)) return;
      const updated: DailyPlan = {
        ...current,
        recipeIds: [...current.recipeIds, recipeId],
      };
      await saveDailyPlan(updated);
      setPlan(updated);
    },
    [plan, date]
  );

  const removeRecipe = useCallback(
    async (recipeId: string) => {
      if (!plan) return;
      const updated: DailyPlan = {
        ...plan,
        recipeIds: plan.recipeIds.filter((id) => id !== recipeId),
      };
      if (updated.recipeIds.length === 0) {
        await deleteDailyPlan(date);
      } else {
        await saveDailyPlan(updated);
      }
      setPlan(updated);
    },
    [plan, date]
  );

  const clearPlan = useCallback(async () => {
    await deleteDailyPlan(date);
    setPlan({ date, recipeIds: [] });
  }, [date]);

  return {
    plan,
    recipeIds: plan?.recipeIds ?? [],
    loading,
    addRecipe,
    removeRecipe,
    clearPlan,
  };
}
