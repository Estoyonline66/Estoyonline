import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'Estoyonline | Videos | Understand our learning process',
  description: 'Find out how our leaning system works.',
}

type Props = {
    children: React.ReactNode
}

export default function layout({children}: Props) {
  return (
    children
  )
}