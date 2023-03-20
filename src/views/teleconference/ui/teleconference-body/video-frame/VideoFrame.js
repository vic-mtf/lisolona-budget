import {
    Box as MuiBox
} from '@mui/material';
import { useEffect, useRef } from 'react';
//import Subheader from './Subheader';

export default function VideoFrame ({data}) {
    const frameRef = useRef();
    useEffect(() => {
        const frame = frameRef.current;
        const videoTrack = data?.tracks?.videoTrack;
        frame.querySelector('video')?.parentNode?.remove();
        if(data.mediaType === 'video')
            videoTrack?.play(frame);
    });

    

    return (
        <MuiBox
            display="flex"
            flex={1}
            width="100%"
            height="100%"
            position="relative"
            ref={frameRef}
        >
            
          {/* <Subheader
            uid={data?.user?.uid}
          /> */}
        </MuiBox>
    );
}