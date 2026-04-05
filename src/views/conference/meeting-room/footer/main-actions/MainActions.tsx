import React from 'react';
import Box from '@mui/material/Box';
import MicButton from '../../../setup-room/device-config/buttons/MicButton';
import CameraButton from '../../../setup-room/device-config/buttons/CameraButton';
import HangUpButton from './buttons/HangUpButton';
import RaiseHandButton from './buttons/RaiseHandButton';
import ReactionButton from './buttons/ReactionButton';
import Divider from '@mui/material/Divider';
import ShareScreenButton from './buttons/ShareScreenButton';
import PresentationViewButton from './buttons/PresentationViewButton';
import useSmallScreen from '../../../../../hooks/useSmallScreen';
import SmallScreenMoreOptions from './buttons/SmallScreenMoreOptions';
import SettingButton from '../../../setup-room/device-config/buttons/SettingButton';
import { useSelector } from 'react-redux';
import useClientCallAuth from '../../../../../hooks/useClientCallAuth';

const MainActions = () => {
  const matches = useSmallScreen();
  const id = useSelector((store) => store.user.id);
  const activeCam = useClientCallAuth(id, 'activateCam');
  const activeMic = useClientCallAuth(id, 'activateMic');
  const shareScreen = useClientCallAuth(id, 'shareScreen');
  const reaction = useClientCallAuth(id, 'react');

  return (
    <Box
      display="flex"
      gap={1}
      flex={1}
      justifyContent={{
        xs: 'center',
        md: 'flex-start',
        lg: 'center',
      }}
      alignItems="center"
      position="absolute"
      sx={{
        zIndex: 0,
        px: {
          xs: 1,
          md: 0,
        },
      }}
      top={0}
      left={0}
      right={0}
      bottom={0}
    >
      <MicButton activateMic={activeMic} />
      <CameraButton activateCam={activeCam} />
      {!matches && (
        <>
          <RaiseHandButton />
          <ReactionButton reaction={reaction} />
          <ShareScreenButton shareScreen={shareScreen} />
          <PresentationViewButton />
          <SettingButton />
        </>
      )}
      {matches && <ShareScreenButton shareScreen={shareScreen} />}
      <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
      <HangUpButton />
      {matches && <SmallScreenMoreOptions reaction={reaction} />}
    </Box>
  );
};

export default React.memo(MainActions);
