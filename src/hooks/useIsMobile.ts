import { useState, useEffect } from "react";
import checkMobile from "../utils/checkMobile";
import useSmallScreen from "./useSmallScreen";

const useIsMobile = () => {
  const matches = useSmallScreen();
  const [isMobile, setIsMobile] = useState(matches || checkMobile());

  useEffect(() => {
    const checkIsMobile = matches || checkMobile();
    if (checkIsMobile !== isMobile) setIsMobile(checkIsMobile);
  }, [isMobile, matches]);

  return isMobile;
};

export default useIsMobile;
