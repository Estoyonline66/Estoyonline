import { Metadata } from 'next'
import React from 'react'



export const metadata: Metadata = {
  title: 'Estoyonline | Start your spanish learning journey',
  description: 'Learn Spanish online with native teachers and let the sun warm your words',
}


type Props = {
    children: React.ReactNode
}


export default function layout({children}: Props) {
  return (
    children
  )
}