import React from "react";
import Table from "../ui/table/Table";
import { onlineSpanishOneColumns } from "./../../data/columns";

const OnlineSpanishOneTable = [
  { course: "Basic Spanish", duration: "6 Weeks", price: 100 },
  { course: "Intermediate Spanish", duration: "8 Weeks", price: 150 },
  { course: "Advanced Spanish", duration: "10 Weeks", price: 200 },
];

const OnlineSpanishOne = () => {
  return (
    <div className="p-3 md:p-6">
      <h1 className="text-xl font-bold mb-4">Online Spanish course Prices</h1>
      <Table columns={onlineSpanishOneColumns} data={OnlineSpanishOneTable} />
    </div>
  );
};

export default OnlineSpanishOne;
