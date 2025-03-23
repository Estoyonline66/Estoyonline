import React from 'react'
import { BigDotSmallDot, SingleLineShortLeft, SingleLineShortRight, SmallDot, SunBW } from '../shapes'

type Props = {
    icon:React.ReactNode,
    text: string
}

export default function GeneralHero({icon,text}: Props) {
  return (
    <section className='w-full bg-primary relative flex items-center justify-center gap-3 py-14 overflow-hidden'>
        <span className='absolute h-full -left-2 top-0'>
            <SingleLineShortLeft className='h-[calc(100%+2rem)]'/>
        </span>
        <span className='absolute h-full right-0 top-0'>
            <SingleLineShortRight className='h-[calc(100%+2rem)] translate-x-2'/>
        </span>
        <span className='absolute size-10 left-[30vw] sm:left-[300px] top-3'>
            <SmallDot/>
        </span>
        <span className='absolute size-5 sm:size-10 left-[20vw] sm:left-[200px] bottom-3 rotate-[145deg]'>
            <BigDotSmallDot className='size-full'/>
        </span>
        <span className='absolute size-5 sm:size-10 right-[20vw] sm:right-[200px] top-3'>
            <BigDotSmallDot className='size-full'/>
        </span>
        <span className='absolute size-5 sm:size-10 right-[30vw] bottom-5'>
            <SunBW className='size-full'/>
        </span>
        <span className='size-10 *:size-full text-white'>{icon}</span>
         <strong className='text-secondary text-3xl'>{text}</strong>
    </section>
  )
}