import {
    Box as MuiBox,
} from '@mui/material';
import { useLayoutEffect } from "react";
import { useRef } from "react";

export default function ViewVideoTrack ({videoTrack, type}) {
    const videoRef = useRef();
    
    useLayoutEffect(() => {
        videoTrack?.play(videoRef.current);
    }, [videoTrack]);

    return (
        <MuiBox
            position="relative"
            sx={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                '& video': {
                    bgcolor: 'black',
                    ...type === 'screen' ? {

                    } : {

                    }
                }
            }}
        >
            <video
                autoPlay
                muted
                ref={videoRef}
            />
        </MuiBox>
    );
}

ViewVideoTrack.defaultProps = {
    type: 'camera',
}