import ToggleButton from "@mui/material/ToggleButton";
import FlipToBackOutlinedIcon from "@mui/icons-material/FlipToBackOutlined";
import FlipToFrontOutlinedIcon from "@mui/icons-material/FlipToFrontOutlined";
import Box from "@mui/material/Box";
//import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { useCallback } from "react";
import { EVENT_NAMES } from "../../annotationStyles";
import { Chip } from "@mui/material";

const FlipZIndexButton = ({ shapeNode }) => {
  const [maxValue] = useState(() => {
    if (!shapeNode) return 0;
    const stage = shapeNode?.getStage();
    const layer = stage
      .getChildren()
      .find((l) => l?.id() === "drawing-area-layer");
    return layer.getChildren().length - 1;
  });
  const [index, setIndex] = useState(() => {
    if (!shapeNode) return 0;
    const stage = shapeNode?.getStage();
    const layer = stage
      .getChildren()
      .find((l) => l?.id() === "drawing-area-layer");
    return layer
      .getChildren()
      .map((shape) => shape.id())
      .indexOf(shapeNode?.id());
  });

  const handleToggle = useCallback(
    (dir = 1) =>
      () => {
        if (!shapeNode) return;
        const name = EVENT_NAMES.updateTool;
        const customEvent = new CustomEvent(name, {
          detail: { index, dir, type: "flipZIndex" },
        });
        window.dispatchEvent(customEvent);
        setIndex((i) => Math.min(Math.max(i + dir, 0), maxValue));
      },
    [shapeNode, maxValue, index]
  );

  return (
    <>
      <Tooltip title="Retourner à l'arrière" placement='top'>
        <div>
          <ToggleButton
            value='back'
            aria-label='back'
            disabled={index === 0}
            onClick={handleToggle(-1)}>
            <FlipToBackOutlinedIcon fontSize='small' />
          </ToggleButton>
        </div>
      </Tooltip>
      <Tooltip title="Retourner vers l'avant" placement='top'>
        <div>
          <ToggleButton
            onClick={handleToggle(1)}
            value='front'
            aria-label='front'
            disabled={index === maxValue}>
            <FlipToFrontOutlinedIcon fontSize='small' />
          </ToggleButton>
        </div>
      </Tooltip>
      <Tooltip title='Position' placement='top'>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Chip label={index + 1} size='small' variant='outlined' />
        </Box>
      </Tooltip>
    </>
  );
};

FlipZIndexButton.propTypes = {
  shapeNode: PropTypes.object,
};

export default FlipZIndexButton;
