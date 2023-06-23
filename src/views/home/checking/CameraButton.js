import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded';
import { Badge, Fab, Box as MuiBox } from '@mui/material';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import getPermission from '../../../utils/getPermission';
import { setCameraData } from '../../../redux/meeting';
import { useData } from '../../../utils/DataProvider';
import { toggleStreamActivation } from './FooterButtons';

export default function CameraButton ({getVideoStream}) {
    const camera = useSelector(store => store.meeting.camera);
    const [permission, setPermission] = useState(null);
    const [{videoStreamRef}] = useData();
    const dispatch = useDispatch();

    const handleDispatchAllowed = useCallback(allowed => {
        dispatch(setCameraData({data: {allowed}}));
    },[dispatch]);

    const handlerToggleCamera = useCallback(() => {
        if(permission?.state !== 'denied') {
            const stream = videoStreamRef.current;
            if(camera.allowed) {
                toggleStreamActivation(stream, 'video');
                dispatch(setCameraData({data: {active: !camera?.active}}));
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

    return (
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
                variant="circular"
                size="small"
                onClick={handlerToggleCamera}
                color={camera?.active ? "primary" : "inherit"}
                disabled={permission?.state === "denied"}
                sx={{
                    zIndex: 0,
                    mx: 1
                }}
            >
                {camera?.active ? <VideocamRoundedIcon/> : <VideocamOffRoundedIcon/>}
            </Fab>
        </Badge>
    );
}
