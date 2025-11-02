import ScreenShareOutlinedIcon from '@mui/icons-material/ScreenShareOutlined';
import React from 'react';
import ActionButton from './ActionButton';

const ShareScreenButton = () => {
  return (
    <ActionButton id="share-screen" title="Partager l'écran" disabled>
      <ScreenShareOutlinedIcon />
    </ActionButton>
  );
};

export default React.memo(ShareScreenButton);
