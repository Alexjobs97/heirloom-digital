/**
 * useTranslation.ts — Hook reattivo per traduzioni UI.
 * Legge la lingua dal LangContext (non da localStorage direttamente).
 */

import { useCallback } from "react";
import it, { TranslationKey } from "./it";
import ja from "./ja";
import { useLang } from "./LangContext";

type SupportedLocale = "it" | "ja";
const catalogs: Record<SupportedLocale, typeof it> = { it, ja };

export function useTranslation() {
  const { lang } = useLang();
  const locale = lang as SupportedLocale;
  const catalog = catalogs[locale] ?? it;

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>): string => {
      let str: string = (catalog[key] as string) ?? (it[key] as string) ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v));
        });
      }
      return str;
    },
    [catalog]
  );

  return { t, locale };
}

// Utilità standalone (fuori da componenti React) — legge localStorage come fallback
export function translate(
  key: TranslationKey,
  vars?: Record<string, string | number>,
  locale: SupportedLocale = "it"
): string {
  const catalog = catalogs[locale] ?? it;
  let str: string = (catalog[key] as string) ?? (it[key] as string) ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v));
    });
  }
  return str;
}
