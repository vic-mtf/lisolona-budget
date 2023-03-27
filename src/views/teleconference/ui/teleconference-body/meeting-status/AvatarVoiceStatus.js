import {
    Box as MuiBox,

} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import Avatar from '../../../../../components/Avatar';
import { useTeleconference } from '../../../../../utils/TeleconferenceProvider';
import genColorById from '../../../../../utils/genColorById';
import getShort from '../../../../../utils/getShort';

export default function AvatarVoiceStatus ({
    uid, 
    audioTrack, 
    name, 
    avatarSrc,
    videoTrack,
}) {
    const {rgb} = genColorById(uid);

    return (
        <MuiBox
            position="absolute"
            height="100%"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <AvatarVoice
                rgb={rgb}
                audioTrack={audioTrack}
                videoTrack={videoTrack}
                name={name}
                avatarSrc={avatarSrc}
            />
        </MuiBox>
    );
}

const AvatarVoice = ({
    audioTrack, 
    avatarSrc, 
    name, 
    rgb, 
    videoTrack
}) => {
    const [volumeLevel, setVolumeLevel] = useState(0);
    const [{agoraEngine}] = useTeleconference();
    const [show, setShow] = useState(!videoTrack?.enable);
    const avatarSx = useMemo(() => ({
        color: `rgba(${rgb.r},${rgb.g},${rgb.b})`,
        bgcolor: theme => theme.palette.background.paper,
        backgroundImage: `
        radial-gradient(circle, transparent 0%, 
        rgba(${rgb.r},${rgb.g},${rgb.b},1) 100%)`,
        fontWeight: 'bold',
        fontSize: 20,
    }), [rgb.r, rgb.g, rgb.b]);

    useEffect(() => {
        let stateVoiceId = null;
        const getStateVoice = () => {
            if(videoTrack) setShow(false);
            else setShow(true);
            if(audioTrack) { 
                setVolumeLevel(audioTrack?.getVolumeLevel() + .8);
                stateVoiceId = window.requestAnimationFrame(getStateVoice);
            }
            else setVolumeLevel(0);
        };
        getStateVoice();
        return () => {
            window.cancelAnimationFrame(stateVoiceId);
        }
    }, [agoraEngine, audioTrack, videoTrack]);

    return (show &&
        <MuiBox
            sx={{
                width: 60,
                height: 60,
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '&::after': {
                    border: `2px solid rgba(${rgb.r},${rgb.g},${rgb.b})`,
                    content: '""',
                    width: 60,
                    height: 60,
                    transform: `scale(${volumeLevel})`,
                    borderRadius: 2,
                    transition: 'transform .1s'
                },
            }}
        >
            <MuiBox 
                position="absolute" 
                top={0} 
                left={0}
                sx={{zIndex: theme => theme.zIndex.drawer}}
            >
                <Avatar
                    src={avatarSrc}
                    srcSet={avatarSrc}
                    children={getShort(name)}
                    sx={{
                        width: 60,
                        height: 60,
                        ...avatarSx,
                    }}
                />
            </MuiBox>
        </MuiBox>
    );
}