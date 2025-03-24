"use client";

import { TeacherVideoShape } from "@/components/shapes";
import { Button } from "@/components/ui/button";
import useIntersectionObserver from "@/lib/hooks/useIntersector";
import clsx from "clsx";
import { Volume2Icon, VolumeX } from "lucide-react";
import { useState } from "react";

type Props = {
  teach: {
    name: string;
    about: string;
  };
};

export default function TeacherCard({ teach }: Props) {
  const [muted, setMuted] = useState(false)
  const [show, setShow] = useState({
    image: false,
    body: false,
  });
  const textref = useIntersectionObserver<HTMLDivElement>({
    onProgress(progress) {
      if (progress > 0.05) {
        setShow((s) => ({
          ...s,
          body: true,
        }));
      } else {
        setShow((s) => ({
          ...s,
          body: false,
        }));
      }
    },
  });
  const imageref = useIntersectionObserver<HTMLDivElement>({
    onProgress(progress) {
      if (progress > 0.05) {
        setShow((s) => ({
          ...s,
          image: true,
        }));
      } else {
        setShow((s) => ({
          ...s,
          image: false,
        }));
      }
    },
  });
  return (
    <li className="flex items-center flex-row-reverse sm:even:flex-row sm:odd:flex-row-reverse flex-wrap sm:flex-nowrap justify-center gap-10">
      <div
        ref={imageref}
        className="w-full relative isolate sm:w-[40%] sm:min-w-72 shrink-0 p-5"
      >
        <div className="w-full bg-black overflow-hidden rounded-md h-52 sm:h-72 relative">
          {/* <video src="" className='size-full object-center object-cover'></video> */}
          <Button onClick={()=>{
            setMuted(!muted)
          }} className="!absolute !block !bottom-4 !left-1/2 !-translate-x-1/2  !p-2 !h-fit !bg-black/30 !backdrop-blur-3xl !text-white">
          {
            muted?<VolumeX className="size-5"/>:<Volume2Icon className="size-5"/>
          }
          </Button>
        </div>
        <span
          className={clsx(
            "absolute inset-0 size-full scale-105 sm:scale-110 -z-10 pointer-events-none duration-500",
            show.image
              ? "scale-100 opacity-100 rotate-0"
              : "scale-50 opacity-50 rotate-180"
          )}
        >
          <TeacherVideoShape className="size-full" />
        </span>
      </div>
      <div
        ref={textref}
        className="w-full py-4 sm:p-5 flex flex-col h-full gap-2"
      >
        <h4 className={
          clsx(
            "uppercase text-secondary font-bold text-base sm:text-lg lg:text-xl delay-300 duration-500",
            show.body?"translate-y-0 opacity-100":"translate-y-5 opacity-0"
          )
        }>
          {teach.name}
        </h4>
        <p className={clsx(
          "text-sm sm:text-base lg:text-lg duration-500 delay-[600ms]",
          show.body?"translate-y-0 opacity-100":"translate-y-5 opacity-0"
        )}>{teach.about}</p>
      </div>
    </li>
  );
}
