import React from "react";
//import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import { useEffect } from "react";
import { EVENT_NAMES } from "../annotationStyles";
import FlipZIndexButtons from "./buttons/FlipZIndexButtons";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import FormatTextButton from "./buttons/FormatTextButton";

const FocusShapeNav = () => {
  const [open, setOpen] = React.useState(false);
  const [shapeNode, setShapeNode] = React.useState(null);

  useEffect(() => {
    const handleFocusShape = (e) => {
      const { shape: s } = e.detail;
      const transformer = s?.findAncestor(
        (node) => node.getClassName() === "Transformer",
        true
      );

      const shape = transformer?.nodes()?.[0] || s;

      if (shape) setShapeNode(shape);
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
      <Stack
        component='div'
        direction='row'
        flexWrap='wrap'
        key={shapeNode?.id()}
        divider={
          <Divider flexItem orientation='vertical' sx={{ mx: 0.5, my: 1.5 }} />
        }>
        {shapeNode?.getClassName() === "Text" && (
          <FormatTextButton shapeNode={shapeNode} />
        )}
        <FlipZIndexButtons shapeNode={shapeNode} />
      </Stack>
    </Fade>
  );
};

export default React.memo(FocusShapeNav);
