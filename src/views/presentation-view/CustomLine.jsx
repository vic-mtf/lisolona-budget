import React, { useEffect } from "react";
import { useRef } from "react";
import { Line } from "react-konva";
import PropTypes from "prop-types";

const CustomLine = React.memo(
  ({ mode = "persist", id, onFinish, ...otherProps }) => {
    const lineRef = useRef();

    useEffect(() => {
      const line = lineRef.current;
      if (mode === "ephemeral" && line)
        line.to({
          opacity: 0,
          duration: 0.8,
          onFinish() {
            if (typeof onFinish === "function") onFinish(line, id);
          },
        });
    }, [mode, onFinish, id]);

    return (
      <Line ref={lineRef} {...otherProps} lineCap='round' lineJoin='round' />
    );
  }
);

CustomLine.propTypes = {
  mode: PropTypes.oneOf(["persist", "ephemeral"]),
  onFinish: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
CustomLine.displayName = "CustomLine";
export default CustomLine;
