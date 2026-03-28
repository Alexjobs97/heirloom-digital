import { useCallback } from "react";
import it, { TranslationKey } from "./it";
import ja from "./ja";

type SupportedLocale = "it" | "ja";

const catalogs: Record<SupportedLocale, typeof it> = { it, ja };

// Legge la lingua salvata, default 'it'
function getLocale(): SupportedLocale {
  try {
    const saved = localStorage.getItem("heirloom_lang");
    if (saved === "it" || saved === "ja") return saved;
  } catch {
    // localStorage non disponibile (es. private browsing estremo)
  }
  return "it";
}

export function useTranslation() {
  const locale = getLocale();
  const catalog = catalogs[locale] ?? it;

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>): string => {
      let str: string = catalog[key] ?? it[key] ?? key;
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

// Utilità standalone (fuori da componenti React)
export function translate(
  key: TranslationKey,
  vars?: Record<string, string | number>,
  locale: SupportedLocale = "it"
): string {
  const catalog = catalogs[locale] ?? it;
  let str: string = catalog[key] ?? it[key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v));
    });
  }
  return str;
}
