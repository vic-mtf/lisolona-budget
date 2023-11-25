import {
    Box as MuiBox
} from '@mui/material';
import FloatView from './FloatView';
import { useSelector } from 'react-redux';
import Client from '../participant/Client';
import { useMeetingData } from '../../../../../utils/MeetingProvider';
import { useLayoutEffect } from 'react';
import { useData } from '../../../../../utils/DataProvider';
import { useRef } from 'react';

export default function CameraView ({mode}) {
    const camera = useSelector(store => store.meeting.camera);
    const micro = useSelector(store => store.meeting.micro);
    const user = useSelector(store => store.meeting.me);
    const [{localTrackRef}] = useMeetingData();
    const [{videoStreamRef}] = useData();
    const videoRef = useRef();

    useLayoutEffect(() => {
        if(camera.active) 
            videoRef.current.srcObject = videoStreamRef.current
    },[camera, videoStreamRef])

    return (
        <MuiBox
            component={mode === 'float' ? FloatView : 'div'}
        >
           {camera.active && 
           <video
                autoPlay
                muted
                ref={videoRef}
            />}
            <Client
                avatarSrc={user?.image}
                id={user?.id}
                audioTrack={micro.active && localTrackRef.current.audioTrack}
                showVideo={camera.active}
                name="Vous"
                reverseScreen
            />
        </MuiBox>
    );
}


