"use client"
import ImageBox from '@/components/ImageBox'
import { Dots1, Dots2, SunIcon } from '@/components/shapes'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/lib/hooks/useMobile'
import React from 'react'


export default function JourneyCTA() {
        const isTabletScreen = useIsMobile(640)
    
  return (
    <section className="w-full py-20 px-4 relative overflow-x-hidden md:px-10 lg:px-20 bg-[#078CE2]">
      {/* sun image */}
      <SunIcon className="animate-[spin_10s_linear_infinite] size-20 sm:size-40 lg:size-60 absolute -top-10 -left-10 sm:-top-20 sm-left-20 lg:-top-30 lg-left-30"/>
      <SunIcon className="animate-[spin_10s_linear_infinite] size-20 sm:size-40 lg:size-60 absolute top-1/2 -translate-y-1/2 left-[calc(100%-2.5rem)] sm:left-[calc(100%-5rem)] lg:left-[calc(100%-7.5rem)]"/>
      <div className="w-full grid sm:grid-cols-2 items-center gap-5 isolate">
        <div className="w-full relative text-white flex flex-col justify-center gap-3 h-full">
          {
            !isTabletScreen&&<>
            <span className="absolute -bottom-5 -left-5 pointer-events-none -z-10">
            <Dots1/>
          </span>
          <span className="absolute -top-8 left-[70%] pointer-events-none -z-10">
            <Dots2/>
          </span>
            </>
          }
          <h3 className="font-bold text-xl sm:text-2xl lg:text-4xl">Start Your Spanish Learning Journey Today!</h3>
          <p>Join Estyonline.es and learn Spanish in a fun and engaging way.</p>
          <Button variant={"secondary"} className="!w-fit !px-4">Explore Courses</Button>
        </div>
        <ul className="w-full grid grid-cols-[repeat(auto-fit,_minmax(240px,1fr))] sm:grid-cols-2 gap-3">
          <li className="w-full max-h-52 sm:max-h-64 bg-primary rounded-md overflow-hidden">
            <ImageBox src="/Images/image (1).png" width={1024} height={1024} className="size-full object-cover object-top"/>
          </li>
          <li className="w-full max-h-52 sm:max-h-64 bg-primary rounded-md overflow-hidden">
            <ImageBox src="/Images/image (2).png" width={1024} height={1024} className="size-full object-cover object-top"/>
          </li>
          <li className="w-full max-h-52 sm:max-h-64 bg-primary rounded-md overflow-hidden">
            <ImageBox src="/Images/image (3).png" width={1024} height={1024} className="size-full object-cover object-top"/>
          </li>
          <li className="w-full max-h-52 sm:max-h-64 bg-primary rounded-md overflow-hidden">
            <ImageBox src="/Images/image (4).png" width={1024} height={1024} className="size-full object-cover object-top"/>
          </li>
        </ul>
      </div>
    </section>
  )
}