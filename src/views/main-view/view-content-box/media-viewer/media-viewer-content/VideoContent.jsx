import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Box, CircularProgress, Fade } from "@mui/material";

import VideoControls from "./video-controls/VideoControls";
import useLocalStoreData, {
  useSmartKey,
} from "../../../../../hooks/useLocalStoreData";

const VideoContent = ({ content, id }) => {
  const { key } = useSmartKey({
    baseKey: `app.key.videos.${id}`,
    paths: { key: ["downloads", "uploads"] },
  });
  const [getData] = useLocalStoreData(key);
  const [url] = useState(
    () =>
      getData("src") || new URL(content, import.meta.env.VITE_SERVER_BASE_URL)
  );
  const [loading, setLoading] = useState(true);
  const videoRef = useRef();
  const mediaContainerRef = useRef();

  return (
    <Box
      position='absolute'
      display='flex'
      height='100%'
      width='100%'
      top={0}
      left={0}
      justifyContent='center'
      alignItems='center'
      overflow='hidden'
      ref={mediaContainerRef}
      sx={{
        "& .CircularProgress-container": {
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: (theme) => theme.zIndex.drawer,
        },
        "& video": {
          opacity: loading ? 0 : 1,
          transition: (theme) =>
            theme.transitions.create("opacity", {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
        },
      }}>
      <video
        src={url}
        loading='lazy'
        draggable={false}
        onLoadedData={() => setLoading(false)}
        preload='preload'
        disablePictureInPicture
        ref={videoRef}
        autoPlay
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
      <Fade
        in={loading}
        unmountOnExit
        appear={false}
        className='CircularProgress-container'>
        <CircularProgress color='inherit' />
      </Fade>
      <VideoControls
        videoRef={videoRef}
        loaded={!loading}
        mediaContainerRef={mediaContainerRef}
      />
    </Box>
  );
};

VideoContent.displayName = "VideoContent";
VideoContent.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(URL)]),
  mode: PropTypes.oneOf(["normal", "zoom"]),
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default React.memo(VideoContent);
