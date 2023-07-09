import StopScreenShareOutlinedIcon from '@mui/icons-material/StopScreenShareOutlined';
import ScreenShareOutlinedIcon from '@mui/icons-material/ScreenShareOutlined';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Badge, Fab, Box as MuiBox, Stack } from '@mui/material';
import { useCallback, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import getPermission from '../../../../../utils/getPermission';
import { setCameraData } from '../../../../../redux/meeting';
import { useData } from '../../../../../utils/DataProvider';
import IconButton from '../../../../../components/IconButton';

export default function ScreenSharingButton ({getVideoStream}) {

    const screen = useSelector(store => store.meeting.screenSharing);
    // const [permission, setPermission] = useState(null);
    // const [{videoStreamRef}] = useData();
    // const dispatch = useDispatch();

    // const handleDispatchAllowed = useCallback(allowed => {
    //     dispatch(setCameraData({data: {allowed}}));
    // },[dispatch]);

    // const handlerToggleCamera = useCallback(() => {
        // if(permission?.state !== 'denied') {
        //     const stream = videoStreamRef.current;
        //     if(camera.allowed) {
        //         if(stream) toggleStreamActivation(stream, 'video');
        //         else  getVideoStream()
        //         dispatch(setCameraData({data: {active: !camera?.active}}));
        //     } else getVideoStream();
        // } else {
        //     //message video ici
        // }
    // }, [videoStreamRef, camera, permission, dispatch, getVideoStream]);
    
    // useLayoutEffect(() => {
        // if(!permission)
        //     getPermission('camera')
        //     .then((permission) => {
        //         setPermission(permission);
        //         handleDispatchAllowed(permission.state === 'granted');
        //     });
        // const handleChangeState = event => {
        //     const permission = event.target;
        //     setPermission(permission);
        //     handleDispatchAllowed(permission.state === 'granted');
        // };
        // permission?.addEventListener('change', handleChangeState);
        // return () => {
        //     permission?.removeEventListener('change', handleChangeState);
        // };
    // }, [permission, handleDispatchAllowed]);

    return (
        <Stack
            sx={{
                border: theme => `1px solid ${theme.palette.divider}`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: .2,
            }}
            borderRadius={1}
            spacing={.1}
            direction="row"
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
                //invisible={screen.allowed || !permission}
                invisible
                overlap="circular"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            > 
                <Fab
                    size="small"
                    // onClick={handlerToggleCamera}
                    color={screen?.active ? "primary" : "inherit"}
                    //disabled={permission?.state === "denied"}
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
            <IconButton>
                <ExpandMoreIcon/>
            </IconButton>
        </Stack>
    );
}
