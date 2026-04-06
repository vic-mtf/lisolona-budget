import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { alpha } from "@mui/material/styles";
import React from "react";
// import useLocalStoreData from "@/hooks/useLocalStoreData";
import useAudioVolume from "@/hooks/useAudioVolume";
import { noiseSuppressor } from "@/utils/NoiseSuppressor";

const VolumeBar = ({ rawStream, enabled }) => {
  const volume = useAudioVolume(
    enabled && noiseSuppressor.getProcessedStream()
  );

  const rawVolume = useAudioVolume(rawStream);

  return (
    <LinearProgress
      value={volume}
      variant={rawStream ? "buffer" : "determinate"}
      valueBuffer={rawVolume}
      color='inherit'
      sx={{
        width: "100%",
        height: 10,
        borderRadius: 6,
        overflow: "hidden",
        position: "relative",
        bgcolor:
          rawStream &&
          ((t) =>
            alpha(
              t.palette.common[t.palette.mode === "dark" ? "white" : "black"],
              0.3
            )),
        "& .MuiLinearProgress-bar": {
          transitionDuration: "50ms",
        },

        [`& .${linearProgressClasses.dashed}`]: {
          display: "none",
        },
        [`& .${linearProgressClasses.bar2}`]: {
          bgcolor: (t) => t.palette.error.main,
          opacity: 1,
        },
      }}
    />
  );
};

export default React.memo(VolumeBar);
