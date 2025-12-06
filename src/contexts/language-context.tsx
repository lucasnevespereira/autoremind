"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { translations, Language, TranslationKey } from "@/lib/i18n";
import { LANG } from "@/constants";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize language from localStorage
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("autoremind-language") as Language;
      if (
        savedLang &&
        (savedLang === LANG.EN ||
          savedLang === LANG.PT ||
          savedLang === LANG.FR)
      ) {
        return savedLang;
      }
    }
    return LANG.EN;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("autoremind-language", lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
