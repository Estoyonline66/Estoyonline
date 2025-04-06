"use client";
import { Dots1, Dots2 } from "@/components/shapes";
import { AnimatedSunLogo } from "@/components/shapes/logo";
import StyledButton from "@/components/StyledButton";
import TranslatedLink from "@/components/TranslatedLink";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/TranslationProvider";
import useIntersectionObserver from "@/lib/hooks/useIntersector";
import { useIsMobile } from "@/lib/hooks/useMobile";
import { HomeProps } from "@/types/PropTypes";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Volume2Icon, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// VideoItem now receives the containerVisible prop from JourneyCTA.
const VideoItem = ({
  video,
  id,
  activeVideo,
  onHover,
  containerVisible,
}: {
  video: string;
  id: number;
  activeVideo: number | null;
  onHover: (id: number | null) => void;
  containerVisible: boolean;
}) => {
  const isMobile = useIsMobile(640);
  const [show, setShow] = useState(false);
  const [muted, setMuted] = useState(true);
  const [play, setPlay] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const vidRef = useRef<HTMLVideoElement>(null);

  // Reset the video to the start.
  const resetVideo = () => {
    if (vidRef.current) {
      vidRef.current.currentTime = 0;
    }
  };

  // Use containerVisible to control when the video should auto-play.
  useEffect(() => {
    if (containerVisible) {
      setShow(true);
      if (!hasPlayed) {
        setPlay(true);
        setHasPlayed(true);
      }
    } else {
      setShow(false);
      setPlay(false);
      setHasPlayed(false);
      resetVideo();
      onHover(null);
    }
  }, [containerVisible, hasPlayed, onHover]);

  // Play or pause the video based on the local "play" state.
  useEffect(() => {
    const videoElement = vidRef.current;
    if (videoElement) {
      if (play) {
        videoElement.play();
      } else {
        videoElement.pause();
        resetVideo();
      }
    }
  }, [play]);

  // When a hover is active, ensure only the active video plays.
  useEffect(() => {
    if (hasPlayed && activeVideo !== null) {
      if (activeVideo === id) {
        setPlay(true);
      } else {
        setPlay(false);
        resetVideo();
      }
    }
  }, [activeVideo, id, hasPlayed]);

  return (
    <li
      // On hover, notify the parent so it can set this video as active.
      onMouseEnter={() => !isMobile?onHover(id):null}
      onClick={() => isMobile?onHover(id):null}
      className={clsx(
        "w-full sm:w-full lg:w-1/2 mx-auto max-h-52 sm:max-h-64 cursor-pointer bg-primary relative rounded-md duration-500 overflow-hidden",
        show ? "scale-100 opacity-100" : "scale-0 opacity-0"
      )}
    >
      <video
        ref={vidRef}
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
        src={video}
        width={1024}
        height={1024}
        className="size-full object-cover aspect-square object-top"
      />
      <Button
        onClick={() => setMuted(!muted)}
        className="!absolute !block !bottom-4 !left-1/2 !-translate-x-1/2 !p-2 !h-fit !bg-black/30 !backdrop-blur-3xl !text-white"
      >
        {muted ? <VolumeX className="size-5" /> : <Volume2Icon className="size-5" />}
      </Button>
    </li>
  );
};



export default function JourneyCTA() {
  const isTabletScreen = useIsMobile(640);
  const [show, setShow] = useState({
    body: false,
  });
  // Track which video is currently hovered/active.
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  // Track the visibility of the videos container.
  const [containerVisible, setContainerVisible] = useState(false);

  const { t } = useTranslation();
  const Data: HomeProps = t("home");
  const defaultData = {
    homeSubAboutTitle: "¡Comienza tu viaje de aprendizaje del español hoy!",
    homeSubAboutButton: "Explorar Cursos",
  };

  const bodyRef = useIntersectionObserver<HTMLDivElement>({
    onProgress(progress) {
      if (progress > 0.05) {
        setShow((s) => ({ ...s, body: true }));
      } else {
        setShow((s) => ({ ...s, body: false }));
      }
    },
  });



  return (
    <section className="w-full py-20 px-4 relative overflow-x-hidden md:px-10 lg:px-20 bg-[#0068FF]">
      {/* sun image */}
      <AnimatedSunLogo
        svg={{
          className:
            "size-40 sm:size-60 absolute -top-20 -left-20 sm:-top-30 sm:-left-30",
        }}
      />
      
      <div className="w-full grid sm:grid-cols-2 items-center gap-5 isolate">
        <div
          ref={bodyRef}
          className="w-full relative text-white flex flex-col text-center justify-center gap-5 h-full"
        >
          {!isTabletScreen && (
            <>
              <span className="absolute -bottom-5 -left-5 pointer-events-none -z-10">
                <Dots1 />
              </span>
              <span className="absolute -top-8 left-[70%] pointer-events-none -z-10">
                <Dots2 />
              </span>
            </>
          )}
          <h3
            className={clsx(
              "font-bold text-2xl sm:text-2xl lg:text-2xl duration-500",
              show.body
                ? "sm:translate-x-0 sm:translate-y-0 opacity-100"
                : "sm:-translate-x-10 sm:translate-y-0 translate-y-10 opacity-0"
            )}
          >
            {Data.homeSubAboutTitle
              ? Data.homeSubAboutTitle
              : defaultData.homeSubAboutTitle}
          </h3>
          
          <TranslatedLink href={"/courses"}>
            <StyledButton className="!mt-2">
              {Data.homeSubAboutButton
                ? Data.homeSubAboutButton
                : defaultData.homeSubAboutButton}
            </StyledButton>
          </TranslatedLink>
        </div>
        <motion.ul
          initial="offscreen"
          whileInView="onscreen"
          onViewportEnter={() => setContainerVisible(true)}
          onViewportLeave={() => setContainerVisible(false)}
          viewport={{ amount: 0.4 }}
          className="w-full grid grid-cols-[repeat(auto-fit,_minmax(240px,1fr))] sm:grid-cols-1 gap-10"
        >
			{(isTabletScreen
		  ? Data.homeSubAboutVideos?.slice(0, 1) // show only the first video on mobile
		  : Data.homeSubAboutVideos // show all videos on desktop
		)?.map((video, i) => (
		  <VideoItem
			key={i}
			id={i}
			video={video}
			activeVideo={activeVideo}
			onHover={(id) => {
			  if (activeVideo !== id) {
				setActiveVideo(id);
			  }
			}}
			containerVisible={containerVisible}
		  />
		))}
        </motion.ul>
      </div>
    </section>
  );
}
