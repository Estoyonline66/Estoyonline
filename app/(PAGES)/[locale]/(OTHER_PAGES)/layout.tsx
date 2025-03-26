"use client"

import Footer from '@/components/footer/Footer'
import Navbar from '@/components/navbar/Navbar'
import React from 'react'

type Props = {
    children:React.ReactNode
}

export default function layout({children}: Props) {
  return (
    <>
    <Navbar />
            {children}
            <Footer />
    </>
  )
}