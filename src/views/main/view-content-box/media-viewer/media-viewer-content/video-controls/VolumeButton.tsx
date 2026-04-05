import { Box, IconButton, Slider, Stack, Tooltip } from "@mui/material";
import { useState } from "react";
import VolumeOffOutlinedIcon from "@mui/icons-material/VolumeOffOutlined";
import VolumeMuteOutlinedIcon from "@mui/icons-material/VolumeMuteOutlined";
import VolumeDownOutlinedIcon from "@mui/icons-material/VolumeDownOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import { useLayoutEffect } from "react";

const VolumeButton = ({ videoRef }) => {
  const [muted, setMute] = useState(false);
  const [volume, setVolume] = useState(1);

  useLayoutEffect(() => {
    const video = videoRef?.current;
    if (video) {
      video.muted = muted;
      video.volume = volume;
    }
  }, [videoRef, muted, volume]);

  return (
    <Stack
      direction='row'
      sx={{
        "& > .volume-slider-container": {
          width: 0,
          opacity: 0,
          padding: 0,
          overflow: "hidden",
          transition: (theme) =>
            theme.transitions.create(["width", "opacity", "padding"], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
        },
        "&:hover": {
          ...(!muted && {
            "& > .volume-slider-container": {
              width: 100,
              opacity: 1,
              padding: "0 15px",
              overflow: "hidden",
            },
          }),
        },
      }}>
      <Tooltip title={muted ? "Activer le son" : "Désactiver le son"}>
        <IconButton onClick={() => setMute((state) => !state)}>
          {muted ? (
            <VolumeOffOutlinedIcon />
          ) : volume === 0 ? (
            <VolumeMuteOutlinedIcon />
          ) : volume < 0.5 ? (
            <VolumeDownOutlinedIcon />
          ) : (
            <VolumeUpOutlinedIcon />
          )}
        </IconButton>
      </Tooltip>

      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        className='volume-slider-container'>
        <Tooltip title='Volume'>
          <Slider
            size='small'
            max={1}
            min={0}
            step={0.01}
            value={volume}
            onChange={(_, value) => setVolume(value)}
            sx={(theme) => ({
              color: "rgba(0,0,0,0.87)",
              height: 2,
              "& .MuiSlider-thumb": {
                width: 8,
                height: 8,
                transition: ".1s linear",
                "&::before": {
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                },
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: `0px 0px 0px 8px ${"rgb(0 0 0 / 16%)"}`,
                  ...theme.applyStyles("dark", {
                    boxShadow: `0px 0px 0px 8px ${"rgb(255 255 255 / 16%)"}`,
                  }),
                },
                "&.Mui-active": {
                  width: 10,
                  height: 10,
                },
              },
              "& .MuiSlider-rail": {
                opacity: 0.28,
              },
              ...theme.applyStyles("dark", {
                color: "#fff",
              }),
            })}
          />
        </Tooltip>
      </Box>
    </Stack>
  );
};

export default VolumeButton;
