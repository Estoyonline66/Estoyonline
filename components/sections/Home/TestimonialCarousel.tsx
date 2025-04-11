"use client";
import ImageBox from "@/components/ImageBox";
import { Marquee } from "@/components/magicui/marquee";
import { AnimatedSunLogo } from "@/components/shapes/logo";
import { useTranslation } from "@/contexts/TranslationProvider";
import { HomeProps } from "@/types/PropTypes";
import { HeartIcon } from "lucide-react";

export default function TestimonialCarousel() {
  const { t } = useTranslation();
  const Data: HomeProps = t("home");
  const defaultData = {
    testimonies: "What our clients are saying about us",
  };


  

  const testimonials: {
    image: string;
    firstComment: string;
    lastComment: string;
    personName: string;
    timeAgo:string;
  }[] = [
    {
      image: "/Images/yasemin.avsar.jpg",
      firstComment: "İspanyolca öğrenmenin bu kadar keyifli olduğunu bilseydim çok daha önce başlardım 🥰 her dersi sabırsızlıkla bekliyorum iyi ki tanıdım sizleri 🌺🌺",
      lastComment: "her dersi sabırsızlıkla bekliyorum",
      personName: "yasemen.avsar",
      timeAgo: "20 min"
    },
    {
      image: "/Images/umaysirke.jpg",
      firstComment: "Aleja ve onun öğretme yöntemini hep çok sevdim ve bir öğretmenin nasıl olması, nasıl eğlenerek öğretmesi konusunda hep onu örnek veririm 😍",
      lastComment: "Aleja ve onun öğretme yöntemini hep çok sevdim",
      personName: "umaysirke",
      timeAgo: "2 h"
    },
    {
      image: "/Images/ugurege.jpg",
      firstComment: "Yıllar önce tanıştığım Aleja ve ekibi sayesinde İspanyolcayı rahatça konuşabilecek ve okuyabilecek şekilde ilerlettim. B1.4 seviyesine kadar sadece bu okuldan ders alarak geldim",
      lastComment: "B1.4 seviyesine kadar sadece bu okuldan ders alarak geldim",
      personName: "ugurege",
      timeAgo: "5 h"
    },
    {
      image: "/Images/muge_dusun.jpg",
      firstComment: "Hola Şarkılarla İspanyolca dersi çok keyifli. Bilmediğim İspanyol şarkıcıları ve ispanyol kültürünü öğreniyorum. Arkadaşlarıma tavsiye edeceğim. İyiki sizi tanımışım.",
      lastComment: "Şarkılarla yapılan İspanyolca dersleri çok eğlenceli.",
      personName: "muge_dusun",
      timeAgo: "5 min"
    },
    {
      image: "/Images/meltem_sonmez_canseco.jpg",
      firstComment: "Harika öğretmenler, harika metodlar. Derslerin nasil gectigini anlamiyorum bile. 2020 den beri sizlerle Ispanyolca ogreniyorum, dersler cok keyifli ve verimli geciyor. Seviyem sizin yardimlarinizla cok iyi seviyeye geldi.",
      lastComment: "Harika öğretmenler, harika metodlar.",
      personName: "meltem_sonmez_canseco",
      timeAgo: "10 min"
    },
    {
      image: "/Images/ulucozuyener.jpg",
      firstComment: "İspanyolca'ya 3 sene önce sıfırdan başladım. @estoyonline.es ve @danielasalzman sayesinde B2.2 seviyesine geldim. İspanyolca öğrenmek isteyenlere şiddetle tavsiye ederim.😍",
      lastComment: "@estoyonline.es ve @danielasalzman sayesinde B2.2 seviyesine geldim",
      personName: "ulucozuyener",
      timeAgo: "9 h"
    },
    {
      image: "/Images/17limerence.jpg",
      firstComment: `Gerçekten wow dedim. Bir öğretmensiniz ve hâlâ kendinizi geliştiriyorsunuz. "Yakında öğrendiğim her şeyi derslerime uygulamaya başlayacağım" ne kadar güzel bir cümle, heyecanınızı ben bile hissettim 😊Hoşuma gitti❤️ Hocam❤️`,
      lastComment: `Gerçekten "wow" dedim. Bir öğretmensiniz ve hâlâ kendinizi geliştiriyorsunuz.`,
      personName: "17limerence",
      timeAgo: "10 h"
    },
    {
      image: "/Images/allaunal_embroidery.jpg",
      firstComment: `Daha 1 seviye geçip diğerine geçtim. Carolina ile derslerimiz çok eğlenceli geçiyor, çok verimli, bilgilerle dolu dolu, hocamız çok güler yüzlü ve çok yardımcıdır. İyi ki yolumuz kesişti @estoyonline.es sizi seviyorum, sizinle konuşma korkusunu aştım ve çok motive oldum dili öğrenmeye devam etmek için. 😍`,
      lastComment: `sizinle konuşma korkusunu aştım ve çok motive oldum.`,
      personName: "allaunal_embroidery",
      timeAgo: "1h"
    },
    {
      image: "/Images/ebru_basaran35.jpg",
      firstComment: `Recomiendo las lecciones de Aleja, son muy divertidas`,
      lastComment: `son muy divertidas`,
      personName: "ebru_basaran35",
      timeAgo: "7 min"
    },
    {
      image: "/Images/yollarinrengi.jpg",
      firstComment: `Aleja ve ekibine Teşekkürler. İspanyolca öğrenirken en iyi yani ogretmenlerin İspanyol ve Türkçe biliyor olmaları..Anlamamız kolay oluyor..bir yabancı dil öğretmeni olarak üçüncü bir dil İspanyolca ya iki ay önce başladım.. A1.1 deyim zamanım oldukça öğrenmeye devam edeceğim.. yeni kurda görüşmek üzere`,
      lastComment: `Aleja ve ekibine teşekkürler.`,
      personName: "yollarinrengi",
      timeAgo: "just now"
    },
	{
      image: "/Images/zenteksen.jpg",
      firstComment: `Aslında İspanyolca öğrenmeye 2019'da başlamıştım ama sizlerle çalışmaya başladıktan sonra İspanyolcam çok ilerledi. Dün Buenos Aires’li bir aileye ve  Arjantinli olan 7 kişilik bir aileyle İspanyolca sohbet edip zaman geçirdim. Onlarla son derece rahat bir şekilde akıcı konuşarak anlaşabilmek beni çok mutlu etti. ❤️❤️ `,
      lastComment: ` Sizlerle çalışmaya başladıktan sonra İspanyolcam çok ilerledi.`,
      personName: "zenteksen",
      timeAgo: "19 sem"
    },
	{
      image: "/Images/merterdem.jpg",
      firstComment: `Pandemiden beri Aleja ve Dani ile keyifli dersler yapıyoruz. Enerjileriyle motivasyonumu korumama yardım ettiler. İspanyolca öğrenmek isteyenlere kesinlikle öneriyorum. 🙌😍`,
      lastComment: `Enerjileriyle motivasyonumu korumama yardım ettiler..`,
      personName: "_merterdem_",
      timeAgo: "24 h"
    },
	{
      image: "/Images/kemal_yesra.jpg",
      firstComment: `Bugün sertifikamı aldım. Aleja’ya ve kadrosuna çok teşekkür ederim, çok profesyoneller. Tüm öğretmenlerin yabancı olması ve ilk dersten itibaren İspanyolca konuşmaları ilk başlarda beni korkutmuştu. Ama düşündüğüm gibi olmadı. Kesinlikle Aleja’yı ve kadrosunu tavsiye ediyorum.`,
      lastComment: `Çok profesyoneller`,
      personName: "kemal_yesra",
      timeAgo: "14 h"
    },
	{
      image: "/Images/nebibekum.jpg",
      firstComment: `Dersler çok eğlenceli, bol bol konuşuyoruz, oyunlar oynuyoruz, bunları yaparken gramer ve yeni kelimeleri öğrenmiş oluyoruz. Öğretmenimiz Türkçe biliyor, evet çok az kullanıyor ama anlamadığımız konuları Türkçe kullanarak tekrar açıklıyor.  Sıradaki seviyeye geçmek için sabırsızlanıyorum 😊.`,
      lastComment: `Dersler çok eğlenceli, bol bol konuşuyoruz,`,
      personName: "nebibekum",
      timeAgo: "12 h"
    }
  ];


  return (
    <section className="w-full flex flex-col gap-10 items-center justify-center bg-white py-20 px-4 relative overflow-x-hidden md:px-10 lg:px-20">
      <h3 className="font-bold text-xl sm:text-2xl lg:text-4xl text-center">
        {Data.testimonies ? Data.testimonies : defaultData.testimonies}
      </h3>
      <AnimatedSunLogo
        svg={{
          className:
            "size-40 sm:size-60 absolute -top-20 left-[calc(100%-5rem)] z-0 sm:left-[calc(100%-7.5rem)]",
        }}
      />
      <div className="relative flex w-full flex-col items-center bg-white justify-center z-[1] overflow-hidden">
        <Marquee pauseOnHover className="[--duration:50s]">
          {testimonials.map((testimony, index) => (
            <div
              key={index}
              className="relative h-full bg-white w-fit max-w-[100vw] min-[300px]:max-w-[70vw] min-[498px]:max-w-80 cursor-pointer overflow-hidden rounded-xl border p-4 mx-0"
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
                  <div className="w-full flex min-[360px]:items-center justify-between flex-col-reverse min-[360px]:flex-row">
                    <strong className="text-sm shrink max-w-full min-[360px]:max-w-[40%] break-words">{testimony.personName}</strong>
                    <span className="w-full justify-between min-[360px]:justify-start min-[360px]:w-fit flex items-center gap-2 shrink-0">
                      <em className="text-xs not-italic text-neutral-400">
                        {testimony.timeAgo}
                      </em>
                      <div className="flex items-center gap-2">
                      <HeartIcon
                        className="text-transparent w-5 h-5 shrink-0"
                        fill="#EB0004"
                        fillOpacity={30}
                      />
                      <span className="w-5 h-5 bg-neutral-300 shrink-0 rounded-full"></span>
                      </div>
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
