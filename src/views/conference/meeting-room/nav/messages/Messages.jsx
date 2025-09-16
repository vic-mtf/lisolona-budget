import React, { forwardRef } from "react";
import Box from "@mui/material/Box";

const Messages = forwardRef((_, ref) => {
  return (
    <Box ref={ref} bgcolor='background.default' display='flex' flex={1}>
      Messages
    </Box>
  );
});

Messages.displayName = "Messages";

export default React.memo(Messages);
