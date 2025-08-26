import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MicButton from "../../../setup-room/device-config/buttons/MicButton";
import CameraButton from "../../../setup-room/device-config/buttons/CameraButton";
import HangUpButton from "./buttons/HangUpButton";
import RaiseHandButton from "./buttons/RaiseHandButton";
import ReactionButton from "./buttons/ReactionButton";
import Divider from "@mui/material/Divider";
import ShareScreenButton from "./buttons/ShareScreenButton";
import PresentationViewButton from "./buttons/PresentationViewButton";
import useSmallScreen from "../../../../../hooks/useSmallScreen";
import SmallScreenMoreOptions from "./buttons/SmallScreenMoreOptions";
import SettingButton from "../../../setup-room/device-config/buttons/SettingButton";

const MainActions = () => {
  const matches = useSmallScreen();

  return (
    <Box
      display='flex'
      gap={1}
      flex={1}
      justifyContent='center'
      alignItems='center'>
      <MicButton />
      <CameraButton />
      {!matches && (
        <>
          <RaiseHandButton />
          <ReactionButton />
          <ShareScreenButton />
          <PresentationViewButton />
          <SettingButton />
        </>
      )}
      {matches && <ShareScreenButton />}
      <Divider flexItem orientation='vertical' sx={{ mx: 0.5, my: 1 }} />
      <HangUpButton />
      {matches && <SmallScreenMoreOptions />}
    </Box>
  );
};

export default React.memo(MainActions);
