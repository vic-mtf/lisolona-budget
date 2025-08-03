import { Box as MuiBox } from "@mui/material";
import { useTransition, animated } from "@react-spring/web";
import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

const HandRaisedSignalAnimate = React.memo(() => {
  const handRaised = useSelector((store) => store.conference.handRaised);
  return <BorderAnimate visible={handRaised} />;
});

const BorderAnimate = ({ duration = 4000, visible = false }) => {
  const transitions = useTransition(visible ? [1] : [], {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return transitions((style, item) => (
    <animated.div style={{ ...style }}>
      <MuiBox className='starbox' sx={getMuiStyle({ duration })} />
    </animated.div>
  ));
};
const getMuiStyle = ({ duration }) => ({
  position: "absolute",
  height: "calc(100% - 12px)",
  width: "calc(100% - 12px)",
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
  border: "6px solid",
  borderRadius: 25,
  bgcolor: "transparent",
  zIndex: -1,
  "@property --gradX": {
    syntax: `'<percentage>'`,
    initialValue: "50%",
    inherits: true,
  },
  "@property --gradY": {
    syntax: `'<percentage>'`,
    initialValue: "0%",
    inherits: true,
  },
  borderImage: (theme) => `
              conic-gradient(from var(--angle), 
              ${theme.palette.primary.main + "0a"}, ${
    theme.palette.primary.main
  } 0.1turn, 
              ${theme.palette.primary.main} 0.15turn, 
              ${theme.palette.primary.main + "0a"} 0.25turn) 30`,
  animation: `borderRotate ${duration}ms  linear infinite forwards`,
  "& :nth-of-type(2)": {
    borderImage: (theme) =>
      `radial-gradient(ellipse at var(--gradX) var(--gradY), ${
        theme.palette.primary.main
      }, ${theme.palette.primary.main} 10%, ${
        theme.palette.primary.main + "0a"
      } 40%) 30`,
    animation: `borderRadial ${duration}ms  linear infinite forwards`,
  },
  "@keyframes borderRotate": {
    "100% ": {
      "--angle": "420deg",
    },
  },
});

BorderAnimate.propTypes = {
  duration: PropTypes.number,
  visible: PropTypes.bool,
};

HandRaisedSignalAnimate.displayName = "HandRaisedSignalAnimate";
export default HandRaisedSignalAnimate;
