import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/plugins/record";
import RecordingTimer from "./RecordingTimer";
import ToggleListingButton from "./ToggleListingButton";
import ListeningTimer from "./ListeningTimer";
import ProgressSlider from "./ProgressSlider";
import ringtones from "../../../../../../utils/ringtones";
import useLocalStoreData from "../../../../../../hooks/useLocalStoreData";
import useWaveSurferStyle from "../../../../../../hooks/useWaveSurferStyle";

const RecordingViewer = ({ setPaused, paused, waveSurferData }) => {
  const [duration, setDuration] = useState(0);
  const containerRef = useRef();
  const timeRef = useRef(0);
  const [getData] = useLocalStoreData();
  const waveSurferStyle = useWaveSurferStyle();

  useEffect(() => {
    const container = containerRef.current;
    const onGetDuration = (duration) => setDuration(duration);
    let waveSurfer = waveSurferData?.instance;
    if (!waveSurfer && !waveSurferData?.plugins?.record) {
      const recordPlugin = RecordPlugin.create({
        renderRecordedAudio: true,
        scrollingWaveform: true,
        continuousWaveform: false,
        continuousWaveformDuration: 30,
        scrollingWaveformWindow: 4,
        mimeType: "audio/webm",
      });
      waveSurfer = WaveSurfer.create({
        container,
        ...waveSurferStyle,
      });

      waveSurfer.registerPlugin(recordPlugin);
      waveSurferData.instance = waveSurfer;
      waveSurferData.plugins.record = recordPlugin;
      recordPlugin.startRecording().then(() => {
        setPaused(false);
        getData("app.playings.audio")?.pause();
      });
      ringtones.start.play();
      ringtones.start.volume = 0.1;
    }
    waveSurfer?.on("ready", onGetDuration);
    return () => {
      waveSurfer?.un("ready", onGetDuration);
    };
  }, [setPaused, getData, waveSurferData, waveSurferStyle]);

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
        <ToggleListingButton
          waveSurfer={waveSurferData.instance}
          duration={duration}
        />
      ) : (
        <RecordingTimer pause={paused} timeRef={timeRef} />
      )}
      <Box position='relative' flexGrow={1} sx={{ transition: ".2s all" }}>
        <Box ref={containerRef} height={35} y={1}></Box>
        {paused && (
          <ProgressSlider
            waveSurfer={waveSurferData.instance}
            duration={duration}
          />
        )}
      </Box>
      {paused && (
        <ListeningTimer
          waveSurfer={waveSurferData.instance}
          duration={duration}
          key={duration}
        />
      )}
    </Box>
  );
};
export default React.memo(RecordingViewer);
