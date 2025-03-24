import Accordion from '@/components/Accordion/Accordion'
import GeneralHero from '@/components/GeneralHero'
import Courses from '@/components/majors/Courses'
import { BookIcon } from '@/components/shapes'

export default function page() {
    

  return (
    <>
    <GeneralHero icon={<BookIcon/>} text='Courses'/>
    <div className="w-full flex flex-col justify-between gap-2 md:gap-5 pt-20">
      <Accordion/>  
      <Courses/>  
    </div>
    </>
  )
}
