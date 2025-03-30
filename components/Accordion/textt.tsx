"use client";
import { Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

interface AccordionItemProps {
  title: string;
  content: {
    contentTitle: string;
    contentDescription: string;
  }[];
  isActive: boolean;
  onClick: () => void;
}

export function AccordionItem({ title, content, isActive, onClick }: AccordionItemProps) {
  return (
    <div className="border-b-2 border-red-500 focus:border-none overflow-hidden">
      <button
        onClick={onClick}
        className="w-full p-3 text-red-500 text-left hover:bg-gray-50 focus:bg-gray-50 font-semibold flex items-center justify-between"
      >
        <span>{title}</span>
        <span className="p-1 rounded-full bg-red-500 text-white flex items-center justify-center transition-transform duration-500">
          {isActive ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
        </span>
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={isActive ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="p-4 bg-white max-h-[20rem] overflow-y-auto">
          {content.map((item, index) => (
            <div key={index} className="mb-1">
              <h3 className="text-lg font-bold">{item.contentTitle}</h3>
              <p className="text-gray-600">{item.contentDescription}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
