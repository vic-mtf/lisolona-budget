import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Badge, Box as MuiBox, Stack, Tooltip } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import IconButton from '../../../../../components/IconButton';
import SpeakerOutlinedIcon from '@mui/icons-material/SpeakerOutlined';
import audioSrc from '../../../../../assets/Offical-message-tone.webm';
import AudioOutputButtonOptions from './AudioOutputButtonOptions';

export default function SpeakerButton ({handleCheckErrors}) {
    const [played, setPlayed] = useState(false);
    const [hasDevice, setHasDevice] = useState(true);
    const audioRef = useRef(new Audio(audioSrc));

    const handlerToggleSound = () => {
        audioRef.current.currentTime = 0;
        setPlayed(played => !played);
        if(played) audioRef.current.pause();
        else audioRef.current.play();
        }

    useEffect(() => {

        const onPlay  = () => setPlayed(false);
        const audio = audioRef.current ;
        audio?.addEventListener('ended', onPlay);
        return () => {
            audio?.removeEventListener('ended', onPlay);
        }
    },[]);

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
                title={played ? 'Arreter la sonnerie' : 'Tester le haut parleur'}
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
                invisible={hasDevice}
                overlap="circular"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            > 
                <IconButton
                    onClick={handlerToggleSound}
                    disabled={!hasDevice}
                    sx={{
                        zIndex: 0,
                        borderRadius: 1,
                        boxShadow: 'none',
                        width: 40,
                        height: 40
                    }}
                >
                    {played ? 
                    <StopCircleOutlinedIcon fontSize="small"/> : 
                    <SpeakerOutlinedIcon fontSize="small"/>}
                </IconButton>
            </Badge>
            </Tooltip>
            <AudioOutputButtonOptions
                audio={audioRef.current}
                setHasDevice={setHasDevice}
                hasDevice={hasDevice}
                handleCheckErrors={handleCheckErrors}
            />
        </Stack>
    );
}
