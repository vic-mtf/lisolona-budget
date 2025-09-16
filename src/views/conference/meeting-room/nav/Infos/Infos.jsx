import React, { forwardRef } from "react";
import Box from "@mui/material/Box";

const Infos = forwardRef((_, ref) => {
  return <Box ref={ref}>Infos</Box>;
});

Infos.displayName = "Infos";

export default React.memo(Infos);
