"use client"; 
import Image from 'next/image'
import { motion } from 'framer-motion'
import React from 'react'

export default function BgSvg() {
  return (
    <div className='w-full h-full flex justify-between overflow-hidden'>
      {/* Left side */}
      <div className='flex flex-col gap-[10rem] mt-[15rem]'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            rotate: [0, 8, -8, 0], 
            y: [0, -12, 12, 0]
          }}
          transition={{
            duration: 3.5,
            ease: [0.42, 0, 0.58, 1],
            repeat: Infinity, // Repeat animation
            repeatDelay: 5 // Wait 5s before repeating
          }}
        >
          <Image src="/Images/Vector 8.svg" alt="1" width={55} height={200} className='md:w-[6rem] ml-[-1rem]' />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            rotate: [0, -8, 8, 0],
            y: [0, 12, -12, 0]
          }}
          transition={{
            duration: 3.5,
            ease: [0.42, 0, 0.58, 1],
            delay: 0.3,
            repeat: Infinity,
            repeatDelay: 5
          }}
        >
          <Image src="/Images/Artboard 1 copy 4ldpi 2.svg" alt="1" width={85} height={100} className='md:w-[15rem] ml-[-1rem]' />
        </motion.div>
      </div>

      {/* Right side */}
      <div className='flex flex-col gap-[2rem] items-end'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            rotate: [0, 5, -5, 0],
            y: [0, -10, 10, 0]
          }}
          transition={{
            duration: 3.5,
            ease: [0.42, 0, 0.58, 1],
            delay: 0.6,
            repeat: Infinity,
            repeatDelay: 5
          }}
        >
          <Image src="/Images/Artboard 1.svg" alt="1" width={100} height={100} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            rotate: [0, -6, 6, 0],
            y: [0, 9, -9, 0]
          }}
          transition={{
            duration: 3.5,
            ease: [0.42, 0, 0.58, 1],
            delay: 0.9,
            repeat: Infinity,
            repeatDelay: 5
          }}
        >
          <Image src="/Images/Vector 7.svg" alt="1" width={60} height={50} className='md:w-[10rem] mr-[-1rem]' />
        </motion.div>
      </div>
    </div>
  )
}
