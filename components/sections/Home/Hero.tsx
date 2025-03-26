import ImageBox from "@/components/ImageBox";
import HeroContent from "./HeroContent";

export default function HomeHero() {
  return (
    <section className="w-full min-h-screen py-40 px-4 md:px-10 lg:px-20 z-0 relative isolate flex items-center">
      <span className="block size-full -z-10 absolute inset-0 brightness-[.3] isolate">
        <ImageBox src="/Images/homeImage.png" width={1440} height={1080} className="size-full absolute inset-0 object-center object-cover -z-10"/>
        <video
          src="/videos/banner.mp4"
          muted
          autoPlay
          playsInline
          loop
          className="size-full object-center object-cover"
        />
      </span>
      <HeroContent/>
    </section>
  );
}
