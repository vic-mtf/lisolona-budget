import { Fab } from '@mui/material';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import { useEffect, useMemo } from 'react';
import { useTeleconference } from '../../../../../../utils/TeleconferenceProvider';
import { useDispatch, useSelector } from 'react-redux';
import { addTeleconference } from '../../../../../../redux/teleconference';

export default function ToggleMicroButton () {

    const turnOn = useSelector(store => store.teleconference?.audio);
    const mode = useSelector(store => store.teleconference.mode);
    const disabled = useMemo(() => mode !== 'on', [mode]);

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