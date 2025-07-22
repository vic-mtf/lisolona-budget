import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import PropTypes from "prop-types";
import useLocalStoreData from "../../../../../../hooks/useLocalStoreData";

const ToggleListingButton = ({ waveSurfer, duration, disabled }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [getData, setData] = useLocalStoreData();

  const togglePlaying = () => {
    if (duration) {
      if (isPlaying) waveSurfer?.pause();
      else {
        waveSurfer?.play();
        const currentWaveSurfer = getData("app.playings.audio");
        if (currentWaveSurfer !== waveSurfer) {
          currentWaveSurfer?.pause();
          setData("app.playings.audio", waveSurfer);
        }
      }
      //setIsPlaying((isPlaying) => !isPlaying);
    }
  };

  useEffect(() => {
    if (disabled) return;
    const onPlaying = () => {
      if (!isPlaying) setIsPlaying(true);
    };
    const onPause = () => {
      if (isPlaying) setIsPlaying(false);
    };
    waveSurfer?.on("pause", onPause);
    waveSurfer?.on("play", onPlaying);
    return () => {
      waveSurfer?.un("pause", onPause);
      waveSurfer?.un("play", onPlaying);
    };
  }, [waveSurfer, isPlaying, disabled]);

  return (
    <IconButton onClick={togglePlaying} disabled={disabled}>
      {isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
    </IconButton>
  );
};

ToggleListingButton.propTypes = {
  waveSurfer: PropTypes.object,
  duration: PropTypes.number,
  disabled: PropTypes.bool,
};

export default React.memo(ToggleListingButton);
