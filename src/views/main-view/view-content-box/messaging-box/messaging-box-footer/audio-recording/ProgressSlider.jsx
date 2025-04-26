import { Box, Slider } from "@mui/material";
import React, { useEffect, useState } from "react";
import waveSurferInfo from "./waveSurferInfo";

const ProgressSlider = React.memo(() => {
  const [data, setData] = useState({ duration: 0, currentTime: 0 });

  useEffect(() => {
    const onTimeupdate = (currentTime) => {
      setData(({ duration }) => ({
        currentTime,
        duration: Math.max(duration, waveSurfer?.getDuration()),
      }));
    };
    const waveSurfer = waveSurferInfo.instance;
    waveSurfer?.on("timeupdate", onTimeupdate);
    return () => {
      waveSurfer?.un("timeupdate", onTimeupdate);
    };
  }, []);

  useEffect(() => {
    const waveSurfer = waveSurferInfo.instance;
    waveSurfer?.setTime(10000000);
  }, []);

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
        onChange={(_, currentTime) => {
          setData(({ duration }) => ({ duration, currentTime }));
          waveSurferInfo.instance?.setTime(currentTime);
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

ProgressSlider.propTypes = {};

ProgressSlider.displayName = "ProgressSlider";
export default ProgressSlider;
