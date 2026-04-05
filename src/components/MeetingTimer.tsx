import { useEffect, useRef, useState } from 'react';

const pad2 = (n) => String(n).padStart(2, '0');

const MeetingTimer = ({ start = false, paused = false, className }) => {
  const [elapsedSec, setElapsedSec] = useState(0);
  const startTsRef = useRef(null);
  const accumulatedRef = useRef(0);
  const intervalRef = useRef(null);

  const clearTick = () => {
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!start) {
      clearTick();
      startTsRef.current = null;
      accumulatedRef.current = 0;
      setElapsedSec(0);
      return;
    }

    if (paused) {
      if (startTsRef.current != null) {
        accumulatedRef.current += Math.floor(
          (Date.now() - startTsRef.current) / 1000
        );
        startTsRef.current = null;
      }
      clearTick();
      return;
    }

    if (startTsRef.current == null) startTsRef.current = Date.now();

    clearTick();

    const tick = () => {
      const runningSec =
        startTsRef.current != null
          ? Math.floor((Date.now() - startTsRef.current) / 1000)
          : 0;
      setElapsedSec(accumulatedRef.current + runningSec);
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);

    return clearTick;
  }, [start, paused]);

  useEffect(() => () => clearTick(), []);

  const formatTime = (totalSec) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    if (hours > 0) return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
    return `${pad2(minutes)}:${pad2(seconds)}`;
  };

  return <span className={className}>{formatTime(elapsedSec)}</span>;
};

export default MeetingTimer;
