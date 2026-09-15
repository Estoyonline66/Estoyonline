import type { Locale } from "@/lib/i18n";
import { pageStructuredData, type PublicRoute } from "@/lib/seo";

export default function PageStructuredData({ locale, route }: { locale: Locale; route: PublicRoute }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify(pageStructuredData(locale, route)).replace(/</g, "\\u003c"),
  }} />;
}
