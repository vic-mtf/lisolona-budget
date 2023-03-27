import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import { BottomNavigationAction, Zoom } from '@mui/material';
import Typography from '../../../../../components/Typography';
import { useSocket } from '../../../../../utils/SocketIOProvider';
import answerRingtone from '../../../../../utils/answerRingtone';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function RaiseHandButton () {
    const [raise, setRaise] = useState(false);
    const {id, type, mode} = useSelector(store => {
        const meetingId = store.teleconference?.meetingId;
        const from = store.teleconference?.from;
        const type = store.teleconference?.type;
        const id = type === 'direct' ? from : meetingId;
        const mode = store.teleconference.meetingMode
        return {id, type, mode};
    });
    const socket = useSocket();

    const handleRaiseHandButton = () => {
        if(!raise) {
            answerRingtone({
                type: 'action',
                audio: new Audio(),
            });
            socket.emit('signal', {
                to: id,
                type,
                details: {variant: 'raise-hand'},
            })
        };
        setRaise(raise => !raise);
    }

    return (
        <Zoom in={mode === 'on'}>
            <div>
                <BottomNavigationAction
                    icon={<PanToolOutlinedIcon fontSize="small" />} 
                    selected={raise}
                    label={
                        <Typography
                            variant="caption" 
                            fontSize="10px" 
                            color="inherit"
                        >
                            Lever la main
                        </Typography>
                    }
                    color="inherit"
                    showLabel
                    onClick={handleRaiseHandButton}
                    sx={{borderRadius: 1}}
                />
            </div>
        </Zoom>
    )
}