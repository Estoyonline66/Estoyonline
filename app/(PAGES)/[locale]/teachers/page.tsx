"use client"
import GeneralHero from "@/components/GeneralHero";
import Meta from "@/components/Meta";
import TeacherCard from "@/components/sections/Teachers/TeacherCard";
import { TeacherIcon } from "@/components/shapes";
import { useTranslation } from "@/contexts/TranslationProvider";
import { TeachersData } from "@/types/PropTypes";

export default function Teachers() {
  const { t } = useTranslation()
  const Data: TeachersData = t('teachers')
  const teachers = Data?.teacher || []

  return (
    <>
      <Meta route="/teachers"/>
    
     <GeneralHero icon={<TeacherIcon/>} text={Data.PageTitle}/>

     <section className="w-full flex items-center justify-center px-4 py-10 text-center">
        <strong className="font-bold text-base sm:text-xl lg:text-2xl max-w-xl">{Data.teachersTitle} <em className="text-secondary not-italic">{Data.teachersTitleRed}</em> {Data.teachersTitle2}</strong>
     </section>

     <ul className="w-full flex flex-col gap-10 px-4 md:px-10 lg:px-20 mb-10">
        {
          teachers.map((teach,ind)=><TeacherCard key={ind} teach={teach}/>)
        }
        {
          teachers.map((teach,ind)=><TeacherCard key={ind} teach={teach}/>)
        }
        {
          teachers.map((teach,ind)=><TeacherCard key={ind} teach={teach}/>)
        }
     </ul>
    </>
  );
}
