"use client";
// import react from "react"

import GeneralHero from "@/components/GeneralHero";
import Meta from "@/components/Meta";
import VideoCard from "@/components/sections/Videos/VideoCard";
import { DoubleLeft, DoubleRight, VideoLinedBottom } from "@/components/shapes";
import { useTranslation } from "@/contexts/TranslationProvider";
import { VideosData } from "@/types/PropTypes";

export default function Videos() {
  const { t } = useTranslation();
  const Data: VideosData = t("videos");
  const videos = Data?.videos || [];
  return (
    <>
      <Meta route="/videos"/>
      <GeneralHero icon={<VideoLinedBottom />} text={Data.PageTitle} />
      <section className="w-full overflow-hidden relative isolate flex flex-col items-center gap-7 p-4 md:px-20 lg:px-40 pt-10 pb-20">
        <span className="fixed pointer-events-none w-fit max-w-[20vw] -left-5 top-5 sm:h-screen block -z-10 overflow-x-hidden">
                  <DoubleLeft className="h-full w-full" />
                </span>
                <span className="fixed pointer-events-none w-fit max-w-[20vw] -right-0 top-10 sm:h-screen block -z-10 overflow-x-hidden">
                  <DoubleRight className="h-full relative left-5" />
                </span>
        {videos.map((vid, ind) => (
          <VideoCard key={ind} {...vid} />
        ))}
      </section>
    </>
  );
}
