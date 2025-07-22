import React, { useMemo, useState, useEffect, useRef } from "react";
import { Box, Slider, Typography, IconButton } from "@mui/material";
import VoiceWaveform from "./VoiceWaveform";
import PropTypes from "prop-types";
import formatTime from "../utils/formatTime";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import useLocalStoreData from "../hooks/useLocalStoreData";

const VoiceListenerView = ({ file, src, audioRef, disabled }) => {
  const [playing, setPlaying] = useState(false);
  const audio = useMemo(() => audioRef?.current || new Audio(), [audioRef]);
  const [getData, setData] = useLocalStoreData();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef(null);

  const value = useMemo(() => {
    const v = mapValueWithSnap(
      currentTime,
      0,
      duration,
      0,
      100,
      duration < 10 ? 0.96 : 0.985
    );
    return Math.min(Math.max(v, 0), 100);
  }, [currentTime, duration]);

  const startHold = () => {
    if (playing && !audio.paused) audio.pause();
  };
  const endHold = () => {
    if (playing && audio.paused) audio.play();
  };

  useEffect(() => {
    if (audio.src !== src) audio.src = src;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onFinish = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onFinish);
    audio.currentTime = currentTime;
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onFinish);
    };
  }, [audio, src, currentTime]);

  useEffect(() => {
    if (playing && audio.paused) audio.play();
    if (!playing && !audio.paused) audio.pause();
    return () => {
      if (playing && !audio.paused) audio.pause();
    };
  }, [audio, playing]);

  return (
    <>
      <IconButton
        onClick={() => {
          setPlaying((playing) => {
            if (!playing && currentTime === duration) {
              audio.currentTime = 0;
              getData("app.playings.audio")?.pause();
              setData("app.playings.audio", audio);
            }
            return !playing;
          });
          playerRef.current ??= true;
        }}>
        {playing ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
      </IconButton>
      <Box
        height='100%'
        width='100%'
        position='relative'
        display='flex'
        flexDirection='row'
        gap={1}>
        <VoiceWaveform
          onGetDuration={setDuration}
          currentTime={currentTime}
          audioFileOrBuffer={file}
        />
        <Box
          position='absolute'
          width='100%'
          height='100%'
          display='flex'
          top={0}
          left={0}
          justifyContent='center'
          alignItems='center'
          sx={{ zIndex: 1 }}>
          <Slider
            min={0}
            max={100}
            value={value}
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            onTouchCancel={endHold}
            onChange={(_, value) => {
              const v = mapValueWithSnap(
                value,
                0,
                100,
                0,
                duration,
                duration < 10 ? 0.96 : 0.985
              );
              setCurrentTime(Math.max(0, Math.min(duration, v)));
            }}
            sx={{
              "& .MuiSlider-rail, & .MuiSlider-track": { color: "transparent" },
              "& .MuiSlider-thumb": {
                transitionDuration: "100ms",
                height: 12,
                width: 12,
                boxShadow: "none",
                "&:focus, &:hover, &.Mui-active": {
                  boxShadow: "none",
                  "@media (hover: none)": {
                    boxShadow: "none",
                  },
                },
                "&:before": {
                  boxShadow: "none",
                },
              },
            }}
          />
        </Box>
      </Box>
      <Typography
        variant='body1'
        component='div'
        ml={1}
        sx={{
          color: disabled ? (t) => t.palette.text.disabled : "currentcolor",
        }}>
        {formatTime({
          currentTime: playerRef.current ? currentTime : duration,
        })}
      </Typography>
    </>
  );
};

VoiceListenerView.displayName = "VoiceListenerView";

VoiceListenerView.propTypes = {
  src: PropTypes.string,
  audioRef: PropTypes.object,
  disabled: PropTypes.bool,
  file: PropTypes.oneOfType([
    PropTypes.instanceOf(File),
    PropTypes.instanceOf(ArrayBuffer),
    PropTypes.instanceOf(Blob),
  ]),
};

function mapValueWithSnap(
  value,
  inMin,
  inMax,
  outMin,
  outMax,
  snapThreshold = 0.98
) {
  if (!value || !inMin === !inMax) return inMin || 0;
  value = Math.max(inMin, Math.min(value, inMax));
  let mapped = ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  let ratio = (value - inMin) / (inMax - inMin);
  if (ratio >= snapThreshold) return outMax;
  return mapped;
}
export default React.memo(VoiceListenerView);
