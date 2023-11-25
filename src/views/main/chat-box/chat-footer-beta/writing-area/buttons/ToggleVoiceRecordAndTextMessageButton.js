import React, {useMemo } from 'react';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import { Fab, Tooltip, Zoom, useTheme } from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

export default function ToggleVoiceRecordAndTextMessageButton ({type, onSend, onRecord}) {
    const theme = useTheme();
    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };
    const value = useMemo(() => type === "voice" ? 0 : 1, [type]);

    return (
        fabs.map((fab, index) => (
            <Tooltip
                title={fab.title}
                enterDelay={1000}
                arrow
                key={fab.color}
            >
                <Zoom
                    in={value === index}
                    timeout={transitionDuration}
                    style={{
                        transitionDelay: `${value === index ? transitionDuration.exit : 0}ms`,
                        transitionDuration: '.2s',
                        position: 'absolute',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    appear={false}
                >
                        <Fab
                            sx={{borderRadius: 1,}} 
                            size="small"
                            variant="circular"
                            aria-label={fab.label} 
                            color={fab.color}
                            onClick={type === 'voice' ? onRecord : onSend}
                        >
                            {fab.icon}
                        </Fab>
                    </Zoom>
            </Tooltip>
          ))
    )
};

const fabs =  [
    {
        
        color: 'default',
        icon: <KeyboardVoiceOutlinedIcon fontSize="small" />,
        label: 'microphone',
        title: 'Enregistrer'
    },
    {
        color: 'primary',
        icon: <SendOutlinedIcon fontSize="small" />,
        label: 'Send message',
        title: 'Envoyer'
    }
];