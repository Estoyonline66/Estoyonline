"use client";

import { TeacherVideoShape } from "@/components/shapes";
import { Button } from "@/components/ui/button";
import useIntersectionObserver from "@/lib/hooks/useIntersector";
import { useIsMobile } from "@/lib/hooks/useMobile";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Volume2Icon, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  teach: {
    name: string;
    about: string;
    media: string;
  };
  id: number;
  activeVideo: number | null;
  onHover: (id: number | null) => void;
};

export default function TeacherCard({
  teach,
  activeVideo,
  id,
  onHover,
}: Props) {
  const isMobile = useIsMobile(640);
  const [muted, setMuted] = useState(true);
  const [play, setPlay] = useState(false);
  const vidRef = useRef<HTMLVideoElement>(null);
  const [show, setShow] = useState({
    image: false,
    body: false,
  });
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

  // Observer for text animation.
  const textref = useIntersectionObserver<HTMLDivElement>({
    onProgress(progress) {
      setShow((s) => ({ ...s, body: progress > 0.05 }));
    },
  });


  // When the video container becomes visible, auto‑play only once.
  useEffect(() => {
    if (show.image && !hasAutoPlayed) {
      onHover(id);
      setHasAutoPlayed(true);
    } else if (!show.image && activeVideo === id) {
      onHover(null);
    }
    if (!show.image) {
      setHasAutoPlayed(false);
    }
  }, [show.image, activeVideo, id, onHover, hasAutoPlayed]);

  // Reset the video to the start.
  const resetVideo = () => {
    if (vidRef.current) {
      vidRef.current.currentTime = 0;
    }
  };

  // Control playback based on whether this card is active.
  useEffect(() => {
    if (activeVideo === id) {
      setPlay(true);
    } else {
      setPlay(false);
      resetVideo();
    }
  }, [activeVideo, id]);

  // When play state changes, play or pause the video.
  useEffect(() => {
    const videoElement = vidRef.current;
    if (videoElement) {
      if (play) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
    }
  }, [play, muted]);

  return (
    <li className="flex items-center my-5 sm:my-10 flex-row-reverse sm:even:flex-row sm:odd:flex-row-reverse flex-wrap sm:flex-nowrap justify-center gap-10">
      <motion.div
        initial="offscreen"
      whileInView="onscreen"
      onViewportEnter={() => setShow((s) => ({ ...s, image: true }))}
      onViewportLeave={() => setShow((s) => ({ ...s, image: false }))}
      viewport={{ amount: 0.4 }}
        className="w-full relative isolate sm:w-[40%] sm:min-w-72 min-[498px]:max-w-fit shrink-0"
      >
        <div
          // On desktop, trigger onHover on mouse enter; on mobile, on click.
          onMouseEnter={() => !isMobile && onHover(id)}
          onClick={() => isMobile && onHover(id)}
          className="w-full bg-black overflow-hidden rounded-md h-72 relative"
        >
          <video
            onEnded={() => {
              setPlay(false);
              resetVideo();
              onHover(null);
            }}
            loop={false}
            disablePictureInPicture={true}
            controls={false}
            autoPlay={false}
            muted={muted}
            disableRemotePlayback={true}
            playsInline={true}
            ref={vidRef}
            src={teach.media}
            className="size-full object-top object-cover aspect-square"
          ></video>
          <Button
            onClick={() => setMuted(!muted)}
            className="!absolute !block !bottom-4 !left-1/2 !-translate-x-1/2 !p-2 !h-fit !bg-black/30 !backdrop-blur-3xl !text-white"
          >
            {muted ? (
              <VolumeX className="size-5" />
            ) : (
              <Volume2Icon className="size-5" />
            )}
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
      </motion.div>
      <div ref={textref} className="w-full flex flex-col h-full gap-2">
        <h4
          className={clsx(
            "uppercase text-secondary font-inkfree font-extrabold text-base sm:text-lg lg:text-xl delay-300 duration-500",
            show.body ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          )}
        >
          {teach.name}
        </h4>
        <p
          className={clsx(
            "text-sm sm:text-base lg:text-lg duration-500 delay-[600ms]",
            show.body ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          )}
        >
          {teach.about}
        </p>
      </div>
    </li>
  );
}
