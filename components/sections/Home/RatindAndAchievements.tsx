"use client";
import { useTranslation } from "@/contexts/TranslationProvider";
import useCounter from "@/lib/hooks/useCounter";
import useIntersectionObserver from "@/lib/hooks/useIntersector";
import { HomeProps } from "@/types/PropTypes";
import React, { useState } from "react";

export default function RatindAndAchievements() {
  const [startCounter, setSartCounter] = useState(false);
  const ref = useIntersectionObserver<HTMLUListElement>({
    onProgress(progress) {
      if (progress > 0.05) {
        setSartCounter(true);
      } else {
        setSartCounter(false);
      }
    },
  });
  const { t } = useTranslation();
  const Data: HomeProps = t("home");
  const defaultData = {
    "counterTitle": "Success Stories",
    "counterTitle2": "Expert Instructors",
    "counterTitle3": "Students",
    "counterTitle4": "Trending Subjects"
  };

  const calculateSkipper = (length: number) => Math.floor(length / 20);
  const successStoriesCount = useCounter({
    to: 45,
    delay: 100,
    skip: calculateSkipper(45),
    start: startCounter,
  });
  const StudentsCount = useCounter({
    to: 300,
    delay: 100,
    skip: calculateSkipper(300),
    start: startCounter,
  });
  const TrendingSubjectsCount = useCounter({
    to: 1500,
    delay: 100,
    skip: calculateSkipper(1500),
    start: startCounter,
  });
  return (
    <ul
      ref={ref}
      className="w-full bg-secondary py-5 px-4 relative md:px-10 lg:px-20 grid grid-cols-1 z-[1] sm:grid-cols-3 gap-3"
    >
      <li className="p-2 flex text-white flex-col gap-3 items-center justify-center">
        <strong className="text-xl">{successStoriesCount.current}+</strong>
        <em className="not-italic text-xs">{Data.counterTitle?Data.counterTitle:defaultData.counterTitle}</em>
      </li>
      <li className="p-2 flex text-white flex-col gap-3 items-center justify-center">
        <strong className="text-xl">{StudentsCount.current}+</strong>
        <em className="not-italic text-xs">{Data.counterTitle3?Data.counterTitle3:defaultData.counterTitle3}</em>
      </li>
      <li className="p-2 flex text-white flex-col gap-3 items-center justify-center">
        <strong className="text-xl">{TrendingSubjectsCount.current}+</strong>
        <em className="not-italic text-xs">{Data.counterTitle4?Data.counterTitle4:defaultData.counterTitle4}</em>
      </li>
    </ul>
  );
}
