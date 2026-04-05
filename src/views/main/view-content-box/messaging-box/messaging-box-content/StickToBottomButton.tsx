import { Fab, Zoom } from "@mui/material";
import React from "react";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

const StickToBottomButton = React.memo(
  ({ onScrollToBottom, shouldStickToBottom = true }) => {
    return (
      <Zoom in={shouldStickToBottom} unmountOnExit appear={false}>
        <Fab
          variant='circular'
          color='default'
          onClick={onScrollToBottom}
          sx={{
            position: "fixed",
            backdropFilter: "blur(10px)",
            zIndex: (theme) => theme.zIndex.fab + 100000,
            bottom: (theme) => theme.spacing(2),
            right: (theme) => theme.spacing(2),
          }}>
          <ExpandMoreOutlinedIcon />
        </Fab>
      </Zoom>
    );
  }
);

StickToBottomButton.displayName = "StickToBottomButton";
export default StickToBottomButton;
