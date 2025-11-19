import usePublishLocalCamStream from './hooks/usePublishLocalCamStream';
import usePublishLocalMicroStream from './hooks/usePublishLocalMicroStream';
import useRemotePublishAudioTrack from './hooks/useRemotePublishAudioTrack';
import usePublishLocalScreen from './hooks/usePublishLocalScreen';
import React from 'react';
import PropTypes from 'prop-types';

const ActionWrapper = ({ isConnected }) => {
  usePublishLocalMicroStream(isConnected);
  usePublishLocalCamStream(isConnected);
  usePublishLocalScreen(isConnected);
  useRemotePublishAudioTrack(isConnected);

  return null;
};

ActionWrapper.propTypes = {
  isConnected: PropTypes.bool,
};
export default React.memo(ActionWrapper); //ActionWrapper;
