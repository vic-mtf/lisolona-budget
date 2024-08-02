import React, { useMemo } from 'react';
import { Grid, Box as MuiBox, alpha } from '@mui/material';
import { getCharacterFromCodeString } from '../EmojiPicker';

export default React.memo(function EmojiPickerContent ({ onSelect, data }) {

  return (
    <Grid
        margin="auto"
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
            />
          </Grid>
        ))}
    </Grid>
  );
})

const ImageCard = ({src, metadata, name, rootRef, ...otherProps}) => {
  const url = useMemo(() => window.encodeURI(`${process.env.PUBLIC_URL}/${src}`), [src]);

  return (
      <MuiBox
        component="button"
        {...otherProps}
        onMouseDown={event => event.preventDefault()}
        sx={{
          backgroundColor: 'transparent',
          backgroundImage: `url(${url})`,
          fontSize: 20,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          outline: 'none',
          border: 'none',
          borderRadius: 1,
          cursor: 'pointer',
          m: .25,
          p: .25,
          fontFamily: 'noto emoji',
          color: 'transparent',
          "&:hover, &:active": {
            backgroundColor: theme => alpha(
              theme.palette.common[theme.palette.mode === 'light' ? 'black' : 'white'],
              0.2
            )
          }
        }}
        children={
          <span>{getCharacterFromCodeString(metadata.glyph)}</span>
         }
      />
  );
};
