import { Box as MuiBox } from '@mui/material';
import { useLayoutEffect, useRef, useState } from 'react';

export default function PictureItem ({src, srcSet, title, description}) {
    useLayoutEffect(() => {
       
    }, [])
    return (
        <MuiBox
            display="flex"
            height="100%"
            width="100%"
            justifyContent="center"
            alignItems="center"
            position="relative"
            overflow="hidden"
        >
            <img
                src={src}
                srcSet={srcSet}
                loading="lazy"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                }}
            />
        </MuiBox>
    );
}