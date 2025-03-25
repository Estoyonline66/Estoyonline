"use client";
import Accordion from "@/components/Accordion/Accordion";
import GeneralHero from "@/components/GeneralHero";
import Courses from "@/components/majors/Courses";
import Meta from "@/components/Meta";
import { BookIcon } from "@/components/shapes";
import { useTranslation } from "@/contexts/TranslationProvider";
import { CoursesData } from "@/types/PropTypes";

export default function Course() {
  const { t } = useTranslation();
  const Data: CoursesData = t("courses");

  return (
    <>
      <Meta route="/courses" />
      <GeneralHero icon={<BookIcon />} text={Data.PageTitle} />
      <div className="w-full flex flex-col justify-between gap-2 md:gap-5 pt-20">
        <Accordion />
        <Courses />
      </div>
    </>
  );
}
