import { styled, Typography } from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";
import { forwardRef } from "react";

const Link = styled(
  forwardRef((props, ref) => (
    <Typography ref={ref} component={ReactRouterLink} {...props} />
  ))
)(() => ({
  textDecoration: "none",
}));

export default Link;
