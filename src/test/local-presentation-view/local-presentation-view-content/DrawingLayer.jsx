import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import annotationStyles, {
  findById,
} from "../local-presentation-view-header/annotationStyles";
import { Layer } from "react-konva";
import DrawingStageProvider from "../../../components/DrawingStageProvider";
import DrawingArea from "./DrawingArea";
import EphemeralPencil from "./pencils/EphemeralPencil";

const DrawingLayer = ({ width, height, scaleX, scaleY, offsetX, offsetY }) => {
  const mode = useSelector(
    (store) =>
      store.conference.meeting.actions.localPresentation.annotation.mode
  );
  const color = useSelector(
    (store) =>
      store.conference.meeting.actions.localPresentation.annotation.color
  );
  const active = useSelector(
    (store) =>
      store.conference.meeting.actions.localPresentation.annotation.active
  );

  const modeSelected = useMemo(
    () => findById({ kinds: annotationStyles }, mode),
    [mode]
  );

  const cursor = useMemo(() => {
    const pens = ["pencil", "ephemeralPencil"];
    if (active) {
      if (pens.includes(modeSelected.id)) {
        const url = generateCircleSVG(color, 4);
        return `url("${url}") 4 4, auto`;
      }
    }

    return "default";
  }, [modeSelected, active, color]);

  return (
    <Box
      position={"absolute"}
      id='local-presentation-video-layer'
      onContextMenu={(e) => e.preventDefault()}
      top={offsetY}
      left={offsetX}
      width={width}
      height={height}
      sx={{ cursor }}>
      <DrawingStageProvider
        width={width}
        height={height}
        scaleX={scaleX}
        scaleY={scaleY}>
        <Layer id='drawing-area-layer'>
          <DrawingArea />
        </Layer>
        <Layer id='ephemeral-pencil-layer'>
          <EphemeralPencil />
        </Layer>
      </DrawingStageProvider>
    </Box>
  );
};

DrawingLayer.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  scaleX: PropTypes.number,
  scaleY: PropTypes.number,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
};

const generateCircleSVG = (color, radius = 3, strokeWidth = 1) => {
  const size = radius * 2;
  const r = Math.max(0, radius - strokeWidth / 2);
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>
      <defs>
        <filter id='shadow' x='-50%' y='-50%' width='200%' height='200%'>
          <feDropShadow dx='1' dy='1' stdDeviation='1' flood-color='rgba(0,0,0,0.3)'/>
        </filter>
      </defs>
      <circle cx='${radius}' cy='${radius}' r='${r}' fill='${color}' stroke='white' stroke-width='${strokeWidth}' filter='url(#shadow)'/>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export default React.memo(DrawingLayer);
