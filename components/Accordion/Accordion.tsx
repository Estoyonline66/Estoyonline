"use client";
import { useState } from "react";
import { AccordionItem } from "./AccordionItem";
// import { accordionData } from "./accordionData";
import { useTranslation } from "@/contexts/TranslationProvider";
import { PriceData } from "@/types/PropTypes";



export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { t } = useTranslation();
    // fetch courses data from translation file
    const Data: PriceData = t("courses");
  
  const accordionDatas = Data?.accordionData || [];
  

  

  const handleToggle = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 p-5">
      {accordionDatas.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isActive={activeIndex === index}
          onClick={() => handleToggle(index)}
        />
      ))}
    </div>
  );
}
