import { useMemo, useEffect, useState } from "react";
import { Ring } from "react-konva";
import PropTypes from "prop-types";
import { useCallback } from "react";

const DrawCircles = ({ stageRef, mode, updateForms, color }) => {
  const [points, setPoints] = useState([]);
  const paintState = useMemo(() => ({ active: false }), []);
  const updatePoints = useCallback((points = []) => {
    if (points.every((point) => typeof point === "number")) setPoints(points);
  }, []);

  useEffect(() => {
    const stage = stageRef?.current;

    if (stage && ["circle"].includes(mode)) {
      const onStart = (e) => {
        if (e.evt.button || e.target.name() === "circle") return;
        e.evt.preventDefault();
        paintState.active = true;
        const pos = stage.getPointerPosition();
        const stageTransform = stage.getAbsoluteTransform().copy();
        const position = stageTransform.invert().point(pos);
        updatePoints([position.x, position.y, 0]);
      };
      const onMouseMove = (e) => {
        if (!paintState.active) return;
        e.evt.preventDefault();
        const pos = stage.getPointerPosition();
        const stageTransform = stage.getAbsoluteTransform().copy();
        const position = stageTransform.invert().point(pos);
        const [x, y] = points;
        updatePoints([
          x,
          y,
          ((position.x - x) ** 2 + (position.y - y) ** 2) ** 0.5,
        ]);
      };
      const onEnd = (e) => {
        if (!paintState.active) return;
        e.evt.preventDefault();
        paintState.active = false;
        const [x, y, radius] = points;
        if (radius > 4)
          updateForms({
            x,
            y,
            outerRadius: radius,
            innerRadius: radius,
            strokeWidth: 4,
            stroke: color,
            globalCompositeOperation: "source-over",
            id: Date.now().toString(16),
            mode,
            name: "circle",
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
  }, [stageRef, paintState, mode, points, updatePoints, color, updateForms]);

  return (
    <>
      {points.length > 0 && (
        <Ring
          {...(() => {
            const [x, y, radius] = points;
            return { x, y, outerRadius: radius, innerRadius: radius };
          })()}
          stroke={color}
          strokeWidth={4}
          lineCap='round'
          pointerLength={5}
          pointerWidth={5}
        />
      )}
    </>
  );
};

DrawCircles.propTypes = {
  stageRef: PropTypes.object,
  scale: PropTypes.number,
  mode: PropTypes.string,
  updateForms: PropTypes.func,
  color: PropTypes.string,
};

export default DrawCircles;
