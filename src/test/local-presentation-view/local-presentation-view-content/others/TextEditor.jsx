import React, { useEffect, useRef } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import PropTypes from "prop-types";
import { Text } from "react-konva";

// Konva._fixTextRendering = true;

const TextEditor = ({ textNode, onClose, onChange }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    // const stage = textNode.getStage();
    const textPosition = textNode.position();
    // const stageBox = stage.container().getBoundingClientRect();
    const areaPosition = {
      x: textPosition.x,
      y: textPosition.y,
    };

    // Match styles with the text node
    textarea.value = textNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${textNode.width() - textNode.padding() * 2}px`;
    textarea.style.height = `${
      textNode.height() - textNode.padding() * 2 + 5
    }px`;
    textarea.style.fontSize = `${textNode.fontSize()}px`;
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill();
    textarea.style.fontWeight = textNode.fontStyle().includes("bold")
      ? "bold"
      : "normal";
    textarea.style.fontStyle = textNode.fontStyle().includes("italic")
      ? "italic"
      : "normal";
    const rotation = textNode.rotation();
    let transform = "";
    if (rotation) {
      transform += `rotateZ(${rotation}deg)`;
    }
    textarea.style.transform = transform;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 3}px`;
    textarea.focus();

    // Add event listeners
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onChange(textarea.value);
        onClose();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleInput = () => {
      const scale = textNode.getAbsoluteScale().x;
      textarea.style.width = `${textNode.width() * scale}px`;
      textarea.style.height = "auto";
      textarea.style.height = `${
        textarea.scrollHeight + textNode.fontSize()
      }px`;
      onChange(textarea.value);
    };

    textarea.addEventListener("keydown", handleKeyDown);
    textarea.addEventListener("input", handleInput);

    return () => {
      textarea.removeEventListener("keydown", handleKeyDown);
      textarea.removeEventListener("input", handleInput);
    };
  }, [textNode, onChange, onClose]);

  useEffect(() => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    textarea.select();
  }, []);

  return (
    <ClickAwayListener
      onClickAway={(e) => {
        const textarea = textareaRef.current;
        e.preventDefault();
        onChange(textarea.value);
        onClose();
      }}>
      <div>
        <textarea
          ref={textareaRef}
          spellCheck={false}
          autoCorrect='off'
          autoComplete='off'
          autoCapitalize='off'
          style={{
            minHeight: "1em",
            position: "absolute",
          }}
        />
      </div>
    </ClickAwayListener>
  );
};

TextEditor.propTypes = {
  textNode: PropTypes.oneOfType([
    PropTypes.instanceOf(Text),
    PropTypes.object,
    PropTypes.node,
  ]).isRequired, // PropTypes.instanceOf(Text).isRequired,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};
export default React.memo(TextEditor);
