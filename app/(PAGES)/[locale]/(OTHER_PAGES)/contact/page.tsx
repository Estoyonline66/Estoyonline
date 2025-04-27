"use client";

import GeneralHero from "@/components/GeneralHero";
import Meta from "@/components/Meta";
import MapComponent from "@/components/sections/Contact/MapContainer";
import { MessagePhone } from "@/components/shapes";
import { useTranslation } from "@/contexts/TranslationProvider";
import { ContactData } from "@/types/PropTypes";

export default function Contact() {
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

      <section className="w-full mt-10 bg-white grid grid-cols-1 sm:grid-cols-2 items-center justify-center overflow-hidden">
        <div className="w-full h-full px-4 py-14 md:px-10 lg:px-20 flex flex-col gap-5">
          <strong className="text-lg sm:text-xl lg:text-2xl">
            {Data.needAssistance}
          </strong>
          <p>{Data.contactDescription}</p>
          <div className="w-full mt-2 flex items-center justify-center sm:justify-start">
            <a href={Data.whatsapplink} target="_blank" rel="noopener noreferrer">
              <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition">
                {Data.officeContactButton}
              </button>
            </a>
          </div>
        </div>

        <div className="w-full flex flex-col items-center px-4 py-14 md:px-10 lg:px-20 gap-5">
          <strong>{Data.officeAddressTitle}</strong>
          <address className="w-full text-center max-w-[25ch]">
            {Data.officeAddressDescription}
          </address>
        </div>
      </section>

      <section className="w-full mt-10">
        <MapComponent />
      </section>
    </>
  );
}
