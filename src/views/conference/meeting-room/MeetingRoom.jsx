import React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MeetingFooter from "./footer/MeetingFooter";
import MeetingContentContainer from "./Meeting-content-container/MeetingContentContainer";

const MeetingRoom = React.forwardRef((_, ref) => {
  return (
    <Box
      ref={ref}
      height='100%'
      // width='100%'
      display='flex'
      flex={1}
      flexDirection='column'>
      <Box flex={1} position='relative'>
        <Box
          left={0}
          top={0}
          right={0}
          bottom={0}
          position='absolute'
          width='100%'
          height='100%'>
          <MeetingContentContainer />
        </Box>
      </Box>
      <Divider />
      <MeetingFooter />
    </Box>
  );
});

MeetingRoom.displayName = "MeetingRoom";

export default MeetingRoom;
