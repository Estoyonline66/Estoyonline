import GeneralHero from "@/components/GeneralHero";
import TeacherCard from "@/components/sections/Teachers/TeacherCard";
import { TeacherIcon } from "@/components/shapes";

export default function Teachers() {
  const teachers = [
    {
      name: "DIANA MELISSA",
      about: "Born and raised in Colombia, she currently lives in Colombia. She has worked as a librarian and taught library services at all levels. He completed his master's degree in Béziers, France. Melissa learned Turkish a long time ago and speaks Turkish at an advanced level. Since 2010, she has taught French, English and Spanish in various academies (Oxford, Just English) and schools in Turkey (ISTEK in Antalya, Kütahya Başarı, etc.). In her spare time, she enjoys knitting dolls, singing with her friends, and cooking. Our school offers A1 beginner courses that require Turkish support."
    },
    {
      name: "ALEJA",
      about: `She lived in Istanbul for 10 years, working as a teacher at Saint Michel High School and Cervantes Institute. She organized the "Solo hablamos Español" meetings that brought together those who wanted to practice Spanish. During her teaching career, she improved herself with many international formation courses such as ELE, DELE, AVE, Int House, etc. She moved to Spain in 2019 and decided to establish her own school. She developed modern methods for her school, based on fun and conversation. He continues to improve the educational processes together with the teachers in his team.`
    },
    {
      name: "ANITA",
      about: `Anita is from Ecuador. She graduated from the Universidad de las Américas in Quito with a degree in Communication. She also holds a certificate in Spanish language teaching grammar and methodology. She worked as a teacher at the Instituto Internacional de Español, gaining experience in teaching Spanish to foreigners. She worked in institutions such as Istanbul Just English, British Town Language Schools, Likia Just Kids, etc. She taught Turkish students at all levels. In recent years, she started giving private and group online lessons to students from different countries, thus she had the opportunity to integrate with different cultures.`
    }
  ]
  return (
    <>
     <GeneralHero icon={<TeacherIcon/>} text="Teachers"/>

     <section className="w-full flex items-center justify-center px-4 py-10 text-center">
      <strong className="font-bold text-base sm:text-xl lg:text-2xl max-w-xl">Learn <em className="text-secondary not-italic">Spanish online</em> with native teachers and let the sun warm your words</strong>
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
