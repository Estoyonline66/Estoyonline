"use client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

export interface video {
  youtubeId: string;
  title: string;
  description: string;
}

export default function VideoCard(vid: video) {
    const [loading, setLoading] = useState(true)
  const opts: YouTubeProps["opts"] = {
    playerVars: {
      autoplay: 0,
    },
  };
  const videoReady = ()=>{
    setLoading(false)
  }
  return (
    <div className="w-full grid sm:grid-cols-2 items-center border gap-5 p-4 rounded-md">
      <span className="w-full rounded-md overflow-hidden bg-black relative">
        {
            loading&&<Loader2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white size-10 animate-spin"/>
        }
        <YouTube
        loading="lazy"
        onReady={videoReady}
          videoId={vid.youtubeId}
          opts={opts}
          className="*:w-full *:h-52"
        />
      </span>
      <div className="w-full flex flex-col gap-3 items-center justify-center text-center">
        <strong className="font-bold text-xl sm:text-2xl lg:text-4xl">
          {vid.title}
        </strong>
        <p className="text-sm sm:text-base text-neutral-600">
          {vid.description}
        </p>
      </div>
    </div>
  );
}
