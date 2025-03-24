import { useState, useLayoutEffect } from "react";

const useVideoTimer = (videoRef) => {
  const video = videoRef?.current;
  const [currentTime, setCurrentTime] = useState(video?.currentTime || 0);
  const [duration, setDuration] = useState(video?.duration || 0);

  useLayoutEffect(() => {
    const video = videoRef?.current;
    if (video) {
      const timeUpdate = (e) => setCurrentTime(e.target.currentTime);
      const durationChange = (e) => setDuration(e.target.duration);
      video.addEventListener("timeupdate", timeUpdate);
      video.addEventListener("durationchange", durationChange);
      return () => {
        video.removeEventListener("timeupdate", timeUpdate);
        video.removeEventListener("durationchange", durationChange);
      };
    }
  }, [videoRef]);

  return [
    { currentTime, duration },
    { setDuration, setCurrentTime },
  ];
};

export default useVideoTimer;
