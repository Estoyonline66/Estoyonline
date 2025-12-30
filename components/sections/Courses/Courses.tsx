import React, { useEffect, useState } from "react";
import { useTranslation } from "@/contexts/TranslationProvider";
import { PriceData } from "@/types/PropTypes";

interface CourseCard {
  title: string;
  bold: string;
  lesson: string;
  time: string;
  week: string;
  month: string;
}

export default function Courses() {
  const { t, language } = useTranslation();
  const Data: PriceData = t("courses");

  const [cardCourses, setCardCourses] = useState<CourseCard[]>([]);

  useEffect(() => {
    const fetchCardCourses = async () => {
      const blobUrl =
        "https://iwvrsly8ro5bi96g.public.blob.vercel-storage.com/courses/courses-data.json";

      try {
        // 🔹 Hem İngilizce hem Türkçe sayfalar için blob'dan veri çek
        const res = await fetch(`${blobUrl}?_ts=${Date.now()}`, {
          cache: "no-cache",
        });
        if (!res.ok) throw new Error(`Blob fetch failed: ${res.status}`);
        const data = await res.json();
        
        if (language === "en") {
          // 🔹 İngilizce sayfa -> EN kısmını oku
          setCardCourses(data.cardCoursesEn || []);
        } else {
          // 🔹 Türkçe sayfa -> TR kısmını oku
          const coursesTr = data.cardCoursesTr || [];
          const cleanedCourses = coursesTr.map((course: any) => ({
            ...course,
            week: course.week
              .replace(" 1 saat 15 dk", "")
              .replace(" 2,5 saat", "")
              .replace(" 2 saat", "")
              .trim(),
          }));
          setCardCourses(cleanedCourses);
        }
      } catch (err) {
        console.error("Error fetching courses from blob:", err);
        // Fallback olarak JSON'daki veriyi kullan
        setCardCourses(Data?.cardCourses || []);
      }
    };

    fetchCardCourses();
  }, [language, Data]);

  return (
    <section className="w-full flex flex-col gap-5 py-20 px-5 md:px-20 lg:px-40 z-0">
      <h2 className="text-2xl font-bold mb-4">{Data?.scheduleTitle}</h2>

      {/* 🔹 Kurs Kartları */}
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-10 overflow-x-auto">
        {cardCourses.map((card, index) => (
          <li
            key={index}
            className="bg-[#FB2C3621] rounded-lg text-[#333] p-6 min-h-[160px] text-center shadow-lg scale-100 duration-300 hover:scale-105"
          >
            <h1 className="text-2xl font-semibold line-clamp-2 min-h-[3em] leading-normal">
              {card.title}
            </h1>
            <p className="text-md">
              <span className="font-bold">{card.bold}</span> {card.time}
            </p>
            <p className="text-md">{card.week}</p>
            <p className="text-md">
              <span>{card.lesson}</span>{" "}
              <span className="font-bold">{card.month}</span>
            </p>
          </li>
        ))}
      </ul>

      {/* 🔹 Seviyeler Bölümü */}
      <section className="relative bg-[#0068FF] w-full h-[85rem] flex justify-center items-center z-[-1]">
        <div className="absolute w-full h-full flex flex-col items-center py-20 gap-9 px-4">
          <h1 className="text-white text-2xl font-bold">{Data?.title}</h1>
          <ul className="text-white flex flex-col gap-9">
            {Data?.levels?.map((level, index) => (
              <li key={index} className="flex flex-col">
                <div className="flex flex-col">
                  <b className="pb-2">{level.title}</b>
                  {level.items.map((item, idx) => (
                    <p key={idx} className="font-light">
                      <span className="font-bold">{item.level}</span> &nbsp;
                      {item.duration} {item.book}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </section>
  );
}