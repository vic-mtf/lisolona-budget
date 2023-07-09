import { Box, styled } from "@mui/material";
import interact from "interactjs";
import { useLayoutEffect } from "react";
import { useRef } from "react";

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
    top: '5px',
    right: '5px',
    zIndex: theme.zIndex.tooltip,
    background: theme.palette.background.paper + 
    theme.customOptions.opacity,
    border: `1px solid ${theme.palette.divider}`,
    backdropFilter: `blur(${theme.customOptions.blur})`,
    position: 'fixed',
    overflow: 'hidden',
    "& video": {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: 'scale(-1, 1)',
      objectPosition: 'center',
    }
  }));

  export default FloatView