import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'Estoyonline | Teachers',
  description: 'Know more about our teachers.',
}



type Props = {
    children: React.ReactNode
}

export default function layout({children}: Props) {
  return (
    children
  )
}