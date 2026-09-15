import type { LocalePageProps } from "@/lib/i18n";
import { getPageLocale, pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/PageStructuredData";
import PageContent from "./page-content";
import { getCourseSchedule } from "@/lib/course-schedule";

export function generateMetadata(props: LocalePageProps) {
  return pageMetadata(props, "/courses");
}

export default async function Page(props: LocalePageProps) {
  const locale = await getPageLocale(props);
  const initialCourses = await getCourseSchedule(locale);
  return <>
    <PageStructuredData locale={locale} route="/courses" />
    <PageContent initialCourses={initialCourses} />
  </>;
}
