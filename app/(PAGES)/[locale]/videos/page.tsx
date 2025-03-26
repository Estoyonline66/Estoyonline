"use client";
// import react from "react"

import GeneralHero from "@/components/GeneralHero";
import Meta from "@/components/Meta";
import VideoCard, { video } from "@/components/sections/Videos/VideoCard";
import { VideoLinedBottom } from "@/components/shapes";

export default function Videos() {
  const videos: video[] = [
    {
      title: "A1.1 Spanish  Beginner Level",
      description:
        "At the beginning level, you start speaking Spanish from the first lesson.",
      youtubeId: "JP1dSslQqVc",
    },
    {
      title: "A1.1 Spanish  Beginner Level",
      description:
        "Our students reach basic speaking proficiency amd use simple grammatical structure within a few weeks.",
      youtubeId: "hdyEE5YDQBg",
    },
    {
      title: "A1.1 Spanish  Beginner Level",
      description:
        "At the beginner level, our teachers sometimes help with Turkish.",
      youtubeId: "_x1uuq4Ta2c",
    },
    {
      title: "A2.1 Spanish Basic Level",
      description:
        "Our students reach have reached this level are now advanced enoungh to have a simple conversion",
      youtubeId: "MMYkbSAKdN4",
    },
    {
      title: "A2.1 Spanish Basic Level",
      description:
        "Our teachers take care to make the lesson fun by using creative methods and objects from daily life. ",
      youtubeId: "aJg6gEIYsFs",
    },
    {
      title: "A2.2 Spanish Intermediate Level",
      description:
        "Our students at A2.2 level can make detailed descriptions with a wide vocabulary and comprehensive use of grammar.",
      youtubeId: "H5tmRgVsBSY",
    },
    {
      title: "A2.3 Spanish Intermediate Level",
      description:
        "At level A2.3, dialogues now reach a normal speaking tempo and use special terms.",
      youtubeId: "0jxqVyG5tt8",
    },
    {
      title: "B1.2 Advance Spanish",
      description:
        "Advanced students have no trouble understanding and using the fast spoken language of Spanish.",
      youtubeId: "srggR7eHxc8",
    },
    {
      title: "B1.6 Spanish Advanced Level",
      description:
        "Advanced students are now fully adapted to the pace of spanish",
      youtubeId: "nsnLOSRtrd4",
    },
  ];
  return (
    <>
        <Meta route="/videos"/>
      <GeneralHero icon={<VideoLinedBottom />} text="Videos" />
      <section className="w-full flex flex-col items-center gap-7 p-4 md:px-10 lg:px-20 pt-10 pb-20">
        {videos.map((vid, ind) => (
          <VideoCard key={ind} {...vid} />
        ))}
      </section>
    </>
  );
}
