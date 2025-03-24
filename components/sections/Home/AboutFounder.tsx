"use client"


import ImageBox from '@/components/ImageBox'
import { HomeVector, MessagePhone } from '@/components/shapes'
import StyledButton from '@/components/StyledButton'
import useIntersectionObserver from '@/lib/hooks/useIntersector'
import clsx from 'clsx'
import { useState } from 'react'


export default function AboutFounder() {
   const [show, setShow] = useState({
      image: false,
      body: false
    })
  const imageRef = useIntersectionObserver<HTMLDivElement>({
    onProgress(progress) {
      if(progress>0.05){
        setShow(s=>({
          ...s,
          image:true
        }))
      }else{
        setShow(s=>({
          ...s,
          image:false
        }))
      }
    },
  })
  const bodyRef = useIntersectionObserver<HTMLDivElement>({
    onProgress(progress) {
      if(progress>0.05){
        setShow(s=>({
          ...s,
          body:true
        }))
      }else{
        setShow(s=>({
          ...s,
          body:false
        }))
      }
    },
  })
  return (
    <section className="w-full min-h-[500px] my-20">
          <div className="w-full px-4 md:px-10 lg:px-20 grid sm:grid-cols-2 items-center gap-10">
            <div ref={imageRef} className="w-full min-h-fit h-32 sm:h-60 relative flex items-center justify-center pointer-events-none">
              <HomeVector className={
                clsx(
                  "absolute size-full z-0 aspect-square duration-500",
                  show.image?"scale-100 opacity-100 rotate-0":"scale-50 opacity-50 rotate-180"
                )
              }/>
              <ImageBox className="max-w-[70vw] sm:max-w-full object-contain aspect-square relative" src="/Images/homeImage2.png" width={500} height={500}/>
            </div>
            <div ref={bodyRef}  className="w-full flex gap-5 flex-col">
              <h3 className={
                clsx(
                  "font-bold text-lg sm:text-xl lg:text-2xl duration-500 delay-100",
                  show.body?"translate-y-0 opacity-100":"translate-y-10 opacity-0"
                )
              }>Hello! Hola! I’am <em className="shadows-into-light-regular text-secondary font-normal">Aleja</em>, the founder of Estyonline.es</h3>
              <p className={
                clsx(
                  "duration-500 delay-300",
                  show.body?"translate-y-0 opacity-100":"translate-y-10 opacity-0"
                )
              }>
              An online Spanish school <strong>with over 300 students.</strong> We’re excited to tell you all about our boutique school and our lessons in detail. Let’s schedule a free class! I am looking forward to your Whatsapp message. <strong> Text us now!</strong>
              </p>
              <StyledButton className="mx-auto sm:mx-0 !mt-2" icon={<MessagePhone svg={{
                className:"size-4"
              }}/> }> Whatsapp (530) 77 00 789</StyledButton>
            </div>
          </div>
        </section>
  )
}