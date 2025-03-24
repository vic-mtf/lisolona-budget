import { useMemo } from "react";

export default function useAudio(src, props = new Audio()) {
  const audio = useMemo(() => {
    const audio = new Audio();
    audio.src = src;
    if (props)
      Object.keys(props).forEach((key) => {
        if (audio[key] !== props[key]) audio[key] = props[key];
      });
    return audio;
  }, [props, src]);

  return {
    audio,
    clearAudio() {
      audio.pause();
      audio.currentTime = 0;
      Object.keys(audio).forEach((key) => {
        if (key.slice(0, 2) === "on") audio[key] = new Audio()[key];
      });
    },
  };
}
