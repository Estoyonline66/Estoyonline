import { TranslationProvider } from "@/contexts/TranslationProvider";
import clsx from "clsx";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EstoyOnline.es - Enjoy learning Spanish naturally",
  description:
    "At our boutique school based in Barcelona, EstoyOnline.es, we teach Spanish in a way that's very different from traditional methods—through fun and enjoyment. With our modern techniques, learning Spanish online becomes a truly enjoyable and engaging experience.",
  keywords: [
    // English
    "EstoyOnline",
    "learn Spanish online",
    "online Spanish courses",
    "Spanish classes online",
    "Spanish language school",
    "native Spanish teachers",
    "Spanish conversation practice",
    "online Spanish lessons",
    "speak Spanish fluently",
    "bilingual education",
    "Spanish learning platform",
    "study Spanish online",
    "fun Spanish classes",
    "modern Spanish learning",
    "affordable Spanish classes",
    "private Spanish lessons online",
    "best Spanish tutors",
    "Spanish speaking practice online",
    "how to learn Spanish fast",
    "Spanish for beginners",
    "Spanish for travelers",
    "interactive Spanish classes",
    "small group Spanish classes",
    "personalized Spanish courses",
    "flexible Spanish lessons",
    "conversational Spanish online",
    "Spanish immersion programs",
    "live Spanish classes online",
    "learn conversational Spanish",
    "improve Spanish speaking skills",
    // Turkish
    "online İspanyolca öğren",
    "İspanyolca kursları",
    "internet üzerinden İspanyolca dersi",
    "İspanyolca dil okulu",
    "anadili İspanyolca olan öğretmenler",
    "İspanyolca konuşma pratiği",
    "çevrimiçi İspanyolca dersleri",
    "akıcı İspanyolca konuşmak",
    "çift dilli eğitim",
    "İspanyolca öğrenme platformu",
    "internetten İspanyolca çalış",
    "eğlenceli İspanyolca dersleri",
    "modern İspanyolca öğrenimi",
    "uygun fiyatlı İspanyolca kursları",
    "online özel İspanyolca dersleri",
    "en iyi İspanyolca öğretmenleri",
    "çevrimiçi İspanyolca konuşma pratiği",
    "hızlı İspanyolca öğrenme yöntemleri",
    "yeni başlayanlar için İspanyolca",
    "seyahat için İspanyolca",
    "etkileşimli İspanyolca dersleri",
    "küçük grup İspanyolca dersleri",
    "kişiye özel İspanyolca kursları",
    "esnek İspanyolca ders programı",
    "konuşmaya yönelik İspanyolca eğitimi",
    "İspanyolca dil daldırma programları",
    "canlı İspanyolca dersleri",
    "günlük İspanyolca pratik yap",
    "İspanyolca konuşma becerilerini geliştirme",
  ],
  openGraph: {
    title: "EstoyOnline.es - Enjoy learning Spanish naturally",
    description:
      "At our boutique school based in Barcelona, EstoyOnline.es, we teach Spanish in a way that's very different from traditional methods—through fun and enjoyment. With our modern techniques, learning Spanish online becomes a truly enjoyable and engaging experience.",
    url: "https://estoyonline.es",
    siteName: "EstoyOnline.es",
    images: [
      {
        url: "https://estoyonline.es/Images/estoyonline_sun.png", // düzenlendi (senin örneğinde eksikti)
        width: 1200,
        height: 630,
        alt: "EstoyOnline.es - Enjoy learning Spanish naturally",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@estoyonline", // twitter handle eklendi
    title: "EstoyOnline.es - Enjoy learning Spanish naturally",
    description:
      "At our boutique school based in Barcelona, EstoyOnline.es, we teach Spanish in a way that's very different from traditional methods—through fun and enjoyment. With our modern techniques, learning Spanish online becomes a truly enjoyable and engaging experience.",
    images: [
      "https://estoyonline.es/Images/estoyonline_sun.png",
    ],
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        {/* Font Styles */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=poppins@300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "EstoyOnline.es",
              url: "https://estoyonline.es",
              logo: "https://estoyonline.es/Images/estoyonline_sun.png",
              description:
                "At our boutique school based in Barcelona, EstoyOnline.es, we teach Spanish in a way that's very different from traditional methods—through fun and enjoyment. With our modern techniques, learning Spanish online becomes a truly enjoyable and engaging experience.",
              sameAs: [
                "https://www.instagram.com/estoyonline.es/",  "https://www.instagram.com/estoyonline_spanish/",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Barcelona",
                addressCountry: "ES",
              },
            languages: ["en", "tr"],
              subjectOf: {
                "@type": "EducationalOccupationalProgram",
                name: "Spanish Language Learning Online",
                educationalProgramMode: "online",
                programPrerequisites: "Beginner, Intermediate, Advanced",
                educationalCredentialAwarded: "Spanish Language Proficiency",
                keywords: [
                  // Full keywords (same as in metadata)
                  "EstoyOnline",
                  "learn Spanish online",
                  "online Spanish courses",
                  "Spanish classes online",
                  "Spanish language school",
                  "native Spanish teachers",
                  "Spanish conversation practice",
                  "online Spanish lessons",
                  "speak Spanish fluently",
                  "bilingual education",
                  "Spanish learning platform",
                  "study Spanish online",
                  "fun Spanish classes",
                  "modern Spanish learning",
                  "affordable Spanish classes",
                  "private Spanish lessons online",
                  "best Spanish tutors",
                  "Spanish speaking practice online",
                  "how to learn Spanish fast",
                  "Spanish for beginners",
                  "Spanish for travelers",
                  "interactive Spanish classes",
                  "small group Spanish classes",
                  "personalized Spanish courses",
                  "flexible Spanish lessons",
                  "conversational Spanish online",
                  "Spanish immersion programs",
                  "live Spanish classes online",
                  "learn conversational Spanish",
                  "improve Spanish speaking skills",
                  "online İspanyolca öğren",
                  "İspanyolca kursları",
                  "internet üzerinden İspanyolca dersi",
                  "İspanyolca dil okulu",
                  "anadili İspanyolca olan öğretmenler",
                  "İspanyolca konuşma pratiği",
                  "çevrimiçi İspanyolca dersleri",
                  "akıcı İspanyolca konuşmak",
                  "çift dilli eğitim",
                  "İspanyolca öğrenme platformu",
                  "internetten İspanyolca çalış",
                  "eğlenceli İspanyolca dersleri",
                  "modern İspanyolca öğrenimi",
                  "uygun fiyatlı İspanyolca kursları",
                  "online özel İspanyolca dersleri",
                  "en iyi İspanyolca öğretmenleri",
                  "çevrimiçi İspanyolca konuşma pratiği",
                  "hızlı İspanyolca öğrenme yöntemleri",
                  "yeni başlayanlar için İspanyolca",
                  "seyahat için İspanyolca",
                  "etkileşimli İspanyolca dersleri",
                  "küçük grup İspanyolca dersleri",
                  "kişiye özel İspanyolca kursları",
                  "esnek İspanyolca ders programı",
                  "konuşmaya yönelik İspanyolca eğitimi",
                  "İspanyolca dil daldırma programları",
                  "canlı İspanyolca dersleri",
                  "günlük İspanyolca pratik yap",
                  "İspanyolca konuşma becerilerini geliştirme",
                ],
              },
            }),
          }}
        />
      </head>
      <body className={clsx("bg-white max-h-screen", inter.className)}>
        <TranslationProvider>
          <main id="scroll-container" className="max-h-screen overflow-auto relative">
            {children}
          </main>
        </TranslationProvider>
      </body>
    </html>
  );
}
