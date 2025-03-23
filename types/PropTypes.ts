export interface CoursesData {
  level: string;
  duration: string;
  book: string;
}
export interface LevelsProps{
  title: string;
  items: CoursesData[];
}
export interface CoursesData {
  title: string;
  lesson: string;
  time: string;
  week: string;
  month: string;
}
interface AccordionContent {
  contentTitle: string;
  contentDescription: string;
}

interface AccordionProps {
  title: string;
  content: AccordionContent[];
}
export interface PriceData {
  title: string;
  levels: LevelsProps[];
  cardCourses: CoursesData[];
  accordionData: AccordionProps[];
}