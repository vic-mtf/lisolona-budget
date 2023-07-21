import { Box as MuiBox } from "@mui/material";
import { useLayoutEffect } from "react";
import { useRef } from "react";

export default function VideoTrackView ({videoTrack}) {
    const rootRef = useRef();
    const videoRef = useRef();

    useLayoutEffect(() => {
        if(videoTrack?.play && videoRef.current)
            videoTrack?.play(videoRef.current);
    }, [videoTrack]);

    return (
        <MuiBox
            ref={rootRef}
            sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: "100%",
            }}
        >
         <video
            ref={videoRef}
            autoPlay
            muted
         />
        </MuiBox>
    );
}