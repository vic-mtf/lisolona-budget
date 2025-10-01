import React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MeetingFooter from "./footer/MeetingFooter";
import MeetingContentContainer from "./Meeting-content-container/MeetingContentContainer";
import AgoraActionsWrapper from "./agora-actions-wrapper/AgoraActionsWrapper";
import DeviceAlertPermission from "../setup-room/device-config/DeviceAlertPermission";
import AgoraProviderClient, {
  RemoteUsersTrackProvider,
} from "../../../components/AgoraProviderClient";

const MeetingRoom = React.forwardRef((_, ref) => {
  return (
    <AgoraProviderClient>
      <RemoteUsersTrackProvider>
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
        <AgoraActionsWrapper />
        <DeviceAlertPermission />
      </RemoteUsersTrackProvider>
    </AgoraProviderClient>
  );
});

MeetingRoom.displayName = "MeetingRoom";

export default React.memo(MeetingRoom);
