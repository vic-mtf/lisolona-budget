import { styled, Box as MuiBox, Fab, IconButton } from "@mui/material";

export const Container = styled(MuiBox)(() => ({
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
  width: "100%",
}));

export const ContainerInner = styled(MuiBox, {
  shouldForwardProp: (prop) => prop !== "duration",
})(({ theme, duration = 500 }) => ({
  display: "flex",
  height: "100%",
  width: "100%",
  transition: theme.transitions.create("transform", {
    easing: "ease-in-out",
    duration,
  }),
}));

export const ContainerlItem = styled(MuiBox)(() => ({
  flex: "0 0 100%",
}));

export const ContainerNavigationZone = styled(MuiBox)(() => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  padding: "10px",
  fontSize: "1.5rem",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

export const NavigationButton = styled(IconButton)(({ theme }) => ({
  background: theme.palette.divider,
  backdropFilter: `blur(${theme.customOptions.blur})`,
}));
