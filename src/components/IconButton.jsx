import { styled, IconButton as MuiIconButton } from "@mui/material";
import React from "react";

const IconButton = styled(
  React.forwardRef((props, ref) => (
    <MuiIconButton size='small' value='' {...props} ref={ref} />
  ))
)(({ theme }) => ({
  borderRadius: theme.spacing(0.5),
  "& .MuiTouchRipple-root span": {
    borderRadius: theme.spacing(0.5),
  },
}));

export default IconButton;
