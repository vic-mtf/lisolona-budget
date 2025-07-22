import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";

const AudioRecordingIndicator = ({ pause }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef(null);
  const savedTimeRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!pause) {
      startTimeRef.current = Date.now() - savedTimeRef.current;
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 500);
    } else {
      if (startTimeRef.current)
        savedTimeRef.current = Date.now() - startTimeRef.current;
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [pause]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hh = Math.floor(totalSeconds / 3600);
    const mm = Math.floor((totalSeconds % 3600) / 60);
    const ss = totalSeconds % 60;
    return hh > 0
      ? `${hh.toString().padStart(2, "0")}:${mm
          .toString()
          .padStart(2, "0")}:${ss.toString().padStart(2, "0")}`
      : `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          animation: "colorPulse 2s infinite",
          "@keyframes colorPulse": {
            "0%, 100%": { backgroundColor: (t) => t.palette.grey.A700 },
            "50%": { backgroundColor: (t) => t.palette.error.main },
          },
        }}
      />
      <Typography variant='body1'>{formatTime(elapsedTime)}</Typography>
    </>
  );
};

AudioRecordingIndicator.propTypes = {
  pause: PropTypes.bool.isRequired,
};

export default React.memo(AudioRecordingIndicator);
