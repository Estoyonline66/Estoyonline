"use client";

import { useTranslation } from "@/contexts/TranslationProvider";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import Flag from 'react-world-flags';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface languageOption {
  value: string;
  label: string;
  flag: string;
}
const languageOptions:languageOption[] = [
  { value: "en", label: "EN", flag:"gb" },
  { value: "es", label: "ES", flag:"es" },
  { value: "fr", label: "FR", flag:"fr" },
];

const Translator = () => {
  const { setLanguage, language } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<languageOption|undefined>(languageOptions.find(l=>l.value===language));
  const [filteredLanguagesOption, setFilteredLanguagesOption] = useState<languageOption[]>([])


  const handleChange = (value: string) => {
    const findLanguage = languageOptions.find(l=>l.value===value)
    setSelectedLang(findLanguage);
    setLanguage(value);
  };



  const handleSearchLangFilter = (value:string) =>{
    const filtered = languageOptions.filter(l=>l.value.includes(value) || l.flag.includes(value) || l.label.includes(value))
    setFilteredLanguagesOption(filtered)
  }

  useEffect(() => {
    handleSearchLangFilter("")
  }, [])
  

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex  h-fit items-center justify-between gap-2 cursor-pointer text-base sm:text-sm md:text-base lg:text-lg">
          <span className="size-6 overflow-hidden rounded-full flex items-center justify-center">
          <Flag code={selectedLang?.flag} className="size-full object-center object-cover"/>
          </span>
          {selectedLang?.label}
          <ChevronDown className="font-light" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit">
        <DropdownMenuLabel asChild>
          <div className="w-full flex flex-col px-2 gap-2">
            <strong>Select language</strong>

            {/* language filter element: uncomment as needed */}
            {/* <div className="w-full relative">
            <Input className="!bg-transparent !outline-none !ring-0 pr-7" placeholder="search language" onChange={(e)=>{
              handleSearchLangFilter(e.target.value)
            }}/>
            <span className="absolute right-0 top-0 w-7 h-full flex items-center justify-center">
              <Search className="size-4 text-neutral-500"/>
            </span>
            </div> */}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedLang?.value}
          onValueChange={handleChange}
          className="max-h-52 px-2 overflow-y-auto"
        >
          {filteredLanguagesOption.map((lang) => (
            <DropdownMenuRadioItem className="cursor-pointer" key={lang.value} value={lang.value}>
              <span className="size-4 overflow-hidden rounded-full flex items-center justify-center">
          <Flag code={lang.flag} className="size-full object-center object-cover"/>
          </span>
          {lang.label}
            </DropdownMenuRadioItem>
          ))}

        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Translator;
