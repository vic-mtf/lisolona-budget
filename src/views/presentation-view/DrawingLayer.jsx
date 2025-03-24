import React, { useRef, useMemo, useLayoutEffect } from "react";
import Konva from "konva";
import { Layer, Stage } from "react-konva";
import PropTypes from "prop-types";
import DrawnVideo from "./DrawnVideo";
import DrawForms from "./DrawForms";

const DrawingLayer = React.memo(
  ({ width = 0, height = 0, videoRef, streamRef, mode, color }) => {
    const stageRef = useRef();
    const sceneSize = useMemo(() => ({ width: 0, height: 0 }), []);
    const layerRef = useRef();

    const scale = useMemo(() => {
      const currentSize = Math.max(width, height);
      const originSize = Math.max(sceneSize.width, sceneSize.height);
      return currentSize === originSize || !originSize
        ? 1
        : currentSize / originSize;
    }, [width, height, sceneSize]);

    useLayoutEffect(() => {
      sceneSize.height = Math.max(height, sceneSize.height);
      sceneSize.width = Math.max(width, sceneSize.width);
      const stage = stageRef.current;
      const layer = layerRef.current;
      if ("current" in streamRef && stage) {
        const canvas = stage.content.querySelector("& > canvas");
        streamRef.current = canvas.captureStream(25);
      }
      if (layer) {
        const anim = new Konva.Animation(() => {}, layer);
        anim.start();
        return () => anim.stop();
      }
    }, [sceneSize, height, width, scale, streamRef]);

    return (
      <Stage
        ref={stageRef}
        height={height}
        width={width}
        scaleX={scale}
        scaleY={scale}
        style={{ top: 0, left: 0, userSelect: "none" }}
        className='stage-container'
        draggable={false}>
        <Layer x={0} y={0} ref={layerRef} draggable={false}>
          <DrawnVideo
            videoRef={videoRef}
            width={width}
            height={height}
            scale={scale}
            sceneSize={sceneSize}
          />
          <DrawForms stageRef={stageRef} mode={mode} color={color} />
          {/* <WriteTexts stageRef={stageRef} scale={scale} /> */}
        </Layer>
      </Stage>
    );
  }
);

DrawingLayer.displayName = "DrawingLayer";

DrawingLayer.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  videoRef: PropTypes.object,
  streamRef: PropTypes.object,
  mode: PropTypes.string,
  color: PropTypes.string,
};

export default DrawingLayer;
