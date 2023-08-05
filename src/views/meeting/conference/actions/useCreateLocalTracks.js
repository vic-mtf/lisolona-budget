import { useLayoutEffect } from "react";
import { useData } from "../../../../utils/DataProvider";
import { useMeetingData } from "../../../../utils/MeetingProvider";
import AgoraRTC from "agora-rtc-sdk-ng";
import store from "../../../../redux/store";

export default function useCreateLocalTracks() {
    const [{videoStreamRef, audioStreamRef, screenStreamRef}] = useData();
    const [{localTrackRef}] = useMeetingData();

    useLayoutEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const micro = store.getState().meeting.micro;
            const camera = store.getState().meeting.camera;
            const screen = store.getState().meeting.screenSharing;
            const localAudioTrack = localTrackRef.current.audioTrack;
            const localVideoTrack = localTrackRef.current.videoTrack;
            if(micro.active && !localAudioTrack && audioStreamRef.current)  {
                const [mediaStreamTrack] = audioStreamRef.current.getAudioTracks();
                localTrackRef.current.audioTrack = 
                AgoraRTC.createCustomAudioTrack({mediaStreamTrack})
            }
            if(!micro.active && localAudioTrack) 
                localTrackRef.current.audioTrack = null;
            if(camera.active && !localVideoTrack && videoStreamRef.current)  {
                const [mediaStreamTrack] = videoStreamRef.current.getVideoTracks();
                localTrackRef.current.videoTrack = 
                AgoraRTC.createCustomVideoTrack({mediaStreamTrack})
            }
            if(!camera.active && localVideoTrack && !screen.active) 
                localTrackRef.current.videoTrack = null;
        });
        return () => {
            unsubscribe();
        }
    }, [videoStreamRef, audioStreamRef, screenStreamRef, localTrackRef]);

}