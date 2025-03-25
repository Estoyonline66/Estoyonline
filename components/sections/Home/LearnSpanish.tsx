"use client"
import { DoubleLeft, DoubleRight } from '@/components/shapes'
import StyledButton from '@/components/StyledButton'
import TranslatedLink from '@/components/TranslatedLink'
import { useTranslation } from '@/contexts/TranslationProvider'
import useIntersectionObserver from '@/lib/hooks/useIntersector'
import { HomeProps } from '@/types/PropTypes'
import clsx from 'clsx'
import { useState } from 'react'


export default function LearnSpanish() {
  const [show, setShow] = useState({
    header: false,
    body: false
  })
  const { t } = useTranslation()
  const Data: HomeProps = t('home')
  
  const generalSect = useIntersectionObserver({
    onProgress(progress) {
      if(progress>0.05){
        setShow(s=>({
          ...s,
          header:true
        }))
      }else{
        setShow(s=>({
          ...s,
          header:false
        }))
      }
      if(progress>0.15){
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
    <section ref={generalSect} className="w-full mt-20 px-4 z-0 relative flex items-center justify-center isolate h-fit">
      <span className="absolute pointer-events-none w-fit -left-5 top-5 h-screen block -z-10 overflow-x-hidden">
        <DoubleLeft className="h-full"/>
      </span>
      <span className="absolute pointer-events-none w-fit -right-0 top-10 h-screen block -z-10 overflow-x-hidden">
        <DoubleRight className="h-full relative left-5"/>
      </span>
      <div className="flex items-center justify-center flex-col gap-3 w-full max-w-3xl">
        <h3 className={
          clsx(
            "font-bold text-lg sm:text-xl lg:text-2xl duration-500 delay-100 text-center",
            show.header?"-translate-y-5 opacity-100":"translate-y-0 opacity-0"
          )
        }>
          {Data.LearnSpanishtitle}
        </h3>
        <p className={
          clsx(
            "text-center duration-500 delay-[400ms]",
            show.body?"-translate-y-5 opacity-100":"translate-y-0 opacity-0"
          )
        }>{Data.LearnSpanishdescription}</p>
        <TranslatedLink href="/videos">
        <StyledButton >{Data.LearnSpanishbutton}</StyledButton>
        </TranslatedLink>
      </div>
  </section>
  )
}