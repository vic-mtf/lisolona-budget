import React, { forwardRef } from "react";
import Box from "@mui/material/Box";

const Admin = forwardRef((_, ref) => {
  return <Box ref={ref}>Admin</Box>;
});

Admin.displayName = "Admin";

export default React.memo(Admin);
