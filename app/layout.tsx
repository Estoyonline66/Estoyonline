import { TranslationProvider } from "@/contexts/TranslationProvider";
import clsx from "clsx";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EstoyOnline.es - Learn Spanish naturally and enjoyably",
  description: "At our boutique school based in Barcelona, EstoyOnline.es, we teach Spanish in a way that's very different from traditional methods—through fun and enjoyment.  With our modern techniques, learning Spanish online becomes a truly enjoyable and engaging experience.",
  keywords: [
    "EstoyOnline",
    "learn Spanish online",
    "Spanish courses",
    "clases de español",
    "curso de español online",
    "profesores de idiomas",
    "language tutors",
    "educación en español",
    "aprendizaje de idiomas",
    "bilingual learning",
    "online language courses",
  ],
  openGraph: {
   title: "EstoyOnline.es - Learn Spanish naturally and enjoyably",
  description: "At our boutique school based in Barcelona, EstoyOnline.es, we teach Spanish in a way that's very different from traditional methods—through fun and enjoyment.  With our modern techniques, learning Spanish online becomes a truly enjoyable and engaging experience.",
    url: "https://estoyonline.es",
    siteName: "EstoyOnline.es",
    images: [
      {
        url: "https://your-image-host.com/path-to-image.png",
        width: 1200,
        height: 630,
        alt: "EstoyOnline.es - Learn Spanish naturally and enjoyably",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "",
	title: "EstoyOnline.es - Learn Spanish naturally and enjoyably",		
 description: "At our boutique school based in Barcelona, EstoyOnline.es, we teach Spanish in a way that's very different from traditional methods—through fun and enjoyment.  With our modern techniques, learning Spanish online becomes a truly enjoyable and engaging experience.",
    images: [
    "https://estoyonline.es/Images/logo.png",
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
              "@type": "OnlineSpanish",
              name: "EstoyOnline.es",
              url: "https://estoyonline.es",
              logo: "https://your-image-host.com/path-to-logo.png",
           description: "At our boutique school based in Barcelona, EstoyOnline.es, we teach Spanish in a way that's very different from traditional methods—through fun and enjoyment.  With our modern techniques, learning Spanish online becomes a truly enjoyable and engaging experience.",
              sameAs: [
                "https://www.instagram.com/estoyonline.es/"
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
