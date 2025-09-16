import usePublishLocalCamStream from "./hooks/usePublishLocalCamStream";
import usePublishLocalMicroStream from "./hooks/usePublishLocalMicroStream";
import React from "react";
import PropTypes from "prop-types";

const ActionWrapper = ({ isConnected }) => {
  usePublishLocalMicroStream(isConnected);
  usePublishLocalCamStream(isConnected);
  return null;
};

ActionWrapper.propTypes = {
  isConnected: PropTypes.bool,
};
export default React.memo(ActionWrapper); //ActionWrapper;
