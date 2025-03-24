import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Menu from '../../../../../components/Menu';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { setAudioDevice } from '../../../../../redux/meeting';
import { useDispatch, useSelector } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '../../../../../components/IconButton';

export default function AudioOutputButtonOptions ({audio, setHasDevice, hasDevice, handleCheckErrors}) {
    const devicesRef = useRef([]);
    const device = useSelector(store => store.meeting.audio.output);
    const allowed = useSelector(store => store.meeting.micro.allowed);
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

    useLayoutEffect(() => {
        navigator?.mediaDevices?.enumerateDevices()
        ?.then(_devices => {
            const audioOutputs = _devices.filter(device => device.kind === 'audiooutput');
            const [data] = audioOutputs;
            if(typeof handleCheckErrors === 'function')
                handleCheckErrors({speakers: audioOutputs?.length});
            if(audioOutputs.length)
                devicesRef.current = audioOutputs;
            else setHasDevice(false);

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
    }, [device, open, handleChangeDevice, allowed, dispatch, setHasDevice, handleCheckErrors]);


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