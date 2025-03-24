"use client"


import { useTranslation } from '@/contexts/TranslationProvider'
import { Instagram } from 'lucide-react'
import Image from 'next/image'
import { Button } from '../ui/button'
import TranslatedLink from '../TranslatedLink'
import clsx from 'clsx'

export default function Footer() {
    const {t} = useTranslation()
    const navigationData = t<{
      links: Record<string, string>
    }>("navbar")
  
  return (
      <footer className='py-10 w-full bg-[#E9E8E8] flex items-center justify-center flex-col gap-7'>
          <div>
              <Image src="/Images/EstoyLogo.svg" alt="EstoyLogo" width={200} height={100}/>
          </div>

          <nav className="w-full min-[498px]:w-fit flex flex-col min-[498px]:flex-row items-center gap-5 text-sm md:text-base lg:text-lg">
          {
              navigationData.links&&Object.keys(navigationData.links||{
                "Teachers":"/teachers",
                "Courses":"/courses",
                "Videos":"/videos",
                "Price":"/price",
                "Contact":"/contact"
              }).map((link)=><TranslatedLink key={link} href={navigationData.links[link]} className={clsx(
                                "relative w-fit min-[498px]:w-fit text-center",
                                "before:w-0 before:absolute before:h-[2px] before:bg-gradient-to-r before:from-secondary before:to-primary",
                                "hover:before:w-full hover:before:absolute hover:before:bg-gradient-to-r hover:before:from-secondary hover:before:to-primary",
                                "before:duration-500 before:-bottom-1 before:left-0 before:rounded-full before:delay-150"
                              )}>{link}</TranslatedLink>)
            }
          </nav>

          <Button variant="ghost">
            <Instagram className='size-6 sm:size-10 text-neutral-800'/>
          </Button>
          
          <p className='text-xs sm:text-sm'>© 2025 EstoyOnline.es | All Rights Reserved</p>
    </footer>
  )
}
