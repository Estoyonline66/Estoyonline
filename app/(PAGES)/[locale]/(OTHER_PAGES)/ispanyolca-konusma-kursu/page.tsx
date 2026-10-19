import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Clock } from "lucide-react";
import GeneralHero from "@/components/GeneralHero";
import { MessagePhone, TeacherIcon } from "@/components/shapes";
import { Button } from "@/components/ui/button";
import type { LocalePageProps } from "@/lib/i18n";
import { siteUrl } from "@/lib/seo";

const title = "Meli ile İspanyolca Konuşma Kursu | EstoyOnline";
const description = "A1.1, A1.2 ve A2.1 seviyeleri için gerçek öğretmen Meli ile İspanyolca konuşma kursu. Başlangıç: 22 Ekim Perşembe, saat 19:30.";
const poster = "/Images/ispanyolca-konusma-kursu-22-ekim.jpg";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  alternates: { canonical: `${siteUrl}/tr/ispanyolca-konusma-kursu` },
  openGraph: {
    title, description, type: "website", locale: "tr_TR",
    url: `${siteUrl}/tr/ispanyolca-konusma-kursu`,
    images: [{ url: `${siteUrl}${poster}`, width: 941, height: 1672, alt: "Meli ile İspanyolca konuşma kursu afişi" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [`${siteUrl}${poster}`] },
};

export default async function KonusmaKursu({ params }: LocalePageProps) {
  if ((await params).locale !== "tr") notFound();

  return (
    <main>
      <GeneralHero icon={<TeacherIcon />} text="Konuşma Kursu" />
      <section className="px-4 py-10 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">Meli ile <span className="text-secondary">İspanyolca Konuşma Kursu</span></h2>
        <p className="mt-4 text-lg">Yapay zekâ değil, gerçek öğretmen Meli ile!</p>
      </section>
      <section aria-label="Kurs bilgileri ve afiş" className="mx-auto mb-16 grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:px-10">
        <div className="min-w-0">
          <h3 className="text-2xl font-bold">İspanyolca konuşma pratiği yapın</h3>
          <p className="mt-4 text-lg leading-relaxed">A1.1, A1.2 ve A2.1 seviyelerine yönelik konuşma kursunda Meli ile İspanyolca pratiği yapın.</p>
          <dl className="mt-6 space-y-6 text-lg">
            <div className="rounded-xl bg-primary/20 p-5">
              <dt className="font-semibold">Seviyeler</dt>
              <dd className="mt-1">A1.1 · A1.2 · A2.1</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 font-semibold"><CalendarDays aria-hidden="true" className="size-5 text-secondary" />Başlangıç tarihi</dt>
              <dd className="mt-1">22 Ekim Perşembe</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 font-semibold"><Clock aria-hidden="true" className="size-5 text-secondary" />Saat</dt>
              <dd className="mt-1">19:30</dd>
            </div>
            <div>
              <dt className="font-semibold">Öğretmen</dt>
              <dd className="mt-1">Meli — yapay zekâ değil, gerçek öğretmen</dd>
            </div>
          </dl>
          <div className="mt-8">
            <Button asChild variant="secondary" className="styledButton secondary !h-auto !px-6 !py-4 !text-base">
              <a href="https://wa.me/34633452268" target="_blank" rel="noopener noreferrer">
                <MessagePhone svg={{ className: "size-5" }} path={{ fill: "var(--styledButtonHoveredTextColor)" }} />
                Hemen Kaydol
              </a>
            </Button>
            <p className="mt-3 text-sm">Bilgi ve kayıt için WhatsApp: +34 633 45 22 68</p>
          </div>
        </div>
        <Image src={poster} width={941} height={1672} priority sizes="(max-width: 767px) 100vw, 560px"
          className="mx-auto h-auto w-full max-w-lg rounded-xl shadow-md"
          alt="İspanyolca Konuşma Kursu. A1.1, A1.2 ve A2.1 seviyeleri. Yapay zekâ değil, gerçek öğretmen Meli ile. Başlangıç: 22 Ekim Perşembe, saat 19:30. Kayıt: WhatsApp +34 633 45 22 68. estoyonline.es/tr." />
      </section>
    </main>
  );
}
