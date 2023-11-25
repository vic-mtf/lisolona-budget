import { useEffect } from "react";
import { Toolbar } from "@mui/material";
import MicroButton from "./MicroButton";
import CameraButton from "./CameraButton";
import store from '../../../redux/store';

export default function FooterButtons ({videoRef, handleGetMediaStream}) {

    useEffect(() => {
        const {camera, micro } = store.getState().meeting;
        if(!camera.active && !micro.active && typeof handleGetMediaStream === 'function') 
        handleGetMediaStream();
    }, [handleGetMediaStream]);

    return (
        <Toolbar
            sx={{
                display: 'flex', 
                justifyContent: 'center', 
                width: '100%',
                mb: 1.5
            }}
            variant="dense"
        >
            <MicroButton
                getAudioStream={() => handleGetMediaStream('audio')}
            />
            <CameraButton
                videoRef={videoRef}
                getVideoStream={() => handleGetMediaStream('video')}
            />
        </Toolbar>
    );
}

export function toggleStreamActivation(stream, type) {
    const [videoTrack] = stream?.getVideoTracks() || [];
    const [audioTrack] = stream?.getAudioTracks() || [];
    if(audioTrack && type === 'audio') 
        audioTrack.enabled = !audioTrack.enabled;
    if(videoTrack && type === 'video')
        videoTrack.enabled = !videoTrack.enabled;
}