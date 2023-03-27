import { useEffect, useMemo, useRef } from "react";
import {
    Box as MuiBox,
} from '@mui/material';
import FloatFrame from "./FloatFrame";
import GridFrame from "./GridFrame";
import { useTeleconference } from "../../../../../utils/TeleconferenceProvider";
import { useSelector } from "react-redux";
import AvatarVoiceStatus from "../meeting-status/AvatarVoiceStatus";

export default function MirrorVideoFrame ({gridProps}) {
    const containerRef = useRef();
    const [{localTracks}, ] = useTeleconference();
    const {videoMirrorMode, component, video, uid, avatarSrc, mode, name} = useSelector(store => {
        const videoMirrorMode =store.teleconference.videoMirrorMode;
        const component = videoMirrorMode === 'float' ? FloatFrame : GridFrame;
        const video = store.teleconference.video;
        const uid = store.user.id;
        const avatarSrc = store.user.image;
        const mode = store.teleconference.meetingMode;
        const {lastname, firstname, middelname} = store.user;
        const name = `${firstname || ''} ${lastname || ''} ${middelname || ''}`.trim();
        return {component, videoMirrorMode, video, uid, avatarSrc, mode, name};
    });
    const videoTrack = useMemo(() => localTracks?.videoTrack, [localTracks?.videoTrack]);
    const audioTrack = useMemo(() => localTracks?.audioTrack, [localTracks?.audioTrack]);
    useEffect(() => {
        const container = containerRef.current;
        container?.querySelector('video')?.parentNode?.remove();
        if(videoTrack && videoMirrorMode !== 'none' && container && video) {
            videoTrack.play(container);
            let video = container?.querySelector('video');
            video.parentNode.style.backgroundColor = 'transparent';
        }
        if(!video)
            container?.querySelector('video')?.parentNode?.remove();
    },[videoTrack, component, videoMirrorMode, video]);

    return videoMirrorMode !== 'none' && (
        <MuiBox
            component={component}
            gridProps={gridProps}
        >
            <MuiBox
                height="100%"
                width="100%"
                ref={containerRef}
                bgcolor="transparent"
                sx={{position: 'relative'}}
            >
                {!video && mode === 'on' &&
                <AvatarVoiceStatus
                    audioTrack={audioTrack}
                    uid={uid}
                    avatarSrc={avatarSrc}
                    name={name}
                />}
            </MuiBox>
        </MuiBox>
    );
}