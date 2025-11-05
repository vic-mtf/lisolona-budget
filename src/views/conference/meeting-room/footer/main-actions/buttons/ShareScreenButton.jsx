import ScreenShareOutlinedIcon from '@mui/icons-material/ScreenShareOutlined';
import React from 'react';
import ActionButton from './ActionButton';
import PropTypes from 'prop-types';

const ShareScreenButton = ({ shareScreen }) => {
  return (
    <ActionButton
      id="share-screen"
      title="Partager l'écran"
      disabled={shareScreen || true}
    >
      <ScreenShareOutlinedIcon />
    </ActionButton>
  );
};

ShareScreenButton.propTypes = {
  shareScreen: PropTypes.bool,
};

export default React.memo(ShareScreenButton);
