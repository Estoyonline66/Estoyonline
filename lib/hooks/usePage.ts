import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function usePage(pageToIndex: string="/") {
  const pathname = usePathname();
  const [currentPageRoute, setCurrentPageRoute] = useState("");
  const [isPage, setIsPage] = useState(true);

  useEffect(() => {
    // Set the current route and determine if it matches the pageToIndex
    setCurrentPageRoute(pathname);
    setIsPage(pathname === pageToIndex);
  }, [pathname, pageToIndex]);

  return {
    currentPageRoute,
    isPage,
  };
}
