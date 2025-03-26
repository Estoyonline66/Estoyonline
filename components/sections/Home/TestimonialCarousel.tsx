"use client";
import ImageBox from "@/components/ImageBox";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import clsx from "clsx";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, HeartIcon } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "@/contexts/TranslationProvider";
import { HomeProps } from "@/types/PropTypes";

export default function TestimonialCarousel() {
  const plugin = useRef(Autoplay({ stopOnInteraction: true }));
  const { t } = useTranslation()
  const Data: HomeProps = t('home')
  const defaultData = {
    "testimonies": "Lo que nuestros clientes dicen sobre nosotros",
  };
  const testimonials: {
    image: string;
    firstComment: string;
    lastComment: string;
    personName: string;
  }[] = [
    {
      image: "/Images/testimonialImage (3).png",
      firstComment:
        "İspanyolca öğrenmenin bu kadar keyifli olduğunu bilseydim çok daha önce başlardım 🥰 her dersi sabırsızlıkla bekliyorum iyi ki tanıdım sizleri 🌺🌺",
      lastComment: "If I had known that learning Spanish was this enjoyable",
      personName: "yasemen.avsar",
    },
    {
      image: "/Images/testimonialImage (2).png",
      firstComment:
        "Aleja ve onun öğretme yöntemini hep çok sevdim ve bir öğretmenin nasıl olması, nasıl eğlenerek öğretmesi konusunda hep onu örnek veririm 😍",
      lastComment: "I have always loved Aleja and her teaching method.",
      personName: "umaysirke",
    },
    {
      image: "/Images/testimonialImage (1).png",
      firstComment:
        "Yıllar önce tanıştığım Aleja ve ekibi sayesinde İspanyolcayı rahatça konuşabilecek ve okuyabilecek şekilde ilerlettim. B1.4 seviyesine kadar sadece bu okuldan ders alarak geldim",
      lastComment: "Thanks to Aleja and her team, whom I met years ago",
      personName: "ugurege",
    },
  ];

  const carouselContent = useRef<HTMLDivElement>(null)

  return (
    <section className="w-full flex flex-col gap-10 items-center justify-center py-20 px-4 relative overflow-x-hidden md:px-10 lg:px-20">
      <h3 className="font-bold text-xl sm:text-2xl lg:text-4xl text-center">
        {Data.testimonies?Data.testimonies:defaultData.testimonies}
      </h3>
      <Carousel plugins={[plugin.current]} className="w-full *:first:!w-full *:first:!max-w-full">
        <CarouselContent ref={carouselContent} className={
          clsx(
            "-ml-1 gap-3 lg:!grid",
            `lg:grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] md:place-items-center`
          )
        }>
          {testimonials.map((testimony, index) => (
            <CarouselItem
              key={index}
              style={{
                minHeight: `${carouselContent.current?.clientHeight}px`
              }}
              className="p-3 rounded-md border h-full basis-[80vw] min-[498px]:basis-[300px]"
            >
              <div className="flex gap-2">
                {/* image */}
                <span className="size-14 rounded-full overflow-hidden shrink-0">
                  <ImageBox
                    src={testimony.image}
                    className="size-full object-cover object-center"
                  />
                </span>
                {/* content */}
                <div className="w-full flex flex-col gap-3">
                  <div className="w-full flex items-center justify-between flex-col-reverse min-[300px]:flex-row">
                    <strong className="text-sm">{testimony.personName}</strong>
                    <span className="flex items-center gap-2 shrink-0">
                      <em className="text-xs shrink-0 not-italic text-neutral-400">
                        20 mins
                      </em>
                      <HeartIcon
                        className="text-transparent size-5 shrink-0"
                        fill="#EB0004"
                        fillOpacity={30}
                      />
                      <span className="size-5 bg-neutral-300 shrink-0 rounded-full"></span>
                    </span>
                  </div>
                  <p className="text-xs">{testimony.firstComment}</p>
                  <div className="w-full flex items-center justify-between text-xs text-neutral-400 flex-wrap">
                    <p>Responder</p>
                    <p>Ocultar</p>
                    <p>Ver traduccion</p>
                  </div>
                  <div className="w-full flex flex-col items-center gap-2 text-center">
                    <strong className="text-sm">{testimony.personName}</strong>
                    <q className="text-xs">{testimony.lastComment}</q>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 size-12 sm:-left-5 !bg-neutral-700">
          <ChevronLeft className="bg-white rounded-full size-[50%]" />
        </CarouselPrevious>
        <CarouselNext className="right-0 size-12 sm:left-[calc(100%+(var(--spacing)_*_-2))] !bg-neutral-700">
          <ChevronRight className="bg-white rounded-full size-[50%]" />
        </CarouselNext>
      </Carousel>
    </section>
  );
}
