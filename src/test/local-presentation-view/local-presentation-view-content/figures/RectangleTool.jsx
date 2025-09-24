import React, { useState, useEffect, useRef } from "react";
import { Rect } from "react-konva";
import useDrawingStageRef from "../../../../hooks/useDrawingStageRef";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const RectangleTool = ({ data, onErase, onUpdate }) => {
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
  const { id, x, y, width, height, stroke } = data;

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
      stage.off("pointerup pointerleave pointercancel", endErase);
    };
  }, [stageRef, active, isGum]);

  const handleErase = () => {
    if (typeof onErase === "function") onErase(id);
  };

  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      stroke={stroke}
      strokeWidth={5}
      id={id}
      draggable={!isGum}
      onDragEnd={(e) => {
        const { x, y } = e.target.position();
        data.x = x;
        data.y = y;
        if (typeof onUpdate === "function") onUpdate({ x, y });
      }}
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

RectangleTool.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    stroke: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func,
  onErase: PropTypes.func,
};

const MIN_SIZE = 5;

const RectangleMark_ = ({ onFinishDrawing }) => {
  const [rect, setRect] = useState(null);
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

  const isRectangle = mode === "rectangle";

  useEffect(() => {
    const stage = stageRef?.current;
    if (!stage || !active || !isRectangle) return;

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
      setRect({
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        stroke,
      });
    };

    const draw = () => {
      if (!isDrawing.current || !startPosRef.current) return;
      const pos = getPosition();
      const width = pos.x - startPosRef.current.x;
      const height = pos.y - startPosRef.current.y;

      setRect({
        x: Math.min(pos.x, startPosRef.current.x),
        y: Math.min(pos.y, startPosRef.current.y),
        width: Math.abs(width),
        height: Math.abs(height),
        stroke,
      });
    };

    const endDrawing = () => {
      if (!isDrawing.current || !rect) return;
      isDrawing.current = false;
      if (rect.width > MIN_SIZE && rect.height > MIN_SIZE) {
        const id = Date.now().toString(16);
        if (typeof onFinishDrawing === "function") {
          onFinishDrawing({ ...rect, id });
        }
      }
      setRect(null);
      startPosRef.current = null;
    };

    stage.on("pointerdown", startDrawing);
    stage.on("pointermove", draw);
    stage.on("pointerup pointerleave pointercancel", endDrawing);

    return () => {
      stage.off("pointerdown", startDrawing);
      stage.off("pointermove", draw);
      stage.off("pointerup pointerleave pointercancel", endDrawing);
    };
  }, [stageRef, active, isRectangle, stroke, rect, onFinishDrawing]);

  return (
    <>
      {isRectangle && rect && (
        <Rect
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          stroke={rect.stroke}
          strokeWidth={5}
        />
      )}
    </>
  );
};

RectangleMark_.propTypes = {
  onFinishDrawing: PropTypes.func,
};

export default RectangleTool;
export const RectangleMark = React.memo(RectangleMark_);
