import React, { useState, useEffect, useCallback } from "react";
import Pencil, { PencilMark } from "./pencils/Pencil";
import EphemeralPencil from "./pencils/EphemeralPencil";
import RectangleTool, { RectangleMark } from "./figures/RectangleTool";
import ArrowTool, { ArrowMark } from "./figures/ArrowTool";
import LineTool, { LineMark } from "./figures/LineTool";
import CircleTool, { CircleMark } from "./figures/CircleTool";
import TextTool from "./others/TextTool";
import store from "../../../redux/store";

const DrawingArea = () => {
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
    const name = "__local_presentation_view_add_text";

    const handleAddNewText = () => {
      const { localPresentation } = store.getState().conference.meeting.actions;
      const fill = localPresentation.annotation.color;
      const id = Date.now().toString(16);
      const index = tools.findIndex((f) => f === TextTool);
      const draw = handleAddNewDrawing(index);
      console.log(fill);

      if (draw) draw({ id, fill });
    };
    window.addEventListener(name, handleAddNewText);
    return () => {
      window.removeEventListener(name, handleAddNewText);
    };
  }, [handleAddNewDrawing]);

  return (
    <>
      <EphemeralPencil />
      {marks.map((Mark, index) => (
        <Mark key={index} onFinishDrawing={handleAddNewDrawing(index)} />
      ))}
      {drawings.map(({ index, data }, i) => {
        const Tool = tools[index] || null;
        return (
          <React.Fragment key={Tool.id | i}>
            {Tool && <Tool data={data} onErase={handleRemoveDrawing} />}
          </React.Fragment>
        );
      })}
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
