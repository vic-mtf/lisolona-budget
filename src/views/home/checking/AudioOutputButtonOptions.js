import SpeakerOutlinedIcon from '@mui/icons-material/SpeakerOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import Button from '../../../components/Button';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Menu from '../../../components/Menu';
import { Divider, ListItemIcon, ListItemText, MenuItem, Box as MuiBox } from '@mui/material';
import { setAudioDevice } from '../../../redux/meeting';
import { useDispatch, useSelector } from 'react-redux';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import audio_test_src from '../../../assets/Offical-message-tone.mp3';

export default function AudioOutputButtonOptions () {
    const devicesRef = useRef([]);
    const device = useSelector(store => store.meeting.audio.output);
    const allowed = useSelector(store => store.meeting.micro.allowed);
    const [open, setOpen] = useState(false);
    const audio = useMemo(() =>{
        const audio =  new Audio();
        audio.src = audio_test_src;
        return audio;
    }, []);
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
                dispatch(setAudioDevice({
                    type: 'output',
                    data: newDevice,
                }));
                await audio.setSinkId(newDevice.deviceId);
            } catch (e) {
                dispatch(setAudioDevice({
                    type: 'output',
                    data: oldDevice,
                }));
            }
        }
    },[audio, device, dispatch]);

    const speakerTest = useCallback(() => {
        audio.play();
        setOpen(false);
    }, [audio]);

    useLayoutEffect(() => {
        const devices = devicesRef.current;
        navigator.mediaDevices.enumerateDevices()
        .then(_devices => {
            const audioOutputs = [];
            _devices.filter(device => device.kind === 'audiooutput')
            .forEach(device => {
                if(!devices.find(({deviceId}) => device.deviceId === deviceId)) {
                    if(device?.deviceId?.trim())
                        audioOutputs.push(device);
                }
            });
            const [data] = devices;
            if(audioOutputs.length)
                devicesRef.current = devices.concat(audioOutputs);
           if(!device.deviceId && allowed)
                dispatch(setAudioDevice({
                        type: 'output',
                        data: {
                            deviceId: data?.deviceId,
                            groupId: data?.groupId,
                            kind: data?.kind,
                            label: data?.label,
                        },
                }));
            }).catch(error => {
            console.error('Impossible de récupérer les périphériques audio/visuels', error);
        });
    }, [device, open, handleChangeDevice, allowed, dispatch]);

    return (
        <React.Fragment>
            <Button
                disabled={!device?.deviceId}
                startIcon={<SpeakerOutlinedIcon/>}
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
                    onClick={speakerTest}
                >
                    <ListItemIcon>
                        <VolumeUpOutlinedIcon/>
                    </ListItemIcon>
                    <ListItemText>Tester les haut-parleurs</ListItemText>
                </MenuItem>
            </Menu>
        </React.Fragment>
    )
}