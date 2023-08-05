import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import { Alert, Badge, Fab, Box as MuiBox, Stack, Tooltip } from '@mui/material';
import { useCallback, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import getPermission from '../../../../../utils/getPermission';
import { setMicroData } from '../../../../../redux/meeting';
import { useData } from '../../../../../utils/DataProvider';
import IconButton from '../../../../../components/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import store from '../../../../../redux/store';
import { useMeetingData } from '../../../../../utils/MeetingProvider';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { toggleStreamActivation } from '../../../../home/checking/FooterButtons';
import useMicroProps from './useMicroProps';

export default function MicroButton () {
   const {permission, micro, handleToggleMicro, loading} = useMicroProps();
   

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
                        onClick={handleToggleMicro}
                        color={micro?.active ? "primary" : "inherit"}
                        disabled={permission?.state === "denied" || loading}
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
            <IconButton
                disabled
            >
                <ExpandMoreIcon/>
            </IconButton>
        </Stack>
    );
}