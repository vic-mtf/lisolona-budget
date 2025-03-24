import React, { useEffect, useState, useRef } from "react";
import { Text, Transformer } from "react-konva";
import PropTypes from "prop-types";
import { Html } from "react-konva-utils";
import { useTheme } from "@mui/material";
// import Konva from "konva";

const CustomText = React.memo(({ mode, id, text, ...otherProps }) => {
  const [value, setValue] = useState(text);
  const textRef = useRef();
  const transformerRef = useRef();
  const textareaRef = useRef();
  const theme = useTheme();

  useEffect(() => {
    const text = textRef.current;
    const transformer = transformerRef.current;
    // const textarea = textareaRef.current;
    if (text && transformer) {
      transformer.nodes([text]);
      transformer.getLayer().batchDraw();
    }
  }, [mode, id]);

  return (
    <>
      <Text
        ref={textRef}
        id={id}
        padding={4}
        text={value}
        width={300}
        onDblClick={(e) => {
          const textNode = e.target;
          const textarea = textareaRef.current;
          textNode.draggable(false);
          const textPosition = textNode.absolutePosition();
          textarea.style.display = "block";
          textarea.value = textNode.text();
          textarea.style.position = "absolute";
          textarea.style.top = textPosition.y + "px";
          textarea.style.left = textPosition.x + "px";
          textarea.style.width = textNode.width() + "px";
          textarea.style.height = textNode.height() + "px";
          textarea.style.fontSize = textNode.fontSize() + "px";
          textarea.style.padding = textNode.padding() + "px";
          textarea.style.lineHeight = textNode.lineHeight();
          textarea.style.fontFamily = textNode.fontFamily();
          textarea.style.paddingTop = "0px";
          textarea.style.paddingBottom = "0px";
          textarea.style.textAlign = textNode.align();
          textarea.style.caretColor = textNode.fill();
          textarea.style.color = "transparent";

          // const rotation = textNode.rotation();
          // let transform = "";
          // if (rotation) {
          //   transform += "rotateZ(" + rotation + "deg)";
          // }

          // var px = 0;
          // // also we need to slightly move textarea on firefox
          // // because it jumps a bit
          // var isFirefox =
          //   navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
          // if (isFirefox) {
          //   px += 2 + Math.round(textNode.fontSize() / 20);
          // }
          // transform += "translateY(-" + px + "px)";

          // textarea.style.transform = transform;

          // reset height
          textarea.style.height = "auto";
          // after browsers resized it we can set actual value
          textarea.style.height = textarea.scrollHeight + "px";

          textarea.focus();

          // function removeTextarea() {
          //   textarea.parentNode.removeChild(textarea);
          //   window.removeEventListener("click", handleOutsideClick);
          //   textNode.show();
          //   tr.show();
          //   tr.forceUpdate();
          // }

          // function setTextareaWidth(newWidth) {
          //   if (!newWidth) {
          //     // set width for placeholder
          //     newWidth = textNode.placeholder.length * textNode.fontSize();
          //   }
          //   // some extra fixes on different browsers
          //   var isSafari = /^((?!chrome|android).)*safari/i.test(
          //     navigator.userAgent
          //   );
          //   var isFirefox =
          //     navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
          //   if (isSafari || isFirefox) {
          //     newWidth = Math.ceil(newWidth);
          //   }

          //   var isEdge =
          //     document.documentMode || /Edge/.test(navigator.userAgent);
          //   if (isEdge) {
          //     newWidth += 1;
          //   }
          //   textarea.style.width = newWidth + "px";
          // }

          textarea.addEventListener("keydown", function (e) {
            // hide on enter
            // but don't hide on shift + enter
            if (e.keyCode === 13 && !e.shiftKey) {
              textNode.text(textarea.value);
              // removeTextarea();
            }
            // on esc do not set value back to node
            if (e.keyCode === 27) {
              // removeTextarea();
            }
          });
        }}
        {...otherProps}
        // onDragEnd={(e) => {
        //   onChange({
        //     ...shapeProps,
        //     x: e.target.x(),
        //     y: e.target.y(),
        //   });
        // }}
        onTransform={(e) => {
          const textarea = textareaRef.current;
          textarea.style.transform = `scale(${e.target.scaleX()}, ${e.target.scaleY()})`;
        }}
        onTransformEnd={(e) => {
          e.evt.preventDefault();
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          // const node = textRef.current;
          // const scaleX = node.scaleX();
          // const scaleY = node.scaleY();
          // we will reset it back
          // node.scaleX(1);
          // node.scaleY(1);
          // onChange({
          //   ...shapeProps,
          //   x: node.x(),
          //   y: node.y(),
          //   // set minimal value
          //   width: Math.max(5, node.width() * scaleX),
          //   height: Math.max(node.height() * scaleY),
          // });
        }}
      />
      <Html>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            const textNode = textRef.current;
            // const scale = textNode.getAbsoluteScale().x;
            e.currentTarget.style.width = textNode.width() + "px";
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height =
              e.currentTarget.scrollHeight + textNode.fontSize() + "px";
          }}
          style={{
            position: "absolute",
            border: "none",
            padding: "0px",
            margin: "0px",
            overflow: "hidden",
            background: "none",
            outline: "none",
            resize: "none",
            transformOrigin: "left top",
            display: "none",
            width: 100,
          }}
        />
      </Html>
      <Transformer
        ref={transformerRef}
        rotateEnabled={false}
        flipEnabled={false}
        anchorStyleFunc={(anchor) => {
          anchor.fill(theme.palette.primary.main);
          anchor.cornerRadius(50);
        }}
        anchorStrokeWidth={1.5}
        anchorStroke='white'
        anchorSize={8}
        borderStroke={theme.palette.primary.main}
        boundBoxFunc={(oldBox, newBox) =>
          Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5
            ? oldBox
            : newBox
        }
      />
    </>
  );
});

CustomText.propTypes = {
  mode: PropTypes.oneOf(["persist", "ephemeral"]),
  onFinish: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  text: PropTypes.string,
};

CustomText.displayName = "CustomText";
export default CustomText;
