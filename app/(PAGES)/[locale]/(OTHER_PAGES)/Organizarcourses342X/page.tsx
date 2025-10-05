// -------------------------------
// Server Component (Next.js Page)
// -------------------------------

import CourseManagement from "./CourseManagement";

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = params;
  return <CourseManagement locale={locale} />;
}
