import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Line } from 'react-konva';
import useDrawingStageRef from '@/hooks/useDrawingStageRef';
import { useSelector } from 'react-redux';

const Pencil = ({ data: { id, points, stroke }, onErase }) => {
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

  const isGum = mode === 'gum';

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

    stage.on('pointerdown', startErase);
    stage.on('pointerup pointerleave pointercancel', endErase);

    return () => {
      stage.off('pointerdown', startErase);
      stage.off('pointerup pointerleave pointercancel', endErase);
    };
  }, [stageRef, active, isGum]);

  const handleErase = useCallback(() => {
    if (typeof onErase === 'function') onErase(id);
  }, [onErase, id]);

  return (
    <Line
      points={points}
      stroke={stroke}
      strokeWidth={5}
      lineCap="round"
      lineJoin="round"
      tension={0.8}
      draggable={false}
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

const PencilMark_ = ({ onFinishDrawing }) => {
  const [points, setPoints] = useState([]);
  const stageRef = useDrawingStageRef();
  const isDrawing = useRef(false);
  const pointsRef = useRef([]);

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

  const isPencil = mode === 'pencil';

  useEffect(() => {
    const stage = stageRef?.current;
    if (!stage || !active || !isPencil) return;

    const getPosition = () => {
      const pos = stage.getPointerPosition();
      const transform = stage.getAbsoluteTransform().copy();
      return transform.invert().point(pos);
    };

    const startDrawing = (e) => {
      if (e.target !== stage) return;
      isDrawing.current = true;
      const pos = getPosition();
      const initial = [pos.x, pos.y, pos.x, pos.y];
      setPoints(initial);
      pointsRef.current = initial;
    };

    const draw = () => {
      if (!isDrawing.current) return;
      const pos = getPosition();
      setPoints((prev) => {
        const updated = [pos.x, pos.y, ...prev];
        pointsRef.current = updated;
        return updated;
      });
    };

    const endDrawing = () => {
      if (!isDrawing.current || !pointsRef.current.length) return;
      isDrawing.current = false;
      const id = Date.now().toString(16);
      const data = { id, points: pointsRef.current, stroke };
      setPoints([]);
      pointsRef.current = [];
      if (onFinishDrawing) onFinishDrawing(data);
    };

    stage.on('pointerdown', startDrawing);
    stage.on('pointermove', draw);
    stage.on('pointerup pointerleave pointercancel', endDrawing);

    return () => {
      stage.off('pointerdown', startDrawing);
      stage.off('pointermove', draw);
      stage.off('pointerup pointerleave pointercancel', endDrawing);
    };
  }, [stageRef, active, isPencil, stroke, onFinishDrawing]);

  return (
    <>
      {isPencil && points.length > 0 && (
        <Line
          points={points}
          stroke={stroke}
          strokeWidth={5}
          lineCap="round"
          lineJoin="round"
          tension={0.8}
          draggable={false}
          name="pencil"
        />
      )}
    </>
  );
};

export const PencilMark = React.memo(PencilMark_);

export default React.memo(Pencil);
