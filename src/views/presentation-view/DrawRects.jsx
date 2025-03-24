import { useMemo, useEffect, useState } from "react";
import { Line } from "react-konva";
import PropTypes from "prop-types";
import { useCallback } from "react";

const DrawRects = ({ stageRef, mode, updateForms, color }) => {
  const [points, setPoints] = useState([]);
  const paintState = useMemo(() => ({ active: false }), []);
  const updatePoints = useCallback((points = []) => {
    if (points.every((point) => typeof point === "number")) setPoints(points);
  }, []);

  useEffect(() => {
    const stage = stageRef?.current;
    const rect = (A, B) => {
      const [xa, ya] = A;
      const [xb, yb] = B;
      return [xa, ya, xa, yb, xb, yb, xb, ya, xa, ya];
    };
    if (stage && ["rect"].includes(mode)) {
      const onStart = (e) => {
        e.evt.preventDefault();
        if (e.evt.button || e.target.name() === "rect") return;
        paintState.active = true;
        const pos = stage.getPointerPosition();
        const stageTransform = stage.getAbsoluteTransform().copy();
        const position = stageTransform.invert().point(pos);
        updatePoints(rect([position.x, position.y], [position.x, position.y]));
      };
      const onMouseMove = (e) => {
        e.evt.preventDefault();
        if (!paintState.active) return;
        const pos = stage.getPointerPosition();
        const stageTransform = stage.getAbsoluteTransform().copy();
        const position = stageTransform.invert().point(pos);
        const [x, y] = points;

        updatePoints(rect([x, y], [position.x, position.y]));
      };
      const onEnd = (e) => {
        e.evt.preventDefault();
        if (!paintState.active) return;
        paintState.active = false;
        const pos = stage.getPointerPosition();
        const stageTransform = stage.getAbsoluteTransform().copy();
        const position = stageTransform.invert().point(pos);
        const [x, y] = points;
        updatePoints(rect([x, y], [position.x, position.y]));

        if (((position.x - x) ** 2 + (position.y - y) ** 2) ** 0.5 > 4)
          updateForms({
            points,
            strokeWidth: 4,
            stroke: color,
            globalCompositeOperation: "source-over",
            id: Date.now().toString(16),
            mode,
            name: "rect",
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
  }, [stageRef, paintState, color, points, updatePoints, updateForms, mode]);

  return (
    <>
      {points.length > 0 && (
        <Line
          points={points}
          stroke={color}
          strokeWidth={4}
          lineCap='square'
          pointerLength={5}
          pointerWidth={5}
        />
      )}
    </>
  );
};

DrawRects.propTypes = {
  stageRef: PropTypes.object,
  scale: PropTypes.number,
  mode: PropTypes.string,
  updateForms: PropTypes.func,
  color: PropTypes.string,
};
export default DrawRects;
