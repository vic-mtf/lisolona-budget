import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import { Badge, Fab, Box as MuiBox, Stack, Tooltip } from '@mui/material';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import getPermission from '../../../../../utils/getPermission';
import { setCameraData } from '../../../../../redux/meeting';
import { useData } from '../../../../../utils/DataProvider';
import IconButton from '../../../../../components/IconButton';
import { toggleStreamActivation } from '../../../../home/checking/FooterButtons';
import store from '../../../../../redux/store';
import useCustomSnackbar from '../../../../../components/useCustomSnackbar';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import VideoInputButtonOptions from './VideoInputButtonOptions';

export default function CameraButton ({handleCheckErrors}) {
    const camera = useSelector(store => store.meeting.camera);
    const { enqueueCustomSnackbar, closeCustomSnackbar} = useCustomSnackbar();
    const [permission, setPermission] = useState(null);
    const [{videoStreamRef}] = useData();
    const dispatch = useDispatch();
    const [hasDevice, setHasDevice] = useState(true);
 
    const handleDispatchAllowed = useCallback(allowed => {
        dispatch(setCameraData({data: {allowed}}));
    },[dispatch]);

    const getVideoStream = useCallback(() => {
        const videoDevice = store.getState().meeting.video.input;
        navigator.mediaDevices.getUserMedia({
            video: videoDevice.deviceId ? videoDevice : {
                width: {ideal: window.innerWidth},
                height: {ideal: window.innerHeight}
            },
        }).then(async stream => {
            videoStreamRef.current = stream;
            dispatch(setCameraData({data: {active: true,  published: true}}));
        }).catch((e) => {
            const message = e.toString().toLowerCase();
            if('notreadableerror: could not start video source' === message) {
                let key;
                enqueueCustomSnackbar({
                    message: `Caméra occupée par une autre application.`,
                    severity: 'error',
                    getKey: _key => key = _key,
                    action: (
                        <IconButton
                            onClick={() => {
                                closeCustomSnackbar(key);
                            }}
                        >
                            <CloseOutlinedIcon/>
                        </IconButton>
                    )
                })
            }
        });
    }, [dispatch, videoStreamRef, closeCustomSnackbar, enqueueCustomSnackbar]);

    const handlerToggleCamera = useCallback(async () => {
        if(permission?.state !== 'denied') {
            const stream = videoStreamRef.current;
            if(stream) {
                toggleStreamActivation(stream, 'video');
                const state = !camera.active;
                dispatch(setCameraData({data: {active: state, published: state}}));
            } else getVideoStream();
        } else {
            //message video ici
        }
    }, [videoStreamRef, camera, permission, dispatch, getVideoStream]);
    
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

    useEffect(() => {
        if(hasDevice && !navigator?.mediaDevices?.enumerateDevices)
            setHasDevice(false)
    },[hasDevice, setHasDevice]);

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
                invisible={
                    permission ? 
                    (camera.allowed && permission?.state === 'granted' && hasDevice):
                    true
                }
                overlap="circular"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            > 
                <Fab
                    size="small"
                    onClick={handlerToggleCamera}
                    color={camera?.active ? "primary" : "default"}
                    disabled={permission?.state === "denied"}
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
            <VideoInputButtonOptions
                setHasDevice={setHasDevice}
                hasDevice={hasDevice}
                handleCheckErrors={handleCheckErrors}
            />
        </Stack>
    );
}
