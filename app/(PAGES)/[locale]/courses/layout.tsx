import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'Estoyonline | Courses',
  description: 'FInd the course of your interest.',
}


type Props = {
    children: React.ReactNode
}

export default function layout({children}: Props) {
  return (
    children
  )
}