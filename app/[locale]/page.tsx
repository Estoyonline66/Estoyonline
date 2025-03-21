"use client"

import { useTranslation } from "@/contexts/TranslationProvider";


export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h2 className="text-2xl font-bold">{t("welcome")}</h2>
      <p className="text-lg">{t("hello")}!</p>
    </div>
  );
}
