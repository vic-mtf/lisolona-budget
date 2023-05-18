import {
    Box as MuiBox,

} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import Avatar from '../../../../../../components/Avatar';
import { useTeleconference } from '../../../../../../utils/TeleconferenceProvider';
import genColorById from '../../../../../../utils/genColorById';
import getShort from '../../../../../../utils/getShort';

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
            <AvatarWrapper
                uid={uid}
                audioTrack={audioTrack} 
                name={name} 
                avatarSrc={avatarSrc}
                videoTrack={videoTrack}
                rgb={rgb}
            />
        </MuiBox>
    );
}

const AvatarWrapper = ({audioTrack, videoTrack, rgb, avatarSrc, name}) => {
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

    return (
        <React.Fragment>
            <MuiBox
                sx={{
                    width: 60,
                    height: 60,
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
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
            <AvatarVoice
                audioTrack={audioTrack}
                videoTrack={videoTrack}
                show={show}
                setShow={setShow}
                rgb={rgb}
            />
            </MuiBox>
        </React.Fragment>
    );
}

const AvatarVoice = ({
    audioTrack,  
    rgb, 
    videoTrack,
    show, 
    setShow
}) => {
    const [volumeLevel, setVolumeLevel] = useState(0);
    const [{agoraEngine}] = useTeleconference();

    useEffect(() => {
        let stateVoiceId = null;
        const getStateVoice = () => {
            if(videoTrack && show) setShow(false);
            if(!videoTrack && !show) setShow(true);
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
    }, [agoraEngine, audioTrack, videoTrack, show]);

    return (show &&
            <MuiBox 
                position="absolute" 
                top={0} 
                left={0}
                sx={{zIndex: theme => theme.zIndex.drawer}}
            >
            <MuiBox
                sx={{
                    border: `2px solid rgba(${rgb.r},${rgb.g},${rgb.b})`,
                    content: '""',
                    width: 60,
                    height: 60,
                    transform: `scale(${volumeLevel})`,
                    borderRadius: 2,
                    transition: 'transform .1s'
                }}
            />
            </MuiBox>
    );
}