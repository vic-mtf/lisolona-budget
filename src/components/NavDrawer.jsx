import { forwardRef } from "react";
import { Drawer, styled } from "@mui/material";
import { drawerWidth as width } from "./MainContent";

const NavDrawer = styled(
  forwardRef(({ variant = "persistent", ...otherProps }, ref) => (
    <Drawer variant={variant} {...otherProps} ref={ref} />
  ))
)(({ drawerWidth = width }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    display: "flex",
    overflow: "hidden",
  },
}));

export default NavDrawer;

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
