import { useContext } from "react";
import { createContext } from "react";

export const DrawingStageContext = createContext({ current: null });

const useDrawingStageRef = () => useContext(DrawingStageContext);

import { useEffect } from "react";

export const useDraggableCursor = () => {
  const stageRef = useDrawingStageRef();
  useEffect(() => {
    const stage = stageRef?.current;
    if (!stage) return;

    const handleDragStart = () => {
      stage.container().style.cursor = "grabbing";
    };

    const handleDragEnd = () => {
      stage.container().style.cursor = "default";
    };

    const handleMouseOver = (e) => {
      if (e.target.draggable()) stage.container().style.cursor = "grab";
    };

    const handleMouseOut = (e) => {
      if (e.target.draggable()) stage.container().style.cursor = "default";
    };

    stage.on("dragstart", handleDragStart);
    stage.on("dragend", handleDragEnd);
    stage.on("mouseover", handleMouseOver);
    stage.on("mouseout", handleMouseOut);

    return () => {
      stage.off("dragstart", handleDragStart);
      stage.off("dragend", handleDragEnd);
      stage.off("mouseover", handleMouseOver);
      stage.off("mouseout", handleMouseOut);
    };
  }, [stageRef]);
};

export default useDrawingStageRef;
