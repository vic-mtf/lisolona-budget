import StopScreenShareOutlinedIcon from '@mui/icons-material/StopScreenShareOutlined';
import ScreenShareOutlinedIcon from '@mui/icons-material/ScreenShareOutlined';
import { Badge, Fab, Box as MuiBox, Stack, Tooltip } from '@mui/material';
import { useCallback, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import { setCameraData, setScreenSharingData } from '../../../../../redux/meeting';
import { useData } from '../../../../../utils/DataProvider';
import { useMeetingData } from '../../../../../utils/MeetingProvider';
import store from '../../../../../redux/store';
import AgoraRTC from 'agora-rtc-sdk-ng';
import closeMediaStream from '../../../../../utils/closeMediaStream';

export default function ScreenSharingButton () {
    const screen = useSelector(store => store.meeting.screenSharing);
    const   [{videoStreamRef, screenStreamRef, client}] = useData();
    const [{localTrackRef}] = useMeetingData();
    const [loading, setLoading] = useState();
    const dispatch = useDispatch();

    const handleToggleScreenSharing = async event => {
        const {videoTrack, audioTrack} = localTrackRef.current;
        const cameraPublished = store.getState().meeting.camera.published;
        const optionsDisplay = store.getState().meeting.screen.output;
        setLoading(true);
        if(screen.active) {
            if(cameraPublished) {
                const stream = videoStreamRef.current
                const [mediaStreamTrack] = stream.getVideoTracks();
                const videoTrack = localTrackRef.current.videoTrack;
                await videoTrack.replaceTrack(mediaStreamTrack);
            } else {
                const videoTrack = localTrackRef.current.videoTrack;
                await client.unpublish([videoTrack]);
            }
            await closeMediaStream(screenStreamRef.current);
            dispatch(
                setScreenSharingData({ data: {
                active: false,
                published: false,
            }}));
        } else {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia(optionsDisplay);
                screenStreamRef.current = stream;
                const [mediaStreamTrack] = stream.getVideoTracks();
                const localVideoScreenTrack = AgoraRTC.createCustomVideoTrack({mediaStreamTrack});
                if(cameraPublished && videoTrack) 
                    await videoTrack.replaceTrack(mediaStreamTrack);
                else {
                    localTrackRef.current.videoTrack = localVideoScreenTrack;
                    await client.publish([localVideoScreenTrack]);
                }
                dispatch(setScreenSharingData({ data: {
                    active: true,
                    published: true,
                }}))
            } catch(e) {
                console.log('screen error: ', e)
            }
        }
        setLoading(false);
    };

    return (
        <Tooltip
            title={`${screen.active ? 'Arreter le partage' : 'Partage'} d'écran`}
            arrow
        >
            <Badge
                badgeContent={
                    <PriorityHighRoundedIcon
                        fontSize="small"
                        sx={{
                            bgcolor: 'error.main', 
                            color: 'white',
                            borderRadius: 25,
                        }}
                    
                    />
                }
                invisible
                overlap="circular"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            > 
                <Fab
                    size="small"
                    onClick={handleToggleScreenSharing}
                    color={screen?.active ? "primary" : "inherit"}
                    disabled={loading}
                    sx={{
                        zIndex: 0,
                        borderRadius: 1,
                        boxShadow: 'none',
                    }}
                >
                    {screen?.active ? 
                    <StopScreenShareOutlinedIcon fontSize="small"/> : 
                    <ScreenShareOutlinedIcon fontSize="small"/>}
                </Fab>
            </Badge>
        </Tooltip>
    );
}
