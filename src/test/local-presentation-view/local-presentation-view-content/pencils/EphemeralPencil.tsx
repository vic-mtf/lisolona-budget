import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { Line } from "react-konva";
import useDrawingStageRef from "../../../../hooks/useDrawingStageRef";
import { useSelector } from "react-redux";
import { useCallback } from "react";

const EphemeralPencil = () => {
  const [points, setPoints] = useState([]);
  const [persistePointsData, setPersistePointsData] = useState([]);

  const onFinish = useCallback((_, { line, id }) => {
    {
      if (line.opacity() === 0) {
        line.hide();
        setPersistePointsData((coords) =>
          coords.filter((coord) => coord.id !== id)
        );
      }
    }
  }, []);

  const active = useSelector(
    (store) =>
      store.conference.meeting.actions.localPresentation.annotation.active
  );
  const isEphemeralPencil = useSelector(
    (store) =>
      store.conference.meeting.actions.localPresentation.annotation.mode ===
      "ephemeralPencil"
  );
  const stroke = useSelector(
    (store) =>
      store.conference.meeting.actions.localPresentation.annotation.color
  );
  const stageRef = useDrawingStageRef();
  const isDrawing = useRef(false);

  const pointsRef = useRef([]);

  useEffect(() => {
    const stage = stageRef?.current;
    if (!stage || !active || !isEphemeralPencil) {
      isDrawing.current = false;
      return;
    }

    const getPosition = () => {
      const pos = stage.getPointerPosition(); // position du curseur dans le canvas
      const stageTransform = stage.getAbsoluteTransform().copy(); // récupère toutes les transformations appliquées
      const position = stageTransform.invert().point(pos); // inverse les transformations pour retrouver les coordonnées "brutes"
      return position;
    };

    const onStartDrawing = () => {
      const pointerPos = stage.getPointerPosition();
      const shape = stage.getIntersection(pointerPos);
      isDrawing.current = !shape;
      if (!isDrawing.current) return;
      const pos = getPosition();
      const points = [pos.x, pos.y, pos.x, pos.y];
      setPoints(points);
      pointsRef.current = points;
    };

    const onDraw = () => {
      if (!isDrawing.current) return;
      const pos = getPosition();
      setPoints((prevPoints) => {
        const points = [pos.x, pos.y, ...prevPoints];
        pointsRef.current = points;
        return points;
      });
    };

    const onEndDrawing = () => {
      isDrawing.current = false;
      if (pointsRef.current?.length === 0) return;
      setPoints([]);
      const id = parseInt(Date.now()).toString(16);
      setPersistePointsData((prevPoints) => [
        { points: pointsRef.current, stroke, id },
        ...prevPoints,
      ]);
      pointsRef.current = [];
    };

    stage.on("pointerdown", onStartDrawing);
    stage.on("pointermove", onDraw);
    stage.on("pointerup pointerleave pointercancel", onEndDrawing);

    return () => {
      stage.off("pointerdown", onStartDrawing);
      stage.off("pointermove", onDraw);
      stage.off("pointerup pointerleave pointercancel", onEndDrawing);
    };
  }, [stageRef, active, isEphemeralPencil, stroke]);

  return (
    <>
      {points.length > 0 && (
        <Line
          points={points}
          stroke={stroke}
          strokeWidth={5}
          lineCap='round'
          lineJoin='round'
          tension={0.8}
        />
      )}
      {persistePointsData.map(({ points, stroke, id }) => (
        <EphemeralLine
          key={id}
          points={points}
          stroke={stroke}
          strokeWidth={5}
          lineCap='round'
          lineJoin='round'
          tension={0.8}
          onFinish={onFinish}
        />
      ))}
    </>
  );
};

const CustomLine = ({ id, onFinish, ...otherProps }) => {
  const lineRef = useRef();

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    line.to({
      opacity: 0,
      duration: 0.8,
      onFinish(e) {
        if (typeof onFinish === "function") onFinish(e, { line, id });
      },
    });
  }, [onFinish, id]);

  return (
    <Line
      ref={lineRef}
      {...otherProps}
      lineCap='round'
      lineJoin='round'
      id={id}
    />
  );
};

const EphemeralLine = React.memo(CustomLine);

export default React.memo(EphemeralPencil);
