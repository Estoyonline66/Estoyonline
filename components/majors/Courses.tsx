import { cardCourses } from '@/data/courseDatas';
import React from 'react';
import BgSvg from '../ui/BgSvg';

export default function Courses() {
  const levels = [
    {
      title: 'Beginner Level A1',
      items: [
        { level: 'A1.1', duration: '40 minutes', book: 'Hall 1' },
        { level: 'A1.2', duration: '30 minutes', book: 'Hall 1' },
      ],
    },
    {
      title: 'Basic Level A2',
      items: [
        { level: 'A1.1', duration: '30 hours', book: 'Area 2' },
        { level: 'A1.2', duration: '30 hours', book: 'Area 2' },
        { level: 'A2.1', duration: '30 hours', book: 'Area 2' },
        { level: 'A2.2', duration: '30 hours', book: 'Area 2' },
      ],
    },
    {
      title: 'Intermediate Level B1',
      items: [
        { level: 'A1.1', duration: '30 minutes', book: 'Hall 3' },
        { level: 'A1.2', duration: '30 minutes', book: 'Hall 3' },
        { level: 'A1.3', duration: '30 minutes', book: 'Hall 3' },
        { level: 'A1.4', duration: '30 minutes', book: 'Hall 3' },
        { level: 'A1.5', duration: '30 minutes', book: 'Hall 3' },
        { level: 'A1.6', duration: '30 minutes', book: 'Hall 3' },
      ],
      },
    {
      title: 'Beginner Level A1',
      items: [
        { level: 'A1.1', duration: '40 minutes', book: 'Hall 1' },
        { level: 'A1.2', duration: '30 minutes', book: 'Hall 1' },
      ],
      },
    {
      title: 'Beginner Level A1',
      items: [
        { level: 'A1.1', duration: '40 minutes', book: 'Hall 1' },
        { level: 'A1.2', duration: '30 minutes', book: 'Hall 1' },
      ],
      },
    {
      title: 'Beginner Level A1',
      items: [
        { level: 'A1.1', duration: '40 minutes', book: 'Hall 1' },
        { level: 'A1.2', duration: '30 minutes', book: 'Hall 1' },
      ],
      },
    {
      title: 'Beginner Level A1',
      items: [
        { level: 'A1.1', duration: '40 minutes', book: 'Hall 1' },
        { level: 'A1.2', duration: '30 minutes', book: 'Hall 1' },
      ],
    },
    
  ];

  return (
    <>
      <section className="w-full flex flex-col gap-5 py-20 px-5 lg:px-20 z-[-1]">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cardCourses.map((card, index) => (
            <li
                key={index}
                className="bg-[#078CE2] p-6 h-[226px] text-center text-white shadow-lg transform scale-100 transition-all duration-300 hover:scale-110"
            >
                <h1 className="text-xl font-bold">{card.title}</h1>
                <p className="text-md">
                <span className="font-semibold">Only</span> {card.time}
                </p>
                <p className="text-md">{card.week}</p>
                <p className="text-md">
                <span>{card.lesson}</span>{" "}
                <span className="font-semibold">{card.month}</span>
                </p>
            </li>
            ))}
        </ul>
      </section>

          
      <section className="relative bg-[#078CE2] w-full h-[75rem] flex justify-center items-center z-[-1]">
        <BgSvg />
        <div className="absolute w-full h-full flex flex-col items-center py-20 gap-9">
          <h1 className="text-white text-2xl font-bold">All Levels</h1>
          <ul className="text-white flex flex-col gap-9">
            {levels.map((level, index) => (
              <li key={index} className="flex flex-col">
                <b className="pb-2">{level.title}</b>
                {level.items.map((item, idx) => (
                  <p key={idx} className="font-light">
                    <span className="font-semibold">{item.level}</span> - {item.duration} - Book: {item.book}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
