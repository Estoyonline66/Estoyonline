import React from 'react'
import { Button } from './ui/button'
import clsx from 'clsx';

type Props = {
    children: React.ReactNode;
    icon?:React.ReactNode;
    className?:string;
}

export default function StyledButton({children,icon,className}: Props) {
  return (
    <Button variant={"secondary"} className={
        clsx(
            "!w-fit !px-6 !py-3 !h-fit !rounded",
            className
        )
    }> {icon}{children}</Button>
  )
}