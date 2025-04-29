import { Box, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/plugins/record";
import waveSurferInfo from "./waveSurferInfo";
import RecordingTimer from "./RecordingTimer";
import ToggleListingButton from "./ToggleListingButton";
import ListeningTimer from "./ListeningTimer";
import ProgressSlider from "./ProgressSlider";

const RecordingViewer = React.memo(({ plugins, setPaused, paused }) => {
  const containerRef = useRef();
  const timeRef = useRef(0);

  const theme = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!waveSurferInfo.instantiated && container) {
      plugins.record = RecordPlugin.create({
        renderRecordedAudio: true,
        scrollingWaveform: true,
        continuousWaveform: false,
        continuousWaveformDuration: 30,
        scrollingWaveformWindow: 4,
        mimeType: "audio/webm",
      });

      const waveSurfer = WaveSurfer.create({
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
      waveSurfer.registerPlugin(plugins.record);
      plugins.record.startRecording().then(() => {
        setPaused(false);
      });
      waveSurferInfo.instantiated = true;
      waveSurferInfo.instance = waveSurfer;
    }
  }, [plugins, setPaused, theme]);

  return (
    <Box
      display='flex'
      flexDirection='row'
      justifyContent='center'
      alignItems='center'
      height={40}
      width='100%'
      flex={1}
      gap={2}
      sx={{
        "@keyframes fadeIn": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        "@keyframes fadeOut": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        ...(paused && {
          opacity: 0,
          animation: "fadeIn .2s ease-in-out forwards",
        }),
        ...(!paused && {
          opacity: 0,
          animation: "fadeOut .2s ease-in-out forwards",
        }),
      }}>
      {paused ? (
        <ToggleListingButton waveSurfer={waveSurferInfo.instance} />
      ) : (
        <RecordingTimer pause={paused} timeRef={timeRef} />
      )}
      <Box position='relative' flexGrow={1} sx={{ transition: ".2s all" }}>
        <Box ref={containerRef} height={35} y={1}></Box>
        {paused && <ProgressSlider waveSurfer={waveSurferInfo.instance} />}
      </Box>
      {paused && <ListeningTimer waveSurfer={waveSurferInfo.instance} />}
    </Box>
  );
});

RecordingViewer.displayName = "RecordingViewer";

RecordingViewer.propTypes = {
  plugins: PropTypes.object,
  setPaused: PropTypes.func,
  paused: PropTypes.bool,
};
export default RecordingViewer;
