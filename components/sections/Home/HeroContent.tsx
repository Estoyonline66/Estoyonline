"use client";

import StyledButton from "@/components/StyledButton";
import TranslatedLink from "@/components/TranslatedLink";
import { useTranslation } from "@/contexts/TranslationProvider";
import { HomeProps } from "@/types/PropTypes";
import React from "react";


export default function HeroContent() {
  const { t } = useTranslation();
  const Data: HomeProps = t("home");
  const defaultData = {
   "HeroTitle": "",
    "HeroYellowTitle": "",
    "HeroTitle2": "",
     "HeroDescription": "",
    "HeroButton": "",
  };
  return (
    <div className="w-fit p-1 flex flex-col gap-5 animate-[pulse_1s_linear_forwards] text-white relative max-w-[95vw] min-[498px]:max-w-sm sm:max-w-lg lg:max-w-xl">
      <strong className="text-3xl sm:text-6xl font-bold lg:text-6xl">
        {Data.HeroTitle ? Data.HeroTitle : defaultData.HeroTitle}{" "}
        <em className="text-primary not-italic">{Data.HeroYellowTitle ? Data.HeroYellowTitle : defaultData.HeroYellowTitle}</em>{" "}
        {Data.HeroTitle2 ? Data.HeroTitle2 : defaultData.HeroTitle2}
      </strong>
      <p className="text-base md:text-lg">
        {Data.HeroDescription
          ? Data.HeroDescription
          : defaultData.HeroDescription}
      </p>
      <TranslatedLink href={"/courses"}>
        <StyledButton className="w-fit px-4 text-base mt-2 md:text-lg">
          {Data.HeroButton ? Data.HeroButton : defaultData.HeroButton}
        </StyledButton>
      </TranslatedLink>
    </div>
  );
}
