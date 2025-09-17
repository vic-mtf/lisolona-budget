import React from "react";
import { Stage } from "react-konva";
import PropTypes from "prop-types";
import { DrawingStageContext } from "../hooks/useDrawingStageRef";

const DrawingStageProvider = ({ children, width, height, scaleX, scaleY }) => {
  const stageRef = React.useRef();

  return (
    <Provider value={stageRef}>
      <div style={{ position: "absolute" }}>
        <Stage
          width={width}
          height={height}
          ref={stageRef}
          style={{ touchAction: "none" }}
          scaleX={scaleX}
          scaleY={scaleY}>
          {children}
        </Stage>
      </div>
    </Provider>
  );
};

const { Provider } = DrawingStageContext;

DrawingStageProvider.propTypes = {
  children: PropTypes.node,
  width: PropTypes.number,
  height: PropTypes.number,
  scaleX: PropTypes.number,
  scaleY: PropTypes.number,
};

export default React.memo(DrawingStageProvider);
