import FrontHandOutlinedIcon from "@mui/icons-material/FrontHandOutlined";
import React from "react";
import ActionButton from "./ActionButton";
import PropTypes from "prop-types";

const RaiseHandButton = ({ onClose }) => {
  return (
    <ActionButton id='raise-hand' title='Lever la main' onClick={onClose}>
      <FrontHandOutlinedIcon />
    </ActionButton>
  );
};

RaiseHandButton.propTypes = {
  onClose: PropTypes.func,
};

export default React.memo(RaiseHandButton);
