"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

// Define translation types
interface Translations {
  [key: string]: string;
}

interface TranslationContextType {
  t: (key: string) => string;
  setLanguage: (lang: string) => void;
  language: string;
}

// Create the context
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const [language, setLanguage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("language") || "en";
    }
    return "en";
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
      localStorage.setItem("language", language);
    }
  }, [language]);

  // Function to update language and route
  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    const newPath = `/${lang}${pathname.replace(/^\/(en|es|fr)/, "")}`;
    router.push(newPath); // Update URL dynamically
  };

  const t = (key: string) => translations[key] || key;

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
