import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Alert, Badge, Fab, Box as MuiBox, Stack, Tooltip } from '@mui/material';
import { useCallback, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import getPermission from '../../../../../utils/getPermission';
import { setCameraData } from '../../../../../redux/meeting';
import { useData } from '../../../../../utils/DataProvider';
import IconButton from '../../../../../components/IconButton';
import { toggleStreamActivation } from '../../../../home/checking/FooterButtons';
import store from '../../../../../redux/store';
import { useMeetingData } from '../../../../../utils/MeetingProvider';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useSnackbar } from 'notistack';

export default function CameraButton () {
    const camera = useSelector(store => store.meeting.camera);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [permission, setPermission] = useState(null);
    const [{videoStreamRef, client}] = useData();
    const [{localTrackRef}] = useMeetingData();
    const dispatch = useDispatch();

    const handleDispatchAllowed = useCallback(allowed => {
        dispatch(setCameraData({data: {allowed}}));
    },[dispatch]);

    const getVideoStream = useCallback(() => {
        setLoading(true);
        const videoDevice = store.getState().meeting.video.input;
        navigator.mediaDevices.getUserMedia({
            video: videoDevice.deviceId ? videoDevice : {
                width: {ideal: window.innerWidth},
                height: {ideal: window.innerHeight}
            },
        }).then(async stream => {
            videoStreamRef.current = stream;
            const screenPublished = store.getState().meeting.screenSharing.published;
            if(!screenPublished) {
                const [mediaStreamTrack] = stream.getVideoTracks();
                localTrackRef.current.videoTrack = AgoraRTC.createCustomVideoTrack({mediaStreamTrack});
                await client.publish([localTrackRef.current.videoTrack]);
            } 
            dispatch(setCameraData({data: {active: true,  published: true}}));
            setLoading(false);
        }).catch((e) => {
            setLoading(false);
            const message = e.toString().toLowerCase();
            if('notreadableerror: could not start video source' === message) {
                enqueueSnackbar({
                    message: `Caméra occupée par une autre application.`,
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
    }, [dispatch, videoStreamRef, localTrackRef, client, closeSnackbar, enqueueSnackbar]);

    const handlerToggleCamera = useCallback(async () => {
        if(permission?.state !== 'denied') {
            const stream = videoStreamRef.current;
            if(stream) {
                setLoading(true);
                toggleStreamActivation(stream, 'video');
                const state = !camera.active;
                const screenPublished = store.getState().meeting.screenSharing.published;
                if(!screenPublished) {
                    if(camera.published && camera.active) 
                        await client.unpublish([localTrackRef.current.videoTrack]);
                    if(!camera.published && !camera.active) {
                        const [mediaStreamTrack] = stream.getVideoTracks();
                        localTrackRef.current.videoTrack = AgoraRTC.createCustomVideoTrack({mediaStreamTrack})
                        await client.publish([localTrackRef.current.videoTrack]);
                    }
                }
                dispatch(setCameraData({data: {active: state, published: state}}));
                setLoading(false);
            } else getVideoStream();
        } else {
            //message video ici
        }
    }, [videoStreamRef, camera, permission, dispatch, getVideoStream, client, localTrackRef]);
    
    useLayoutEffect(() => {
        if(!permission)
            getPermission('camera')
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
                title={`${camera.active ? 'Desactiver' : 'Activer'} la caméra`}
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
                invisible={camera.allowed || !permission}
                overlap="circular"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            > 
                <Fab
                    size="small"
                    onClick={handlerToggleCamera}
                    color={camera?.active ? "primary" : "inherit"}
                    disabled={permission?.state === "denied" || loading}
                    sx={{
                        zIndex: 0,
                        borderRadius: 1,
                        boxShadow: 'none',
                    }}
                >
                    {camera?.active ? 
                    <VideocamOutlinedIcon fontSize="small"/> : 
                    <VideocamOffOutlinedIcon fontSize="small"/>}
                </Fab>
            </Badge>
            </Tooltip>
            <IconButton disabled>
                <ExpandMoreIcon/>
            </IconButton>
        </Stack>
    );
}
