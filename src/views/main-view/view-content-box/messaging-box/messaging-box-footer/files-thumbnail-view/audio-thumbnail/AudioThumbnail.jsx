import React, { useMemo, useLayoutEffect, useRef } from "react";
import { Box, useTheme } from "@mui/material";
import WaveSurfer from "wavesurfer.js";
import PropTypes from "prop-types";
import ListeningTimer from "../../audio-recording/ListeningTimer";
import ProgressSlider from "../../audio-recording/ProgressSlider";
import ToggleListingButton from "../../audio-recording/ToggleListingButton";
import { useState } from "react";

const AudioThumbnail = React.memo(
  React.forwardRef(({ src: url }, ref) => {
    const containerRef = useRef(null);
    const [waveSurfer, setWaveSurfer] = useState(null);
    const waveSurferData = useMemo(() => ({ isInstance: false }), []);

    const theme = useTheme();

    useLayoutEffect(() => {
      const container = containerRef.current;
      if (!waveSurferData.isInstance) {
        waveSurferData.isInstance = true;
        setWaveSurfer(
          WaveSurfer.create({
            url,
            container,
            waveColor: theme.palette.text.secondary,
            progressColor: theme.palette.primary.main,
            height: 35,
            barHeight: 1,
            barGap: 3,
            barWidth: 4,
            barRadius: 100,
            cursorWidth: 0,
            autoCenter: true,
            hideScrollbar: true,
            interact: true,
          })
        );
      }
    }, [waveSurfer, url, theme, waveSurferData]);

    return (
      <Box
        display='flex'
        width={250}
        flexDirection='row'
        gap={1}
        ref={ref}
        height={60}
        alignItems='center'
        px={1}>
        <ToggleListingButton waveSurfer={waveSurfer} />
        <Box position='relative' flexGrow={1} sx={{ transition: ".2s all" }}>
          <Box ref={containerRef} height={35} y={1}></Box>
          <ProgressSlider waveSurfer={waveSurfer} />
        </Box>
        <ListeningTimer waveSurfer={waveSurfer} />
      </Box>
    );
  })
);

AudioThumbnail.displayName = "AudioThumbnail";
AudioThumbnail.propTypes = {
  src: PropTypes.string,
  id: PropTypes.string,
};

export default AudioThumbnail;
