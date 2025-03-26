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
export interface TeachersTeacher {
  name: string;
  about: string;
  media:string
}
export interface TeachersData {
  PageTitle: string;
  teachersTitle: string;
  teachersTitleRed: string;
  teachersTitle2: string;
  teacher: TeachersTeacher[]
}

export interface VideosVideo {
  title: string;
  description: string;
  youtubeId: string;
}
export interface VideosData {
  PageTitle: string;
  videos: VideosVideo[];
}

export interface CoursesData {
  level: string;
  duration: string;
  book: string;
  bold: string;
  PageTitle: string;
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
export interface ContactData{
  PageTitle: string;
  needAssistance: string;
  contactDescription: string;
  officeAddressTitle: string;
  officeAddressDescription: string;
  officeContactButton: string;
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
