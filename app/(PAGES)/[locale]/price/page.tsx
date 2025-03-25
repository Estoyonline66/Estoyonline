"use client";

import React from "react";
import ExtraSpanish from "@/components/TablesCell/ExtraSpanish";
import OnlineSpanishOne from "@/components/TablesCell/OnlineSpanishOne";
import OnlineSpanishTwo from "@/components/TablesCell/OnlineSpanishTwo";
import { useTranslation } from "@/contexts/TranslationProvider";
import GeneralHero from "@/components/GeneralHero";
import { PriceTagIcon } from "@/components/shapes";
import Meta from "@/components/Meta";

interface PriceData {
  PageTitle: string;
  cards?: {
    title: string;
    description: string;
  }[];
}

export default function Page() {
  const { t } = useTranslation();
  // fetch price data from translation file
  const Data: PriceData = t("price");

  return (
    <>
      <Meta route="/price" />
      <GeneralHero icon={<PriceTagIcon />} text={Data.PageTitle} />

      <div className="w-full flex flex-col justify-between gap-2 md:gap-5 py-20 px-3 md:px-5 lg:px-20">
        <OnlineSpanishOne />
        <OnlineSpanishTwo />
        <ExtraSpanish />

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-5 px-3 md:px-10 lg:px-[10rem]">
          {Data?.cards?.map((card, index) => (
            <li
              key={index}
              className="bg-[#078CE2] px-3 py-9 h-[226px] rounded-lg text-center text-white space-y-1 transition-transform duration-300 transform hover:scale-105 z-[-1]"
            >
              <h1 className="text-xl font-bold">{card.title}</h1>
              <p className="text-md">{card.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
