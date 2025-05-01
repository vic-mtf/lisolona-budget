import React, { useMemo, useLayoutEffect, useRef, useState } from "react";
import { Box, useTheme } from "@mui/material";
import WaveSurfer from "wavesurfer.js";
import PropTypes from "prop-types";
import ListeningTimer from "../../audio-recording/ListeningTimer";
import ProgressSlider from "../../audio-recording/ProgressSlider";
import ToggleListingButton from "../../audio-recording/ToggleListingButton";

const AudioThumbnail = React.memo(
  React.forwardRef(({ src: url }, ref) => {
    const containerRef = useRef(null);
    const [duration, setDuration] = useState(0);
    const waveSurferData = useMemo(() => ({ instance: null }), []);

    const theme = useTheme();

    useLayoutEffect(() => {
      const container = containerRef.current;
      const onGetDuration = (duration) => setDuration(Math.floor(duration));
      if (!waveSurferData.instance) {
        waveSurferData.instance = WaveSurfer.create({
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
        });
        waveSurferData.instance.on("ready", onGetDuration);
      }
      return () => {
        waveSurferData.instance?.destroy();
        waveSurferData.instance = null;
      };
    }, [url, theme, waveSurferData]);

    return (
      <Box
        display='flex'
        width={250}
        flexDirection='row'
        gap={2}
        ref={ref}
        height={60}
        alignItems='center'
        px={1}>
        <ToggleListingButton
          waveSurfer={waveSurferData.instance}
          duration={duration}
        />
        <Box position='relative' flexGrow={1} sx={{ transition: ".2s all" }}>
          <Box ref={containerRef} height={35} y={1}></Box>
          <ProgressSlider
            waveSurfer={waveSurferData.instance}
            duration={duration}
          />
        </Box>
        <ListeningTimer
          waveSurfer={waveSurferData.instance}
          duration={duration}
        />
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
