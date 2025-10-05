import CourseManagement from "./CourseManagement";

// ⚡ Burada params tipini gevşetiyoruz (Promise değil, unknown değil)
export default function Page({ params }: { params?: { locale?: string } }) {
  const locale = params?.locale ?? "en";
  return <CourseManagement locale={locale} />;
}
