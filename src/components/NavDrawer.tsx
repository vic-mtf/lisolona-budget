import { forwardRef } from "react";
import { Drawer, styled } from "@mui/material";
import { drawerWidth as width } from "./MainContent";

const DrawerForwardRef = forwardRef(
  ({ variant = "persistent", ...otherProps }, ref) => (
    <Drawer variant={variant} {...otherProps} ref={ref} hideBackdrop />
  )
);

DrawerForwardRef.displayName = "DrawerForwardRef";

const NavDrawer = styled(DrawerForwardRef)(({ drawerWidth = width }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    border: "none",
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
