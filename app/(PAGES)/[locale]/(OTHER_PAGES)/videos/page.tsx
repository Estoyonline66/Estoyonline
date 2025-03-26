"use client";
// import react from "react"

import GeneralHero from "@/components/GeneralHero";
import Meta from "@/components/Meta";
import VideoCard from "@/components/sections/Videos/VideoCard";
import { VideoLinedBottom } from "@/components/shapes";
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
      <section className="w-full flex flex-col items-center gap-7 p-4 md:px-10 lg:px-20 pt-10 pb-20">
        {videos.map((vid, ind) => (
          <VideoCard key={ind} {...vid} />
        ))}
      </section>
    </>
  );
}
