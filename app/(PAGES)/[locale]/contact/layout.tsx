import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'Estoyonline | Contact us',
  description: 'Get in touch with us and begin your learning journey.',
}


type Props = {
    children: React.ReactNode
}

export default function layout({children}: Props) {
  return (
    children
  )
}