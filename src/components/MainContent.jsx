import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";

export const drawerWidth = 420;

const MainContent = styled("main", {
  shouldForwardProp: (prop) =>
    !["openLeft", "openRight", "side"].includes(prop),
})(({ theme, openLeft, openRight, side = 0 }) => ({
  flexGrow: 1,
  display: "flex",
  flex: 1,
  flexDirection: "column",
  overflow: "hidden",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth * side}px`,
  ...(openLeft && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: -drawerWidth,
  }),

  marginRight: 0,
  ...(openRight && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

MainContent.propTypes = {
  openLeft: PropTypes.bool,
  openRight: PropTypes.bool,
  side: PropTypes.oneOf([0, 1, 2]),
};

export default MainContent;
