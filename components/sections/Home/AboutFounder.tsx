import ImageBox from '@/components/ImageBox'
import { HomeVector, MessagePhone } from '@/components/shapes'
import { Button } from '@/components/ui/button'
import React from 'react'


export default function AboutFounder() {
  return (
    <section className="w-full min-h-[500px] my-20">
          <div className="w-full px-4 md:px-10 lg:px-20 grid sm:grid-cols-2 items-center gap-10">
            <div className="w-full min-h-fit h-32 sm:h-60 relative flex items-center justify-center pointer-events-none">
              <HomeVector className="absolute w-[50vw] sm:w-full z-0 aspect-square"/>
              <ImageBox className="max-w-[50vw] sm:max-w-full object-contain aspect-square relative" src="/Images/homeImage2.png" width={500} height={500}/>
            </div>
            <div className="w-full flex gap-3 flex-col">
              <h3 className="font-bold text-xl sm:text-2xl lg:text-4xl">Hello! Hola! I’am <em className="shadows-into-light-regular text-secondary font-normal">Aleja</em>, the founder of Estyonline.es</h3>
              <p>
              An online Spanish school <strong>with over 300 students.</strong> We’re excited to tell you all about our boutique school and our lessons in detail. Let’s schedule a free class! I am looking forward to your Whatsapp message. <strong> Text us now!</strong>
              </p>
              <Button variant={"secondary"} className="!w-fit !px-4 mx-auto sm:mx-0"> <MessagePhone className="size-4"/> Whatsapp (530) 77 00 789</Button>
            </div>
          </div>
        </section>
  )
}