import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, Video } from "lucide-react";
import GeneralHero from "@/components/GeneralHero";
import { DoubleLeft, DoubleRight, TeacherIcon } from "@/components/shapes";
import type { LocalePageProps } from "@/lib/i18n";
import { siteUrl } from "@/lib/seo";

const title = "Free Spanish Trial Lesson with Meli | EstoyOnline";
const description = "Free beginner Spanish lesson with Meli, a real native Spanish-speaking teacher, not AI. Live online on Monday, 12 October at 19:00 UK time.";
const poster = "/Images/free-spanish-trial-lesson.png";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteUrl}/en/free-lesson` },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/en/free-lesson`,
    type: "website",
    locale: "en_GB",
    images: [{ url: `${siteUrl}${poster}`, width: 1122, height: 1402, alt: "Free Spanish trial lesson with Meli" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [`${siteUrl}${poster}`] },
};

export default async function FreeLesson({ params }: LocalePageProps) {
  const { locale } = await params;
  if (locale !== "en") notFound();

  return (
    <main>
      <GeneralHero icon={<TeacherIcon />} text="Free Lesson" />

      <section className="w-full px-4 py-10 text-center">
        <h2 className="font-bold text-xl lg:text-2xl">
          Your <em className="text-secondary not-italic">free Spanish trial lesson</em>
          <br />
          Beginner level · With Meli
        </h2>
        <p className="mt-4 text-base sm:text-lg">
          Learn live with a real native Spanish-speaking teacher, not AI.
        </p>
      </section>

      <section aria-label="Free lesson details" className="relative isolate mx-auto mb-16 w-full max-w-7xl px-4 md:px-20 lg:px-40">
        <span aria-hidden="true" className="pointer-events-none absolute -left-5 top-5 -z-10 h-full max-w-[20vw] overflow-hidden">
          <DoubleLeft className="h-full w-full" />
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute right-0 top-10 -z-10 h-full max-w-[20vw] overflow-hidden">
          <DoubleRight className="relative left-5 h-full w-full" />
        </span>

        <div className="flex flex-col items-center justify-center gap-10 md:flex-row-reverse">
          <Image
            src={poster}
            alt="EstoyOnline.es announcement: free Spanish trial lesson, beginner level, with Meli. Monday, 12 October, 19:00 UK. Live online class."
            width={1122}
            height={1402}
            priority
            sizes="(max-width: 767px) 100vw, 480px"
            className="h-auto w-full max-w-lg rounded-md shadow-md md:w-1/2"
          />
          <div className="w-full min-w-0 md:w-1/2">
            <h3 className="font-inkfree text-2xl font-extrabold uppercase text-secondary">With Meli</h3>
            <p className="mt-4 text-base leading-relaxed lg:text-lg">
              Join Meli, a native Spanish-speaking teacher, for a free Spanish trial lesson for beginners, live online.
              {" "}Meli is a real person, not an AI tutor. You will practise Spanish with her in real time.
            </p>
            <dl className="mt-6 space-y-5 text-base lg:text-lg">
              <div className="rounded-xl bg-primary/20 p-4">
                <dt className="font-semibold">Level</dt>
                <dd>Beginner</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 font-semibold"><CalendarDays aria-hidden="true" className="size-5 text-secondary" />Date</dt>
                <dd className="mt-1">Monday, 12 October</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 font-semibold"><Clock aria-hidden="true" className="size-5 text-secondary" />Time</dt>
                <dd className="mt-1">19:00 UK time</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 font-semibold"><Video aria-hidden="true" className="size-5 text-secondary" />Format</dt>
                <dd className="mt-1">Live online class</dd>
              </div>
              <div>
                <dt className="font-semibold">Price</dt>
                <dd className="font-bold text-secondary">Free</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </main>
  );
}
