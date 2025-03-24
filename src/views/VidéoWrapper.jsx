import React from "react";
import PropTypes from "prop-types";

const VideoWrapper = React.memo(({ index }) => {
  // console.log(index + 1);
  return <div>user - {index + 1}</div>;
});

VideoWrapper.propTypes = {
  index: PropTypes.number,
};

VideoWrapper.displayName = "VideoWrapper";

export default VideoWrapper;
