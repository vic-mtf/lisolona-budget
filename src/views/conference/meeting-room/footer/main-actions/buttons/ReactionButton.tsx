import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import React from 'react';
import ActionButton from './ActionButton';

const ReactionButton = ({ onClose, reaction }) => {
  return (
    <ActionButton
      id="reaction"
      title="Réagir"
      onClick={onClose}
      disabled={reaction || true}
    >
      <SentimentSatisfiedOutlinedIcon />
    </ActionButton>
  );
};

export default React.memo(ReactionButton);
