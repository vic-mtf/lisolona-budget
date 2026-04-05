import usePublishLocalCamStream from './hooks/usePublishLocalCamStream';
import usePublishLocalMicroStream from './hooks/usePublishLocalMicroStream';
import useRemotePublishAudioTrack from './hooks/useRemotePublishAudioTrack';
import usePublishLocalScreen from './hooks/usePublishLocalScreen';
import React from 'react';

const ActionWrapper = ({ isConnected }) => {
  usePublishLocalMicroStream(isConnected);
  usePublishLocalCamStream(isConnected);
  usePublishLocalScreen(isConnected);
  useRemotePublishAudioTrack(isConnected);

  return null;
};
export default React.memo(ActionWrapper); //ActionWrapper;
