import { useMemo, useEffect, useState } from "react";
import { Line } from "react-konva";
import PropTypes from "prop-types";
import { useCallback } from "react";

const DrawLines = ({ stageRef, mode, updateForms, color }) => {
  const [points, setPoints] = useState([]);
  const paintState = useMemo(() => ({ active: false, mode: "line" }), []);
  const updatePoints = useCallback((points = []) => {
    if (points.every((point) => typeof point === "number")) setPoints(points);
  }, []);

  useEffect(() => {
    const stage = stageRef?.current;

    if (stage && ["line"].includes(mode)) {
      const onStart = (e) => {
        e.evt.preventDefault();
        if (e.evt.button || e.target.name() === "line") return;
        paintState.active = true;
        const pos = stage.getPointerPosition();
        const stageTransform = stage.getAbsoluteTransform().copy();
        const position = stageTransform.invert().point(pos);
        updatePoints([position.x, position.y, position.x, position.y]);
      };
      const onMouseMove = (e) => {
        e.evt.preventDefault();
        if (!paintState.active) return;
        const pos = stage.getPointerPosition();
        const stageTransform = stage.getAbsoluteTransform().copy();
        const position = stageTransform.invert().point(pos);
        const [x, y] = points;
        updatePoints([x, y, position.x, position.y]);
      };
      const onEnd = (e) => {
        e.evt.preventDefault();
        if (!paintState.active) return;
        paintState.active = false;
        const [xA, yA, xB, yB] = points;
        if (((xB - xA) ** 2 + (yB - yA) ** 2) ** 0.5 > 0)
          updateForms({
            points,
            strokeWidth: 4,
            stroke: color,
            globalCompositeOperation: "source-over",
            id: Date.now().toString(16),
            mode: paintState.mode,
            opacity: 1,
            name: "line",
          });
        setPoints([]);
      };
      stage.on("mousedown touchstart", onStart);
      stage.on("mouseup touchend mouseleave", onEnd);
      stage.on("mousemove touchmove", onMouseMove);
      return () => {
        stage.off("mousedown touchstart", onStart);
        stage.off("mouseup touchend mouseleave", onEnd);
        stage.off("mousemove touchmove", onMouseMove);
      };
    }
  }, [stageRef, paintState, mode, points, updatePoints, color, updateForms]);

  return (
    <>
      {points.length > 0 && (
        <Line
          points={points}
          stroke={color}
          fill={color}
          strokeWidth={4}
          lineCap='round'
          lineJoin='round'
        />
      )}
    </>
  );
};

DrawLines.propTypes = {
  stageRef: PropTypes.object,
  scale: PropTypes.number,
  mode: PropTypes.string,
  updateForms: PropTypes.func,
  color: PropTypes.string,
};
export default DrawLines;
