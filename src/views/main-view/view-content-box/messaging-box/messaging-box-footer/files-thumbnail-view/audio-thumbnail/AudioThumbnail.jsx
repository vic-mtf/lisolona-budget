import React, { useMemo, useLayoutEffect, useEffect, useState } from "react";
import { Box, Slider, IconButton, Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import PropTypes from "prop-types";
import formatTime from "../../../../../../../utils/formatTime";
import useLocalStoreData from "../../../../../../../hooks/useLocalStoreData";

const AudioThumbnail = React.memo(
  React.forwardRef(({ url }, ref) => {
    const [duration, setDuration] = useState(0);
    const audioData = useMemo(() => ({ instance: null }), []);

    useLayoutEffect(() => {
      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };
      audioData.instance = audio;
      return () => {
        audio.pause();
        audio.currentTime = 0;
        audioData.instance = null;
      };
    }, [url, audioData]);

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
        <ToggleListingButton audioData={audioData} />
        <Box
          position='relative'
          flexGrow={1}
          sx={{ transition: ".2s all" }}
          display='flex'
          alignItems='center'>
          <ProgressSlider audioData={audioData} duration={duration} />
        </Box>
        <ListeningTimer audioData={audioData} duration={duration} />
      </Box>
    );
  })
);

const ToggleListingButton = ({ audioData }) => {
  const [paused, setPaused] = useState(true);
  const [getData, setData] = useLocalStoreData();

  useEffect(() => {
    const audio = audioData?.instance;
    const onEnded = () => setPaused(true);
    const onPlay = () => setPaused(false);
    audio?.addEventListener("ended", onEnded);
    audio?.addEventListener("play", onPlay);
    audio?.addEventListener("pause", onEnded);
    return () => {
      audio?.removeEventListener("ended", onEnded);
      audio?.removeEventListener("play", onPlay);
      audio?.removeEventListener("pause", onEnded);
    };
  }, [audioData]);

  return (
    <IconButton
      onClick={() => {
        if (paused) {
          getData("app.playings.audio")?.pause();
          setData("app.playings.audio", audioData.instance);
          audioData.instance.play();
        } else audioData.instance.pause();
      }}>
      {paused ? <PlayArrowRoundedIcon /> : <PauseRoundedIcon />}
    </IconButton>
  );
};

const ProgressSlider = ({ audioData, duration }) => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const audio = audioData?.instance;
    const onTimeupdate = () => setCurrent(audio.currentTime);
    audio.addEventListener("timeupdate", onTimeupdate);
    return () => {
      audio.removeEventListener("timeupdate", onTimeupdate);
    };
  });
  return (
    <Slider
      step={duration / 1000}
      max={duration}
      value={current}
      //size='small'
      sx={{
        "& .MuiSlider-thumb": {
          transition: "none",
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
      onChange={(_, value) => (audioData.instance.currentTime = value)}
    />
  );
};

const ListeningTimer = ({ audioData, duration }) => {
  const [current, setCurrent] = useState(null);
  const currentTime = current ?? Math.floor(duration);

  useEffect(() => {
    const audio = audioData?.instance;
    const onTimeupdate = () => setCurrent(audio.currentTime);
    audio.addEventListener("timeupdate", onTimeupdate);
    return () => {
      audio.removeEventListener("timeupdate", onTimeupdate);
    };
  }, [audioData]);

  return (
    <Typography variant='body1' component='div'>
      {formatTime({ currentTime })}
    </Typography>
  );
};

ListeningTimer.propTypes = {
  audioData: PropTypes.object,
  duration: PropTypes.number,
};
ProgressSlider.propTypes = {
  audioData: PropTypes.object,
  duration: PropTypes.number,
};
ToggleListingButton.propTypes = {
  audioData: PropTypes.object,
};
AudioThumbnail.displayName = "AudioThumbnail";
AudioThumbnail.propTypes = {
  id: PropTypes.string,
  url: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(URL)]),
};

export default AudioThumbnail;
