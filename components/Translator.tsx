"use client";

import { useTranslation } from "@/contexts/TranslationProvider";
import { useState } from "react";

const languageOptions = [
  { value: "en", label: "EN" },
  { value: "es", label: "ES" },
  { value: "fr", label: "FR" },
];

const Translator = () => {
  const { t, setLanguage, language } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(language);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLang(e.target.value);
    setLanguage(e.target.value);
  };

  return (
    <div className="px-6 text-center flex items-center gap-9">
      <h2 className="text-2xl font-bold">{t("welcome")}</h2>
      <p className="text-lg">{t("hello")}!</p>

      <div className="relative flex items-center gap-3">
        <div className="flex items-center h-10 w-10 bg-gray-200 rounded-full">Flags</div>
        <select
          value={selectedLang}
          onChange={handleChange}
          className="bg-white border-none rounded-md pr-3 text-black focus:outline-none cursor-pointer"
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Translator;
