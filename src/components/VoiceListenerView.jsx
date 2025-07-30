import React, { useMemo, useState, useEffect, useRef } from "react";
import { Box, Slider, Typography, IconButton } from "@mui/material";
import VoiceWaveform from "./VoiceWaveform";
import PropTypes from "prop-types";
import formatTime from "../utils/formatTime";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import useLocalStoreData from "../hooks/useLocalStoreData";
import mapValueWithSnap from "../utils/mapValueWithSnap";
import { useDispatch } from "react-redux";
import { updateData } from "../redux/data/data";

const VoiceListenerView = ({
  file,
  src,
  audio: aux,
  disabled,
  onGetRawData,
  duration: d,
  rawData,
  uploading,
  uploadingProgressButton,
  id = null,
  targetId = null,
}) => {
  const [playing, setPlaying] = useState(aux && !aux.paused);
  const audio = useMemo(() => aux || new Audio(), [aux]);
  const [getData, setData] = useLocalStoreData();
  const [duration, setDuration] = useState(d || 0);
  const [currentTime, setCurrentTime] = useState(audio.currentTime || 0);
  const playerRef = useRef(null);
  const holdRef = useRef(false);
  const dispatch = useDispatch();

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
    if (playing && !audio.paused) {
      audio.pause();
      holdRef.current = true;
    }
  };
  const endHold = () => {
    if (holdRef.current) {
      audio.play();
      holdRef.current = false;
    }
  };

  useEffect(() => {
    if (audio.src !== src) audio.src = src;
    audio.dataset.targetId = targetId;
    audio.dataset.id = id;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onFinish = () => setPlaying(false);
    const onTogglePlay = (e) => {
      if (!holdRef.current) setPlaying(!e.target.paused);
    };
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onFinish);
    audio.addEventListener("pause", onTogglePlay);
    audio.addEventListener("play", onTogglePlay);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onFinish);
      audio.removeEventListener("pause", onTogglePlay);
      audio.removeEventListener("play", onTogglePlay);
    };
  }, [audio, src, currentTime, targetId, id]);

  useEffect(() => {
    if (playing && audio.paused) audio.play();
    if (!playing && !audio.paused) audio.pause();
    return () => {
      if (playing && !audio.paused && !aux) {
        audio.pause();
        audio.remove();
      }
    };
  }, [audio, playing, aux]);

  return (
    <>
      <div style={{ position: "relative" }}>
        {uploading ? (
          uploadingProgressButton
        ) : (
          <IconButton
            onClick={() => {
              setPlaying((playing) => {
                if (!playing) {
                  if (currentTime === duration) audio.currentTime = 0;
                  getData("app.playings.audio")?.pause();
                  setData("app.playings.audio", audio);
                  const key = [
                    "app.actions.messaging.medias.playings.targetId",
                    "app.actions.messaging.medias.playings.id",
                  ];
                  dispatch(updateData({ data: [targetId, id], key }));
                }
                return !playing;
              });
              playerRef.current ??= true;
            }}>
            {playing ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
          </IconButton>
        )}
      </div>
      <Box
        height='100%'
        width='100%'
        position='relative'
        display='flex'
        flexDirection='row'
        gap={1}>
        <VoiceWaveform
          rawData={rawData}
          onGetRawData={(data) => {
            if (duration !== data.duration) setDuration(data.duration);
            if (typeof onGetRawData === "function") onGetRawData(data);
          }}
          currentTime={currentTime}
          audioFileOrBuffer={file}
          duration={duration}
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
              const currenTime = Math.max(0, Math.min(duration, v));
              setCurrentTime(currenTime);
              audio.currentTime = currenTime;
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

VoiceListenerView.propTypes = {
  src: PropTypes.string,
  audio: PropTypes.instanceOf(Audio),
  disabled: PropTypes.bool,
  duration: PropTypes.number,
  file: PropTypes.oneOfType([
    PropTypes.instanceOf(File),
    PropTypes.instanceOf(ArrayBuffer),
    PropTypes.instanceOf(Blob),
  ]),
  onGetRawData: PropTypes.func,
  rawData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.instanceOf(Uint8Array),
    PropTypes.instanceOf(Uint16Array),
    PropTypes.instanceOf(Uint32Array),
    PropTypes.instanceOf(Float32Array),
    PropTypes.instanceOf(Float64Array),
    PropTypes.instanceOf(Int8Array),
    PropTypes.instanceOf(Int16Array),
    PropTypes.instanceOf(Int32Array),
    PropTypes.instanceOf(Uint8ClampedArray),
  ]),
  uploading: PropTypes.bool,
  uploadingProgressButton: PropTypes.node,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  targetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default React.memo(VoiceListenerView);
