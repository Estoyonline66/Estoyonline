"use client"

import { useTranslation } from '@/contexts/TranslationProvider'
import clsx from 'clsx'
import { Instagram } from 'lucide-react'
import WebsiteLogo from '../shapes/logo'
import TranslatedLink from '../TranslatedLink'
import { Button } from '../ui/button'

export default function Footer() {
  const { t } = useTranslation(); // doğru namespace kullanıldığından emin olun
  const navigationData = t<{
    links: Record<string, string>
  }>('navbar');

  const instagramUrl = t('social.instagram');

  return (
    <footer className='py-10 w-full bg-[#E9E8E8] flex items-center justify-center relative z-10 flex-col gap-7'>
      <div>
        <TranslatedLink href={"/"} className="w-fit">
          <WebsiteLogo svg={{ className: "h-8 md:h-10 lg:h-12 w-fit" }} />
        </TranslatedLink>
      </div>

      <nav className="w-full min-[498px]:w-fit flex flex-col min-[498px]:flex-row items-center gap-5 text-sm md:text-base lg:text-lg">
        {
          navigationData.links && Object.keys(navigationData.links).map((link) => (
            <TranslatedLink
              key={link}
              href={navigationData.links[link]}
              className={clsx(
                "relative w-fit text-center",
                "before:w-0 before:absolute before:h-[2px] before:bg-gradient-to-r before:from-secondary before:to-primary",
                "hover:before:w-full hover:before:absolute hover:before:bg-gradient-to-r hover:before:from-secondary hover:before:to-primary",
                "before:duration-500 before:-bottom-1 before:left-0 before:rounded-full before:delay-150"
              )}
            >
              {link}
            </TranslatedLink>
          ))
        }
      </nav>

      <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="ghost">
          <Instagram className='size-6 sm:size-10 text-neutral-800' />
        </Button>
      </a>

      <p className='text-xs sm:text-sm'>© 2025 EstoyOnline.es | All Rights Reserved</p>
    </footer>
  );
}
