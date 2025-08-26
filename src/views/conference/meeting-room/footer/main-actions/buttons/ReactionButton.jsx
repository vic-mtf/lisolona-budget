import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import React from "react";
import PropTypes from "prop-types";
import ActionButton from "./ActionButton";

const ReactionButton = ({ onClose }) => {
  return (
    <ActionButton id='reaction' title='Réagir' onClick={onClose}>
      <SentimentSatisfiedOutlinedIcon />
    </ActionButton>
  );
};

ReactionButton.propTypes = {
  onClose: PropTypes.func,
};

export default React.memo(ReactionButton);
