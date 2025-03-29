"use client";
import { useState } from "react";
import { AccordionItem } from "./AccordionItem";
import { useTranslation } from "@/contexts/TranslationProvider";
import { PriceData } from "@/types/PropTypes";

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { t } = useTranslation();
  const Data: PriceData = t("courses");
  const accordionDatas = Data?.accordionData || [];

  const handleToggle = (index: number) => {
    if (activeIndex === null) {
      setActiveIndex(index);
    } else if (activeIndex === index) {
      // Toggle off the active item
      setActiveIndex(null);
    } else {
      // A different item is open: close it first...
      setActiveIndex(null);
      // ...then open the new one after the close animation finishes.
      setTimeout(() => {
        setActiveIndex(index);
      }, 500); // Adjust delay to match the closing animation duration
    }
  };

  return (
    <div className="w-full md:px-20 lg:px-40 mx-auto space-y-4 px-4">
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
