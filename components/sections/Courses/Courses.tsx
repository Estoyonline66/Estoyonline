"use client"
import React from 'react';
import BgSvg from '../../ui/BgSvg';
import { useTranslation } from '@/contexts/TranslationProvider';
import { PriceData } from '@/types/PropTypes';


export default function Courses() {
  const { t } = useTranslation();
  // fetch courses data from translation file
  const Data: PriceData = t("courses");

  const levelss = Data?.levels || [];

  const cardCourses = Data?.cardCourses || [];


  return (
    <>
      <section className="w-full flex flex-col gap-5 py-20 px-5 md:px-20 lg:px-40 z-0">
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {cardCourses.map((card, index) => (
            <li
                key={index}
                className="bg-[#F8BC1680] rounded-lg text-[#333] p-6 min-h-[160px] text-center shadow-lg scale-100 duration-300 hover:scale-105"
            >
                <h1 className="text-2xl font-semibold line-clamp-2 min-h-[3em] leading-normal">{card.title}</h1>
                <p className="text-sm">
                  <span className="font-semibold">{card.bold}</span> {card.time}
                </p>
                <p className="text-sm">{card.week}</p>
                <p className="text-sm">
                  <span>{card.lesson}</span>{" "}
                  <span className="font-semibold">{card.month}</span>
                </p>
            </li>
            ))}
        </ul>
      </section>

          
      <section className="relative bg-[#0068FF] w-full h-[85rem] flex justify-center items-center z-[-1]">
        <BgSvg />
        <div className="absolute w-full h-full flex flex-col items-center py-20 gap-9 px-4">
          <h1 className="text-white text-2xl font-bold">{Data?.title}</h1>
          <ul className="text-white flex flex-col gap-9">
            {levelss.map((level, index) => (
              <li key={index} className="flex flex-col">
                <div className='flex flex-col'>
                   <b className="pb-2">{level.title}</b>
                   {level.items.map((item, idx) => (
                    <p key={idx} className="font-light">
                      <span className="font-semibold">{item.level}</span> &nbsp; {item.duration} {item.book}
                     </p>
                   ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
