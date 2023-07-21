import { Box as MuiBox } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { useLayoutEffect } from "react";
import VideoTrackView from "./VideoTrackView";
import AudioTrackView from "./AudioTrackView";
import Title from "./Title";
import MicroOff from "./MicroOff";
import { useMeetingData } from "../../../../../utils/MeetingProvider";

export default function Participant ({uid, name, id, avatarSrc}) {
    const rootRef = useRef();
    const [,{settersRemoteTracks}] = useMeetingData();
    const [audioTrack, setAudioTrack] = useState(null);
    const [videoTrack, setVideoTrack] = useState(null);

    const handleTrack = useCallback(event => {
        const { user, trackType } = event.detail;
        if(uid === user?.uid) {
            const setState = trackType === 'audioTrack' ? setAudioTrack : setVideoTrack;
            setState(user[trackType]  || null);
        }
    },[uid]);

    useLayoutEffect(() => {
        const root = document.getElementById("root");
        const name = '__state-track-change';
        root.addEventListener(name, handleTrack);
        return () => {
            root.removeEventListener(name, handleTrack);
        }
    },[handleTrack]);

    useLayoutEffect(() => {
        if(uid) {
            const {audioTrack, videoTrack} = settersRemoteTracks.getObjectById(uid) || {};
            setAudioTrack(audioTrack);
            setVideoTrack(videoTrack);
        }
    },[uid, settersRemoteTracks])

    return (
        <Client
            rootRef={rootRef}
            audioTrack={audioTrack}
            videoTrack={videoTrack}
            name={name}
            id={id}
            avatarSrc={avatarSrc}
        />
    );
}

export const Client = ({name, avatarSrc, id, audioTrack, videoTrack, rootRef, externalVideo, reverseScreen}) => (
    <MuiBox
            ref={rootRef}
            sx={{
                // position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                boxShadow: 1,
                borderRadius: 1,
                overflow: 'hidden',
                '& video, & .audio-track': {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: reverseScreen ?  'scale(-1, 1)' : 'scale(1, 1)',
                    objectPosition: 'center',
                }
            }}
        >
         {
            (videoTrack || externalVideo) ? 
            (videoTrack &&
            <VideoTrackView
                videoTrack={videoTrack}
            />
            ) : 
            (
            <AudioTrackView
                audioTrack={audioTrack}
                id={id}
                avatarSrc={avatarSrc}
            />
            )
        }
        <Title name={name} />
        {!audioTrack && <MicroOff />}
        </MuiBox>
)