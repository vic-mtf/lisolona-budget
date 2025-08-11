import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { alpha } from "@mui/material/styles";
import React, { useMemo } from "react";
import useLocalStoreData from "../../../../hooks/useLocalStoreData";
import useAudioVolume from "../../../../hooks/useAudioVolume";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const VolumeBar = ({ rawStream }) => {
  const [getData] = useLocalStoreData("conference.setup.devices");
  const enabled = useSelector(
    (store) => store.conference.setup.devices.microphone.enabled
  );

  const stream = useMemo(
    () => (enabled ? getData("microphone.processedStream") : null),
    [enabled, getData]
  );

  const volume = useAudioVolume(stream);
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

VolumeBar.propTypes = {
  deviceId: PropTypes.string,
  rawStream: PropTypes.instanceOf(MediaStream),
};

export default React.memo(VolumeBar);
