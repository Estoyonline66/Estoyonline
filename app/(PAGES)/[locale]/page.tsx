import AboutFounder from "@/components/sections/Home/AboutFounder";
import HomeHero from "@/components/sections/Home/Hero";
import JourneyCTA from "@/components/sections/Home/JourneyCTA";
import LearnSpanish from "@/components/sections/Home/LearnSpanish";
import RatindAndAchievements from "@/components/sections/Home/RatindAndAchievements";
import TestimonialCarousel from "@/components/sections/Home/TestimonialCarousel";

export default async function Home() {
  return (
    <>
      <HomeHero />

      <LearnSpanish />

      <AboutFounder />

      <JourneyCTA />

      <TestimonialCarousel />

      <RatindAndAchievements />
    </>
  );
}
