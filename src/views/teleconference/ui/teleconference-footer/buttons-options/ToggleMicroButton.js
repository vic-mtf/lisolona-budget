import {
    Fab
} from '@mui/material';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import { useEffect, useState } from 'react';
import { useTeleconference } from '../../../../../utils/TeleconferenceProvider';
import { useDispatch, useSelector } from 'react-redux';
import { addTeleconference } from '../../../../../redux/teleconference';

export default function ToggleMicroButton () {
    const {turnOn, disabled} = useSelector(store => {
        const turnOn = store.teleconference?.audio;
        const disabled = store.teleconference.meetingMode !== 'on';
        return {turnOn, disabled};
    });
    const dispatch = useDispatch();
    const [{localTracks}] = useTeleconference();
    
    useEffect(() => {
        if(localTracks?.audioTrack)
            localTracks.audioTrack?.setEnabled(turnOn);
    }, [turnOn, localTracks?.audioTrack]);

    return (
        <Fab
            color={turnOn ? "primary" : "default"}
            sx={{boxShadow: 0}}
            size="small"
            variant="extended"
            disabled={disabled}
            onClick={() => dispatch(
                addTeleconference({
                    key: 'audio', data: !turnOn
                })
            )
        }
        >
          {turnOn ?
          <MicNoneOutlinedIcon fontSize="small" />:
          <MicOffOutlinedIcon fontSize="small" />}
        </Fab>
    )
}