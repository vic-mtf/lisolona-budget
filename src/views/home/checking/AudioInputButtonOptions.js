
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import Button from '../../../components/Button';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Menu from '../../../components/Menu';
import { Divider, ListItemIcon, ListItemText, MenuItem, Box as MuiBox } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setAudioDevice } from '../../../redux/meeting';
import AudioLevelIndicator from './AudioLevelIndicator.js';
import { useData } from '../../../utils/DataProvider';
import closeMediaStream from '../../../utils/closeMediaStream';

export default function AudioInputButtonOptions () {
    const devicesRef = useRef([]);
    const device = useSelector(store => store.meeting.audio.input);
    const micro = useSelector(store => store.meeting.micro);
    const [open, setOpen] = useState(false);    
    const anchorElRef = useRef();
    const [{audioStreamRef, client}] = useData();
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
                const stream = await navigator?.mediaDevices?.getUserMedia({audio: newDevice});
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
            .forEach(device => {
                if(!devices.find(({deviceId}) => device.deviceId === deviceId)) {
                    if(device?.deviceId?.trim())
                        audioInputs.push(device);
                }
            });
            const [data] = devices;
            if(audioInputs.length)
                devicesRef.current = devices.concat(audioInputs);
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
    }, [device, open, dispatch, micro]);
  
    return (
        <React.Fragment>
            <Button
                disabled={!device?.deviceId}
                startIcon={<KeyboardVoiceOutlinedIcon/>}
                endIcon={<ExpandMoreOutlinedIcon/>}
                variant="outlined"
                sx={{mx: .5}}
                ref={anchorElRef}
                onClick={() => setOpen(true)}
                children={
                    <MuiBox
                        whiteSpace="nowrap"
                        textOverflow="ellipsis"
                        overflow="hidden"
                        width={75}
                    >
                    {device.label}
                    </MuiBox>
                }
            />
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