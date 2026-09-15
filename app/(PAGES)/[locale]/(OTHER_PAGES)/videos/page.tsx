import type { LocalePageProps } from "@/lib/i18n";
import { getPageLocale, pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import PageContent from "./page-content";

export function generateMetadata(props: LocalePageProps) {
  return pageMetadata(props, "/videos");
}

export default async function Page(props: LocalePageProps) {
  const locale = await getPageLocale(props);
  return <>
    <PageStructuredData locale={locale} route="/videos" />
    <PageContent />
  </>;
}
