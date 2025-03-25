"use client"
// import ImageBox from '@/components/ImageBox'
import StyledButton from '@/components/StyledButton'
import TranslatedLink from '@/components/TranslatedLink'
import { useTranslation } from '@/contexts/TranslationProvider'
import { HomeProps } from '@/types/PropTypes'


export default function HomeHero() {
  const { t } = useTranslation()
  const Data: HomeProps = t('home')

  return (
    <section className="w-full min-h-screen py-40 px-4 md:px-10 lg:px-20 z-0 relative isolate flex items-center">
          <span className='block size-full bg-black -z-10 absolute inset-0 brightness-[.3]'>
          <video src="/videos/banner.mp4" muted autoPlay playsInline loop className="size-full object-center object-cover" />
          </span>
    
          <div className="w-fit p-2 flex flex-col gap-5 animate-[pulse_1s_linear_forwards] text-white relative max-w-[95vw] min-[498px]:max-w-sm sm:max-w-lg lg:max-w-xl">
            <strong className="text-3xl sm:text-5xl font-bold lg:text-6xl">{Data.HeroTitle} <em className="text-primary not-italic">{Data.HeroYellowTitle}</em> {Data.HeroTitle2}</strong>
            <p className="text-base md:text-lg">{Data.HeroDescription}</p>
            <TranslatedLink href={"/courses"}>
            <StyledButton className="w-fit px-4 text-base mt-2 md:text-lg">{Data.HeroButton}</StyledButton>
            </TranslatedLink>
          </div>
        </section>
  )
}