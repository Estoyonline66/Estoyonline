import { TranslationProvider } from "@/contexts/TranslationProvider";
import clsx from "clsx";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EstoyOnline.co - Aprende Español e Inglés con Profesores Expertos",
  description: "Domina el español e inglés con cursos interactivos, clases en vivo y recursos personalizados.",
  keywords: [
    "EstoyOnline",
    "learn Spanish",
    "learn English",
    "Spanish courses",
    "English courses",
    "clases de español",
    "clases de inglés",
    "curso de español online",
    "curso de inglés online",
    "profesores de idiomas",
    "language tutors",
    "educación en español",
    "aprendizaje de idiomas",
    "bilingual learning",
    "online language courses",
  ],
  openGraph: {
    title: "EstoyOnline.co - Aprende Español e Inglés con Expertos",
    description: "Mejora tu español e inglés con clases en línea, materiales interactivos y ejercicios prácticos.",
    url: "https://estoyonline.co",
    siteName: "EstoyOnline.co",
    images: [
      {
        url: "https://your-image-host.com/path-to-image.png",
        width: 1200,
        height: 630,
        alt: "EstoyOnline - Aprende español e inglés en línea",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@EstoyOnline",
    title: "EstoyOnline.co - Aprende Español e Inglés de Forma Divertida y Efectiva",
    description: "Únete a nuestra comunidad y mejora tu español e inglés con profesores calificados.",
    images: [
      "https://your-image-host.com/path-to-image.png",
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

        {/* Structured Data for Bilingual Education */}
        {/* Note these will be corected to the actual domain tags */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "EstoyOnline.co",
              url: "https://estoyonline.co",
              logo: "https://your-image-host.com/path-to-logo.png",
              description:
                "Plataforma educativa para aprender español e inglés con clases en vivo y recursos interactivos.",
              sameAs: [
                "https://www.facebook.com/EstoyOnline",
                "https://twitter.com/EstoyOnline",
                "https://www.instagram.com/EstoyOnline",
              ],
              languages: ["es", "en"],
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
