import { Text, Transformer } from "react-konva";
import { Html } from "react-konva-utils";
import React, { useEffect, useRef, useState, useCallback } from "react";
import useDrawingStageRef from "../../../../hooks/useDrawingStageRef";
import TextEditor from "./TextEditor";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const TextTool = ({ data, onErase, onUpdate }) => {
  const [text, setText] = useState(data.text || "Nouvel texte");
  const [isEditing, setIsEditing] = useState(false);
  const [textWidth, setTextWidth] = useState(() =>
    typeof data?.width === "number" ? data.width : 200
  );
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

  const handleTransformEnd = useCallback(() => {
    const node = textRef.current;
    const scaleX = node.scaleX();
    const width = node.width() * scaleX;
    if (typeof onUpdate === "function") onUpdate({ width });
  }, [onUpdate]);

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

    const onSelect = () => {
      const pointerPos = stage.getPointerPosition();
      const s = stage.getIntersection(pointerPos);
      const transformer = s?.findAncestor(
        (node) => node.getClassName() === "Transformer",
        true
      );
      const shape = transformer?.nodes()?.[0] || s;

      if (shape?.id() === data.id && !data?.focused)
        onUpdate({ focused: true });
      if (shape?.id() !== data.id && data?.focused)
        onUpdate({ focused: false });
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
    stage.on("pointerdown", onSelect);
    stage.on("pointerup pointerleave pointercancel", onEndErase);

    return () => {
      stage.off("pointerdown", onSelect);
      stage.off("pointerdown", onStartErase);
      stage.off("pointerup pointerleave pointercancel", onEndErase);
    };
  }, [stageRef, data.id, isGum, handleErase, active, onUpdate, data.focused]);

  useEffect(() => {
    const textNode = textRef.current;
    const stage = stageRef?.current;
    if (typeof data?.x === "number" || typeof data?.y === "number") return;
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
  }, [stageRef, data.x, data.y]);

  return (
    <>
      <Text
        ref={textRef}
        text={text}
        id={data.id}
        fontSize={data?.fontSize || 30}
        fill={data.fill}
        draggable={!isGum}
        width={textWidth}
        onDblClick={handleTextDblClick}
        onDblTap={handleTextDblClick}
        x={data?.x}
        y={data?.y}
        onDragEnd={(e) => {
          const { x, y } = e.target.position();
          data.x = x;
          data.y = y;
          if (typeof onUpdate === "function") onUpdate({ x, y });
        }}
        onTransform={handleTransform}
        onTransformEnd={handleTransformEnd}
        visible={!isEditing}
        opacity={isGum && hovered ? 0.3 : 1}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => isGum && handleErase(data.id)}
        fontStyle={data.fontStyle}
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
          id={data.id}
          visible={data?.focused}
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
    fontSize: PropTypes.number,
    fontStyle: PropTypes.string,
    focused: PropTypes.bool,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
  }).isRequired,
  onUpdate: PropTypes.func,
  onErase: PropTypes.func,
};

export default React.memo(TextTool);
