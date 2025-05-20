"use client";
import GeneralHero from "@/components/GeneralHero";
import Meta from "@/components/Meta";
// import MapComponent from "@/components/sections/Contact/MapContainer";
import {
  MapPinCustom,
  MessagePhone,
  SingleLineShortLeft,
  SingleLineShortRight,
} from "@/components/shapes";
import StyledButton from "@/components/StyledButton";
import { useTranslation } from "@/contexts/TranslationProvider";
import { useIsMobile } from "@/lib/hooks/useMobile";
import { ContactData } from "@/types/PropTypes";
import clsx from "clsx";
import Image from "next/image";

export default function Freecourse() {
  const sm = useIsMobile(640);
  const { t } = useTranslation();
  const Data: ContactData = t("freecourse");

  return (
    <>
      <Meta route="/freecourse" />

      <GeneralHero
        icon={
          <MessagePhone
            path={{
              fill: "none",
              stroke: "#FEFEFE",
            }}
          />
        }
        text={Data.PageTitle}
      />

      {/* Yeni Görsel ve Metin */}
      <section className="w-full px-4 py-10 flex flex-col items-center bg-white">
        <Image
          src="/freeclass.jpeg"
          alt="Free Spanish Course"
          width={768}
          height={768}
          className="w-full max-w-3xl rounded-xl shadow-lg"
        />
        <div className="mt-6 text-center max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">
            Would you like to get to know our school?
          </h2>
          <p className="mb-2">There’s no need to travel to Barcelona!</p>
          <p className="mb-2">
            Next week, we’re starting a free mini course made up of 4 classes.
            It will take place on Wednesdays and Saturdays from 18:30 pm to 19:30 pm
          </p>
          <p className="mb-2">
            This mini course is designed for beginner students who want to start learning Spanish.
          </p>
          <p className="mb-2">
            If you’d like to sign up, simply send us a text message on the school’s WhatsApp and we’ll send you the Zoom link along with the materials for each class.
          </p>
          <p className="font-semibold mt-4">
            Don’t miss out on this great opportunity!<br />
            WhatsApp: +34-633-452-268
          </p>
        </div>
      </section>

      <section className="w-full mt-10 bg-white isolate relative grid grid-cols-1 sm:grid-cols-2 items-center justify-center overflow-hidden">
        <div className="w-full h-full isolate px-4 relative py-14 md:px-10 lg:px-20 flex flex-col gap-5">
          <span
            className={clsx(
              "absolute size-full bg-[#DEEBFE] top-0 left-0 -z-10",
              sm ? "contact-shape-bottom" : "contact-shape-left"
            )}
          />
          <span className="absolute h-full -left-2 top-0 pointer-events-none -z-10">
            <SingleLineShortLeft className="h-[calc(100%+2rem)]" />
          </span>
          <strong className="text-lg sm:text-xl lg:text-2xl">
            {Data.needAssistance}
          </strong>
          <p>{Data.contactDescription}</p>
          <div className="w-full mt-2 flex items-center justify-center sm:justify-start">
            <a href={Data.whatsapplink} target="_blank">
              <StyledButton
                icon={
                  <MessagePhone
                    path={{
                      fill: "var(--styledButtonHoveredTextColor)",
                      style: {
                        transitionDuration: "300ms",
                      },
                    }}
                    svg={{
                      className: "size-4",
                    }}
                  />
                }
              >
                {" "}
                {Data.officeContactButton}
              </StyledButton>
            </a>
          </div>
        </div>
        <div className="w-full isolate flex flex-col items-center  px-4 relative py-14 md:px-10 lg:px-20 gap-5">
          <span
            className={clsx(
              "absolute size-full bg-[#DEEBFE] top-0 left-0 -z-10",
              sm ? "contact-shape-top" : "contact-shape-right"
            )}
          />
          <span className="absolute h-full right-0 top-0 pointer-events-none -z-10">
            <SingleLineShortRight className="h-[calc(100%+2rem)] translate-x-2 -z-10" />
          </span>
          <span className="size-10">
            <MapPinCustom className="size-full" />
          </span>
          <strong>{Data.officeAddressTitle}</strong>
          <address className="w-full text-center max-w-[25ch]">
            {Data.officeAddressDescription}
          </address>
        </div>
      </section>

      {/* Harita kaldırıldı */}
      {/* <section className="w-full mt-10 z-[-1]">
        <MapComponent />
      </section> */}
    </>
  );
}
