import { Box, Slider } from "@mui/material";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const ProgressSlider = React.memo(({ waveSurfer }) => {
  const [data, setData] = useState({ duration: 0, currentTime: 0 });

  // const handlePause = () => {
  //   if (waveSurfer?.isPlaying) waveSurfer?.pause();
  // };

  // const handlePlay = () => {
  //   waveSurfer?.play();
  // };

  useEffect(() => {
    const onTimeupdate = (currentTime) => {
      setData(({ duration }) => ({
        currentTime,
        duration: Math.max(duration, waveSurfer?.getDuration()),
      }));
    };

    waveSurfer?.on("timeupdate", onTimeupdate);
    return () => {
      waveSurfer?.un("timeupdate", onTimeupdate);
    };
  }, [waveSurfer]);

  useEffect(() => {
    waveSurfer?.setTime(10000000);
  }, [waveSurfer]);

  return (
    <Box
      position='absolute'
      width='100%'
      height='100%'
      display='flex'
      top={0}
      left={0}
      justifyContent='center'
      alignItems='center'
      sx={{ zIndex: (t) => t.zIndex.tooltip }}>
      <Slider
        min={0}
        max={data.duration}
        value={data.currentTime}
        step={0.00001}
        slotProps={
          {
            // thumb: {
            //   onMouseDown: handlePause,
            //   onMouseUp: handlePlay,
            //   onMouseLeave: handlePlay,
            //   onTouchStart: handlePause,
            //   onTouchCancel: handlePlay,
            //   onTouchEnd: handlePlay,
            // },
          }
        }
        onChange={(_, currentTime) => {
          setData(({ duration }) => ({ duration, currentTime }));
          waveSurfer?.setTime(currentTime);
        }}
        sx={{
          position: "absolute",
          top: 2.5,
          left: 0,
          "& .MuiSlider-rail, & .MuiSlider-track": { color: "transparent" },
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
      />
    </Box>
  );
});

ProgressSlider.propTypes = {
  waveSurfer: PropTypes.object,
};

ProgressSlider.displayName = "ProgressSlider";
export default ProgressSlider;
