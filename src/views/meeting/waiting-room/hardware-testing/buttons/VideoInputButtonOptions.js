import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import Button from '../../../../../components/Button';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Menu from '../../../../../components/Menu';
import { ListItemIcon, ListItemText, MenuItem, Box as MuiBox } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setVideoDevice } from '../../../../../redux/meeting';

import closeMediaStream from '../../../../../utils/closeMediaStream';
import IconButton from '../../../../../components/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function VideoInputButtonOptions ({setHasDevice, hasDevice, handleCheckErrors}) {
    const devicesRef = useRef([]);
    const device = useSelector(store => store.meeting.video.input);
    const camera = useSelector(store => store.meeting.camera);
    const [{videoStreamRef}] useLocalStoreData();
    const [open, setOpen] = useState(false);    
    const anchorElRef = useRef();
    const deviceIdSelected = useMemo(() => 
        devicesRef.current?.find(
            ({deviceId}) => device?.deviceId === deviceId
        )?.deviceId, 
        [device]
    );
    const dispatch = useDispatch();

    const handleChangeDevice = useCallback(async (newDevice) => {
        const oldDevice = device;
        setOpen(false);
        if(device?.deviceId !== newDevice.deviceId) {
            try {
                dispatch(setVideoDevice({
                    type: 'input',
                    data: newDevice,
                }));
                closeMediaStream(videoStreamRef.current);
                const stream = await navigator?.mediaDevices?.getUserMedia({audio: newDevice});
                videoStreamRef.current = stream;
                const [videoTrack] = stream?.getVideoTracks() || [];
                if(videoTrack) videoTrack.enabled = camera.active;
            } catch (e) {
                dispatch(setVideoDevice({
                    type: 'input',
                    data: oldDevice,
                }));
            }
        }
    },[device, dispatch, videoStreamRef, camera]);


    useLayoutEffect(() => {
        const devices = devicesRef.current;
        navigator?.mediaDevices?.enumerateDevices()
        ?.then(_devices => {
            const videoInputs = [];
            _devices.filter(device => device.kind === 'videoinput')
            .forEach(device => videoInputs.push(device));
            const [data] = devices;
            if(typeof handleCheckErrors === 'function')
                handleCheckErrors({cameras: videoInputs?.length});
            if(videoInputs.length) {
                devicesRef.current = videoInputs;
                setHasDevice(true);
            }
           if(!device.deviceId && camera.allowed)
                dispatch(setVideoDevice({
                    type: 'input',
                    data: {
                        deviceId: data?.deviceId,
                        groupId: data?.groupId,
                        kind: data?.kind,
                        label: data?.label,
                    },
                }));
            }).catch(error => {
            console.error('Impossible de récupérer les périphériques visuels', error);
        });
    }, [device, open, dispatch, camera, setHasDevice, handleCheckErrors]);
  

    return (
        <React.Fragment>
            <IconButton 
                ref={anchorElRef}
                onClick={() => setOpen(true)}
                selected={open}
                disabled={!hasDevice}
            >
                <ExpandMoreIcon/>
            </IconButton>
            <Menu
                variant="menu"
                anchorEl={anchorElRef.current}
                open={open}
                onClose={() => setOpen(false)}
            >
                {
                    devicesRef.current.map(device => (
                        <MenuItem 
                            key={device?.deviceId}
                            onClick={() => handleChangeDevice({
                                deviceId: device?.deviceId,
                                groupId: device?.groupId,
                                kind: device?.kind,
                                label: device?.label,
                            })}
                        >
                            <ListItemIcon>
                                {deviceIdSelected === device?.deviceId && 
                                <CheckOutlinedIcon fontSize="small" />}
                            </ListItemIcon>
                            <ListItemText>{device?.label}</ListItemText>
                        </MenuItem>
                    ))
                }
            </Menu>
        </React.Fragment>
    )
}