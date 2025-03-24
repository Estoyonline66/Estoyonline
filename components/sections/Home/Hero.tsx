import ImageBox from '@/components/ImageBox'
import { Button } from '@/components/ui/button'
import React from 'react'


export default function HomeHero() {
  return (
    <section className="w-full min-h-screen px-4 md:px-10 lg:px-20 z-0 relative isolate flex items-center">
      {/* hero section, change uncomment the video and replace the video url with the necesssary url, remove image */}
      <ImageBox src="/Images/homeImage.png" className="size-full -z-10 absolute inset-0 object-center object-cover brightness-[.4]" width={1024} height={980}></ImageBox>
      {/* <video src="/viddemo.mp4" className="size-full absolute -z-10 inset-0 object-center object-cover brightness-[.4]" /> */}

      <div className="w-fit p-2 flex flex-col gap-4 text-white relative max-w-[70vw] md:max-w-sm lg:max-w-2xl">
        <strong className="text-xl md:text-2xl font-bold lg:text-[3.5rem]">The World <em className="text-primary not-italic">Speaks Spanish,</em> Will You?</strong>
        <p className="text-sm md:text-base">Learn Spanish online with native teachers and let the sun warm your words</p>
        <Button variant={"secondary"} className="!w-fit !px-4 !py-2 sm:text-xl lg:text- !h-fit">Explore Courses</Button>
      </div>
    </section>
  )
}