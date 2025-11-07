import React, { useState, useEffect, useRef } from "react";
import { Arrow } from "react-konva";
import useDrawingStageRef from "../../../../../../../hooks/useDrawingStageRef";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const MIN_LENGTH = 5;

const ArrowMark_ = ({ onFinishDrawing }) => {
  const [arrow, setArrow] = useState(null);
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

  const isArrow = mode === "arrow";

  useEffect(() => {
    const stage = stageRef?.current;
    if (!stage || !active || !isArrow) return;

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
      setArrow({
        points: [pos.x, pos.y, pos.x, pos.y],
        stroke,
      });
    };

    const draw = () => {
      if (!isDrawing.current || !startPosRef.current) return;
      const pos = getPosition();
      setArrow({
        points: [startPosRef.current.x, startPosRef.current.y, pos.x, pos.y],
        stroke,
      });
    };

    const endDrawing = () => {
      if (!isDrawing.current || !arrow) return;
      isDrawing.current = false;

      const [x1, y1, x2, y2] = arrow.points;
      const length = Math.hypot(x2 - x1, y2 - y1);

      if (length > MIN_LENGTH) {
        const id = Date.now().toString(16);
        if (typeof onFinishDrawing === "function") {
          onFinishDrawing({ ...arrow, id });
        }
      }

      setArrow(null);
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
  }, [stageRef, active, isArrow, stroke, arrow, onFinishDrawing]);

  return (
    <>
      {isArrow && arrow && (
        <Arrow
          points={arrow.points}
          stroke={arrow.stroke}
          fill={arrow.stroke}
          strokeWidth={5}
          pointerLength={15}
          pointerWidth={15}
        />
      )}
    </>
  );
};

ArrowMark_.propTypes = {
  onFinishDrawing: PropTypes.func,
};

export const ArrowMark = React.memo(ArrowMark_);

const ArrowTool = ({ data, onErase, onUpdate }) => {
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
  const { id, points, stroke } = data;

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
    <Arrow
      points={points}
      stroke={stroke}
      fill={stroke}
      x={data?.x}
      y={data?.y}
      strokeWidth={5}
      id={id}
      pointerLength={15}
      pointerWidth={15}
      draggable={!isGum}
      opacity={isGum && hoveredId === id ? 0.3 : 1}
      onDragEnd={(e) => {
        const { x, y } = e.target.position();
        // data.x = x;
        // data.y = y;
        if (typeof onUpdate === "function") onUpdate({ x, y });
      }}
      onMouseEnter={() => setHoveredId(id)}
      onMouseLeave={() => setHoveredId(null)}
      onClick={() => isGum && handleErase()}
      onMouseOver={() => {
        if (isGum && isErasing.current) handleErase();
      }}
    />
  );
};

ArrowTool.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    points: PropTypes.array.isRequired,
    stroke: PropTypes.string.isRequired,
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
  onUpdate: PropTypes.func,
  onErase: PropTypes.func,
};

export default React.memo(ArrowTool);
