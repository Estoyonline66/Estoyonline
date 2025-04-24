"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCookie, setCookie } from "@/lib/utils/__cookies";

// Define translation types
interface Translations {
  [key: string]: any;
}

interface TranslationContextType {
  t<T>(key: string): T;
  setLanguage: (lang: string) => void;
  language: string;
}

// Create the context
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const detectedLangFromPath = pathname?.split("/")[1];
  const supportedLanguages = ["en", "tr"];
  const initialLang = supportedLanguages.includes(detectedLangFromPath) ? detectedLangFromPath : "tr";

  const [language, setLanguage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return getCookie("language") || initialLang;
    }
    return initialLang;
  });

  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`/locales/${language}.json`);
        const data: Translations = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Error loading translations:", error);
      }
    };

    fetchTranslations();
  }, [language]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCookie("language", language);
    }
  }, [language]);

  // Sync language when URL path changes
  useEffect(() => {
    const newLang = pathname?.split("/")[1];
    if (supportedLanguages.includes(newLang) && newLang !== language) {
      setLanguage(newLang);
    }
  }, [pathname]);

  // Function to update language and route
  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    const newPath = `/${lang}${pathname.replace(/^\/(en|tr)/, "")}`;
    router.push(newPath);
  };

  // Nested key lookup for translations (supports “home.testimonialsList”)
  function t<T>(key: string): T {
    const keys = key.split(".");
    let result: any = translations;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) break;
    }
    return (result !== undefined ? result : key) as T;
  }

  return (
    <TranslationContext.Provider value={{ t, setLanguage: changeLanguage, language }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
