"use client";
import ImageBox from "@/components/ImageBox";
import { Marquee } from "@/components/magicui/marquee";
import { useTranslation } from "@/contexts/TranslationProvider";
import { HomeProps } from "@/types/PropTypes";
import { HeartIcon } from "lucide-react";

export default function TestimonialCarousel() {
  const { t } = useTranslation();
  const Data: HomeProps = t("home");
  const defaultData = {
    testimonies: "Lo que nuestros clientes dicen sobre nosotros",
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


  return (
    <section className="w-full flex flex-col gap-10 items-center justify-center py-20 px-4 relative overflow-x-hidden md:px-10 lg:px-20">
      <h3 className="font-bold text-xl sm:text-2xl lg:text-4xl text-center">
        {Data.testimonies ? Data.testimonies : defaultData.testimonies}
      </h3>
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:20s]">
          {testimonials.map((testimony, index) => (
            <div
              key={index}
              className="relative h-full w-fit max-w-[100vw] min-[300px]:max-w-[70vw] min-[498px]:max-w-72 cursor-pointer overflow-hidden rounded-xl border p-4 mx-0"
            >
              <div className="flex gap-2">
                {/* Image */}
                <span className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                  <ImageBox
                    src={testimony.image}
                    className="w-full h-full object-cover object-center"
                  />
                </span>
                {/* Content */}
                <div className="w-full flex flex-col gap-3">
                  <div className="w-full flex items-center justify-between flex-col-reverse sm:flex-row">
                    <strong className="text-sm">{testimony.personName}</strong>
                    <span className="flex items-center gap-2 shrink-0">
                      <em className="text-xs not-italic text-neutral-400">
                        20 mins
                      </em>
                      <HeartIcon
                        className="text-transparent w-5 h-5 shrink-0"
                        fill="#EB0004"
                        fillOpacity={30}
                      />
                      <span className="w-5 h-5 bg-neutral-300 shrink-0 rounded-full"></span>
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
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
