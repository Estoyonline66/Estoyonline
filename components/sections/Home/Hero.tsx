"use client"
import ImageBox from '@/components/ImageBox'
import StyledButton from '@/components/StyledButton'
import { useTranslation } from '@/contexts/TranslationProvider'
import { HomeProps } from '@/types/PropTypes'


export default function HomeHero() {
  const { t } = useTranslation()
  const Data: HomeProps = t('home')

  return (
    <section className="w-full min-h-screen py-40 px-4 md:px-10 lg:px-20 z-0 relative isolate flex items-center">
          {/* hero section, change uncomment the video and replace the video url with the necesssary url, remove image */}
          <span className='block size-full bg-black -z-10 absolute inset-0'>
          <ImageBox src="/Images/homeImage.png" style={{
            animationDelay:"500ms"
          }} className="size-full animate-[pulse_1s_linear_forwards] object-center object-cover brightness-[.4]" width={1024} height={980}></ImageBox>
          </span>
          {/* <video src="/viddemo.mp4" className="size-full absolute -z-10 inset-0 object-center object-cover brightness-[.4]" /> */}
    
          <div className="w-fit p-2 flex flex-col gap-5 animate-[pulse_1s_linear_forwards] text-white relative max-w-[95vw] min-[498px]:max-w-sm sm:max-w-lg lg:max-w-xl">
            <strong className="text-3xl sm:text-5xl font-bold lg:text-6xl">{Data.HeroTitle} <em className="text-primary not-italic">{Data.HeroYellowTitle}</em> {Data.HeroTitle2}</strong>
            <p className="text-base md:text-lg">{Data.HeroDescription}</p>
            <StyledButton className="w-fit px-4 text-base mt-2 md:text-lg">{Data.HeroButton}</StyledButton>
          </div>
        </section>
  )
}