import en from "@/public/locales/en.json";
import tr from "@/public/locales/tr.json";

export const locales = ["en", "tr"] as const;
export type Locale = (typeof locales)[number];
export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}
// Use the same dictionaries for the server response and client hydration.
export const dictionaries = { en, tr };
export type LocalePageProps = { params: Promise<{ locale: string }> };
