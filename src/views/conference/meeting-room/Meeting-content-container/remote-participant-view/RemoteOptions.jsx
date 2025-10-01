import React from "react";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material";
import RemoteMoreOptions from "./RemoteMoreOptions";

const RemoteOptions = () => {
  const containerRef = React.useRef();
  return (
    <>
      <Box
        ref={containerRef}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          "& > .remote-user-options": {
            opacity: 0,
            pointerEvents: "none",
            touchAction: "none",
          },
          "&:hover > .remote-user-options": {
            opacity: 0.4,
            pointerEvents: "auto",
            touchAction: "auto",
            "&:hover": { opacity: 1 },
          },
        }}>
        <Box
          className='remote-user-options'
          component='div'
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          sx={{
            pointerEvents: "none",
            display: "flex",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
            transform: "translate(-50%, -50%)",
            p: 0.5,
            borderRadius: 1,
            top: "50%",
            left: "50%",
            position: "absolute",
            color: "#fff",
            bgcolor: (t) => alpha(t.palette.common.black, 0.6),
            transition: (t) =>
              t.transitions.create("opacity", {
                easing: t.transitions.easing.easeInOut,
                duration: t.transitions.duration.leavingScreen,
              }),
            zIndex: (t) => t.zIndex.tooltip,
          }}>
          Bonjour les gens je suis là
          {/* <Tooltip title='Ajouter dans la grille'>
        <div>
          <IconButton size='small' onClick={onAddToGrid}>
            <CoPresentOutlinedIcon fontSize='small' />
          </IconButton>
        </div>
      </Tooltip>

      <Tooltip title='Réduire'>
        <div>
          <IconButton size='small' onClick={onReduced}>
            <CloseFullscreenOutlinedIcon fontSize='small' />
          </IconButton>
        </div>
      </Tooltip> */}
        </Box>
      </Box>
      <RemoteMoreOptions containerRef={containerRef} />
    </>
  );
};

export default React.memo(RemoteOptions); // RemoteOptions;
