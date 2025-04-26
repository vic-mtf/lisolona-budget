import { IconButton } from "@mui/material";
import React from "react";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import { useState } from "react";
import waveSurferInfo from "./waveSurferInfo";
import { useEffect } from "react";

const ToggleListingButton = React.memo(() => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const waveSurfer = waveSurferInfo.instance;
    const onTogglePlaying = () => setIsPlaying(waveSurfer?.isPlaying());
    waveSurfer?.on("pause", onTogglePlaying);
    waveSurfer?.on("play", onTogglePlaying);
    return () => {
      waveSurfer?.un("pause", onTogglePlaying);
      waveSurfer?.un("play", onTogglePlaying);
    };
  }, []);

  return (
    <IconButton
      onClick={() => {
        const waveSurfer = waveSurferInfo.instance;
        if (isPlaying) {
          waveSurfer?.pause();
        } else {
          waveSurfer?.play();
          if (waveSurfer.getDuration() === waveSurfer?.getCurrentTime())
            waveSurfer.setTime(0);
        }
      }}>
      {isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
    </IconButton>
  );
});

ToggleListingButton.displayName = "ToggleListingButton";

export default ToggleListingButton;
