import { TeacherVideoShape } from '@/components/shapes'
import React from 'react'

type Props = {
    teach:{
        name: string,
        about: string
    }
}

export default function TeacherCard({teach}: Props) {
  return (
    <li className="flex items-center flex-row-reverse sm:even:flex-row sm:odd:flex-row-reverse flex-wrap sm:flex-nowrap justify-center gap-5">
          <div className="w-full relative isolate sm:w-[50%] shrink p-5">
            <div className="w-full bg-black overflow-hidden rounded-md h-52 sm:h-72">
                {/* <video src="" className='size-full object-center object-cover'></video> */}
            </div>
            <span className="absolute inset-0 size-full scale-105 sm:scale-110 -z-10 pointer-events-none">
              <TeacherVideoShape className="size-full"/>
            </span>
          </div>
          <div className="w-full py-4 sm:p-5 flex flex-col h-full gap-2">
            <h4 className="uppercase text-secondary font-bold text-sm sm:text-base lg:text-lg">{teach.name}</h4>
            <p className="text-xs sm:text-sm lg:text-base">{teach.about}</p>
          </div>
      </li>
  )
}