import { useMemo } from "react";
import { useEffect, useRef } from "react";

const useSwipe = ({ threshold = 80, onSwipe }) => {
  const ref = useRef();
  const coords = useMemo(
    () => ({ startX: null, startY: null, distX: null, distY: null }),
    []
  );

  useEffect(() => {
    const initCoords = () => {
      Object.keys(coords).forEach((key) => (coords[key] = null));
    };
    const element = ref.current;
    const handleTouchStart = (e) => {
      //e?.preventDefault();
      initCoords();
      const touchObj = e.touches ? e.touches[0] : e;
      coords.startX = touchObj.clientX;
      coords.startY = touchObj.clientY;
    };
    const handleTouchMove = (e) => {
      // e?.preventDefault();
      const { startX, startY } = coords;
      if (!startX || !startY) return;
      const touchObj = e.touches ? e.touches[0] : e;
      coords.distX = touchObj.clientX - startX;
      coords.distY = touchObj.clientY - startY;
    };

    const handleTouchEnd = (e) => {
      // e?.preventDefault();
      const { distX, distY } = coords;
      if (!distX || !distY) return;
      const axis = Math.abs(distX) > Math.abs(distY) ? "x" : "y";
      const dist = Math.abs(axis === "x" ? distX : distY);

      if (dist > threshold) {
        const directionX = distX > threshold ? "right" : "left";
        const directionY = distY > threshold ? "down" : "up";
        const direction = axis === "x" ? directionX : directionY;
        if (typeof onSwipe === "function") onSwipe(e, direction);
      }
      initCoords();
    };

    if (element) {
      element.addEventListener("touchstart", handleTouchStart);
      element.addEventListener("touchmove", handleTouchMove);
      element.addEventListener("touchend", handleTouchEnd);

      element.addEventListener("mousedown", handleTouchStart);
      element.addEventListener("mousemove", handleTouchMove);
      element.addEventListener("mouseup", handleTouchEnd);
      element.addEventListener("mouseleave", initCoords);

      return () => {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchmove", handleTouchMove);
        element.removeEventListener("touchend", handleTouchEnd);

        element.removeEventListener("mousedown", handleTouchStart);
        element.removeEventListener("mousemove", handleTouchMove);
        element.removeEventListener("mouseup", handleTouchEnd);
        element.removeEventListener("mouseleave", initCoords);
      };
    }
  });

  return { ref };
};

export default useSwipe;
