import React, { useEffect, useRef, useState } from "react";
import { LinearProgress, Box, Typography } from "@mui/material";
import useAudioValue from "../hooks/useAudioVolume";

export default function AudioLevelWithBufferBar({
  processedStream,
  rawStream,
}) {
  const volumeRaw = useAudioValue(rawStream);
  const processedVolume = useAudioValue(processedStream);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant='body2' gutterBottom>
        Niveau micro (traité) + buffer (écart)
      </Typography>
      <LinearProgress
        variant='buffer'
        value={processedVolume}
        valueBuffer={Math.min(100, volumeRaw)}
        sx={{ height: 10, borderRadius: 5 }}
      />
    </Box>
  );
}
