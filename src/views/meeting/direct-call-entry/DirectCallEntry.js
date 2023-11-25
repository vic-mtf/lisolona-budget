import { Box as MuiBox, Stack } from '@mui/material';
import FooterButtons from './FooterButtons';
import { useRef, useLayoutEffect, useState, useCallback } from 'react';
import { useMeetingData } from '../../../utils/MeetingProvider';
import CallingState from './CallingState';
import useAudio from '../../../utils/useAudio';
import waiting_src from '../../../assets/mixkit-on-hold-ringtone.aac';
import useGetMediaStream from '../actions/useGetMediaStream';
import useVideoStreamState from '../actions/useVideoStreamState';
import useBackgroundRoot from '../actions/useBackgroundRoot';
import useCreateMeeting from '../actions/useCreateMeeting';
import store from '../../../redux/store';
import { useSocket } from '../../../utils/SocketIOProvider';


export default function DirectCallEntry () {
    const videoRef = useRef();
    const rootRef = useRef();
    const [{meetingData, target, ringRef}] = useMeetingData();
    const [callState, setCallState] = useState(meetingData.defaultCallingState);
    const socket = useSocket();
    const handleGetMediaStream = useGetMediaStream();
    const waitingAudio = useAudio(waiting_src);
    const handleCreateMeeting = useCreateMeeting();
   

    const handleCall = useCallback((media) => {
        handleGetMediaStream(media);
        waitingAudio.audio.play();
        ringRef.current?.clearAudio();
        ringRef.current = waitingAudio;
        setCallState('waiting');
        handleCreateMeeting(false).then(data => {
            const userId = store.getState().user.id;
            const callData = {
                id: data?._id,
                type: 'direct',
                who: data.participants
                ?.filter(({identity}) => identity?._id !== userId)
                ?.map(({identity}) => identity?._id)
             };
             socket.emit('call', callData);
        }).catch(() => {
            setCallState('error');
        });

    }, [waitingAudio, ringRef, handleGetMediaStream, handleCreateMeeting, socket]);
    
    useLayoutEffect(() => {
        if(callState === 'incoming') 
            handleGetMediaStream('audio');
    }, [callState, handleGetMediaStream]);

    useBackgroundRoot({target, rootRef});
    useVideoStreamState(videoRef);

    return (
        <Stack
            spacing={1}
            display="flex"  
            justifyContent="center"
            flex={1}
            height="100%"
            width="100%"
            ref={rootRef}
            position="relative"
        >
            <MuiBox
                position="relative"
                display="flex"
                alignItems="end"
                width="100%"
                flex={1}
                borderRadius={1}
                sx={{
                    backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                    "& video": {
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        bgcolor: 'transparent',
                        borderRadius: 1,
                        transform: 'scaleX(-1)',
                    }
                }}
            >
                <CallingState
                    callState={callState}
                    setCallState={setCallState}
                />
                <video ref={videoRef} muted autoPlay />
                {['before', 'waiting', 'ringing', 'incoming'].includes(callState) &&
                <FooterButtons
                    handleCall={handleCall}
                    callState={callState}
                    setCallState={setCallState}
                />}
            </MuiBox>
        </Stack>
    );
}