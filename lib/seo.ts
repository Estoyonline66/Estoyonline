import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dictionaries, isLocale, type Locale, type LocalePageProps } from "@/lib/i18n";

export const siteUrl = "https://estoyonline.es";
export const publicRoutes = ["/", "/courses", "/teachers", "/videos", "/price", "/contact", "/freecourse"] as const;
export type PublicRoute = (typeof publicRoutes)[number];

export function pageUrl(locale: Locale, route: PublicRoute) {
  return `${siteUrl}/${locale}${route === "/" ? "" : route}`;
}

export async function getPageLocale({ params }: LocalePageProps): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export function pageDescription(locale: Locale, route: PublicRoute) {
  const existing = dictionaries[locale].seo.pages.find((page) => page.route === route)?.datas;
  if (existing) return existing;
  return locale === "tr"
    ? { title: "EstoyOnline | Ücretsiz online İspanyolca kursu", description: "Başlangıç seviyesindeki öğrenciler için ücretsiz online İspanyolca mini kursu. Kayıt ve Zoom ders bilgileri için WhatsApp üzerinden iletişime geçin." }
    : { title: "EstoyOnline | Free online Spanish course", description: "A free online Spanish mini course for beginners. Contact the school on WhatsApp for registration, Zoom lesson links and course materials." };
}

export function languageAlternates(route: PublicRoute) {
  return { en: pageUrl("en", route), tr: pageUrl("tr", route), "x-default": pageUrl("en", route) };
}

export async function pageMetadata(props: LocalePageProps, route: PublicRoute): Promise<Metadata> {
  const locale = await getPageLocale(props);
  const { title, description } = pageDescription(locale, route);
  const url = pageUrl(locale, route);
  return {
    title, description,
    alternates: { canonical: url, languages: languageAlternates(route) },
    robots: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
    openGraph: {
      title, description, url, siteName: "EstoyOnline.es", type: "website",
      locale: locale === "tr" ? "tr_TR" : "en_GB",
      alternateLocale: locale === "tr" ? "en_GB" : "tr_TR",
      images: [{ url: `${siteUrl}/Images/estoyonline_sun.png`, alt: "EstoyOnline.es" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${siteUrl}/Images/estoyonline_sun.png`] },
  };
}

export function pageStructuredData(locale: Locale, route: PublicRoute) {
  const data = dictionaries[locale];
  const url = pageUrl(locale, route);
  const { title, description } = pageDescription(locale, route);
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "EducationalOrganization", "@id": organizationId,
      name: "EstoyOnline.es", url: siteUrl,
      logo: `${siteUrl}/Images/estoyonline_sun.png`,
      description: data.home.LearnSpanishdescription,
      sameAs: [data.contact.instagramlink],
      address: {
        "@type": "PostalAddress", streetAddress: "Avenida Arquitecto Eduard Ferrés 12",
        postalCode: "08340", addressLocality: "Vilassar de Mar", addressRegion: "Barcelona", addressCountry: "ES",
      },
      contactPoint: { "@type": "ContactPoint", contactType: "customer service", telephone: "+34 633 45 22 68", url: data.contact.whatsapplink, availableLanguage: ["Turkish", "English", "Spanish"] },
    },
    { "@type": "WebSite", "@id": websiteId, url: siteUrl, name: "EstoyOnline.es", inLanguage: ["en", "tr"], publisher: { "@id": organizationId } },
    {
      "@type": route === "/contact" ? "ContactPage" : route === "/" || route === "/freecourse" ? "WebPage" : "CollectionPage",
      "@id": `${url}#webpage`, url, name: title, description, inLanguage: locale,
      isPartOf: { "@id": websiteId }, about: { "@id": organizationId },
      ...(["/courses", "/teachers"].includes(route) ? { mainEntity: { "@id": `${url}#${route.slice(1)}` } } : {}),
    },
  ];
  // Use only courses and profiles actually available on the page. Do not invent
  // reviews, qualifications, prices, video dates or credential claims.
  if (route === "/courses") {
    graph.push({
      "@type": "ItemList", "@id": `${url}#courses`,
      itemListElement: data.courses.accordionData.map((course, index) => ({
        "@type": "ListItem", position: index + 1,
        item: { "@type": "Course", name: course.title, description: course.content[0].contentDescription, inLanguage: locale, provider: { "@id": organizationId } },
      })),
    });
  }
  if (route === "/teachers") {
    graph.push({
      "@type": "ItemList", "@id": `${url}#teachers`,
      itemListElement: data.teachers.teacher.map((teacher, index) => ({
        "@type": "ListItem", position: index + 1,
        item: { "@type": "Person", name: teacher.name, description: teacher.about, worksFor: { "@id": organizationId } },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
