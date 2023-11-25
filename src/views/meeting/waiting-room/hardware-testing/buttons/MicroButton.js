import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import {Badge, Fab, Stack, Tooltip } from '@mui/material';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import useMicroProps from './useMicroProps';
import AudioInputButtonOptions from './AudioInputButtonOptions';
import { useEffect, useState } from 'react';

export default function MicroButton ({handleCheckErrors}) {
   const {permission, micro, handleToggleMicro} = useMicroProps();
   const [hasDevice, setHasDevice] = useState(true);
   
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
                title={`${micro.active ? 'Desactiver' : 'Activer'} le micro`}
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
                        (micro.allowed && permission?.state === 'granted' && hasDevice):
                        true
                    }
                    overlap="circular"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                > 
                    <Fab
                        variant="circular"
                        size="small"
                        onClick={handleToggleMicro}
                        color={micro?.active ? "primary" : "default"}
                        disabled={permission?.state === "denied"}
                        sx={{
                            zIndex: 0,
                            borderRadius: 1,
                            boxShadow: 0,
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
            </Tooltip>
            <AudioInputButtonOptions
                setHasDevice={setHasDevice}
                hasDevice={hasDevice}
                handleCheckErrors={handleCheckErrors}
            />
        </Stack>
    );
}