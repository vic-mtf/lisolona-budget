import { Box as MuiBox, Stack } from '@mui/material';
import FooterButtons from './FooterButtons';
import { useRef, useLayoutEffect, useState, useCallback, useMemo } from 'react';
import { useMeetingData } from '../../../utils/MeetingProvider';
import generateBackgroundFromImage from '../../../utils/generateBackgroundFromImage';
import generateBackgroundFromId from '../../../utils/generateBackgroundFromId';
import CallingState from './CallingState';
import { useDispatch, useSelector } from 'react-redux';
import useAxios from '../../../utils/useAxios';
import useAudio from '../../../utils/useAudio';
import waiting_src from '../../../assets/mixkit-on-hold-ringtone.wav';
import { setData } from '../../../redux/meeting';

export default function CallEntry () {
    const videoRef = useRef();
    const rootRef = useRef();
    const [{meetingData, ringRef}, {settersMembers}] = useMeetingData();
    const [callState, setCallState] = useState(meetingData.defaultCallingState);
    const [media, setMedia] = useState(); 
    const target = useMemo(() => meetingData?.target || null, [meetingData?.target]);
    const user = useSelector(store => store.meeting.me);
    const waitingAudio = useAudio(waiting_src);
    const dispatch = useDispatch();
    const [,refetch] = useAxios({
        url: '/api/chat/room/call/',
        headers: {Authorization: `Bearer ${user?.token}`},
    }, {manual: true});

    const handleCall = useCallback((media) => {
        waitingAudio.audio.play();
        ringRef.current?.clearAudio();
        ringRef.current = waitingAudio;
        setMedia(media);
        setCallState('waiting');
        refetch({
            method: 'post',
            data: {
                target: target?.id,
                type: target?.type,
                tokenType: 'uid',
                role: 'publisher',
                start: Date.now(),
                // details: autres details
            }
        }).then(({data}) => {
            const { 
                callDetails: options,
                createdAt,
                location,
                participants: members,
                _id: meetingId
            } = data;

            dispatch(setData({data: {
                options, createdAt, location, meetingId
            }}));
            settersMembers.addObjects(members.map(
                member => ({...member, id: member.identity._id,})
            ));
        }).catch(() => {
            
        });
    }, [target, refetch, waitingAudio, ringRef, dispatch, settersMembers]);

    useLayoutEffect(() => {
        if(target) {
            const {id, avatarSrc} = target;
            const getBackground = avatarSrc ? 
            generateBackgroundFromImage : generateBackgroundFromId;
            const key = avatarSrc ? 'url' : 'id';
            const value = avatarSrc || id;
            getBackground({[key]: value}).then(img => {
                if(rootRef?.current) {
                    rootRef.current.style.background = `url(${img})`;
                    rootRef.current.style.backgroundSize = 'cover';
                }
            })
        }
    },[target]);
    
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
                {(new RegExp(['before', 'waiting', 'ringing', 'incoming'].join('|'))).test(callState) &&
                <FooterButtons
                    videoRef={videoRef}
                    media={media}
                    handleCall={handleCall}
                    callState={callState}
                    setCallState={setCallState}
                />}
            </MuiBox>
        </Stack>
    );
}