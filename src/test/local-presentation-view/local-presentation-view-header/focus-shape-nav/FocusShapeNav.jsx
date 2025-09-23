import React from "react";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import { useEffect } from "react";
import { EVENT_NAMES } from "../annotationStyles";
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
} from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/material";
import FlipZIndexButton from "./buttons/FlipZIndexButton";

const FocusShapeNav = () => {
  const [open, setOpen] = React.useState(false);
  const [shapeNode, setShapeNode] = React.useState(null);

  useEffect(() => {
    const handleFocusShape = (e) => {
      const { shape } = e.detail;
      setShapeNode(shape);
      setOpen(Boolean(shape));
    };

    window.addEventListener(EVENT_NAMES.selectTool, handleFocusShape);

    return () => {
      window.removeEventListener(EVENT_NAMES.selectTool, handleFocusShape);
    };
  }, []);

  return (
    <Fade
      in={open}
      appear={false}
      timeout={100}
      unmountOnExit
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}>
      <Box>
        <RootToggleButtonGroup size='small'>
          {shapeNode && (
            <FlipZIndexButton shapeNode={shapeNode} key={shapeNode?.id()} />
          )}
        </RootToggleButtonGroup>
      </Box>
    </Fade>
  );
};

const RootToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
  },
  [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
    {
      marginLeft: -1,
      borderLeft: "1px solid transparent",
    },
}));

export default React.memo(FocusShapeNav);
