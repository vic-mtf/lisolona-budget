import { Box as MuiBox, Fade } from '@mui/material';
import { useEffect, useMemo, useRef } from 'react';
import { useTeleconference } from '../../../../../../utils/TeleconferenceProvider';
import AvatarVoiceStatus from '../meeting-status/AvatarVoiceStatus';
import useGetUser from './useGetUser';
import Subheader from './Subheader';

export default function VideoFrame ({data}) {
    const frameRef = useRef();
    const [{participants}] = useTeleconference();
    const {name, avatarSrc} = useGetUser(data?.tracks?.uid);
    const videoTrack = useMemo(() => data?.tracks?.videoTrack, [data?.tracks?.videoTrack]);
    const audioTrack = useMemo(() => data?.tracks?.audioTrack, [data?.tracks?.audioTrack]);
    const uid = useMemo(() => data?.tracks?.uid, [data?.tracks?.uid]);

    useEffect(() => {
        const frame = frameRef.current;
        frame.querySelector('video')?.parentNode?.remove();
        if(videoTrack)
            videoTrack?.play(frame);
        if(audioTrack)
            audioTrack?.play();
    }, [videoTrack, audioTrack, participants]);

    return (
        <Fade in>
            <MuiBox
                display="flex"
                flex={1}
                width="100%"
                height="100%"
                position="relative"
                ref={frameRef}
            >
                <AvatarVoiceStatus
                    audioTrack={audioTrack}
                    videoTrack={videoTrack}
                    uid={uid}
                    avatarSrc={avatarSrc}
                    name={name}
                />
                <Subheader
                    uid={uid}
                    micTurnOn={Boolean(audioTrack)}
                />
            </MuiBox>
        </Fade>
    );
}