import React, { useState } from 'react';
import CardMedia from '@mui/material/CardMedia';
import 'animate.css/source/fading_entrances/fadeIn.css';


function CustomCardMedia(props) {
  const [loaded, setLoaded] = useState(false);

  function handleLoad() {
    setLoaded(true);
  }

  return (
    <React.Fragment>
      <CardMedia
        onLoad={handleLoad}
        {...props}
        sx={{
          ...props.sx,
          transition: 'opacity .2s',
          opacity: Number(loaded)
        }}
      />
    </React.Fragment>
  );
}


export default CustomCardMedia;
