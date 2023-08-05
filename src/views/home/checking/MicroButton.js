import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import { Badge, Fab, Box as MuiBox } from '@mui/material';
import { useCallback, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import getPermission from '../../../utils/getPermission';
import { setMicroData } from '../../../redux/meeting';
import { useData } from '../../../utils/DataProvider';
import { toggleStreamActivation } from './FooterButtons';

export default function MicroButton ({getAudioStream}) {
    const micro = useSelector(store => store.meeting.micro);
    const [permission, setPermission] = useState(null);
    const [{audioStreamRef}] = useData();
    const dispatch = useDispatch();
    
    const handleDispatchAllowed = useCallback(allowed => {
        dispatch(setMicroData({data: {allowed}}));
    },[dispatch]);

    const handlerTogleMicro = useCallback(() => {
        if(permission?.state !== 'denied') {
            const stream = audioStreamRef.current;
            if(micro.allowed) {
                if(stream) toggleStreamActivation(stream, 'audio');
                else  getAudioStream()
                dispatch(setMicroData({data: {active: !micro?.active}}));
            } else getAudioStream()
        } else {
            //message audio ici
        }
    }, [audioStreamRef, micro, permission, dispatch, getAudioStream]);


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
                disabled={permission?.state === "denied"}
                sx={{
                    zIndex: 0,
                    mx: 1,
                    borderRadius: 1,
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
    );
}