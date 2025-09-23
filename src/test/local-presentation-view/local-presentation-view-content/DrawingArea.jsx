import React, { useState, useEffect, useCallback } from "react";
import Pencil, { PencilMark } from "./pencils/Pencil";
// import EphemeralPencil from "./pencils/EphemeralPencil";
import RectangleTool, { RectangleMark } from "./figures/RectangleTool";
import ArrowTool, { ArrowMark } from "./figures/ArrowTool";
import LineTool, { LineMark } from "./figures/LineTool";
import CircleTool, { CircleMark } from "./figures/CircleTool";
import TextTool from "./others/TextTool";
import store from "../../../redux/store";
import { EVENT_NAMES } from "../local-presentation-view-header/annotationStyles";
import useDrawingStageRef from "../../../hooks/useDrawingStageRef";

const DrawingArea = () => {
  const stageRef = useDrawingStageRef();
  const [drawings, setDrawings] = useState([]);

  const handleAddNewDrawing = useCallback(
    (index) => (data) =>
      setDrawings((drawings) => [...drawings, { index, data }]),
    []
  );
  const handleRemoveDrawing = useCallback(
    (id) =>
      setDrawings((drawings) => drawings.filter(({ data }) => data.id !== id)),
    []
  );

  useEffect(() => {
    const stage = stageRef?.current;
    const handleAddNewText = () => {
      const { localPresentation } = store.getState().conference.meeting.actions;
      const fill = localPresentation.annotation.color;
      const id = Date.now().toString(16);
      const index = tools.findIndex((f) => f === TextTool);
      const draw = handleAddNewDrawing(index);
      if (draw) draw({ id, fill });
    };
    const handleDeleteAll = () => setDrawings([]);
    const selectTool = (evt) => {
      const targetNode = evt.target;
      const parentLayer = targetNode.getLayer();

      const pointerPos = stage.getPointerPosition();
      let shape = stage.getIntersection(pointerPos);

      if (parentLayer?.id() !== "drawing-area-layer") shape = null;
      const name = EVENT_NAMES.selectTool;
      const detail = { shape, name };
      const customEvent = new CustomEvent(name, { detail });
      window.dispatchEvent(customEvent);
    };
    // const getLayer = (l) => l?.id() === "drawing-area-layer";
    // const layer = stage?.getChildren().find(getLayer);
    stage?.on("pointerdown", selectTool);
    window.addEventListener(EVENT_NAMES.addText, handleAddNewText);
    window.addEventListener(EVENT_NAMES.deleteAll, handleDeleteAll);
    return () => {
      window.removeEventListener(EVENT_NAMES.addText, handleAddNewText);
      window.removeEventListener(EVENT_NAMES.deleteAll, handleDeleteAll);
      stage?.off("pointerdown", selectTool);
    };
  }, [handleAddNewDrawing, stageRef]);

  useEffect(() => {
    const stage = stageRef?.current;
    if (!stage) return;
    const handleToolUpdate = (evt) => {
      const { dir, type, index } = evt.detail;
      if (type !== "flipZIndex") return;
      const _drawings = [...drawings];

      const newIndex = Math.min(drawings.length - 1, Math.max(0, index + dir));
      const replacedShape = drawings[newIndex];
      _drawings[newIndex] = drawings[index];
      _drawings[index] = replacedShape;
      setDrawings([..._drawings]);
    };

    window.addEventListener(EVENT_NAMES.updateTool, handleToolUpdate);
    return () => {
      window.removeEventListener(EVENT_NAMES.updateTool, handleToolUpdate);
    };
  }, [stageRef, drawings]);

  console.log("render drawings", drawings);

  return (
    <>
      {drawings.map(({ index, data }, i) => {
        const Tool = tools[index] || null;
        return (
          <React.Fragment key={Tool.id | i}>
            {Tool && <Tool data={data} onErase={handleRemoveDrawing} />}
          </React.Fragment>
        );
      })}
      {marks.map((Mark, index) => (
        <Mark key={index} onFinishDrawing={handleAddNewDrawing(index)} />
      ))}
    </>
  );
};

const marks = [PencilMark, RectangleMark, ArrowMark, LineMark, CircleMark];
const tools = [
  Pencil,
  RectangleTool,
  ArrowTool,
  LineTool,
  CircleTool,
  TextTool,
];

export default React.memo(DrawingArea);
