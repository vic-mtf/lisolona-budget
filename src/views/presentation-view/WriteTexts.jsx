import { useMemo, useEffect, useState, useCallback } from "react";
import { Text } from "react-konva";
import PropTypes from "prop-types";
import CustomText from "./CustomText";

const WriteTexts = ({ stageRef, scale }) => {
  const [texts, setTexts] = useState([]);
  const [text, setText] = useState(null);
  const color = "gold";
  const paintState = useMemo(
    () => ({ active: false, mode: "text" || "persist" }),
    []
  );

  useEffect(() => {
    const stage = stageRef?.current;

    if (stage && ["text"].includes(paintState.mode)) {
      const onClick = (e) => {
        e.evt.preventDefault();
        if (e.evt.button || e.target.id()) return;
        // paintState.active = true;
        const pos = stage.getPointerPosition();
        const stageTransform = stage.getAbsoluteTransform().copy();
        const { x, y } = stageTransform.invert().point(pos);
        setText({
          text: "Bonjour le monde",
          x,
          y,
          id: Date.now().toString(16),
        });
      };

      stage.on("click", onClick);
      //   stage.on("mouseup touchend mouseleave", onEnd);
      //   stage.on("mousemove touchmove", onMouseMove);
      return () => {
        // stage.off("mousedown touchstart", onStart);
        // stage.off("mouseup touchend mouseleave", onEnd);
        // stage.off("mousemove touchmove", onMouseMove);
      };
    }
  }, [stageRef, paintState, scale]);

  return (
    <>
      {text && (
        <CustomText
          draggable
          {...text}
          fontSize={40}
          fill={color}
          stroke='#00000015'
        />
      )}
      {texts.map(({ id, ...data }) => (
        <Text
          {...data}
          key={id}
          id={id}
          lineCap='round'
          pointerLength={5}
          draggable
          //   fill={color}
          pointerWidth={5}
        />
      ))}
    </>
  );
};

WriteTexts.propTypes = {
  stageRef: PropTypes.object,
  scale: PropTypes.number,
};
export default WriteTexts;
