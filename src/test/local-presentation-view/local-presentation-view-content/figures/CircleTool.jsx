import React, { useState, useEffect, useRef } from "react";
import { Circle } from "react-konva";
import useDrawingStageRef from "../../../../hooks/useDrawingStageRef";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const CircleTool = ({ data, onErase, onUpdate }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const stageRef = useDrawingStageRef();
  const isErasing = useRef(false);

  const active = useSelector(
    (store) =>
      store.conference.meeting.actions.localPresentation.annotation.active
  );
  const mode = useSelector(
    (store) =>
      store.conference.meeting.actions.localPresentation.annotation.mode
  );

  const isGum = mode === "gum";
  const { id, x, y, radius, stroke } = data;

  useEffect(() => {
    const stage = stageRef?.current;
    if (!stage || !active) {
      isErasing.current = false;
      return;
    }

    const startErase = () => {
      if (isGum) isErasing.current = true;
    };
    const endErase = () => {
      if (isGum) isErasing.current = false;
    };

    stage.on("pointerdown", startErase);
    stage.on("pointerup pointerleave pointercancel", endErase);

    return () => {
      stage.off("pointerdown", startErase);
      stage.off("pointerup", endErase);
      stage.off("pointerleave", endErase);
      stage.off("pointercancel", endErase);
    };
  }, [stageRef, active, isGum]);

  const handleErase = () => {
    if (typeof onErase === "function") onErase(id);
  };

  return (
    <Circle
      x={x}
      y={y}
      radius={radius}
      stroke={stroke}
      strokeWidth={5}
      draggable={!isGum}
      onDragEnd={(e) => {
        const { x, y } = e.target.position();
        data.x = x;
        data.y = y;
        if (typeof onUpdate === "function") onUpdate({ x, y });
      }}
      id={id}
      opacity={isGum && hoveredId === id ? 0.3 : 1}
      onMouseEnter={() => setHoveredId(id)}
      onMouseLeave={() => setHoveredId(null)}
      onClick={() => isGum && handleErase()}
      onMouseOver={() => {
        if (isGum && isErasing.current) handleErase();
      }}
    />
  );
};

CircleTool.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired,
    stroke: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func,
  onErase: PropTypes.func,
};

const MIN_RADIUS = 5;

const CircleMark_ = ({ onFinishDrawing }) => {
  const [circle, setCircle] = useState(null);
  const stageRef = useDrawingStageRef();
  const isDrawing = useRef(false);
  const startPosRef = useRef(null);

  const active = useSelector(
    (store) =>
      store.conference.meeting.actions.localPresentation.annotation.active
  );
  const mode = useSelector(
    (store) =>
      store.conference.meeting.actions.localPresentation.annotation.mode
  );
  const stroke = useSelector(
    (store) =>
      store.conference.meeting.actions.localPresentation.annotation.color
  );

  const isCircle = mode === "circle";

  useEffect(() => {
    const stage = stageRef?.current;
    if (!stage || !active || !isCircle) return;

    const getPosition = () => {
      const pos = stage.getPointerPosition();
      const transform = stage.getAbsoluteTransform().copy();
      return transform.invert().point(pos);
    };

    const startDrawing = (e) => {
      if (e.target !== stage) return;
      isDrawing.current = true;
      const pos = getPosition();
      startPosRef.current = pos;
      setCircle({
        x: pos.x,
        y: pos.y,
        radius: 0,
        stroke,
      });
    };

    const draw = () => {
      if (!isDrawing.current || !startPosRef.current) return;
      const pos = getPosition();
      const radius = Math.hypot(
        pos.x - startPosRef.current.x,
        pos.y - startPosRef.current.y
      );
      setCircle({
        x: startPosRef.current.x,
        y: startPosRef.current.y,
        radius,
        stroke,
      });
    };

    const endDrawing = () => {
      if (!isDrawing.current || !circle) return;
      isDrawing.current = false;

      if (circle.radius > MIN_RADIUS) {
        const id = Date.now().toString(16);
        if (typeof onFinishDrawing === "function") {
          onFinishDrawing({ ...circle, id });
        }
      }

      setCircle(null);
      startPosRef.current = null;
    };

    stage.on("pointerdown", startDrawing);
    stage.on("pointermove", draw);
    stage.on("pointerup pointerleave pointercancel", endDrawing);

    return () => {
      stage.off("pointerdown", startDrawing);
      stage.off("pointermove", draw);
      stage.off("pointerup", endDrawing);
      stage.off("pointerleave", endDrawing);
      stage.off("pointercancel", endDrawing);
    };
  }, [stageRef, active, isCircle, stroke, circle, onFinishDrawing]);

  return (
    <>
      {isCircle && circle && (
        <Circle
          x={circle.x}
          y={circle.y}
          radius={circle.radius}
          stroke={circle.stroke}
          strokeWidth={5}
        />
      )}
    </>
  );
};

CircleMark_.propTypes = {
  onFinishDrawing: PropTypes.func,
};

export const CircleMark = React.memo(CircleMark_);

export default React.memo(CircleTool);
