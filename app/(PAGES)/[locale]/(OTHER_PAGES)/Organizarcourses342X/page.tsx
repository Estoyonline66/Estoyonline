import CourseManagement from "./CourseManagement";

// 🚀 Tip kontrolünü gevşetiyoruz
export default function Page(props: any) {
  const locale = props?.params?.locale ?? "en";
  return <CourseManagement locale={locale} />;
}
