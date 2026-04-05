import { Box as MuiBox } from "@mui/material";
import React, { useLayoutEffect } from "react";
import { useRef } from "react";

const VideoTrackView = React.memo(({ videoTrack, sx }) => {
  const rootRef = useRef();
  const videoRef = useRef();

  useLayoutEffect(() => {
    if (videoTrack?.play && videoRef.current)
      videoTrack?.play(videoRef.current);
  }, [videoTrack]);

  return (
    <MuiBox
      ref={rootRef}
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        ...sx,
      }}>
      <video ref={videoRef} autoPlay muted />
    </MuiBox>
  );
});


VideoTrackView.displayName = "VideoTrackView";
export default VideoTrackView;
