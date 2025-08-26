import Fab from "@mui/material/Fab";
import React from "react";
import CallEndOutlinedIcon from "@mui/icons-material/CallEndOutlined";

const HangUpButton = () => {
  return (
    <Fab
      variant='extended'
      size='small'
      // sx={{ aspectRatio: 1 }}
      color='error'
      onClick={null}>
      <CallEndOutlinedIcon />
    </Fab>
  );
};

export default React.memo(HangUpButton);
