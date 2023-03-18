import { Backdrop, Box as MuiBox } from '@mui/material';
import React, { useRef } from 'react';
import ResizeDragContainer from './ResizeDragContainer';

export default function ResizableContainer ({children, size, open}) {

    const coordsRef = useRef({
        width: 400,
        height: 300,
    });

    return (
        <MuiBox
          component={size === 'small' ? ResizeDragContainer : Backdrop}
          sx={{zIndex: theme => theme.zIndex.drawer + 100}}
          open={open}
          children={open && children}
        />
    )
}