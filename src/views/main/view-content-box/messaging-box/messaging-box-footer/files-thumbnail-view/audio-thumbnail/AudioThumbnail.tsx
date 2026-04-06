import React from "react";
import { Box } from "@mui/material";
import AudioListenerView from "@/components/AudioListenerView";

const AudioThumbnail = React.memo(
  React.forwardRef(({ url, id }, ref) => {
    return (
      <Box
        display='flex'
        width={250}
        flexDirection='row'
        ref={ref}
        height={60}
        alignItems='center'
        px={1}>
        <AudioListenerView url={url} id={id} autoClose />
      </Box>
    );
  })
);

AudioThumbnail.displayName = "AudioThumbnail";
export default AudioThumbnail;
