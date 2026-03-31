/**
 * LangContext.tsx — Context React per la lingua dell'interfaccia.
 * Sostituisce window.location.reload() — la lingua è reattiva senza ricarica.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Lang = "it" | "ja";

interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextType>({
  lang: "it",
  toggleLang: () => {},
  setLang: () => {},
});

function readSavedLang(): Lang {
  try {
    const saved = localStorage.getItem("heirloom_lang");
    if (saved === "it" || saved === "ja") return saved;
  } catch { /* noop */ }
  return "it";
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readSavedLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try { localStorage.setItem("heirloom_lang", next); } catch { /* noop */ }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "it" ? "ja" : "it");
  }, [lang, setLang]);

  return (
    <LangContext.Provider value={{ lang, toggleLang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextType {
  return useContext(LangContext);
}
