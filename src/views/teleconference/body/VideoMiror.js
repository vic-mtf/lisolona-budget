import { useCallback, useEffect, useRef, useState } from "react"
import {
    Box as MuiBox, createTheme, Grid
} from '@mui/material';
import { useSelector } from "react-redux";
import Typography from "../../../components/Typography";
import { useTeleconference } from "../../../utils/useTeleconferenceProvider";

export default function VideoMiror () {
    const videoRef = useRef();
    const { isCompatible } = useTeleconference();
    const [mediaStream, setMediaStream] = useState(null);
    const { type } = useSelector(store => {
        const type = store?.teleconference?.type;
        return {type};
    });
    const  setVideoFrame = useCallback((stream) => {
        if(videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.autoplay = true;
        }
        setMediaStream(stream);
    }, []);

    useEffect(() => {
        if(type === 'video' && !mediaStream) {
            if(window?.navigator?.mediaDevices?.getUserMedia) {
                navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: window.innerWidth },
                        height: { ideal: window.innerHeight },
                    },
                }).then(stream => {
                    setVideoFrame(stream);
                })
            }
        };
        return () => {
            const tracks = mediaStream?.getTracks();
            tracks?.forEach(track => track.stop())
        };  
    }, [type, setVideoFrame, mediaStream]);


    return (
        <Grid
            item 
            md={12}
            display="flex"
            flex={1}
            justifyContent="center"
            alignItems="center"
            overflow="hidden"
            flexDirection="column"
        >
            <MuiBox
                height="100%"
                width="100%"
                overflow="hidden"
                borderRadius={1}
                sx={{
                    border: theme => `1px solid ${theme.palette.divider}`,
                    bgcolor: theme => `${theme.palette.grey[900]}`,
                }}
            >
                {isCompatible ?
                (
                <video
                    ref={videoRef}
                    width="100%"
                    style={{transform: 'scale(-1, 1)'}}
                />
                ):
                (
                <Typography
                    align="center"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                    width="100%"
                    display="flex"
                    color="white"
                    variant="body1"
                    px={2}
                    sx={{'& > *': {mx:.5}}}
                >
                    Il est impossible de poursuivre cette opération car votre appareil 
                    n'est pas compatible avec les outils nécessaires à <b>Lisolo Na budget</b> pour fonctionner correctement.
                </Typography>
                )
                }
            </MuiBox>
        </Grid>
    )
}