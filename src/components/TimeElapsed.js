import React, { useState, useEffect } from "react";
import timeElapsed from "../utils/timeElapsed";

export default function TimeElapsed({
  startDate = new Date(),
  startWords,
  endWords,
  timeout = 1000,
  bigger = false,
}) {
  const [time, setTime] = useState(timeElapsed(startDate, bigger));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(timeElapsed(startDate, bigger));
    }, timeout);

    return () => clearInterval(interval);
  }, [startDate, timeout, bigger]);

  return (
    <span>
      {startWords} {time} {endWords}
    </span>
  );
}
