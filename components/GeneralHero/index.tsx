import React from 'react'
import { BigDotSmallDot, SingleLineShortLeft, SingleLineShortRight, SmallDot, SunBW } from '../shapes'

type Props = {
    icon:React.ReactNode,
    text: string
}


export default function GeneralHero({icon,text}: Props) {
  return (
    <section className='w-full bg-primary isolate relative flex items-center justify-center gap-3 py-14 overflow-hidden'>
        <span className='absolute h-full pointer-events-none -left-14 sm:-left-2 top-0 -z-10'>
            <SingleLineShortLeft className='h-full sm:h-[calc(100%+2rem)]'/>
        </span>
        <span className='absolute h-full pointer-events-none right-0 top-0 -z-10'>
            <SingleLineShortRight className='h-full sm:h-[calc(100%+2rem)] translate-x-14 sm:translate-x-2'/>
        </span>
        <span className='absolute size-10 pointer-events-none left-[30vw] sm:left-[300px] top-3 -z-10'>
            <SmallDot/>
        </span>
        <span className='absolute size-5 pointer-events-none sm:size-10 left-[20vw] sm:left-[200px] bottom-3 rotate-[145deg] -z-10'>
            <BigDotSmallDot className='size-full'/>
        </span>
        <span className='absolute size-5 pointer-events-none sm:size-10 right-[20vw] sm:right-[200px] top-3 -z-10'>
            <BigDotSmallDot className='size-full'/>
        </span>
        <span className='absolute size-5 pointer-events-none sm:size-10 right-[30vw] bottom-5 -z-10'>
            <SunBW className='size-full'/>
        </span>
        <span className='size-10 *:size-full text-white'>{icon}</span>
         <strong className='text-secondary text-3xl'>{text}</strong>
    </section>
  )
}