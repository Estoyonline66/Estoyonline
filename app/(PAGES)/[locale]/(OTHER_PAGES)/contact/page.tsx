"use client";
import GeneralHero from "@/components/GeneralHero";
import Meta from "@/components/Meta";
import MapComponent from "@/components/sections/Contact/MapContainer";
// import ContactMap from "@/components/sections/Contact/Map";
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




export default function Contact() {
  const sm = useIsMobile(640);
  const { t } = useTranslation();
  const Data: ContactData = t("contact");
  return (
    <>
      <Meta route="/contact" />

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

      <section className="w-full mt-10 z-[-1]">
        {/* <ContactMap/> */}
        {/* handle the map section in contact design */}
        <MapComponent />
      </section>
    </>
  );
}
