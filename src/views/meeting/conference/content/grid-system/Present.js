import { useEffect, useMemo, useRef } from "react";
import { Box as MuiBox, Button } from '@mui/material';
import { findUser, useMeetingData } from "../../../../../utils/MeetingProvider";
import { useSelector } from "react-redux";
import PresentHeader from "./PresentHeader";
import AudioTrackView from "../participant/AudioTrackView";
import ClientHeader from "../participant/ClientHeader";

export default function Present ({id}) { 
    const rootRef = useRef();

    return (
        <MuiBox
            display="flex"
            height="100%"
            width="100%"
            overflow="hidden"
            position="relative"
            pt={1}
            sx={{
                '& video': {
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    margin: 'auto',
                    width: '100%',
                    height: '100%',
                }
            }}
            ref={rootRef}
        >
            <PresentHeader
                rootRef={rootRef}
                id={id}
            />
            <MediaView id={id} />
        </MuiBox>
    );
}

const MediaView = ({id}) => {

    const [,{settersRemoteVideoTracks, settersRemoteAudioTracks}] = useMeetingData();
    const userId = useSelector(store => store.meeting.me.id);
    const isLocalTrack = useMemo(() => id === userId, [id, userId]);
    const user = useMemo(() => findUser(id),[id]);

    const videoRef = useRef();

    const audioTrack = useMemo(() => 
        settersRemoteAudioTracks.getTrackById(id)?.audioTrack || null, 
        [settersRemoteAudioTracks, id]
    );

    const videoTrack = useMemo(() => 
        settersRemoteVideoTracks.getTrackById(id)?.videoTrack || null, 
        [settersRemoteVideoTracks, id]
    );

    useEffect(() => {
        if(isLocalTrack);
        else videoTrack?.play(videoRef.current);
    },[videoTrack, isLocalTrack]);

    return (
        <>
            {Boolean(videoTrack) && 
            <video 
                ref={videoRef} 
                muted 
                autoPlay
            />}
            {!videoTrack && 
            <AudioTrackView 
                avatarSrc={user.identity.imageUrl}
                id={id}
                audioTrack={audioTrack}
            />}
            <ClientHeader audioTrack={audioTrack}/>
        </>
    );

};