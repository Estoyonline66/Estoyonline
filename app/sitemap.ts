import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { languageAlternates, pageUrl, publicRoutes } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [...publicRoutes.flatMap((route) => locales.map((locale) => ({
    url: pageUrl(locale, route), alternates: { languages: languageAlternates(route) },
  }))), { url: "https://estoyonline.es/en/free-lesson" }];
}
