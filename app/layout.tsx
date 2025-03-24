import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { TranslationProvider } from "@/contexts/TranslationProvider";
import Footer from "@/components/footer/Footer";
import { Inter } from "next/font/google";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={
        clsx(
          "bg-white max-h-screen",
          inter.className
        )
      }>
        <TranslationProvider>
          <main id="scroll-container" className="max-h-screen overflow-auto relative">
          <Navbar/>
          {children}
          <Footer/>
          </main>
          
        </TranslationProvider>
      </body>
    </html>
  );
}
