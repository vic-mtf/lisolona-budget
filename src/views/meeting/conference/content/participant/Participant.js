import { useMemo } from "react";
import Client from "./Client";
import { useMeetingData } from "../../../../../utils/MeetingProvider";

export default function Participant ({uid, name, id, avatarSrc}) {
    const [,{settersRemoteVideoTracks, settersRemoteAudioTracks}] = useMeetingData();
    const audioTrack = useMemo(() => 
        settersRemoteAudioTracks.getTrackById(id)?.audioTrack || null, 
        [settersRemoteAudioTracks, id]
    );
    const videoTrack = useMemo(() => 
        settersRemoteVideoTracks.getTrackById(id)?.videoTrack || null, 
        [settersRemoteVideoTracks, id]
    );

    
    return (
        <Client
            audioTrack={audioTrack}
            videoTrack={videoTrack}
            showVideo={Boolean(videoTrack)}
            name={name}
            id={id}
            uid={uid}
            avatarSrc={avatarSrc}
        />
    );
}