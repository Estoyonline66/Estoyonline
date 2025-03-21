
import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { TranslationProvider } from "@/contexts/TranslationProvider";
import Footer from "@/components/footer/Footer";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        
        <TranslationProvider>
          <Navbar/>
          <main>{children}</main>
          <Footer/>
        </TranslationProvider>
      </body>
    </html>
  );
}
