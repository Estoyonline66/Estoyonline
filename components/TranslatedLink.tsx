"use client"
import { useTranslation } from '@/contexts/TranslationProvider'
import Link from 'next/link'
import React, { ComponentProps } from 'react'

type LinkProps = ComponentProps<typeof Link>;

export default function TranslatedLink(props: LinkProps) {
    const { language } = useTranslation();
    return (
        <Link {...props} href={`/${language}${props.href}`}>
            {props.children}
        </Link>
    );
}