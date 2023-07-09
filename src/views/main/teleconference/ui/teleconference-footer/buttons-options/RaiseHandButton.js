import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import { BottomNavigationAction, Zoom } from '@mui/material';
import Typography from '../../../../../../components/Typography';
import { useSocket } from '../../../../../../utils/SocketIOProvider';
import answerRingtone from '../../../../../../utils/answerRingtone';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

export default function RaiseHandButton () {
    const [raise, setRaise] = useState(false);
    const target = useSelector(store => store.teleconference?.target);
    const from = useSelector(store => store.teleconference?.from);
    const mode = useSelector(store => store.teleconference?.mode);
    const type = useMemo(() => target?.type,
        [target?.type]
    );
    const to = useMemo(() => 
        type === 'direct' ? (from?.id || target.id) : target.id,
        [type, from?.id, target?.id]
    );
    const socket = useSocket();
    
    const handleRaiseHandButton = () => {
        if(!raise) {
            answerRingtone({
                type: 'action',
                audio: new Audio(),
            });
            socket.emit('signal', {
                to,
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