import { useContext } from "react";
import { createContext } from "react";

export const DrawingStageContext = createContext({ current: null });

const useDrawingStageRef = () => useContext(DrawingStageContext);

export default useDrawingStageRef;
