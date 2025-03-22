import React from 'react'


export default function RatindAndAchievements() {
  return (
    <ul className="w-full bg-secondary py-5 px-4 relative md:px-10 lg:px-20 grid grid-cols-1  sm:grid-cols-4 gap-3">
      <li className="p-2 flex text-white flex-col gap-3 items-center justify-center">
        <strong className="text-xl">700+</strong>
        <em className="not-italic text-xs">Success Stories</em>
      </li>
      <li className="p-2 flex text-white flex-col gap-3 items-center justify-center">
        <strong className="text-xl">200+</strong>
        <em className="not-italic text-xs">Expert Instructors</em>
      </li>
      <li className="p-2 flex text-white flex-col gap-3 items-center justify-center">
        <strong className="text-xl">80K+</strong>
        <em className="not-italic text-xs">Students</em>
      </li>
      <li className="p-2 flex text-white flex-col gap-3 items-center justify-center">
        <strong className="text-xl">500+</strong>
        <em className="not-italic text-xs">Trending Subjects</em>
      </li>
    </ul>
  )
}