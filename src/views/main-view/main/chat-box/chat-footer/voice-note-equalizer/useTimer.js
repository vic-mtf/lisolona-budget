import { useState, useRef, useEffect } from 'react';

export default function useTimer(isRunning, timeoutRef) {
  const [elapsedTime, setElapsedTime] = useState(timeoutRef.current);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedTime;
    } else {
      startTimeRef.current = null;
    }
  }, [isRunning]);

  useEffect(() => {
    let intervalId;

    if (isRunning && startTimeRef.current !== null) {
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  return elapsedTime;
}