import React from "react";
import { useTheme, useMediaQuery, Slide, Zoom } from "@mui/material";

const MuiDialogTransition = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  return matches ? (
    <Slide direction='up' ref={ref} {...props} unmountOnExit />
  ) : (
    <Zoom ref={ref} {...props} unmountOnExit />
  );
});

MuiDialogTransition.displayName = "MuiDialogTransition";
export default MuiDialogTransition;
