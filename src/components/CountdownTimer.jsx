import React, { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material';

const CountdownTimer = ({ seconds = 10, onComplete, size = 60 }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [progress, setProgress] = useState(100);
  const startTimeRef = useRef(Date.now());

  const frameIdRef = useRef(null);

  useEffect(() => {
    const durationMs = seconds * 1000;

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(durationMs - elapsed, 0);
      const newProgress = (remaining / durationMs) * 100;
      const newTimeLeft = Math.ceil(remaining / 1000);

      setTimeLeft(newTimeLeft);
      setProgress(newProgress);

      if (remaining <= 0 && onComplete) {
        onComplete();
      }
    };

    const animationFrame = () => {
      updateProgress();
      frameIdRef.current = requestAnimationFrame(animationFrame);
    };

    frameIdRef.current = requestAnimationFrame(animationFrame);

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [seconds, onComplete]);

  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        variant="determinate"
        value={progress}
        size={size}
        thickness={3}
        sx={{
          transition: 'none',
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
            transition: 'none',
          },
          [`& .${circularProgressClasses.track}`]: {
            opacity: 1,
            transition: 'none',
          },
        }}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">
          {timeLeft}s
        </Typography>
      </Box>
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress
          color="inherit"
          sx={{
            color: (t) => alpha(t.palette.text.primary, 0.2),
          }}
          size={size}
          thickness={3}
          value={100}
          variant="determinate"
        />
      </Box>
    </Box>
  );
};

CountdownTimer.propTypes = {
  seconds: PropTypes.number,
  onComplete: PropTypes.func,
  size: PropTypes.number,
};

export default React.memo(CountdownTimer);
