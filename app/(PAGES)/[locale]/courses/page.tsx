import Accordion from '@/components/Accordion/Accordion'
import Courses from '@/components/majors/Courses'

export default function page() {
    

  return (
    <div className="w-full flex flex-col justify-between gap-2 md:gap-5 pt-20">
      <Accordion/>  
      <Courses/>  
    </div>
  )
}
