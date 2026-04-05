import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  alpha,
  Box,
  Fade,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import SliderController from "./SliderController";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import VolumeButton from "./VolumeButton";
import useVideoTimer from "../../../../../../hooks/useVideoTimer";
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import FullScreenHeader from "./FullScreenHeader";

const VideoControls = ({ videoRef, loaded, mediaContainerRef }) => {
  const [paused, setPaused] = useState(true);
  const [visible, setVisible] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const timer = useMemo(() => ({ value: null }), []);

  const showToolbar = useCallback(() => {
    setVisible(true);
    clearTimeout(timer.value);
    if (!paused) timer.value = setTimeout(() => setVisible(false), 3000);
  }, [timer, paused]);

  const toggleVideoPlay = useCallback(() => {
    showToolbar();
    const video = videoRef?.current;
    if (video.paused) {
      video?.play();
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  }, [showToolbar, videoRef]);

  const toggleFullScreen = useCallback(async () => {
    const mediaContainer = mediaContainerRef?.current;
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullscreen(false);
    } else if (mediaContainer) {
      await mediaContainer?.requestFullscreen();
      setFullscreen(true);
    }
  }, [mediaContainerRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (loaded) showToolbar();
    const onFullscreenChange = () =>
      setFullscreen(Boolean(document.fullscreenElement));
    const onPlay = () => setPaused(false);
    video?.addEventListener("play", onPlay);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      clearTimeout(timer.value);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      video?.removeEventListener("play", onPlay);
    };
  }, [showToolbar, loaded, timer, videoRef]);
  return (
    <Box
      position='absolute'
      display='flex'
      flex={1}
      width='100%'
      height='100%'
      justifyContent='center'
      alignItems='end'
      overflow='hidden'
      onMouseDown={showToolbar}
      onMouseMove={showToolbar}
      onTouchStart={showToolbar}
      onTouchMove={showToolbar}
      onClick={toggleVideoPlay}
      tabIndex={0}
      autoFocus
      sx={(theme) => {
        const color =
          theme.palette.common[
            theme.palette.mode === "dark" ? "black" : "white"
          ];
        const topColor = alpha(color, 0.7);
        const bottomColor = alpha(color, 0.3);
        return {
          ...(fullscreen && !visible && { cursor: "none" }),
          "& .header-container": {
            background: `linear-gradient(to bottom, ${topColor} 0%, ${bottomColor} 70%,  transparent) 100%`,
          },
          "& .footer-container": {
            background: `linear-gradient(to top, ${topColor} 0%, ${bottomColor} 70%,  transparent) 100%`,
          },
        };
      }}
      onKeyDown={(event) => {
        if (event.code?.toLocaleLowerCase() === "space") {
          event.preventDefault();
          event.stopPropagation();
          toggleVideoPlay();
        }
        showToolbar();
      }}>
      {fullscreen && (
        <Fade
          in={loaded && visible}
          unmountOnExit
          appear={false}
          className='header-container'
          style={{
            width: "100%",
            zIndex: 1000,
            position: "absolute",
            top: 0,
            left: 0,
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}>
          <Box p={1}>
            <FullScreenHeader />
          </Box>
        </Fade>
      )}
      <Fade
        in={loaded && visible}
        unmountOnExit
        appear={false}
        className='footer-container'
        style={{
          width: "100%",
          zIndex: 1000,
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}>
        <Stack p={2}>
          <SliderController videoRef={videoRef} />
          <Stack spacing={2} direction='row'>
            <Tooltip title={paused ? "Lire" : "Pause"}>
              <IconButton onClick={toggleVideoPlay}>
                {paused ? <PlayArrowOutlinedIcon /> : <PauseOutlinedIcon />}
              </IconButton>
            </Tooltip>

            <VolumeButton videoRef={videoRef} />
            <VideoPlaysTimer videoRef={videoRef} />
            <Stack
              spacing={2}
              direction='row'
              flexGrow={1}
              justifyContent='end'
              alignItems='center'>
              <Tooltip
                title={fullscreen ? "Sortir de plein écran" : "Plein écran"}>
                <IconButton onClick={toggleFullScreen}>
                  {fullscreen ? (
                    <FullscreenExitOutlinedIcon />
                  ) : (
                    <FullscreenOutlinedIcon />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
      </Fade>
    </Box>
  );
};

const VideoPlaysTimer = React.memo(({ videoRef }) => {
  const [{ currentTime, duration }] = useVideoTimer(videoRef);
  const [time, setTime] = useState(currentTime);

  useEffect(() => {
    const name = "__manual-change-current-time";
    const video = videoRef?.current;
    setTime(currentTime);
    if (video) {
      const onManualChange = (event) => {
        if (event.detail.name === name) setTime(event.detail.value);
      };
      video.addEventListener(name, onManualChange);
      return () => {
        video.removeEventListener(name, onManualChange);
      };
    }
  }, [currentTime, videoRef]);

  return (
    <Stack
      spacing={1}
      direction='row'
      justifyContent='center'
      alignItems='center'>
      <Typography>{formatTime(time)}</Typography>
      <Typography>/</Typography>
      <Typography>{formatTime(duration)}</Typography>
    </Stack>
  );
});

VideoPlaysTimer.displayName = "VideoPlaysTimer";

function formatTime(currentTime) {
  const h = Math.floor(currentTime / 3600);
  const m = Math.floor((currentTime % 3600) / 60);
  const s = Math.floor(currentTime % 60);
  const formattedMinutes = m.toString().padStart(2, "0");
  const formattedSeconds = s.toString().padStart(2, "0");
  const formattedHours = h.toString().padStart(2, "0");
  return `${
    h > 0 ? formattedHours + ":" : ""
  }${formattedMinutes}:${formattedSeconds}`;
}
export default VideoControls;
