import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import PropTypes from "prop-types";
import useLocalStoreData from "../../../../../../hooks/useLocalStoreData";

const ToggleListingButton = React.memo(({ waveSurfer }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [getData, setData] = useLocalStoreData();

  const togglePlaying = () => {
    if (isPlaying) waveSurfer?.pause();
    else {
      if (waveSurfer.getDuration() === waveSurfer?.getCurrentTime())
        waveSurfer.setTime(0);
      waveSurfer?.play();
      const currentWaveSurfer = getData("app.playings.audio");
      if (currentWaveSurfer !== waveSurfer) {
        currentWaveSurfer?.pause();
        setData("app.playings.audio", waveSurfer);
      }
    }
    setIsPlaying((isPlaying) => !isPlaying);
  };

  useEffect(() => {
    const onTogglePlaying = () => {
      if (isPlaying !== waveSurfer?.isPlaying())
        setIsPlaying(waveSurfer?.isPlaying());
    };
    waveSurfer?.on("pause", onTogglePlaying);
    waveSurfer?.on("play", onTogglePlaying);
    return () => {
      waveSurfer?.un("pause", onTogglePlaying);
      waveSurfer?.un("play", onTogglePlaying);
    };
  }, [waveSurfer, isPlaying]);

  return (
    <IconButton onClick={togglePlaying}>
      {isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
    </IconButton>
  );
});

ToggleListingButton.displayName = "ToggleListingButton";

ToggleListingButton.propTypes = {
  waveSurfer: PropTypes.object,
};

export default ToggleListingButton;
