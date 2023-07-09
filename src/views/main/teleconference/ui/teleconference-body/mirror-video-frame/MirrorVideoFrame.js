import { useEffect, useMemo, useRef } from "react";
import {
    Box as MuiBox,
} from '@mui/material';
import FloatFrame from "./FloatFrame";
import GridFrame from "./GridFrame";
import { useTeleconference } from "../../../../../../utils/TeleconferenceProvider";
import { useSelector } from "react-redux";
import AvatarVoiceStatus from "../meeting-status/AvatarVoiceStatus";

export default function MirrorVideoFrame ({gridProps}) {
    const containerRef = useRef();
    const [{localTracks}, ] = useTeleconference();
    const videoMirrorMode = useSelector(store => store.teleconference.videoMirrorMode);
    const video = useSelector(store => store.teleconference.video);
    const uid = useSelector(store => store.user.id);
    const avatarSrc = useSelector(store => store.user.image);
    const mode = useSelector(store => store.teleconference.mode);
    const firstname = useSelector(store => store.user.firstname);
    const middelname = useSelector(store => store.user.middelname);
    const lastname = useSelector(store => store.user.lastname);
    
    const name = useMemo(() => 
        `${firstname || ''} ${lastname || ''} ${middelname || ''}`.trim(),
        [firstname, lastname, middelname]
    );

    const component = useMemo(() => videoMirrorMode === 'float' ? 
        FloatFrame : GridFrame, 
        [videoMirrorMode]
    );
    const videoTrack = useMemo(() => localTracks?.videoTrack, [localTracks?.videoTrack]);
    const audioTrack = useMemo(() => localTracks?.audioTrack, [localTracks?.audioTrack]);
    const showVoiceStatus = useMemo(() => !video && mode === 'on', [video, mode]);
    const showVideoMirrorMode = useMemo(() => videoMirrorMode !== 'none', [videoMirrorMode]);
    
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

    return showVideoMirrorMode && (
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
                {showVoiceStatus &&
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