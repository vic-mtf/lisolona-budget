import { useLayoutEffect } from "react";
import { useData } from "../../../../utils/DataProvider";
import {  useSelector } from "react-redux";
import { useMeetingData } from "../../../../utils/MeetingProvider";
import AgoraRTC from "agora-rtc-sdk-ng";

export default function useCreateLocalTracks() {
    const [{videoStreamRef, audioStreamRef, screenStreamRef}] = useData();
    const [{localTrackRef}] = useMeetingData();
    const micro = useSelector(store => store.meeting.micro);
    const camera = useSelector(store => store.meeting.camera);
    const screen = useSelector(store => store.meeting.screenSharing);

    useLayoutEffect(() => {
            const localAudioTrack = localTrackRef.current.audioTrack;
            const localVideoTrack = localTrackRef.current.videoTrack;
            if(micro.active && !localAudioTrack && audioStreamRef.current)  {
                const [mediaStreamTrack] = audioStreamRef.current.getAudioTracks();
                localTrackRef.current.audioTrack = AgoraRTC.createCustomAudioTrack({mediaStreamTrack})
            }
            if(!micro.active && localAudioTrack) 
                localTrackRef.current.audioTrack = null;
            if(camera.active && !localVideoTrack && videoStreamRef.current)  {
                const [mediaStreamTrack] = videoStreamRef.current.getVideoTracks();
                localTrackRef.current.videoTrack = AgoraRTC.createCustomVideoTrack({mediaStreamTrack})
            }
            if(!camera.active && localVideoTrack && !screen.active) 
                localTrackRef.current.videoTrack = null;
    }, [ 
        videoStreamRef, 
        audioStreamRef,
        screenStreamRef,
        camera,
        micro,
        screen,
        localTrackRef, 
    ]);

}