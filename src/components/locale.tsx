"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Language = "ur" | "en";
const LocaleContext = createContext<{ language: Language; setLanguage: (value: Language) => void }>({ language: "ur", setLanguage: () => undefined });

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ur");
  useEffect(() => {
    const saved = window.localStorage.getItem("rehnumai-language");
    if (saved === "ur" || saved === "en") queueMicrotask(() => setLanguage(saved));
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ur" ? "rtl" : "ltr";
    window.localStorage.setItem("rehnumai-language", language);
  }, [language]);
  return <LocaleContext.Provider value={{ language, setLanguage }}>{children}</LocaleContext.Provider>;
}

export function useLocale() { return useContext(LocaleContext); }

export function LanguageSwitch() {
  const { language, setLanguage } = useLocale();
  return <div className="inline-flex rounded-[10px] border border-[var(--line)] bg-white p-1" role="group" aria-label="Language / زبان">
    <button type="button" onClick={() => setLanguage("ur")} aria-pressed={language === "ur"} className={`min-h-9 rounded-md px-3 text-sm font-semibold ${language === "ur" ? "bg-[var(--navy-900)] text-white" : "text-[var(--ink-700)]"}`}>اردو</button>
    <button type="button" onClick={() => setLanguage("en")} aria-pressed={language === "en"} className={`min-h-9 rounded-md px-3 text-sm font-semibold ${language === "en" ? "bg-[var(--navy-900)] text-white" : "text-[var(--ink-700)]"}`}>EN</button>
  </div>;
}

export function copy(language: Language, en: string, ur: string) { return language === "ur" ? ur : en; }
