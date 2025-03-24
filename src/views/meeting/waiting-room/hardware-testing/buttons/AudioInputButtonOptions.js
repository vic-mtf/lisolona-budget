

import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Menu from '../../../../../components/Menu';
import { Divider, ListItemIcon, ListItemText, MenuItem, Box as MuiBox } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setAudioDevice } from '../../../../../redux/meeting';
import AudioLevelIndicator from './AudioLevelIndicator.js';

import closeMediaStream from '../../../../../utils/closeMediaStream';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '../../../../../components/IconButton.js';

export default function AudioInputButtonOptions ({setHasDevice, hasDevice, handleCheckErrors}) {
    const devicesRef = useRef([]);
    const device = useSelector(store => store.meeting.audio.input);
    const micro = useSelector(store => store.meeting.micro);
    const [open, setOpen] = useState(false);    
    const anchorElRef = useRef();
    const [{audioStreamRef}] useLocalStoreData();
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
                dispatch(setAudioDevice({
                    type: 'input',
                    data: newDevice,
                }));
                closeMediaStream(audioStreamRef.current);
                const stream = await navigator.mediaDevices.getUserMedia({audio: newDevice});
                audioStreamRef.current = stream;
                const [audioTrack] = stream?.getAudioTracks() || [];
                if(audioTrack)
                audioTrack.enabled = micro.active;
            } catch (e) {
                dispatch(setAudioDevice({
                    type: 'input',
                    data: oldDevice,
                }));
            }
        }
    },[device, dispatch, audioStreamRef, micro]);


    useLayoutEffect(() => {
        const devices = devicesRef.current;
        navigator?.mediaDevices?.enumerateDevices()
        ?.then(_devices => {
            const audioInputs = [];
            _devices.filter(device => device.kind === 'audioinput')
            .forEach(device => audioInputs.push(device));
            const [data] = devices;
            if(typeof handleCheckErrors === 'function')
                handleCheckErrors({micros: audioInputs?.length});
            if(audioInputs.length)
                devicesRef.current = audioInputs;
            else setHasDevice(false);
            if(!device.deviceId && micro.allowed)
                dispatch(setAudioDevice({
                    type: 'input',
                    data: {
                        deviceId: data?.deviceId,
                        groupId: data?.groupId,
                        kind: data?.kind,
                        label: data?.label,
                    },
                }));
            }).catch(error => {
            console.error('Impossible de récupérer les périphériques audio', error);
        });
    }, [device, open, dispatch, micro, setHasDevice, handleCheckErrors]);
  
    return (
        <React.Fragment>
             <IconButton
                onClick={() => setOpen(true)}
                ref={anchorElRef}
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
                <Divider />
                <MenuItem
                    disableTouchRipple
                    disableRipple
                    disabled={!micro.active}
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <ListItemIcon>
                        <MicNoneOutlinedIcon/>
                    </ListItemIcon>
                    <ListItemText>
                        {micro.active ? 
                        <AudioLevelIndicator
                            stream={audioStreamRef.current}
                        /> : <span>Le micro est désactivé</span>}
                    </ListItemText>
                </MenuItem>
            </Menu>
        </React.Fragment>
    )
}