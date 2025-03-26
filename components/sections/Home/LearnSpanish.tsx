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
    "LearnSpanishtitle": "Aprende español de manera divertida en nuestra escuela boutique.",
    "LearnSpanishdescription": "En nuestra escuela boutique Estyonline.es, con sede en Barcelona, enseñamos español de una manera divertida y atractiva, completamente diferente a los métodos tradicionales. Gracias a las técnicas de nuestro método, aprender español en línea se ha convertido en un proceso agradable y emocionante. Las actividades divertidas y los juegos aumentan tu motivación y reducen tu estrés, facilitando el aprendizaje del idioma. Además, fomentan el uso natural del lenguaje y fortalecen las conexiones sociales. Aprender un idioma de manera divertida mejora la retención y ayuda a mejorar tus habilidades lingüísticas de manera efectiva. Nuestra escuela cuenta con profesores de España, Italia, Argentina y Colombia, quienes son hablantes nativos de español. Los profesores que imparten clases para principiantes también hablan turco. Todas nuestras clases se realizan en línea a través de Zoom.",
    "LearnSpanishbutton": "Videos de muestra de la lección",
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
      <span className="absolute pointer-events-none w-fit -left-5 top-5 h-screen block -z-10 overflow-x-hidden">
        <DoubleLeft className="h-full"/>
      </span>
      <span className="absolute pointer-events-none w-fit -right-0 top-10 h-screen block -z-10 overflow-x-hidden">
        <DoubleRight className="h-full relative left-5"/>
      </span>
      <div className="flex items-center justify-center flex-col gap-3 w-full max-w-3xl">
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
        <TranslatedLink href="/videos">
        <StyledButton >{Data.LearnSpanishbutton?Data.LearnSpanishbutton:defaultData.LearnSpanishbutton}</StyledButton>
        </TranslatedLink>
      </div>
  </section>
  )
}