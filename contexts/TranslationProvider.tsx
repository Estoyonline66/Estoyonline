"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { dictionaries, isLocale, type Locale } from "@/lib/i18n";

interface TranslationContextType {
  t<T>(key: string): T;
  setLanguage: (lang: string) => void;
  language: string;
}
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({
  children, initialLocale = "en",
}: { children: ReactNode; initialLocale?: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const pathLocale = pathname?.split("/")[1] ?? "";
  const language = isLocale(pathLocale) ? pathLocale : initialLocale;
  const translations: Record<string, unknown> = dictionaries[language];

  useEffect(() => {
    // The root layout persists during client navigation between languages.
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (lang: string) => {
    if (!isLocale(lang)) return;
    router.push(`/${lang}${pathname.replace(/^\/(en|es|fr|tr)(?=\/|$)/, "")}`);
  };
  function t<T>(key: string): T {
    return (translations[key] ?? key) as T;
  }
  return (
    <TranslationContext.Provider value={{ t, setLanguage: changeLanguage, language }}>
      {children}
    </TranslationContext.Provider>
  );
}
export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) throw new Error("useTranslation must be used within a TranslationProvider");
  return context;
}
