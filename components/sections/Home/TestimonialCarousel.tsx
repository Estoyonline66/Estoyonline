"use client";
import ImageBox from "@/components/ImageBox";
import { Marquee } from "@/components/magicui/marquee";
import { AnimatedSunLogo } from "@/components/shapes/logo";
import { useTranslation } from "@/contexts/TranslationProvider";
import { TestimonialItem } from "@/types/PropTypes";
import { HeartIcon } from "lucide-react";

export default function TestimonialCarousel() {
  const { t } = useTranslation();
  const testimonialsData = t("testimonials");
  
  // Fallback verileri
  const defaultTestimonials = {
    title: "Öğrencilerimiz Ne Diyor?",
    items: [
      {
        image: "",
        firstComment: "",
        lastComment: "",
        personName: "",
        timeAgo: ""
      }
    ]
  };

  const { title, items: testimonials = [] } = testimonialsData || defaultTestimonials;

  return (
    <section className="w-full flex flex-col gap-10 items-center justify-center bg-white py-20 px-4 relative overflow-x-hidden md:px-10 lg:px-20 dark:bg-gray-800">
      <h3 className="font-bold text-xl sm:text-2xl lg:text-4xl text-center dark:text-white">
        {title}
      </h3>
      <AnimatedSunLogo
        svg={{
          className:
            "size-40 sm:size-60 absolute -top-20 left-[calc(100%-5rem)] z-0 sm:left-[calc(100%-7.5rem)] dark:opacity-20",
        }}
      />
      <div className="relative flex w-full flex-col items-center bg-white dark:bg-gray-700 justify-center z-[1] overflow-hidden">
        <Marquee pauseOnHover className="[--duration:50s]">
          {testimonials.map((testimony: TestimonialItem, index: number) => (
            <div
              key={index}
              className="relative h-full bg-white dark:bg-gray-600 w-fit max-w-[100vw] min-[300px]:max-w-[70vw] min-[498px]:max-w-80 cursor-pointer overflow-hidden rounded-xl border p-4 mx-0 dark:border-gray-500"
            >
              <div className="flex gap-2">
                <span className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                  <ImageBox
                    src={testimony.image}
                    className="w-full h-full object-cover object-center"
                  />
                </span>
                <div className="w-full flex flex-col gap-3">
                  <div className="w-full flex min-[360px]:items-center justify-between flex-col-reverse min-[360px]:flex-row">
                    <strong className="text-sm shrink max-w-full min-[360px]:max-w-[40%] break-words dark:text-white">
                      {testimony.personName}
                    </strong>
                    <span className="w-full justify-between min-[360px]:justify-start min-[360px]:w-fit flex items-center gap-2 shrink-0">
                      <em className="text-xs not-italic text-neutral-400 dark:text-gray-300">
                        {testimony.timeAgo}
                      </em>
                      <div className="flex items-center gap-2">
                        <HeartIcon
                          className="text-transparent w-5 h-5 shrink-0"
                          fill="#EB0004"
                          fillOpacity={30}
                        />
                        <span className="w-5 h-5 bg-neutral-300 dark:bg-gray-400 shrink-0 rounded-full"></span>
                      </div>
                    </span>
                  </div>
                  <p className="text-xs dark:text-gray-200">{testimony.firstComment}</p>
                  <div className="w-full flex items-center justify-between text-xs text-neutral-400 dark:text-gray-300 flex-wrap">
                    <p>Responder</p>
                    <p>Ocultar</p>
                    <p>Ver traduccion</p>
                  </div>
                  <div className="w-full flex flex-col items-center gap-2 text-center">
                    <strong className="text-sm dark:text-white">{testimony.personName}</strong>
                    <q className="text-xs dark:text-gray-300">{testimony.lastComment}</q>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}