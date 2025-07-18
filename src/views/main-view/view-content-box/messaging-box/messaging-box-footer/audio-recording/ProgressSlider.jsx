import { Box, Slider } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import WaveSurfer from "wavesurfer.js";
import PropTypes from "prop-types";

const ProgressSlider = ({ waveSurfer, duration, disabled }) => {
  const [currentTime, setCurrentTime] = useState(
    waveSurfer?.getCurrentTime() || 0
  );
  const step = useMemo(() => calculateOptimalStep(0, duration), [duration]);
  const manualChange = useMemo(() => ({ isActive: false }), []);

  useEffect(() => {
    const onTimeupdate = (currentTime) => {
      if (manualChange.isActive) return;
      setCurrentTime(currentTime);
    };
    waveSurfer?.on("timeupdate", onTimeupdate);
    return () => {
      waveSurfer?.un("timeupdate", onTimeupdate);
    };
  }, [waveSurfer, manualChange]);

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
        max={duration}
        value={currentTime}
        step={step}
        disabled={disabled}
        onChange={(_, value) =>
          waveSurfer?.setTime(roundToNearestStep(value, step))
        }
        sx={{
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
};

const calculateOptimalStep = (min, max) => {
  const range = max - min;
  const decimalPlaces = 4;
  const factor = Math.pow(10, decimalPlaces);
  const rangeInt = Math.round(range * factor);
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const commonDivisor = gcd(rangeInt, factor);
  const optimalStep = commonDivisor / factor;
  return optimalStep;
};

const roundToNearestStep = (value, step) => {
  if (step <= 0) throw new Error("The step must be greater than 0");
  const decimals = (step.toString().split(".")[1] || "").length;
  const rounded = Math.round(value / step) * step;
  return parseFloat(rounded.toFixed(decimals));
};

ProgressSlider.propTypes = {
  waveSurfer: PropTypes.oneOfType([
    PropTypes.instanceOf(WaveSurfer),
    PropTypes.instanceOf(WaveSurfer.create),
    PropTypes.instanceOf(null),
  ]),
  duration: PropTypes.number,
  disabled: PropTypes.bool,
};

export default React.memo(ProgressSlider);
