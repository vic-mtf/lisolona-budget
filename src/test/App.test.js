import { useLayoutEffect } from "react";
import Conference from "../views/meeting/conference/conference";
import AgoraTest from "./AgoraTest";
import GridDataDisplay from "./GridView.js/GridDataDisplay";
import interact from "interactjs";
import { Box, styled, useTheme } from "@mui/material";
import { useRef } from "react";
// import GridTest from "./GridView.js/GridTest";

export default function AppTest () {
  const theme = useTheme();
 
   return (
      <FloatView/>
   )
}

const FloatView = styled(({ref, ...props}) => {
  const rootRef = useRef();
  
  useLayoutEffect(() => {
  if(rootRef.current)
    interact(rootRef.current)
    .draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ],
      autoScroll: true,

      listeners: {
        move (event)  {
          const target = event.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)
        },
      }
    });
  },[])

   return (
        <Box
          {...props}
          ref={nodeRef => {
            if(ref) ref.current = nodeRef;
            rootRef.current = nodeRef;
          }}
        />
   )
  
})(({theme}) => ({
  height: 180,
  width: 180 * 16 / 9,
  boxShadow: theme.shadows[1],
  borderRadius: theme.spacing(1, 1, 1, 1),
  zIndex: theme.zIndex.tooltip,
  background: theme.palette.background.paper + 
  theme.customOptions.opacity,
  border: `1px solid ${theme.palette.divider}`,
  backdropFilter: `blur(${theme.customOptions.blur})`,
  position: 'relative',
}));
