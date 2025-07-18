import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

const RecordingTimer = ({ pause, timeRef }) => {
  const [elapsedTime, setElapsedTime] = useState(timeRef?.current || 0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let interval;

    if (!pause) {
      const now = Date.now();
      setStartTime((prevStartTime) => prevStartTime ?? now - elapsedTime);

      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 500);
    }
    return () => {
      if (timeRef) {
        timeRef.current = elapsedTime;
      }
      clearInterval(interval);
    };
  }, [pause, startTime, elapsedTime, timeRef]);

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds % 3600) / 60);
    const ss = seconds % 60;

    if (hh > 0) {
      return `${String(hh).padStart(2, "0")}:${String(mm).padStart(
        2,
        "0"
      )}:${String(ss).padStart(2, "0")}`;
    }
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  };
  return (
    <>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          animation: " colorChange 2s infinite",
          "@keyframes colorChange": {
            " 0%, 100%": {
              backgroundColor: (t) => t.palette.grey.A700,
            },
            "50%": {
              backgroundColor: (t) => t.palette.error.main,
            },
          },
        }}></Box>
      <Typography variant='body1' component='div'>
        {formatTime(elapsedTime)}
      </Typography>
    </>
  );
};

RecordingTimer.propTypes = {
  pause: PropTypes.bool,
  timeRef: PropTypes.object,
};

export default React.memo(RecordingTimer);
