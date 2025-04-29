import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import formatTime from "../../../../../../utils/formatTime";

const ListeningTimer = React.memo(({ waveSurfer }) => {
  const [currentTime, setCurrentTime] = useState(() => {
    return waveSurfer?.getDuration() || 0;
  });

  useEffect(() => {
    const onTimeupdate = (time) => setCurrentTime(time);

    waveSurfer?.on("timeupdate", onTimeupdate);
    return () => {
      waveSurfer?.un("timeupdate", onTimeupdate);
      waveSurfer?.setTime(0);
    };
  }, [waveSurfer]);

  useEffect(() => {
    waveSurfer?.setTime(100000000);
  }, [waveSurfer]);

  return (
    <Typography variant='body1' component='div'>
      {formatTime({ currentTime })}
    </Typography>
  );
});

ListeningTimer.displayName = "ListeningTimer";
ListeningTimer.propTypes = {
  waveSurfer: PropTypes.object,
};
export default ListeningTimer;
