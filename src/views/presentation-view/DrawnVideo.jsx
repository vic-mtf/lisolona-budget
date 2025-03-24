import { Image } from "react-konva";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useState } from "react";

const DrawnVideo = React.memo(({ videoRef, width, height, sceneSize }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) setImage(video);
  }, [videoRef]);

  return (
    <Image
      image={image}
      width={Math.max(sceneSize.width, width)}
      height={Math.max(sceneSize.height, height)}
    />
  );
});

DrawnVideo.displayName = "DrawnVideo";

DrawnVideo.propTypes = {
  videoRef: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  scale: PropTypes.number,
  sceneSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
};

export default DrawnVideo;
