import Box from "@mui/material/Box";
import React from "react";

const PresentationView = React.forwardRef((_, ref) => {
  return (
    <Box width={"100%"} height={"100%"} bgcolor='pink' ref={ref}>
      Presentation View
    </Box>
  );
});
PresentationView.displayName = "PresentationView";
export default React.memo(PresentationView);
