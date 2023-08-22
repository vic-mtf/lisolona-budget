import React, { useEffect, useRef, useState } from 'react';
import ColorThief from 'colorthief';
import { Grid, Box as MuiBox, alpha } from '@mui/material';

export default React.memo(function EmojiPickerContent ({onSelect, data})  {
  const rootRef = useRef();
  return (
    <Grid
        margin="auto"
        ref={rootRef}
        width="100%"
        height={100}
        overflow="auto"
        container
        display="flex"
        justifyContent="center"
        spacing={.25}
        py={.5}
    >
      {data.map((data) => (
          <Grid
            item
            key={data.name}
          >
            <ImageCard 
              {...data}
              onClick={() => typeof onSelect === "function" ? onSelect(data) : null}
              rootRef={rootRef}
            />
          </Grid>
        ))}
    </Grid>
  )
})



const ImageCard = ({src, metadata, name, rootRef, ...otherProps}) => {
  const [color, setColor] = useState();
  const emojiRootRef = useRef();
  const emojiRef = useRef();

  useEffect(() => {
    const colorThief = new ColorThief();
    const image = new Image();
    const threshold = .005;
    const isNone = () => window.getComputedStyle(emojiRef.current, null).backgroundImage === 'none';
    const options = {
      root: rootRef.current,
      threshold,
    };
    const url = window.encodeURI(`${process.env.PUBLIC_URL}/${src}`);
    if(!isNone()) emojiRef.current.style.backgroundImage = `url(${url})`;
    const observer = new IntersectionObserver((entries, observer)  => {
      entries.forEach((entry) => {
        if(entry.intersectionRatio >= threshold && isNone()) {
          emojiRef.current.style.backgroundImage = `url(${url})`;
          setTimeout(() => {
            image.onload = event => {
              const color = colorThief.getColor(event.target);
              const bgcolor = alpha(`rgb(${color[0]}, ${color[1]}, ${color[2]})`, .3);
              setColor(bgcolor);
            }
            image.src = url;
          }, 300);
        }
      });
    }, options);
    observer.observe(emojiRootRef.current);
    return () => {
      observer.disconnect();
    };
  }, [rootRef, src]);

  return (
      <MuiBox
        ref={emojiRootRef}
        component="button"
        {...otherProps}
        onMouseDown={event => event.preventDefault()}
        sx={{
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          outline: 'none',
          border: 'none',
          borderRadius: 1,
          cursor: 'pointer',
          p: .5,
          "&:focus; &:hover": {
            bgcolor: theme => color || alpha(theme.palette.common[ 
              theme.palette.mode === "dark" ? 'white' : 'black'
            ], .3) 
          }
        }}
      >
        <div 
          ref={emojiRef}
          style={{
            height: 35,
            width: 35,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
       </MuiBox>
  );
};
