import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import formatTime from "../../../../../../utils/formatTime";
import WaveSurfer from "wavesurfer.js";

const ListeningTimer = React.memo(({ waveSurfer, duration, disabled }) => {
  const [current, setCurrent] = useState(waveSurfer?.getCurrentTime() || null);
  const currentTime = current ?? Math.floor(duration);

  useEffect(() => {
    if (disabled) return;
    const onTimeupdate = (time) => setCurrent(time);
    waveSurfer?.on("timeupdate", onTimeupdate);
    return () => {
      waveSurfer?.un("timeupdate", onTimeupdate);
    };
  }, [waveSurfer, disabled]);

  return (
    <Typography
      variant='body1'
      component='div'
      sx={{
        color: disabled ? (t) => t.palette.text.disabled : "currentcolor",
      }}>
      {formatTime({ currentTime })}
    </Typography>
  );
});

ListeningTimer.displayName = "ListeningTimer";
ListeningTimer.propTypes = {
  waveSurfer: PropTypes.oneOfType([
    PropTypes.instanceOf(WaveSurfer),
    PropTypes.instanceOf(WaveSurfer.create),
    PropTypes.instanceOf(null),
  ]),
  duration: PropTypes.number,
  disabled: PropTypes.bool,
};
export default ListeningTimer;
