import {
    Fab
} from '@mui/material';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import { useEffect } from 'react';
import { useTeleconference } from '../../../../../../utils/TeleconferenceProvider';
import { useDispatch, useSelector } from 'react-redux';
import { addTeleconference } from '../../../../../../redux/teleconference';

export default function ToggleCameraButton () {
    const {turnOn, disabled} = useSelector(store => {
        const turnOn = store.teleconference?.video;
        const disabled = store.teleconference.mode !== 'on'
        return {turnOn, disabled};
    });
    const dispatch = useDispatch();
    const [{localTracks}] = useTeleconference();
    
    useEffect(() => {
        if(localTracks?.videoTrack)
            localTracks.videoTrack?.setEnabled(turnOn);
    }, [turnOn, localTracks?.videoTrack]);

    return (
        <Fab
            color={turnOn ? "primary" : "default"}
            sx={{boxShadow: 0}}
            disabled={disabled}
            size="small"
            variant="extended"
            onClick={() => dispatch(
                    addTeleconference({
                        key: 'video', data: !turnOn
                    })
                )
            }
        >
          {turnOn ?
          <VideocamOutlinedIcon fontSize="small" />:
          <VideocamOffOutlinedIcon fontSize="small" />}
        </Fab>
    )
}