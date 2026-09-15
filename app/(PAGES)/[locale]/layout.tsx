import { notFound } from "next/navigation";
import { isLocale, type LocalePageProps } from "@/lib/i18n";

export default async function LocaleLayout({
  children, params,
}: LocalePageProps & { children: React.ReactNode }) {
  if (!isLocale((await params).locale)) notFound();
  return children;
}
