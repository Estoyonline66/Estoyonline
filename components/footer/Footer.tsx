import Image from 'next/image'
import React from 'react'

export default function Footer() {
  return (
      <footer className='h-[362px] w-full bg-[#E9E8E8] flex items-center justify-center'>
          <div>
              <Image src="/Images/EstoyLogo.svg" alt="EstoyLogo" width={200} height={100}/>
          </div>
          
    </footer>
  )
}
