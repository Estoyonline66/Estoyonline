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
    onlineSpanishThreeColumns?: { key: keyof CourseData; header: string }[];
  };
  courses?: {
    onlineSpanishThreeTable?: CourseData[];
  };
}

const OnlineSpanishThree = () => {
    const { t } = useTranslation();
      // fetch price data from translation file
      const Data: PriceData = t("price");
    
    
      // Ensure `columns` is properly structured
      const onlineSpanishThreeColumns: Column<CourseData>[] =
        Data?.tables?.onlineSpanishThreeColumns?.map((col) => ({
          key: col.key, // No need to cast
          header: col.header,
        })) || [];
    
      // Ensure `data` is correctly structured
      const onlineSpanishThreeTables: CourseData[] =
        Data?.courses?.onlineSpanishThreeTable || [];
  return (
    <div className="p-3 md:p-6">
      {/* <h1 className="text-xl font-bold mb-4">{Data?.title}</h1> */}
      <Table columns={[...onlineSpanishThreeColumns]} data={onlineSpanishThreeTables} />
    </div>
  );
};

export default OnlineSpanishThree;
