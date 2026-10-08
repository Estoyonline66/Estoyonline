import { TranslationProvider } from "@/contexts/TranslationProvider";
import GoogleTrafficTracker from "@/components/GoogleTrafficTracker";
import FreeLessonTracker from "@/components/FreeLessonTracker";
import { Suspense } from "react";
import clsx from "clsx";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Public pages override this. Payment, administration and application result
// pages should never inherit indexable marketing-page metadata.
export const metadata: Metadata = {
  metadataBase: new URL("https://estoyonline.es"),
  title: "EstoyOnline.es",
  robots: { index: false, follow: false },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = (await headers()).get("x-site-locale") === "tr" ? "tr" : "en";
  return (
    <html lang={locale}>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=poppins@300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={clsx("bg-white max-h-screen", inter.className)}>
        <TranslationProvider initialLocale={locale}>
          <GoogleTrafficTracker />
          <Suspense fallback={null}><FreeLessonTracker /></Suspense>
          <main id="scroll-container" className="max-h-screen overflow-auto relative">
            {children}
          </main>
        </TranslationProvider>
      </body>
    </html>
  );
}
