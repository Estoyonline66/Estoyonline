"use client";
import Accordion from "@/components/Accordion/Accordion";
import GeneralHero from "@/components/GeneralHero";
import Courses from "@/components/sections/Courses/Courses";
import Meta from "@/components/Meta";
import { BookIcon, DoubleLeft, DoubleRight } from "@/components/shapes";
import { useTranslation } from "@/contexts/TranslationProvider";
import { CoursesData } from "@/types/PropTypes";

export default function Course() {
  const { t } = useTranslation();
  const Data: CoursesData = t("courses");

  return (
    <>
      <Meta route="/courses" />
      <GeneralHero icon={<BookIcon />} text={Data.PageTitle} />
      <div className="w-full flex flex-col justify-between gap-2 relative md:gap-5 pt-20">
        <span className="fixed pointer-events-none w-fit max-w-[20vw] -left-5 top-5 sm:h-screen block -z-10 overflow-x-hidden">
          <DoubleLeft className="h-full w-full" />
        </span>
        <span className="fixed pointer-events-none w-fit max-w-[20vw] -right-0 top-10 sm:h-screen block -z-10 overflow-x-hidden">
          <DoubleRight className="h-full relative left-5" />
        </span>
        
        <Accordion />
        <Courses />
      </div>
    </>
  );
}
