"use client"

import React, { useState } from "react";
import Translator from "../Translator";
import ImageBox from "../ImageBox";
import Link from "next/link";
import { useIsMobile } from "@/lib/hooks/useMobile";
import { Button } from "../ui/button";
import MenuIcon from "../MenuIcon";
import clsx from "clsx";
import { X } from "lucide-react";

export default function Navbar() {
  const isTabletScreen = useIsMobile(640)
  const [dropped, setDropped] = useState(false)

  const handleToggleDropMenu = ()=>{
    setDropped(!dropped)
  }
  return (
    <header className="w-full bg-white shadow-md sticky top-0 p-4 md:px-10 lg:px-20 flex items-center justify-between gap-5">
      {/* logo */}
      <span className="w-fit">
        <ImageBox
          fallback={
            <strong className="text-lg text-black">estoyonline.es</strong>
          }
          className="h-6 min-[498px]:h-8 md:h-10 lg:h-12 w-fit"
          src={"/Images/logo.png"}
          width={500}
          height={300}
          alt="logo image"
        />
      </span>

      
     
      {/* for smaller screen */}
      {
        isTabletScreen&&<Button variant="ghost" onClick={handleToggleDropMenu} className="!bg-transparent !p-0">
        {!dropped?<MenuIcon path={{
            stroke:"#000",
          }} svg={{
            className:"size-6 min-[498px]:size-8"
          }} />:<X className="size-6 min-[498px]:size-8"/>}
        </Button>
      }

      <div className={
        clsx(
          "w-full sm:w-fit absolute left-0 duration-300 shadow-md p-2 sm:p-0 sm:shadow-none bg-white sm:static flex flex-col-reverse sm:flex-row items-center gap-5",
          isTabletScreen&&{
            "top-[100%] opacity-100":dropped,
            "top-[-200%] opacity-0 pointer-events-none":!dropped,
          }
        )
      }>
        <Translator />
        <nav className="w-full min-[498px]:w-fit flex flex-col min-[498px]:flex-row items-center gap-5 text-sm md:text-base lg:text-lg">
          
              <Link href="/" className="w-full min-[498px]:w-fit text-center border-b min-[498px]:border-b-0 border-b-primary">Teachers</Link>
              <Link href="/" className="w-full min-[498px]:w-fit text-center border-b min-[498px]:border-b-0 border-b-primary">Courses</Link>
              <Link href="/" className="w-full min-[498px]:w-fit text-center border-b min-[498px]:border-b-0 border-b-primary">Videos</Link>
              <Link href="/" className="w-full min-[498px]:w-fit text-center border-b min-[498px]:border-b-0 border-b-primary">Price</Link>
              <Link href="/" className="w-full min-[498px]:w-fit text-center border-b min-[498px]:border-b-0 border-b-primary">Contact</Link>
        </nav>
        </div>

      
    </header>
  );
}
