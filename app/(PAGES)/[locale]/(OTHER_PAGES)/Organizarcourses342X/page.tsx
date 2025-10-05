import CourseManagement from "./CourseManagement";

export default function Page(props: unknown) {
  const params = (props as { params?: { locale?: string } }).params;
  const locale = params?.locale ?? "en";
  return <CourseManagement locale={locale} />;
}
