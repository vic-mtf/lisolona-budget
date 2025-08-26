import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import React from "react";
import NavActions from "./nav-actions/NavActions";
import MainActions from "./main-actions/MainActions";

const MeetingFooter = () => {
  return (
    <Box bgcolor='background.paper'>
      <Toolbar>
        <Box display={{ xs: "none", lg: "inline-flex" }} width={{ lg: 320 }}>
          a
        </Box>
        <Box flexGrow={1} display='flex' justifyContent='center'>
          <MainActions />
        </Box>
        <Box
          width={{ md: 320 }}
          // bgcolor='red'
          display={{ xs: "none", md: "inline-flex" }}>
          <NavActions />
        </Box>
      </Toolbar>
    </Box>
  );
};

MeetingFooter.displayName = "MeetingFooter";

export default React.memo(MeetingFooter);
