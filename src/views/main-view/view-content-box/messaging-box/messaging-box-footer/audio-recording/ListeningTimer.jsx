import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import waveSurferInfo from "./waveSurferInfo";
import formatTime from "../../../../../../utils/formatTime";

const ListeningTimer = React.memo(() => {
  const [currentTime, setCurrentTime] = useState(() => {
    waveSurferInfo.instance?.setTime(100000000);
    return waveSurferInfo.instance?.getDuration() || 0;
  });

  useEffect(() => {
    const onTimeupdate = (time) => {
      setCurrentTime(time);
    };
    const waveSurfer = waveSurferInfo.instance;
    waveSurfer?.on("timeupdate", onTimeupdate);
    return () => {
      waveSurfer?.un("timeupdate", onTimeupdate);
      waveSurfer?.setTime(0);
    };
  }, []);

  return (
    <Typography variant='body1' component='div'>
      {formatTime({ currentTime })}
    </Typography>
  );
});

ListeningTimer.displayName = "ListeningTimer";
ListeningTimer.propTypes = {
  pause: PropTypes.bool,
  timeRef: PropTypes.object,
};
export default ListeningTimer;
