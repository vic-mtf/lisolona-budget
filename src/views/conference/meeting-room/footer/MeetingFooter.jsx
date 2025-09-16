import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import React from "react";
import NavActions from "./nav-actions/NavActions";
import MainActions from "./main-actions/MainActions";
import InfoPanel from "./InfoPanel";

const MeetingFooter = () => {
  return (
    <Box bgcolor='background.paper'>
      <Toolbar>
        <Box display={{ xs: "none", lg: "inline-flex" }} zIndex={2}>
          <InfoPanel />
        </Box>
        <Box
          flexGrow={1}
          display='flex'
          justifyContent='center'
          sx={{ position: { xs: "relative", lg: "initial" } }}>
          <MainActions />
        </Box>
        <Box zIndex={2} display={{ xs: "none", md: "inline-flex" }}>
          <NavActions />
        </Box>
      </Toolbar>
    </Box>
  );
};

MeetingFooter.displayName = "MeetingFooter";

export default React.memo(MeetingFooter);
