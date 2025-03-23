import React from "react";
import Table from "../ui/table/Table";
import { extraSpanishColumns } from "./../../data/columns";

const ExtraSpanishTable = [
  { course: "Spanish for Travelers", duration: "3 Weeks", price: 90 },
  { course: "Business Spanish", duration: "7 Weeks", price: 160 },
  { course: "Spanish Pronunciation", duration: "5 Weeks", price: 110 },
];

const ExtraSpanish = () => {
  return (
    <div className="p-3 md:p-6">
      <h1 className="text-xl font-bold mb-4">Extra Spanish course Prices</h1>
      <Table columns={extraSpanishColumns} data={ExtraSpanishTable} />
    </div>
  );
};

export default ExtraSpanish;
