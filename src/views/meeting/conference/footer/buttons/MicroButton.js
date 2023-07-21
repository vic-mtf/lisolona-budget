import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import { Alert, Badge, Fab, Box as MuiBox, Stack, Tooltip } from '@mui/material';
import { useCallback, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import getPermission from '../../../../../utils/getPermission';
import { setMicroData } from '../../../../../redux/meeting';
import { useData } from '../../../../../utils/DataProvider';
import IconButton from '../../../../../components/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSnackbar } from 'notistack';
import store from '../../../../../redux/store';
import { useMeetingData } from '../../../../../utils/MeetingProvider';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { toggleStreamActivation } from '../../../../home/checking/FooterButtons';

export default function MicroButton () {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const micro = useSelector(store => store.meeting.micro);
    const [permission, setPermission] = useState(null);
    const [{localTrackRef}] = useMeetingData();
    const [{audioStreamRef, client}] = useData();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    
    const handleDispatchAllowed = useCallback(allowed => {
        dispatch(setMicroData({data: {allowed}}));
    },[dispatch]);

    const getAudioStream = useCallback(() => {
        setLoading(true);
        const audioDevice = store.getState().meeting.audio.input;
        navigator.mediaDevices.getUserMedia({
            audio: audioDevice.deviceId ? audioDevice : true,
        }).then(async stream => {
            audioStreamRef.current = stream;
            const [mediaStreamTrack] = stream.getAudioTracks();
            localTrackRef.current.audioTrack = AgoraRTC.createCustomAudioTrack({mediaStreamTrack});
            await client.publish([localTrackRef.current.audioTrack]);
            dispatch(setMicroData({data: {active: true, published: true}}));
            setLoading(false);
        }).catch((e) => {
            setLoading(false);
            const message = e.toString().toLowerCase();
            if('notreadableerror: could not start audio source' === message) {
                enqueueSnackbar({
                    message: `Micro occupé par une autre application.`,
                    content: (key, message) => (
                        <Alert onClose={() => closeSnackbar(key)} severity="error">
                          {message}
                        </Alert>
                      ),
                    style: {
                        background: 'none',
                        boxShadow: 0,
                        padding: 0,
                        margin: 0,
                    }
                })
            }
        });
    }, [dispatch, audioStreamRef, localTrackRef, client, closeSnackbar, enqueueSnackbar]);

    const handlerTogleMicro = useCallback(async () => {
        if(permission?.state !== 'denied') {
            const stream = audioStreamRef.current;
            if(stream && micro.allowed) {
                setLoading(true);
                toggleStreamActivation(stream, 'audio');
                const state = !micro.active;
                const audioTrack = localTrackRef.current.audioTrack;
                if(micro.published && micro.active && audioTrack) 
                    await client.unpublish([audioTrack]);
                if(!micro.published && !micro.active) {
                    const [mediaStreamTrack] = stream.getAudioTracks();
                    const audioTrack = AgoraRTC.createCustomAudioTrack({mediaStreamTrack});
                    localTrackRef.current.audioTrack = audioTrack;
                    await client.publish([audioTrack]);
                }
                dispatch(setMicroData({data: {active: state, published: state}}));
                setLoading(false);
            } else getAudioStream();
        } else {
            //message audio ici
        }
    }, [audioStreamRef, micro, permission, dispatch, getAudioStream, client, localTrackRef]);


    useLayoutEffect(() => {
        if(!permission)
            getPermission('microphone')
            .then((permission) => {
                setPermission(permission);
                handleDispatchAllowed(permission.state === 'granted');
            });
        const handleChangeState = event => {
            const permission = event.target;
            setPermission(permission);
            handleDispatchAllowed(permission.state === 'granted');
        };
        permission?.addEventListener('change', handleChangeState);
        return () => {
            permission?.removeEventListener('change', handleChangeState);
        };
    }, [permission, handleDispatchAllowed]);

    return (
        <Stack
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            spacing={.1}
            direction="row"
        >
            <Tooltip
                title={`${micro.active ? 'Desactiver' : 'Activer'} le micro`}
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
                    invisible={micro.allowed || !permission}
                    overlap="circular"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                > 
                    <Fab
                        variant="circular"
                        size="small"
                        onClick={handlerTogleMicro}
                        color={micro?.active ? "primary" : "inherit"}
                        disabled={permission?.state === "denied" || loading}
                        sx={{
                            zIndex: 0,
                            borderRadius: 1,
                            boxShadow: 0,
                        }}
                    >
                        {micro?.active ? 
                        <MicNoneOutlinedIcon
                            fontSize="small"
                        /> : <MicOffOutlinedIcon
                            fontSize="small"
                        />}
                    </Fab>
                </Badge>
            </Tooltip>
            <IconButton
                disabled
            >
                <ExpandMoreIcon/>
            </IconButton>
        </Stack>
    );
}