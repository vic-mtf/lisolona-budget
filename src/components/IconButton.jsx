import { styled, ToggleButton } from "@mui/material";
import React from "react";

const IconButton = styled(
  React.forwardRef((props, ref) => (
    <ToggleButton size='small' value='' {...props} ref={ref} />
  ))
)(() => ({
  // textTransform: 'none',
  border: "none",
  "&:disabled": {
    border: "none",
  },
}));

export default IconButton;
