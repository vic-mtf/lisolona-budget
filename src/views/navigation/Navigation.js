import { Drawer, Toolbar, Box as MuiBox } from "@mui/material";

export const drawerWidth = 400;

export default function Navigation({
  children,
  toolBarProps,
  color,
  disableTooBar,
  sx,
  ...otherProps
}) {
  console.log(otherProps);
  return (
    <MuiBox
      variant='permanent'
      component={Drawer}
      sx={{
        width: {
          xs: "100%",
          md: otherProps?.open ? drawerWidth : 0,
        },
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: {
            xs: "100%",
            md: drawerWidth,
          },
          boxSizing: "border-box",
          background: color || "background.paper",
        },
        ...sx,
      }}
      {...otherProps}>
      {!disableTooBar && <Toolbar variant='dense' {...toolBarProps} />}
      {children}
    </MuiBox>
  );
}
