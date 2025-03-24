"use client"
import useCounter from '@/lib/hooks/useCounter'
import useIntersectionObserver from '@/lib/hooks/useIntersector'
import React, { useState } from 'react'



export default function RatindAndAchievements() {
  const [startCounter, setSartCounter] = useState(false)
  const ref = useIntersectionObserver<HTMLUListElement>({
    onProgress(progress) {
      if (progress > 0.05) {
        setSartCounter(true);
      } else {
        setSartCounter(false);
      }
    },
  })
  const calculateSkipper = (length:number)=>Math.floor(length/20)
  const successStoriesCount = useCounter({to:700,delay:100, skip:calculateSkipper(700),start:startCounter})
  const ExpertInstructorsCount = useCounter({to:200,delay:100, skip:calculateSkipper(200),start:startCounter})
  const StudentsCount = useCounter({to:80,delay:100, skip:calculateSkipper(80),start:startCounter})
  const TrendingSubjectsCount = useCounter({to:500,delay:100, skip:calculateSkipper(500),start:startCounter})
  return (
    <ul ref={ref} className="w-full bg-secondary py-5 px-4 relative md:px-10 lg:px-20 grid grid-cols-1  sm:grid-cols-4 gap-3">
      <li className="p-2 flex text-white flex-col gap-3 items-center justify-center">
        <strong className="text-xl">{successStoriesCount.current}+</strong>
        <em className="not-italic text-xs">Success Stories</em>
      </li>
      <li className="p-2 flex text-white flex-col gap-3 items-center justify-center">
        <strong className="text-xl">{ExpertInstructorsCount.current}+</strong>
        <em className="not-italic text-xs">Expert Instructors</em>
      </li>
      <li className="p-2 flex text-white flex-col gap-3 items-center justify-center">
        <strong className="text-xl">{StudentsCount.current}K+</strong>
        <em className="not-italic text-xs">Students</em>
      </li>
      <li className="p-2 flex text-white flex-col gap-3 items-center justify-center">
        <strong className="text-xl">{TrendingSubjectsCount.current}+</strong>
        <em className="not-italic text-xs">Trending Subjects</em>
      </li>
    </ul>
  )
}