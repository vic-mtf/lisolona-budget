import { useMemo, useEffect, useState } from "react";
import { Arrow } from "react-konva";
import PropTypes from "prop-types";
import { useCallback } from "react";

const DrawArrows = ({ stageRef, mode, updateForms, color }) => {
  const [points, setPoints] = useState([]);

  const paintState = useMemo(() => ({ active: false }), []);
  const updatePoints = useCallback((points = []) => {
    if (points.every((point) => typeof point === "number")) setPoints(points);
  }, []);

  useEffect(() => {
    const stage = stageRef?.current;

    if (stage && ["arrow"].includes(mode)) {
      const onStart = (e) => {
        if (e.evt.button || e.target.name() === "arrow") return;
        e.evt.preventDefault();
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
        if (((xB - xA) ** 2 + (yB - yA) ** 2) ** 0.5 > 6)
          updateForms({
            points,
            strokeWidth: 4,
            stroke: color,
            globalCompositeOperation: "source-over",
            id: Date.now().toString(16),
            mode,
            name: "arrow",
            opacity: 1,
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
  }, [stageRef, paintState, mode, points, updatePoints, updateForms, color]);

  return (
    <>
      {points.length > 0 && (
        <Arrow
          points={points}
          stroke={color}
          fill={color}
          strokeWidth={4}
          lineCap='round'
          pointerLength={5}
          pointerWidth={5}
        />
      )}
    </>
  );
};

DrawArrows.propTypes = {
  stageRef: PropTypes.object,
  scale: PropTypes.number,
  mode: PropTypes.string,
  updateForms: PropTypes.func,
  color: PropTypes.string,
};
export default DrawArrows;
