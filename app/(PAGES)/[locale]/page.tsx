"use client"

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import Footer from "@/components/footer/Footer";
import Meta from "@/components/Meta";
import Navbar from "@/components/navbar/Navbar";
import AboutFounder from "@/components/sections/Home/AboutFounder";
import HomeHero from "@/components/sections/Home/Hero";
import JourneyCTA from "@/components/sections/Home/JourneyCTA";
import LearnSpanish from "@/components/sections/Home/LearnSpanish";
import RatindAndAchievements from "@/components/sections/Home/RatindAndAchievements";
import TestimonialCarousel from "@/components/sections/Home/TestimonialCarousel";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Eğer saat dilimi Europe/Istanbul ise ve sayfa /tr değilse, yönlendir
    if (timezone === 'Europe/Istanbul' && !pathname.startsWith('/tr')) {
      router.replace('/tr');
    }

    // İsteğe bağlı: İstanbul dışıysa ve sayfa /tr ise → /en'e yönlendir
    // if (timezone !== 'Europe/Istanbul' && pathname.startsWith('/tr')) {
    //   router.replace('/en');
    // }
  }, []);

  return (
    <>
      <Navbar isHome />
      <Meta route="/" />
      <HomeHero />
      <LearnSpanish />
      <AboutFounder />
      <JourneyCTA />
      <TestimonialCarousel />
      <RatindAndAchievements />
      <Footer />
    </>
  );
}
