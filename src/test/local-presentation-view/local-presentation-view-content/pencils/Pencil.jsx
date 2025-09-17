import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { Line } from "react-konva";
import useDrawingStageRef from "../../../../hooks/useDrawingStageRef";

const Pencil = () => {
  const [points, setPoints] = useState([]);
  const stageRef = useDrawingStageRef();
  const isDrawing = useRef(false);

  useEffect(() => {
    const stage = stageRef?.current;
    if (!stage) return;
    let index = 0;

    const getPosition = () => {
      const pos = stage.getPointerPosition(); // position du curseur dans le canvas
      const stageTransform = stage.getAbsoluteTransform().copy(); // récupère toutes les transformations appliquées
      const position = stageTransform.invert().point(pos); // inverse les transformations pour retrouver les coordonnées "brutes"
      return position;
    };

    const updatePoints = (pos) => {
      setPoints((prevPoints) => {
        const newPoints = [...prevPoints];
        if (index === newPoints.length)
          newPoints.push({ points: [], stroke: "red" });
        const oldPoints = newPoints[index];
        newPoints[index] = {
          ...oldPoints,
          points: [...oldPoints.points, pos.x, pos.y, pos.x, pos.y],
        };
        console.log(pos);
        return newPoints;
      });
    };

    const StartDrawing = () => {
      isDrawing.current = true;
      const pos = getPosition();
      updatePoints(pos);
    };

    const Draw = () => {
      if (!isDrawing.current) return;
      const pos = getPosition();
      updatePoints(pos);
    };

    const EndDrawing = () => {
      isDrawing.current = false;
      index += 1;
    };

    stage.addEventListener("pointerdown", StartDrawing);
    stage.addEventListener("pointermove", Draw);
    stage.addEventListener("pointerup", EndDrawing);
    stage.addEventListener("pointercancel", EndDrawing);
    return () => {
      stage.removeEventListener("pointerdown", StartDrawing);
      stage.removeEventListener("pointermove", Draw);
      stage.removeEventListener("pointerup", EndDrawing);
      stage.removeEventListener("pointercancel", EndDrawing);
    };
  }, [stageRef]);

  return (
    <>
      {points.map(({ points, stroke }, index) => (
        <Line
          key={index}
          points={points}
          stroke={stroke}
          strokeWidth={4}
          lineCap='round'
          lineJoin='round'
          tension={0.4}
        />
      ))}
    </>
  );
};

export default React.memo(Pencil);
