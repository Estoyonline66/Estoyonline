"use client"

import ImageBox from "@/components/ImageBox";
import { Dots1, Dots2, DoubleLeft, DoubleRight, HomeVector, MessagePhone, SunIcon } from "@/components/shapes";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from "@/lib/hooks/useMobile";
import { ChevronLeft, ChevronRight, HeartIcon } from "lucide-react";



export default function Home() {
    const isTabletScreen = useIsMobile(640)

  return (
    <>
    {/* hero section */}
    <section className="w-full h-fit py-40 px-4 md:px-10 lg:px-20 z-0 relative isolate flex items-center">
      {/* hero section, change uncomment the video and replace the video url with the necesssary url, remove image */}
      <ImageBox src="/Images/homeImage.png" className="size-full -z-10 absolute inset-0 object-center object-cover brightness-[.4]" width={1024} height={980}></ImageBox>
      {/* <video src="/viddemo.mp4" className="size-full absolute -z-10 inset-0 object-center object-cover brightness-[.4]" /> */}

      <div className="w-fit p-2 flex flex-col gap-4 text-white relative max-w-[70vw] sm:max-w-sm lg:max-w-md">
        <strong className="text-xl sm:text-2xl font-bold lg:text-4xl">The World <em className="text-primary not-italic">Speaks Spanish,</em> Will You?</strong>
        <p className="text-sm md:text-base">Learn Spanish online with native teachers and let the sun warm your words</p>
        <Button variant={"secondary"} className="!w-fit !px-4">Explore Courses</Button>
      </div>
    </section>


    <section className="w-full mt-10 px-4 relative flex items-center justify-center isolate h-fit">
      <span className="absolute pointer-events-none w-fit -left-5 top-5 h-screen block -z-10 overflow-x-hidden">
      <DoubleLeft className="h-full"/>
      </span>
      <span className="absolute pointer-events-none w-fit -right-0 top-10 h-screen block -z-10 overflow-x-hidden">
      <DoubleRight className="h-full relative left-5"/>
      </span>
      <div className="flex items-center justify-center flex-col gap-3 w-full max-w-3xl">
      <h3 className="font-bold text-xl sm:text-2xl lg:text-4xl text-center">Learn Spanish in a fun way at our boutique school.</h3>
      <p className="text-center">At our  boutique school Estyonline.es, based in Barcelona, we teach Spanish in fun and engaging way, completely different from traditional methods. Thanks the method techniques we use, learning spanish online has become an enjoyable and exciting process. Fun activities and game increase your motivation and reduce your stress, making language learning easier. Additionally, they encourage natural language use and strengthen social connections.  Learning a language in an enjoyable way enhances retention and effectively helps improve your language skills.Our School has teachers from Spain, Italy, Argentina, and Colombia who are native Spanish speakers. The teacher who conduct beginner-level lessons also speak Turish. All our lessons are conducted online via Zoom </p>
      <Button variant={"secondary"} className="!w-fit !px-4">Sample videos from Lesson</Button>
      </div>
    </section>


    <section className="w-full min-h-[500px] my-20">
      <div className="w-full px-4 md:px-10 lg:px-20 grid sm:grid-cols-2 items-center gap-10">
        <div className="w-full min-h-fit h-32 sm:h-60 relative flex items-center justify-center pointer-events-none">
          <HomeVector className="absolute w-[50vw] sm:w-full z-0 aspect-square"/>
          <ImageBox className="max-w-[50vw] sm:max-w-full object-contain aspect-square relative" src="/Images/homeImage2.png" width={500} height={500}/>
        </div>
        <div className="w-full flex gap-3 flex-col">
          <h3 className="font-bold text-xl sm:text-2xl lg:text-4xl">Hello! Hola! I’am <em className="shadows-into-light-regular text-secondary font-normal">Aleja</em>, the founder of Estyonline.es</h3>
          <p>
          An online Spanish school <strong>with over 300 students.</strong> We’re excited to tell you all about our boutique school and our lessons in detail. Let’s schedule a free class! I am looking forward to your Whatsapp message. <strong> Text us now!</strong>
          </p>
          <Button variant={"secondary"} className="!w-fit !px-4 mx-auto sm:mx-0"> <MessagePhone className="size-4"/> Whatsapp (530) 77 00 789</Button>
        </div>
      </div>
    </section>

    <section className="w-full py-20 px-4 relative overflow-x-hidden md:px-10 lg:px-20 bg-[#078CE2]">
      {/* sun image */}
      <SunIcon className="animate-[spin_10s_linear_infinite] size-20 sm:size-40 lg:size-60 absolute -top-10 -left-10 sm:-top-20 sm-left-20 lg:-top-30 lg-left-30"/>
      <SunIcon className="animate-[spin_10s_linear_infinite] size-20 sm:size-40 lg:size-60 absolute top-1/2 -translate-y-1/2 left-[calc(100%-2.5rem)] sm:left-[calc(100%-5rem)] lg:left-[calc(100%-7.5rem)]"/>
      <div className="w-full grid sm:grid-cols-2 items-center gap-5 isolate">
        <div className="w-full relative text-white flex flex-col justify-center gap-3 h-full">
          {
            !isTabletScreen&&<>
            <span className="absolute -bottom-5 -left-5 pointer-events-none -z-10">
            <Dots1/>
          </span>
          <span className="absolute -top-8 left-[70%] pointer-events-none -z-10">
            <Dots2/>
          </span>
            </>
          }
          <h3 className="font-bold text-xl sm:text-2xl lg:text-4xl">Start Your Spanish Learning Journey Today!</h3>
          <p>Join Estyonline.es and learn Spanish in a fun and engaging way.</p>
          <Button variant={"secondary"} className="!w-fit !px-4">Explore Courses</Button>
        </div>
        <ul className="w-full grid grid-cols-[repeat(auto-fit,_minmax(240px,1fr))] sm:grid-cols-2 gap-3">
          <li className="w-full max-h-52 sm:max-h-64 bg-primary rounded-md overflow-hidden">
            <ImageBox src="/Images/image (1).png" width={1024} height={1024} className="size-full object-cover object-top"/>
          </li>
          <li className="w-full max-h-52 sm:max-h-64 bg-primary rounded-md overflow-hidden">
            <ImageBox src="/Images/image (2).png" width={1024} height={1024} className="size-full object-cover object-top"/>
          </li>
          <li className="w-full max-h-52 sm:max-h-64 bg-primary rounded-md overflow-hidden">
            <ImageBox src="/Images/image (3).png" width={1024} height={1024} className="size-full object-cover object-top"/>
          </li>
          <li className="w-full max-h-52 sm:max-h-64 bg-primary rounded-md overflow-hidden">
            <ImageBox src="/Images/image (4).png" width={1024} height={1024} className="size-full object-cover object-top"/>
          </li>
        </ul>
      </div>
    </section>

          {/* carousel */}
    <section className="w-full flex flex-col gap-10 items-center justify-center py-20 px-4 relative overflow-x-hidden md:px-10 lg:px-20">
      <h3 className="font-bold text-xl sm:text-2xl lg:text-4xl text-center">What our clients are saying about us</h3>
    <Carousel className="w-full *:first:w-full">
      <CarouselContent className="-ml-1 gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="p-3 rounded-md border basis-[80vw] min-[498px]:basis-[300px]">
            <div className="flex gap-2">
              {/* image */}
              <span className="size-14 rounded-full overflow-hidden shrink-0">
                <ImageBox src="/Images/image (1).png" className="size-full object-cover object-center"/>
              </span>
              {/* content */}
              <div className="w-full flex flex-col gap-3">
                <div className="w-full flex items-center justify-between flex-col-reverse min-[300px]:flex-row">
                  <strong className="text-sm">umaysirke</strong>
                  <span className="flex items-center gap-2 shrink-0">
                    <em className="text-xs shrink-0 not-italic text-neutral-400">20 mins</em>
                    <HeartIcon className="text-transparent size-5 shrink-0" fill="#EB0004" fillOpacity={30}/>
                    <span className="size-5 bg-neutral-300 shrink-0 rounded-full"></span>
                  </span>
                </div>
                <p className="text-xs">
                Aleja ve onun öğretme yöntemini hep çok sevdim ve bir öğretmenin nasıl olması, nasıl eğlenerek öğretmesi konusunda hep onu örnek veririm 😍
                </p>
                <div className="w-full flex items-center justify-between text-xs text-neutral-400 flex-wrap">
                  <p>Responder</p>
                  <p>Ocultar</p>
                  <p>Ver traduccion</p>
                </div>
                <div className="w-full flex flex-col items-center gap-2 text-center">
                <strong className="text-sm">umaysirke</strong>
                <q className="text-xs">I have always loved Aleja and her teaching method.</q>
                </div>
              </div>

            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 sm:-left-5 !bg-neutral-700">
        <ChevronLeft className="bg-white rounded-full"/>
      </CarouselPrevious>
      <CarouselNext className="right-0 sm:left-[calc(100%+(var(--spacing)_*_-2))] !bg-neutral-700">
      <ChevronRight className="bg-white rounded-full"/>
      </CarouselNext>
    </Carousel>
    </section>

    {/* rating */}
        
    <ul className="w-full bg-secondary py-5 px-4 relative md:px-10 lg:px-20 grid grid-cols-1  sm:grid-cols-4 gap-3">
      <li className="p-2 flex text-white flex-col gap-3 items-center justify-center">
        <strong className="text-xl">700+</strong>
        <em className="not-italic text-xs">Success Stories</em>
      </li>
      <li className="p-2 flex text-white flex-col gap-3 items-center justify-center">
        <strong className="text-xl">200+</strong>
        <em className="not-italic text-xs">Expert Instructors</em>
      </li>
      <li className="p-2 flex text-white flex-col gap-3 items-center justify-center">
        <strong className="text-xl">80K+</strong>
        <em className="not-italic text-xs">Students</em>
      </li>
      <li className="p-2 flex text-white flex-col gap-3 items-center justify-center">
        <strong className="text-xl">500+</strong>
        <em className="not-italic text-xs">Trending Subjects</em>
      </li>
    </ul>
    </>
  );
}
