"use client"
import GeneralHero from "@/components/GeneralHero";
import Meta from "@/components/Meta";
import TeacherCard from "@/components/sections/Teachers/TeacherCard";
import { DoubleLeft, DoubleRight, TeacherIcon } from "@/components/shapes";
import { useTranslation } from "@/contexts/TranslationProvider";
import { TeachersData } from "@/types/PropTypes";
import { useState } from "react";

export default function Teachers() {
  const { t } = useTranslation();
  const Data: TeachersData = t("teachers");
  const teachers = Data?.teacher || [];
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  return (
    <>
      <Meta route="/teachers" />
    
      <GeneralHero icon={<TeacherIcon />} text={Data.PageTitle} />

      <section className="w-full flex items-center justify-center px-4 py-10 text-center">
        <strong className="font-bold text-base sm:text-xl lg:text-2xl ">
          {Data.teachersTitle} <em className="text-secondary not-italic">{Data.teachersTitleRed}</em> 
		   <br />
		  {Data.teachersTitle2}
        </strong>
      </section>

      <ul className="w-full flex flex-col gap-10 relative px-4 md:px-20 lg:px-40 mb-10">
        <span className="fixed pointer-events-none w-fit max-w-[20vw] -left-5 top-5 sm:h-screen block -z-10 overflow-x-hidden">
          <DoubleLeft className="h-full w-full"/>
        </span>
        <span className="fixed pointer-events-none w-fit max-w-[20vw] -right-0 top-10 sm:h-screen block -z-10 overflow-x-hidden">
          <DoubleRight className="h-full relative left-5"/>
        </span>
        {teachers.map((teach, ind) => (
          <TeacherCard
            key={ind}
            id={ind}
            teach={teach}
            activeVideo={activeVideo}
            onHover={(id) => {
              // Update activeVideo so that only the hovered video plays.
              if (activeVideo !== id) {
                setActiveVideo(id);
              }
            }}
          />
        ))}
      </ul>
    </>
  );
}
