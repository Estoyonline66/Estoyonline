"use client"


import ImageBox from '@/components/ImageBox'
import { HomeVector, MessagePhone } from '@/components/shapes'
import StyledButton from '@/components/StyledButton'
import { useTranslation } from '@/contexts/TranslationProvider'
import useIntersectionObserver from '@/lib/hooks/useIntersector'
import { HomeProps } from '@/types/PropTypes'
import clsx from 'clsx'
import { useState } from 'react'


export default function AboutFounder() {
   const [show, setShow] = useState({
      image: false,
      body: false
   })
  const { t } = useTranslation()
  const Data: HomeProps = t('home')
  const defaultData = {};
  
  const imageRef = useIntersectionObserver<HTMLDivElement>({
    onProgress(progress) {
      if(progress>0.3){
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
    <section className="w-full min-h-fit my-10 sm:my-20">
          <div className="w-full px-4 md:px-10 lg:px-20 grid sm:grid-cols-2 items-center gap-3 sm:gap-10">
            <div ref={imageRef} className="w-full min-h-fit h-32 my-8 sm:my-0 sm:h-60 relative flex items-center justify-center pointer-events-none">
              <HomeVector className={
                clsx(
                  "absolute size-full z-0 aspect-square duration-500",
                  show.image?"scale-110 min-[360px]:scale-100 opacity-100 rotate-0":"scale-50 opacity-50 rotate-180"
                )
              }/>
              <ImageBox className="max-w-[70vw] sm:max-w-full object-contain aspect-square relative" src="/Images/homeImage2.png" width={500} height={500}/>
            </div>
            <div ref={bodyRef}  className="w-full flex gap-5 flex-col">
              <h3 className={
                clsx(
                  "font-bold text-lg sm:text-xl lg:text-2xl duration-500 delay-100 text-center sm:text-left",
                  show.body?"translate-y-0 opacity-100":"translate-y-10 opacity-0"
                )
              }>{Data.homeAboutTitle?Data.homeAboutTitle:defaultData.homeAboutTitle} <em className="font-inkfree font-extrabold text-secondary text-xl sm:text-2xl lg:text-3xl">Aleja</em>, {Data.homeAboutTitle2?Data.homeAboutTitle2:defaultData.homeAboutTitle2}</h3>
              <p className={
                clsx(
                  "duration-500 delay-300 text-justify sm:text-left",
                  show.body?"translate-y-0 opacity-100":"translate-y-10 opacity-0"
                )
              }>
            {Data.homeAboutDescription?Data.homeAboutDescription:defaultData.homeAboutDescription} <strong>{Data.homeAboutDescriptionBold?Data.homeAboutDescriptionBold:defaultData.homeAboutDescriptionBold}</strong> {Data.homeAboutDescription2?Data.homeAboutDescription2:defaultData.homeAboutDescription2} <strong> {Data.homeAboutDescriptionBold2}</strong>
              </p>

              <div className="w-full mt-2 flex items-center justify-center sm:justify-start">
              <a href="https://wa.me/905307700789" target='_blank'><StyledButton icon={<MessagePhone path={{
                fill: "var(--styledButtonHoveredTextColor)",
                style:{
                  transitionDuration: "300ms"
                }
              }} svg={{
                className:"size-4"
          }} />}> {Data.homeAboutButton?Data.homeAboutButton:defaultData.homeAboutButton}</StyledButton>
            </a>
              </div>
            </div>
          </div>
        </section>
  )
}