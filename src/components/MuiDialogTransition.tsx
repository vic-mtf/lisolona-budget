import React from "react";
import { Slide, Zoom, Fade } from "@mui/material";
import useSmallScreen from "../hooks/useSmallScreen";

const MuiDialogTransition = React.forwardRef((props, ref) => {
  const matches = useSmallScreen();
  return matches ? (
    <Slide direction='up' ref={ref} {...props} unmountOnExit />
  ) : (
    <Zoom ref={ref} {...props} unmountOnExit appear={false} />
  );
});

export const MuiModalTransition = React.forwardRef(
  ({ children, ...props }, ref) => {
    return (
      <Zoom ref={ref} {...props} unmountOnExit appear={false}>
        <Fade {...props} unmountOnExit appear={false}>
          {children}
        </Fade>
      </Zoom>
    );
  }
);

MuiModalTransition.displayName = "MuiModalTransition";
MuiDialogTransition.displayName = "MuiDialogTransition";
export default MuiDialogTransition;
