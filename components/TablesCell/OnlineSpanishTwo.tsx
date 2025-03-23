import React from "react";
import Table from "../ui/table/Table";
import { onlineSpanishTwoColumns } from './../../data/columns';

const OnlineSpanishTwoTable = [
  { course: "Spanish Grammar", duration: "4 Weeks", price: 120 },
  { course: "Spanish Writing", duration: "6 Weeks", price: 140 },
  { course: "Spanish Conversation", duration: "5 Weeks", price: 130 },
];

const OnlineSpanishTwo = () => {
  return (
    <div className="p-3 md:p-6">
      <h1 className="text-xl font-bold mb-4">Online Spanish course Prices</h1>
      <Table columns={[...onlineSpanishTwoColumns]} data={OnlineSpanishTwoTable} />
    </div>
  );
};

export default OnlineSpanishTwo;
