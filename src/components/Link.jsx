import { styled, Typography } from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";
import { forwardRef } from "react";

const RouterLink = forwardRef((props, ref) => (
  <Typography ref={ref} component={ReactRouterLink} {...props} />
));
RouterLink.displayName = "RouterLink";
const Link = styled(RouterLink)(() => ({
  textDecoration: "none",
}));

Link.displayName = "Link";
export default Link;
