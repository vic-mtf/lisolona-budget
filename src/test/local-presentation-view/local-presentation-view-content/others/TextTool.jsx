import { Text, Transformer } from "react-konva";
import { Html } from "react-konva-utils";
import React, { useEffect, useRef, useState, useCallback } from "react";
import useDrawingStageRef from "../../../../hooks/useDrawingStageRef";
import TextEditor from "./TextEditor";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const TextTool = ({ data, onErase }) => {
  const [hasFocus, setHasFocus] = useState(true);
  const [text, setText] = useState(data.text || "Nouvel texte");
  const [isEditing, setIsEditing] = useState(false);
  const [textWidth, setTextWidth] = useState(200);
  const [hovered, setHovered] = useState(false);

  const textRef = useRef();
  const trRef = useRef();
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

  const handleTextDblClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleTextChange = useCallback(
    (newText) => {
      setText(newText);
      data.text = newText;
    },
    [data]
  );

  const handleTransform = useCallback(() => {
    const node = textRef.current;
    const scaleX = node.scaleX();
    const newWidth = node.width() * scaleX;
    setTextWidth(newWidth);
    node.setAttrs({
      width: newWidth,
      scaleX: 1,
    });
  }, []);

  const handleErase = useCallback(() => {
    if (typeof onErase === "function") onErase(data.id);
  }, [onErase, data.id]);

  useEffect(() => {
    if (trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
    }
  }, [isEditing]);

  useEffect(() => {
    const stage = stageRef?.current;
    if (!stage) return;

    const onClickText = () => {
      const pointerPos = stage.getPointerPosition();
      const shape = stage.getIntersection(pointerPos);
      if (shape?.id() === data.id && !hasFocus) setHasFocus(true);
      if (shape?.id() !== data.id && hasFocus) setHasFocus(false);
      if (!active) return;
      if (isGum && shape?.id() === data.id) handleErase();
    };

    const onStartErase = () => {
      if (isGum) isErasing.current = true;
    };
    const onEndErase = () => {
      if (isGum) isErasing.current = false;
    };

    stage.on("pointerdown", onStartErase);
    stage.on("pointerup pointerleave pointercancel", onEndErase);
    stage.on("click", onClickText);

    return () => {
      stage.off("click", onClickText);
      stage.off("pointerdown", onStartErase);
      stage.off("pointerup pointerleave pointercancel", onEndErase);
    };
  }, [stageRef, data.id, hasFocus, isGum, handleErase, active]);

  useEffect(() => {
    const textNode = textRef.current;
    const stage = stageRef?.current;
    if (!textNode || !stage) return;
    const center = stage
      .getAbsoluteTransform()
      .copy()
      .invert()
      .point({
        x: (stage.width() - textNode.width()) / 2,
        y: stage.height() / 2,
      });
    textNode.position(center);
  }, [stageRef]);

  return (
    <>
      <Text
        ref={textRef}
        text={text}
        id={data.id}
        fontSize={30}
        fill={data.fill}
        draggable={!isGum}
        width={textWidth}
        onDblClick={handleTextDblClick}
        onDblTap={handleTextDblClick}
        onTransform={handleTransform}
        visible={!isEditing}
        opacity={isGum && hovered ? 0.3 : 1}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => isGum && handleErase(data.id)}
        onMouseOver={() => {
          if (isGum && isErasing.current) handleErase();
        }}
      />
      <Html>
        {isEditing && (
          <TextEditor
            textNode={textRef.current}
            onChange={handleTextChange}
            onClose={() => setIsEditing(false)}
          />
        )}
      </Html>
      {
        <Transformer
          ref={trRef}
          visible={hasFocus}
          anchorCornerRadius={50}
          opacity={isGum && hovered ? 0.2 : 0.8}
          anchorSize={6}
          rotateEnabled={false}
          borderStroke={data.fill}
          anchorStroke={data.fill}
          enabledAnchors={["middle-left", "middle-right"]}
          boundBoxFunc={(oldBox, newBox) => ({
            ...newBox,
            width: Math.max(30, newBox.width),
          })}
        />
      }
    </>
  );
};

TextTool.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    fill: PropTypes.string.isRequired,
    text: PropTypes.string,
  }).isRequired,
  onErase: PropTypes.func,
};

export default React.memo(TextTool);
