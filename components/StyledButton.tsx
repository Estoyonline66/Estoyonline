import React from 'react'
import { Button } from './ui/button'
import clsx from 'clsx';

type Props = {
    children: React.ReactNode;
    icon?:React.ReactNode;
    className?:string;
    variant?:"secondary"|"primary"
}

export default function StyledButton({children,icon,className,variant="secondary"}: Props) {
  return (
    <Button variant={"secondary"} className={
        clsx(
            "!w-fit !text-base !px-6 styledButton",
            variant,
            className
        )
    }> {icon}{children}</Button>
  )
}