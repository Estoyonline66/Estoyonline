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
  const defaultData = {
    "LearnSpanishtitle": "Learn Spanish in a fun way at our boutique school.",
    "LearnSpanishdescription": "At our boutique school based in Barcelona, EstoyOnline.es, we teach Spanish in a way that's very different from traditional methods—through fun and enjoyment. With our modern techniques, learning Spanish online becomes a truly enjoyable and engaging experience. Fun activities and games boost motivation, reduce stress, and make language learning easier. They also promote natural language use and help strengthen social bonds. Learning a language in a fun way not only improves retention but also enhances your overall language skills effectively. All our teachers are native Spanish speakers from Spain and Latin America. All classes are held online via Zoom.",
    "LearnSpanishbutton": "Course Fees",
  };
  
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
      <span className="absolute pointer-events-none w-fit max-w-[20vw] -left-5 top-5 sm:h-screen block -z-10 overflow-x-hidden">
              <DoubleLeft className="h-full w-full"/>
            </span>
            <span className="absolute pointer-events-none w-fit max-w-[20vw] -right-0 top-10 sm:h-screen block -z-10 overflow-x-hidden">
              <DoubleRight className="h-full relative left-5"/>
            </span>
      <div className="flex items-center justify-center flex-col gap-3 w-full max-w-3xl bg-white">
        <h3 className={
          clsx(
            "font-bold text-lg sm:text-xl lg:text-2xl duration-500 text-center",
            show.header?"-translate-y-5 opacity-100":"translate-y-0 opacity-0"
          )
        }>
          {Data.LearnSpanishtitle?Data.LearnSpanishtitle:defaultData.LearnSpanishtitle}
        </h3>
        <p className={
          clsx(
            "text-center duration-500 delay-[300ms]",
            show.body?"-translate-y-5 opacity-100":"translate-y-0 opacity-0"
          )
        }>{Data.LearnSpanishdescription?Data.LearnSpanishdescription:defaultData.LearnSpanishdescription}</p>
        <TranslatedLink href="/price">
        <StyledButton >{Data.LearnSpanishbutton?Data.LearnSpanishbutton:defaultData.LearnSpanishbutton}</StyledButton>
        </TranslatedLink>
      </div>
  </section>
  )
}