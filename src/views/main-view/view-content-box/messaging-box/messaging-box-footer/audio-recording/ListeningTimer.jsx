import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import formatTime from "../../../../../../utils/formatTime";

const ListeningTimer = React.memo(({ waveSurfer, duration }) => {
  const [current, setCurrent] = useState(null);
  const currentTime = current ?? duration;

  useEffect(() => {
    const onTimeupdate = (time) => setCurrent(time);
    waveSurfer?.on("timeupdate", onTimeupdate);
    return () => {
      waveSurfer?.un("timeupdate", onTimeupdate);
    };
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
  duration: PropTypes.number,
};
export default ListeningTimer;
