"use client";

import { useEffect, useState } from "react";
import GeneralHero from "@/components/GeneralHero";
import Meta from "@/components/Meta";
import MapComponent from "@/components/sections/Contact/MapContainer";
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
  const { t } = useTranslation();
  const Data: ContactData = t("contact");

  const sm = useIsMobile(640); // Koşulsuz çalışıyor ✅
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Meta route="/contact" />
      <GeneralHero
        icon={
          <MessagePhone
            path={{ fill: "none", stroke: "#FEFEFE" }}
          />
        }
        text={Data.PageTitle}
      />
      {/* Buradan itibaren senin JSX */}
      <section className="w-full mt-10 bg-white isolate relative grid grid-cols-1 sm:grid-cols-2 items-center justify-center overflow-hidden">
        {/* ... */}
      </section>
      <section className="w-full mt-10 z-[-1]">
        <MapComponent />
      </section>
    </>
  );
}
