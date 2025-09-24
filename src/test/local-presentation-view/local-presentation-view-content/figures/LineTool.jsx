import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-konva";
import useDrawingStageRef from "../../../../hooks/useDrawingStageRef";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const LineTool = ({ data, onErase, onUpdate }) => {
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
    <Line
      points={points}
      stroke={stroke}
      x={data?.x}
      y={data?.y}
      strokeWidth={5}
      lineCap='round'
      id={id}
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

const MIN_LENGTH = 5;

const LineMark_ = ({ onFinishDrawing }) => {
  const [line, setLine] = useState(null);
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

  const isLine = mode === "line";

  useEffect(() => {
    const stage = stageRef?.current;
    if (!stage || !active || !isLine) return;

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
      setLine({
        points: [pos.x, pos.y, pos.x, pos.y],
        stroke,
      });
    };

    const draw = () => {
      if (!isDrawing.current || !startPosRef.current) return;
      const pos = getPosition();
      setLine({
        points: [startPosRef.current.x, startPosRef.current.y, pos.x, pos.y],
        stroke,
      });
    };

    const endDrawing = () => {
      if (!isDrawing.current || !line) return;
      isDrawing.current = false;

      const [x1, y1, x2, y2] = line.points;
      const length = Math.hypot(x2 - x1, y2 - y1);

      if (length > MIN_LENGTH) {
        const id = Date.now().toString(16);
        if (typeof onFinishDrawing === "function") {
          onFinishDrawing({ ...line, id });
        }
      }

      setLine(null);
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
  }, [stageRef, active, isLine, stroke, line, onFinishDrawing]);

  return (
    <>
      {isLine && line && (
        <Line
          points={line.points}
          stroke={line.stroke}
          strokeWidth={5}
          lineCap='round'
        />
      )}
    </>
  );
};

LineMark_.propTypes = {
  onFinishDrawing: PropTypes.func,
};

export const LineMark = React.memo(LineMark_);

LineTool.propTypes = {
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

export default React.memo(LineTool);
