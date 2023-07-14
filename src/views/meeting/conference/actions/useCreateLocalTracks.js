import { useLayoutEffect } from "react";
import { useData } from "../../../../utils/DataProvider";
import {  useSelector } from "react-redux";
import { useMeetingData } from "../../../../utils/MeetingProvider";
import AgoraRTC from "agora-rtc-sdk-ng";

export default function useCreateLocalTracks() {
    const [{videoStreamRef, audioStreamRef}] = useData();
    const [{localTrackRef}] = useMeetingData();
    const micro = useSelector(store => store.meeting.micro);
    const camera = useSelector(store => store.meeting.camera);

    useLayoutEffect(() => {
            const localAudioTrack = localTrackRef.current.audioTrack;
            const localVideoTrack = localTrackRef.current.videoTrack;
            if(micro.active && !localAudioTrack && audioStreamRef)  {
                const [mediaStreamTrack] = audioStreamRef.current.getAudioTracks();
                localTrackRef.current.audioTrack = AgoraRTC.createCustomAudioTrack({mediaStreamTrack})
            }
            if(!micro.active && localAudioTrack) 
                localTrackRef.current.audioTrack = null;
            if(camera.active && !localVideoTrack && videoStreamRef)  {
                const [mediaStreamTrack] = videoStreamRef.current.getVideoTracks();
                localTrackRef.current.audioTrack = AgoraRTC.createCustomVideoTrack({mediaStreamTrack})
            }
            if(!camera.active && localVideoTrack) 
                localTrackRef.current.videoTrack = null;
    }, [ 
        videoStreamRef, 
        audioStreamRef,
        camera,
        micro,
        localTrackRef, 
    ]);

}