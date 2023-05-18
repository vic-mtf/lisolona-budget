
import { Tooltip } from '@mui/material';
import IconButton from '../../../../../components/IconButton';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import { useSelector } from 'react-redux';
import React, { useCallback, useMemo } from 'react';

export default function CallButtons  ({target}) {
    const mode = useSelector(store => store.teleconference?.mode);
    const disabled = useMemo(() => mode !==  'none', [mode]);
   
    const handleCallContact = useCallback(mediaType => () => {
        const root = document.getElementById('root');
        const name = '_call-contact';
        const detail = {
            target: {
                avatarSrc: target.avatarSrc, 
                id: target.id, 
                members: target.members, 
                name: target.name, 
                type: target.type, 
            },
            mediaType,
        };
        const customEvent = new CustomEvent(name, {detail})
        root.dispatchEvent(customEvent);
    }, [target]);

    return (
        <React.Fragment>
            <Tooltip 
                title={disabled ? "Un appel en cours..." : "Lancer l'appel vidéo" }
                arrow
            >
                <div>
                    <IconButton 
                        sx={{mx: 1}} 
                        disabled={disabled}
                        onClick={handleCallContact('video')}
                    >
                        <VideocamOutlinedIcon fontSize="small"/>
                    </IconButton>
                </div>
            </Tooltip>
            <Tooltip title={disabled ? "Un appel en cours..." : "Lancer l'appel"} 
                arrow
            >
                <div>
                    <IconButton 
                        sx={{mx: 1}} 
                        disabled={disabled}
                        onClick={handleCallContact('audio')}
                    >
                        <LocalPhoneOutlinedIcon fontSize="small"/>
                    </IconButton>
                </div>
            </Tooltip>
        </React.Fragment>
    )
}