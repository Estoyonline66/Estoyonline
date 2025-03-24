import StyledButton from '@/components/StyledButton'


export default function HomeHero() {
  return (
    <section className="w-full min-h-screen py-40 px-4 md:px-10 lg:px-20 z-0 relative isolate flex items-center">
          <span className='block size-full bg-black -z-10 absolute inset-0 brightness-[.3]'>
          <video src="/videos/banner.mp4" muted autoPlay playsInline loop className="size-full object-center object-cover" />
          </span>
    
          <div className="w-fit p-2 flex flex-col gap-5 animate-[pulse_1s_linear_forwards] text-white relative max-w-[95vw] min-[498px]:max-w-sm sm:max-w-lg lg:max-w-xl">
            <strong className="text-3xl sm:text-5xl font-bold lg:text-6xl">The World <em className="text-primary not-italic">Speaks Spanish,</em> Will You?</strong>
            <p className="text-base md:text-lg">Learn Spanish online with native teachers and let the sun warm your words</p>
            <StyledButton className="!w-fit !px-4 !text-base !mt-2 md:!text-lg">Explore Courses</StyledButton>
          </div>
        </section>
  )
}