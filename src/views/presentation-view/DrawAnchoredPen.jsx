import { useMemo, useEffect, useState } from "react";
import { Line } from "react-konva";
import PropTypes from "prop-types";
import CustomLine from "./CustomLine";
import { useCallback } from "react";

const DrawAnchoredPen = ({ stageRef, mode, updateForms, color }) => {
  const [coords, setCoords] = useState([]);
  const [points, setPoints] = useState([]);
  const paintState = useMemo(() => ({ active: false }), []);

  const onFinish = useCallback((line, id) => {
    {
      if (line.opacity() === 0) {
        line.hide();
        setCoords((coords) => coords.filter((coord) => coord.key !== id));
      }
    }
  }, []);

  useEffect(() => {
    const stage = stageRef?.current;
    if (stage && ["persist", "ephemeral"].includes(mode)) {
      const onStart = (e) => {
        if (e.evt.button || e.target.id()) return;
        e.evt.preventDefault();
        paintState.active = true;
        const pos = stage.getPointerPosition();
        const stageTransform = stage.getAbsoluteTransform().copy();
        const position = stageTransform.invert().point(pos);
        setPoints([position.x, position.y, position.x, position.y]);
      };
      const onMouseMove = (e) => {
        e.evt.preventDefault();
        if (!paintState.active) return;
        const pos = stage.getPointerPosition();
        const stageTransform = stage.getAbsoluteTransform().copy();
        const position = stageTransform.invert().point(pos);
        setPoints((points) => [...points, position.x, position.y]);
      };
      const onEnd = (e) => {
        e.evt.preventDefault();
        if (!paintState.active) return;
        paintState.active = false;
        const form = {
          points,
          strokeWidth: 4,
          stroke: color,
          globalCompositeOperation: "source-over",
          id: Date.now().toString(16),
          mode,
          name: "anchor",
          opacity: 1,
        };
        if (mode === "ephemeral") setCoords((data) => [...data, form]);
        else updateForms(form);
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
  }, [stageRef, paintState, points, mode, updateForms, color]);

  return (
    <>
      {points.length > 0 && (
        <Line
          points={points}
          stroke={color}
          strokeWidth={4}
          lineCap='round'
          lineJoin='round'
        />
      )}
      {coords.map(({ id, ...data }) => (
        <CustomLine
          {...data}
          key={id}
          id={id}
          lineCap='round'
          lineJoin='round'
          onFinish={onFinish}
        />
      ))}
    </>
  );
};

DrawAnchoredPen.propTypes = {
  stageRef: PropTypes.object,
  mode: PropTypes.string,
  updateForms: PropTypes.func,
  color: PropTypes.string,
};

export default DrawAnchoredPen;
