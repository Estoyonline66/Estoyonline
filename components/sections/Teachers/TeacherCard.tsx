"use client";

import { TeacherVideoShape } from "@/components/shapes";
import { Button } from "@/components/ui/button";
import useIntersectionObserver from "@/lib/hooks/useIntersector";
import clsx from "clsx";
import { Volume2Icon, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  teach: {
    name: string;
    about: string;
    media:string
  };
};

export default function TeacherCard({ teach }: Props) {
  const [muted, setMuted] = useState(false)
  const [play, setPlay]=useState(false)
  const vidRef = useRef<HTMLVideoElement>(null)
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

  useEffect(() => {
    const videoElement = vidRef.current
    
    if(videoElement){
      if(play){
        videoElement.play()
      }else{
        videoElement.pause()
      }

      videoElement.muted = muted
    }
  }, [vidRef, play, muted])
  
  return (
    <li className="flex items-center my-5 sm:my-10 flex-row-reverse sm:even:flex-row sm:odd:flex-row-reverse flex-wrap sm:flex-nowrap justify-center gap-10">
      <div
        ref={imageref}
        className="w-full relative isolate sm:w-[40%] sm:min-w-72 min-[498px]:max-w-fit shrink-0"
      >
        <div onMouseEnter={()=>setPlay(true)} onMouseLeave={()=>setPlay(false)} className="w-full bg-black overflow-hidden rounded-md h-72 relative">
          <video ref={vidRef} src={teach.media} className='size-full object-top object-cover aspect-square'></video>
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
            "absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 size-[calc(100%+2rem)] -z-10 pointer-events-none duration-500",
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
        className="w-full flex flex-col h-full gap-2"
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
