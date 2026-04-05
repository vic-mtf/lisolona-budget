import React from "react";
import { IconButton, Typography } from "@mui/material";
import { useEffect } from "react";

const VoiceRateButton = ({ audio, disabled }) => {
  const [rate, setRate] = React.useState(audio?.playbackRate || 1);

  useEffect(() => {
    if (!audio) return;
    audio.playbackRate = rate;
  }, [audio, rate]);

  return (
    <IconButton
      disabled={disabled}
      onClick={() => {
        setRate((rate) => (rate === 1 ? 1.5 : rate === 1.5 ? 2 : 1));
      }}>
      <Typography width={25} sx={{ color: "currentcolor" }}>
        {rate}x
      </Typography>
    </IconButton>
  );
};

export default React.memo(VoiceRateButton);
