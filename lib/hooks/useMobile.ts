import { useState, useEffect } from "react";

const DEFAULT_BREAKPOINT = 498;

export function useIsMobile(breakpoint = DEFAULT_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is available (for SSR)
    if (typeof window === "undefined") return;

    // Build a media query string (note the added parentheses)
    const mediaQuery = `(max-width: ${breakpoint - 1}px)`;
    const mql = window.matchMedia(mediaQuery);

    // Update the state based on the media query's match
    const handleChange = () => setIsMobile(mql.matches);

    // Set the initial value
    setIsMobile(mql.matches);

    // Add listener for changes
    if (mql.addEventListener) {
      mql.addEventListener("change", handleChange);
    } else {
      mql.addListener(handleChange);
    }

    // Cleanup the listener on unmount
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handleChange);
      } else {
        mql.removeListener(handleChange);
      }
    };
  }, [breakpoint]);

  return isMobile;
}
