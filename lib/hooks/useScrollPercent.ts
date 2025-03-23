
import { useEffect, useRef, useState } from "react";

/**
 * Tracks the scroll progress of an element and the scroll direction.
 *
 * @param {string | HTMLElement | null} targetElement - A CSS selector or the actual HTML element to track.
 * @returns {{
 *   scrollPercentage: number; // How far the user has scrolled (0 to 100).
 *   isScrollingUp: boolean;   // True if the user is scrolling up, false if scrolling down.
 *   scrollTo: (to: number) => void; // Function to scroll the element to a specific position.
 * }}
 */
export default function useScrollPercent(
  targetElement: string | HTMLElement | null
): {
  scrollPercentage: number;
  isScrollingUp: boolean;
} {
  // State to store how much the user has scrolled (as a percentage).
  const [scrollPercentage, setScrollPercentage] = useState(0);

  // State to track if the user is scrolling up or down.
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  // Ref to remember the previous scroll position without causing re-renders.
  const prevScrollTopRef = useRef(0);

  useEffect(() => {
    // Identify the element to observe, based on a selector or provided element.
    const element =
      typeof targetElement === "string"
        ? document.querySelector(targetElement)
        : targetElement;

    if (!element) return; // Exit if the element doesn't exist.

    const handleScroll = (): void => {
      const { scrollTop, scrollHeight, clientHeight } = element;

      // Calculate the current scroll percentage (0 to 100).
      const newScrollPercentage = Math.floor(
        (scrollTop / (scrollHeight - clientHeight)) * 100
      );

      // Update the scroll percentage only if it has changed.
      if (newScrollPercentage !== scrollPercentage) {
        setScrollPercentage(newScrollPercentage);
      }

      // Check if the user is scrolling up or down.
      const isUp = scrollTop < prevScrollTopRef.current;
      if (isUp !== isScrollingUp) {
        setIsScrollingUp(isUp);
      }

      // Save the current scroll position for future comparison.
      prevScrollTopRef.current = scrollTop;
    };

    // Listen for scroll events on the element.
    element.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component is removed or dependencies change.
    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [targetElement, scrollPercentage, isScrollingUp]);


  // Return the scroll percentage, scroll direction, and scrollTo function.
  return {
    scrollPercentage,
    isScrollingUp,
  };
}
