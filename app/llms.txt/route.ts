import { pageDescription, pageUrl, publicRoutes, siteUrl } from "@/lib/seo";
import { locales } from "@/lib/i18n";

export function GET() {
  const sections = locales.map((locale) => [
    `## ${locale === "tr" ? "Türkçe" : "English"}`, "",
    ...publicRoutes.map((route) => {
      const { title, description } = pageDescription(locale, route);
      return `- [${title}](${pageUrl(locale, route)}): ${description}`;
    }),
  ].join("\n"));
  const body = [
    "# EstoyOnline.es", "",
    "> Online Spanish school based in Barcelona, with native Spanish-speaking teachers and lessons via Zoom. Public information is available in English and Turkish.", "",
    "> Barselona merkezli, ana dili İspanyolca olan öğretmenlerle Zoom üzerinden ders veren online İspanyolca okulu. Bilgiler Türkçe ve İngilizce olarak sunulur.", "",
    "The linked HTML pages are the authoritative source for current course descriptions, schedules, fees and teacher profiles. Their text is rendered on the server and can be read without JavaScript. Schedules and fees may change; use the current linked page.", "",
    "Güncel kurs açıklamaları, takvim, ücretler ve öğretmen bilgileri için bağlantılı HTML sayfalarını kullanın. Sayfa metinleri JavaScript gerektirmeden okunabilir. Takvim ve ücretler değişebilir; güncel bağlantılı sayfayı esas alın.", "",
    ...sections.flatMap((section) => [section, ""]),
    `## Sitemap\n\n- [Bilingual sitemap](${siteUrl}/sitemap.xml)`, "",
  ].join("\n");
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
