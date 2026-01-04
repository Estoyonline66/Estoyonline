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
  title?: string;
  tables?: {
    onlineSpanishOneColumns?: { key: keyof CourseData; header: string }[];
  };
  courses?: {
    onlineSpanishOneTable?: CourseData[];
  };
}

const OnlineSpanishOne = () => {
  const { t } = useTranslation();
  // fetch price data from translation file
  const Data: PriceData = t("price");


  // Ensure `columns` is properly structured
  const onlineSpanishOneColumns: Column<CourseData>[] =
    Data?.tables?.onlineSpanishOneColumns?.map((col) => ({
      key: col.key, // No need to cast
      header: col.header,
      className: col.key === "course" ? "w-[44%]" : col.key === "price" ? "w-[30%]" : "w-[26%]",
    })) || [];

  // Ensure `data` is correctly structured
  const onlineSpanishOneTables: CourseData[] =
    Data?.courses?.onlineSpanishOneTable || [];


  return (
    <div className="p-3 md:p-6">
      {/* <h1 className="text-xl font-bold mb-4">{Data?.title}</h1> */}
      <Table columns={onlineSpanishOneColumns} data={onlineSpanishOneTables} />
    </div>
  );
};

export default OnlineSpanishOne;
