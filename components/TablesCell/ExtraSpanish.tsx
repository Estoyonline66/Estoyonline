"use client";
import React from "react";
import Table, { Column } from "../ui/table/Table";
import { useTranslation } from "@/contexts/TranslationProvider";

// Define the structure for the data
interface CourseData {
  course: string;
  duration: string;
  price: number;
}

// Define expected type structure for the `price` translation data
interface PriceData {
  title2?: string;
  tables?: {
    extraSpanishColumns?: { key: keyof CourseData; header: string }[];
  };
  courses?: {
    extraSpanishTable?: CourseData[];
  };
}

const ExtraSpanish = () => {
    const { t } = useTranslation();
    // fetch price data from translation file
    const Data: PriceData = t("price");


    // Ensure `columns` is properly structured
    const extraSpanishColumns: Column<CourseData>[] =
    Data?.tables?.extraSpanishColumns?.map((col) => ({
        key: col.key, // No need to cast
        header: col.header,
        className: col.key === "course" ? "w-[46%]" : col.key === "price" ? "w-[29%]" : "w-[25%]",
    })) || [];

    // Ensure `data` is correctly structured
    const extraSpanishTable: CourseData[] =
    Data?.courses?.extraSpanishTable || [];
  return (
    <div className="p-3 md:p-6">
      {/* <h1 className="text-xl font-bold mb-4">{Data?.title2}</h1> */}
      <Table columns={extraSpanishColumns} data={extraSpanishTable} />
    </div>
  );
};

export default ExtraSpanish;
