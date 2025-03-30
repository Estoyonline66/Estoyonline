"use client";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useRef, useEffect } from "react";

interface AccordionItemProps {
  title: string;
  content: {
    contentTitle: string;
    contentDescription: string;
  }[];
  isActive: boolean;
  activeIndex:number | null|"not-set"
  onClick: () => void;
}

export function AccordionItem({
  title,
  content,
  isActive,
  onClick,
  activeIndex
}: AccordionItemProps) {
  const accordionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handlePosition = () => {
    const element = accordionRef.current;
    const scrollContainer =
      element?.closest("#scroll-container") ||
      document.querySelector("#scroll-container");

    // Get the header's height using the data attribute
    const headerHeight =
      document.querySelector("[data-id='main-header']")?.clientHeight || 0;
    const calculatePosition = ()=>{
      if (element && scrollContainer) {
        const elementRect = element.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        // Calculate the element's offset from the container's top
        const offset = elementRect.top - containerRect.top;
        // Determine the new scroll position
        const targetScroll = scrollContainer.scrollTop + offset - headerHeight;
        const calculatedPosition =  (targetScroll < 0 ? 0 : targetScroll) - 10

        return calculatedPosition
      }

      return 0
      
    }
    if (element && scrollContainer) {
      setTimeout(() => {
        
        scrollContainer.scrollTo({
          top:calculatePosition(),
          behavior: "smooth",
        });
      }, 10);
    }
  };

  useEffect(() => {
    if(activeIndex !== "not-set"){
    handlePosition();

    }
  }, [isActive]);

  return (
    <div
      ref={accordionRef}
      className="border-b-2 border-red-500 focus:border-none overflow-hidden"
    >
      <button
        ref={triggerRef}
        onClick={onClick}
        className="w-full p-3 text-red-500 text-left hover:bg-gray-50 focus:bg-gray-50 font-semibold flex items-center justify-between"
      >
        <span>{title}</span>
        <span className="p-1 rounded-full bg-red-500 text-white flex items-center justify-center transition-transform duration-500">
          {isActive ? (
            <Minus className="w-3 h-3" />
          ) : (
            <Plus className="w-3 h-3" />
          )}
        </span>
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={
          isActive ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="p-4 bg-white max-h-[70vh] min-h-[250px] overflow-y-auto">
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
