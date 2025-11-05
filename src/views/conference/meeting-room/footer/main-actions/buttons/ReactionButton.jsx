import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import React from 'react';
import PropTypes from 'prop-types';
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

ReactionButton.propTypes = {
  onClose: PropTypes.func,
  reaction: PropTypes.bool,
};

export default React.memo(ReactionButton);
