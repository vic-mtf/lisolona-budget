import PropTypes from "prop-types";
import { Slider } from "@mui/material";
import React from "react";
import useVideoTimer from "../../../../../../hooks/useVideoTimer";

const SliderController = React.memo(({ videoRef }) => {
  const [{ currentTime, duration }, { setCurrentTime }] =
    useVideoTimer(videoRef);

  return (
    <Slider
      value={currentTime}
      max={duration}
      min={0}
      size='small'
      step={duration / 1000}
      onChange={(_, value) => {
        const video = videoRef.current;
        if (video) {
          video.currentTime = value;
          setCurrentTime(value);
          const name = "__manual-change-current-time";
          const customEvent = new CustomEvent(name, {
            detail: { value, name },
          });
          video.dispatchEvent(customEvent);
        }
      }}
      sx={(theme) => ({
        color: "rgba(0,0,0,0.87)",
        height: 3,
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
            width: 20,
            height: 20,
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
  );
});

SliderController.displayName = "SliderController";

SliderController.propTypes = {
  videoRef: PropTypes.object,
};

export default SliderController;
