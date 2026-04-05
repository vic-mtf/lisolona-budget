import { useControls } from "react-zoom-pan-pinch";
import React, { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import ZoomOutOutlinedIcon from "@mui/icons-material/ZoomOutOutlined";
import ZoomInOutlinedIcon from "@mui/icons-material/ZoomInOutlined";

const ZoomSlider = ({ mode = "normal" }) => {
  const { centerView, resetTransform, zoomIn, zoomOut } = useControls();

  useEffect(() => {
    if (mode === "normal") resetTransform();
    else centerView(1.5);
  }, [centerView, resetTransform, mode]);

  return (
    <Box p={1} display='flex' alignItems='center' gap={1}>
      <IconButton onClick={() => zoomOut(1 / 3)}>
        <ZoomOutOutlinedIcon />
      </IconButton>
      <ScreenZoom />
      <IconButton onClick={() => zoomIn(1 / 3)}>
        <ZoomInOutlinedIcon />
      </IconButton>
    </Box>
  );
};

const ScreenZoom = React.memo(() => {
  const { instance } = useControls();
  const [scale, setScale] = useState(instance.getContext().state.scale * 100);
  useEffect(() => {
    instance.onChange(({ state }) => setScale(Math.floor(state.scale * 100)));
  }, [instance]);
  return <Box>{scale}%</Box>;
});

ScreenZoom.displayName = "ScreenZoom";

export default ZoomSlider;
