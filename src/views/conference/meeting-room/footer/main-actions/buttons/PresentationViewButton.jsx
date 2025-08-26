import ViewCarouselOutlinedIcon from "@mui/icons-material/ViewCarouselOutlined";
import React from "react";
import ActionButton from "./ActionButton";
import PropTypes from "prop-types";

const PresentationViewButton = ({ onClose }) => {
  return (
    <ActionButton
      id='presentation'
      title='Vue de présentation'
      onClick={onClose}>
      <ViewCarouselOutlinedIcon />
    </ActionButton>
  );
};

PresentationViewButton.propTypes = {
  onClose: PropTypes.func,
};

export default React.memo(PresentationViewButton);
