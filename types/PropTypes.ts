import { Metadata } from "next";

export interface HomeProps {
  HeroTitle: string;
  HeroYellowTitle: string;
  HeroTitle2: string;
  HeroDescription: string;
  HeroButton: string;
  LearnSpanishtitle: string;
  LearnSpanishdescription: string;
  LearnSpanishbutton: string;
  homeAboutTitle: string;
  homeAboutTitle2: string;
  homeAboutDescription: string;
  homeAboutDescriptionBold: string;
  homeAboutDescription2: string;
  homeAboutDescriptionBold2: string;
  homeAboutButton: string;
  homeSubAboutTitle: string;
  homeSubAboutDescription: string;
  homeSubAboutButton: string;
  testimonies: string;
  counterTitle: string;
  counterTitle2: string;
  counterTitle3: string;
  counterTitle4: string;
}
export interface CoursesData {
  level: string;
  duration: string;
  book: string;
  bold: string;
}
export interface LevelsProps {
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

// seo types

interface SeoPageData {
  route: string;
  datas: Metadata;
}
export interface SeoData {
  pages:SeoPageData[]
}

// -----------------
export interface PriceData {
  title: string;
  levels: LevelsProps[];
  cardCourses: CoursesData[];
  accordionData: AccordionProps[];
  home: HomeProps[];
}
