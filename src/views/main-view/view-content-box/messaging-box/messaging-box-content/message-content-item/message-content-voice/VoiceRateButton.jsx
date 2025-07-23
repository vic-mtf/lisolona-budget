import React from "react";
import { IconButton, Typography } from "@mui/material";
import { useEffect } from "react";
import PropTypes from "prop-types";

const VoiceRateButton = ({ audioRef, disabled }) => {
  const [rate, setRate] = React.useState(audioRef.current?.playbackRate || 1);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = rate;
  });
  return (
    <IconButton
      disabled={disabled}
      onClick={() => {
        setRate((rate) => (rate === 1 ? 1.5 : rate === 1.5 ? 2 : 1));
      }}>
      <Typography height={20} minWidth={20} sx={{ color: "currentcolor" }}>
        {rate}x
      </Typography>
    </IconButton>
  );
};

VoiceRateButton.propTypes = {
  audioRef: PropTypes.object,
  disabled: PropTypes.bool,
};

export default React.memo(VoiceRateButton);
